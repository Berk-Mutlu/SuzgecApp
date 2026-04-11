const axios = require('axios');
require('dotenv').config();

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;

const getAuthHeader = () => {
    return 'Basic ' + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');
};

async function pollTaskGet(taskId, type) {
    
    for (let i = 0; i < 24; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const getRes = await axios({
                method: 'get',
                url: `https://api.dataforseo.com/v3/merchant/google/${type}/task_get/advanced/${taskId}`,
                headers: { 'Authorization': getAuthHeader() }
            });
            if (getRes.data?.tasks?.[0]?.status_code === 20000) {
                return getRes.data.tasks[0].result[0];
            }
        } catch (e) {
            console.log(`[DataForSEO] Polling error:`, e.message);
        }
    }
    throw new Error("Task timeout, sonuç alınamadı.");
}

async function searchShopping(keyword) {
    try {
        console.log(`[DataForSEO] 🔍 Arama başlatıldı: "${keyword}" (Görev oluşturuluyor...)`);
        const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/merchant/google/products/task_post',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: [{
                keyword: keyword,
                language_code: "tr",
                location_code: 2792,
                priority: 2
            }]
        });

        const taskId = response.data?.tasks?.[0]?.id;
        if (!taskId) throw new Error("Görev oluşturulamadı");
        
        console.log(`[DataForSEO] ⏳ Sonuçlar bekleniyor (Task: ${taskId})...`);
        const result = await pollTaskGet(taskId, "products");

        const items = result?.items || [];
        console.log(`[DataForSEO] ✅ "${keyword}" için ${items.length} ürün bulundu.`);
        
        const mappedItems = items.filter(i => i.product_id).map(item => ({
            product_id: item.product_id,
            title: item.title,
            price: item.total_price || item.base_price || (typeof item.price === 'object' && item.price !== null ? (item.price.current || item.price.value) : item.price) || 0,
            image_url: (item.product_images && item.product_images.length > 0) ? item.product_images[0] : (item.imageUrl || item.image || item.image_url || ''),
            product_url: item.url || `https://www.google.com/shopping/product/${item.product_id}`,
            rating: item.rating ? item.rating.value : null,
            source: 'dataforseo'
        }));

        return mappedItems;
    } catch (error) {
        console.error(`[DataForSEO] ❌ Arama Hatası:`, error.response?.data?.tasks?.[0]?.status_message || error.message);
        throw new Error('DataForSEO arama servisi geçici olarak hizmet veremiyor');
    }
}

async function getSellers(productId) {
    try {
        console.log(`[DataForSEO] 🏪 Satıcılar aranıyor: "${productId}" (Görev oluşturuluyor...)`);
        const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/merchant/google/sellers/task_post',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: [{
                product_id: productId,
                language_code: "tr",
                location_code: 2792,
                priority: 2
            }]
        });

        const taskId = response.data?.tasks?.[0]?.id;
        if (!taskId) throw new Error("Satıcı görevi oluşturulamadı");
        
        console.log(`[DataForSEO] ⏳ Satıcı sonuçları bekleniyor (Task: ${taskId})...`);
        const result = await pollTaskGet(taskId, "sellers");

        const items = result?.items || [];
        console.log(`[DataForSEO] ✅ Ürün için ${items.length} satıcı bulundu.`);
        
        return items.map(seller => ({
            siteName: seller.seller || seller.domain || seller.source || seller.title || 'Bilinmeyen Satıcı',
            price: seller.total_price || seller.base_price || (typeof seller.price === 'object' && seller.price !== null ? (seller.price.current || seller.price.value) : seller.price) || 0,
            buyUrl: seller.shop_ad_aclk || seller.url || '',
            freeShipping: seller.delivery_info?.price === 0 || seller.shipping_price === 0,
            isOutlet: seller.condition === 'used' || seller.condition === 'refurbished' || seller.product_condition === 'used',
            shop_ad_aclk: seller.shop_ad_aclk || null
        }));
    } catch (error) {
        console.error(`[DataForSEO] ❌ Satıcı Bulma Hatası:`, error.response?.data?.tasks?.[0]?.status_message || error.message);
        throw new Error('DataForSEO satıcı servisi hatası');
    }
}

async function getProductInfo(productId) {
    try {
        console.log(`[DataForSEO] 📝 Ürün detayları çekiliyor: "${productId}"...`);
        const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/merchant/google/product_info/task_post',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            data: [{
                product_id: productId,
                language_code: "tr",
                location_code: 2792,
                priority: 2
            }]
        });

        const taskId = response.data?.tasks?.[0]?.id;
        if (!taskId) throw new Error("Detay görevi oluşturulamadı");
        
        const result = await pollTaskGet(taskId, "product_info");
        const itemDetail = result?.items?.[0]; 

        
        const specs = {};
        if (itemDetail?.specifications) {
            itemDetail.specifications.forEach(s => {
                if (s.specification_name) {
                    specs[s.specification_name] = s.specification_value;
                }
            });
        }

        return {
            imageUrls: itemDetail?.images || [],
            specs: specs
        };
    } catch (error) {
        console.error(`[DataForSEO] ❌ Ürün Detay Hatası:`, error.response?.data?.tasks?.[0]?.status_message || error.message);
        return { imageUrls: [], specs: {} };
    }
}

async function resolveAdUrl(shop_ad_aclk) {
    try {
        if (!shop_ad_aclk) return null;
        console.log(`[DataForSEO] 🔗 Link çözümleniyor...`);
        
        
        
        const response = await axios({
            method: 'get',
            url: `https://api.dataforseo.com/v3/merchant/google/sellers/ad_url/${shop_ad_aclk}`,
            headers: {
                'Authorization': getAuthHeader()
            }
        });

        const result = response.data?.tasks?.[0]?.result?.[0];
        const finalUrl = result?.ad_url || result?.url || null;
        console.log(`[DataForSEO] ✅ Link çözüldü: ${finalUrl ? finalUrl.substring(0,50)+'...' : 'Bilinmiyor'}`);
        
        return finalUrl;
    } catch (error) {
        console.error(`[DataForSEO] ❌ Link Çözme Hatası:`, error.response?.data || error.message);
        return null;
    }
}

module.exports = {
    searchShopping,
    getSellers,
    getProductInfo,
    resolveAdUrl
};
