
export interface Product {
    id: string;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    seller: string;
    sellerLogo?: string;
    condition: "new" | "used";
    category: string;
    rating?: number;
    priceChange?: number; 
    inStock: boolean;
    url?: string;
    specs?: Record<string, string>;
}
export interface PriceHistory {
    date: string;
    price: number;
}
export interface WatchList {
    id: string;
    name: string;
    color: string;
    icon: string;
    itemCount: number;
    estimatedTotal: number;
    items: Product[];
}
export interface Notification {
    id: string;
    type: "price_drop" | "stock_alert" | "price_target";
    title: string;
    message: string;
    productId: string;
    productName: string;
    timestamp: string;
    read: boolean;
    oldPrice?: number;
    newPrice?: number;
}
export const categories = [
    { name: "Telefon", icon: "📱", count: 2450 },
    { name: "Bilgisayar", icon: "💻", count: 1830 },
    { name: "Televizyon", icon: "📺", count: 920 },
    { name: "Kulaklık", icon: "🎧", count: 1560 },
    { name: "Oyun Konsolu", icon: "🎮", count: 340 },
    { name: "Tablet", icon: "📋", count: 680 },
    { name: "Kamera", icon: "📷", count: 450 },
    { name: "Akıllı Saat", icon: "⌚", count: 790 },
];
export const sellers = [
    "Trendyol", "Hepsiburada", "Amazon TR", "N11",
    "MediaMarkt", "Vatan", "Sahibinden", "GittiGidiyor", "Dolap"
];
export const featuredProducts: Product[] = [
    {
        id: "1",
        name: "MacBook Air M3 15\"",
        image: "/products/macbook.jpg",
        currentPrice: 42999,
        originalPrice: 52999,
        seller: "Hepsiburada",
        condition: "new",
        category: "Bilgisayar",
        priceChange: -18.9,
        inStock: true,
        specs: {
            "İşlemci": "Apple M3",
            "RAM": "8 GB",
            "Depolama": "256 GB SSD",
            "Ekran": "15.3 inç Liquid Retina",
            "Batarya": "18 saat",
            "Ağırlık": "1.51 kg"
        }
    },
    {
        id: "2",
        name: "iPhone 15 Pro 256 GB",
        image: "/products/iphone15.jpg",
        currentPrice: 64999,
        originalPrice: 69999,
        seller: "Amazon TR",
        condition: "new",
        category: "Telefon",
        priceChange: -7.1,
        inStock: true,
        specs: {
            "İşlemci": "A17 Pro",
            "RAM": "8 GB",
            "Depolama": "256 GB",
            "Ekran": "6.1 inç Super Retina XDR",
            "Batarya": "3274 mAh",
            "Kamera": "48 MP"
        }
    },
    {
        id: "3",
        name: "Samsung Galaxy S24 Ultra",
        image: "/products/samsung-s24.jpg",
        currentPrice: 59999,
        originalPrice: 64999,
        seller: "Trendyol",
        condition: "new",
        category: "Telefon",
        priceChange: -7.7,
        inStock: true,
        specs: {
            "İşlemci": "Snapdragon 8 Gen 3",
            "RAM": "12 GB",
            "Depolama": "256 GB",
            "Ekran": "6.8 inç Dynamic AMOLED 2X",
            "Batarya": "5000 mAh",
            "Kamera": "200 MP"
        }
    },
    {
        id: "4",
        name: "Sony PlayStation 5 Slim",
        image: "/products/ps5.jpg",
        currentPrice: 18499,
        originalPrice: 22999,
        seller: "MediaMarkt",
        condition: "new",
        category: "Oyun Konsolu",
        priceChange: -19.6,
        inStock: true,
    },
    {
        id: "5",
        name: "AirPods Pro (2. Nesil)",
        image: "/products/airpods.jpg",
        currentPrice: 8999,
        originalPrice: 9999,
        seller: "N11",
        condition: "new",
        category: "Kulaklık",
        priceChange: -10.0,
        inStock: true,
    },
    {
        id: "6",
        name: "LG OLED C4 55\"",
        image: "/products/lg-tv.jpg",
        currentPrice: 44999,
        originalPrice: 54999,
        seller: "Vatan",
        condition: "new",
        category: "Televizyon",
        priceChange: -18.2,
        inStock: true,
    },
];
export const usedProducts: Product[] = [
    {
        id: "u1",
        name: "iPhone 13 128 GB",
        image: "/products/iphone13-used.jpg",
        currentPrice: 29000,
        seller: "Sahibinden",
        condition: "used",
        category: "Telefon",
        inStock: true,
        specs: {
            "İşlemci": "A15 Bionic",
            "RAM": "4 GB",
            "Depolama": "128 GB",
            "Ekran": "6.1 inç OLED",
            "Batarya": "3240 mAh",
            "Kamera": "12 MP"
        }
    },
    {
        id: "u2",
        name: "Samsung Galaxy S23 256 GB",
        image: "/products/samsung-s23-used.jpg",
        currentPrice: 25000,
        seller: "Dolap",
        condition: "used",
        category: "Telefon",
        inStock: true,
        specs: {
            "İşlemci": "Snapdragon 8 Gen 2",
            "RAM": "8 GB",
            "Depolama": "256 GB",
            "Ekran": "6.1 inç AMOLED",
            "Batarya": "3900 mAh",
            "Kamera": "50 MP"
        }
    },
    {
        id: "u3",
        name: "Sony PS5 (2. El Temiz)",
        image: "/products/ps5-used.jpg",
        currentPrice: 14500,
        seller: "Sahibinden",
        condition: "used",
        category: "Oyun Konsolu",
        inStock: true,
    },
    {
        id: "u4",
        name: "MacBook Pro M1 2021",
        image: "/products/macbook-used.jpg",
        currentPrice: 35000,
        seller: "Dolap",
        condition: "used",
        category: "Bilgisayar",
        inStock: true,
    },
];
export const priceHistoryData: PriceHistory[] = [
    { date: "Oca 1", price: 72999 },
    { date: "Oca 15", price: 71999 },
    { date: "Şub 1", price: 69999 },
    { date: "Şub 15", price: 68999 },
    { date: "Mar 1", price: 69499 },
    { date: "Mar 15", price: 67999 },
    { date: "Nis 1", price: 66999 },
    { date: "Nis 15", price: 66499 },
    { date: "May 1", price: 65999 },
    { date: "May 15", price: 64999 },
    { date: "Haz 1", price: 65499 },
    { date: "Haz 15", price: 64999 },
];
export const sellerPrices = [
    { seller: "Amazon TR", price: 64999, shipping: "Ücretsiz", rating: 4.8, inStock: true },
    { seller: "Hepsiburada", price: 65499, shipping: "Ücretsiz", rating: 4.7, inStock: true },
    { seller: "Trendyol", price: 65999, shipping: "29.90 ₺", rating: 4.6, inStock: true },
    { seller: "N11", price: 66499, shipping: "Ücretsiz", rating: 4.5, inStock: true },
    { seller: "MediaMarkt", price: 66999, shipping: "49.90 ₺", rating: 4.4, inStock: false },
    { seller: "Vatan", price: 67999, shipping: "Ücretsiz", rating: 4.3, inStock: true },
];
export const watchLists: WatchList[] = [
    {
        id: "w1",
        name: "Favorilerim",
        color: "#7c3aed",
        icon: "💜",
        itemCount: 12,
        estimatedTotal: 245000,
        items: featuredProducts.slice(0, 3),
    },
    {
        id: "w2",
        name: "Ev İhtiyaçları",
        color: "#059669",
        icon: "🏠",
        itemCount: 5,
        estimatedTotal: 82000,
        items: featuredProducts.slice(3, 5),
    },
    {
        id: "w3",
        name: "Teknoloji İstek Listesi",
        color: "#3b82f6",
        icon: "🚀",
        itemCount: 8,
        estimatedTotal: 189000,
        items: featuredProducts.slice(1, 4),
    },
    {
        id: "w4",
        name: "Doğum Günü Hediyeleri",
        color: "#ea580c",
        icon: "🎁",
        itemCount: 3,
        estimatedTotal: 15500,
        items: featuredProducts.slice(4, 6),
    },
];
export const notifications: Notification[] = [
    {
        id: "n1",
        type: "price_drop",
        title: "Fiyat Düştü!",
        message: "İstediğiniz fiyata yaklaştı",
        productId: "2",
        productName: "iPhone 15 Pro 256 GB",
        timestamp: "2 saat önce",
        read: false,
        oldPrice: 69999,
        newPrice: 64999,
    },
    {
        id: "n2",
        type: "stock_alert",
        title: "Stok Geldi!",
        message: "Takip ettiğiniz ürün tekrar stoklara girdi",
        productId: "4",
        productName: "Sony PlayStation 5 Slim",
        timestamp: "5 saat önce",
        read: false,
    },
    {
        id: "n3",
        type: "price_target",
        title: "Hedef Fiyata Ulaşıldı! 🎯",
        message: "Belirlediğiniz hedef fiyata ulaşıldı",
        productId: "1",
        productName: "MacBook Air M3 15\"",
        timestamp: "1 gün önce",
        read: true,
        oldPrice: 52999,
        newPrice: 42999,
    },
    {
        id: "n4",
        type: "price_drop",
        title: "Fiyat Düştü!",
        message: "%19 indirimle tarihi düşük seviyede",
        productId: "6",
        productName: "LG OLED C4 55\"",
        timestamp: "2 gün önce",
        read: true,
        oldPrice: 54999,
        newPrice: 44999,
    },
];
export const stockTrackingItems = [
    {
        id: "s1",
        product: { ...featuredProducts[3], inStock: false },
        lastChecked: "5 dk önce",
        status: "out_of_stock" as const,
        notifyOnStock: true,
    },
    {
        id: "s2",
        product: {
            id: "s2-p",
            name: "NVIDIA RTX 4090",
            image: "/products/rtx4090.jpg",
            currentPrice: 75000,
            seller: "Vatan",
            condition: "new" as const,
            category: "Bilgisayar",
            inStock: false,
        },
        lastChecked: "12 dk önce",
        status: "out_of_stock" as const,
        notifyOnStock: true,
    },
    {
        id: "s3",
        product: {
            id: "s3-p",
            name: "Apple Vision Pro",
            image: "/products/vision-pro.jpg",
            currentPrice: 129999,
            seller: "Apple Store",
            condition: "new" as const,
            category: "Elektronik",
            inStock: true,
        },
        lastChecked: "2 dk önce",
        status: "in_stock" as const,
        notifyOnStock: true,
    },
    {
        id: "s4",
        product: {
            id: "s4-p",
            name: "Steam Deck OLED 1TB",
            image: "/products/steamdeck.jpg",
            currentPrice: 24999,
            seller: "Amazon TR",
            condition: "new" as const,
            category: "Oyun Konsolu",
            inStock: false,
        },
        lastChecked: "8 dk önce",
        status: "out_of_stock" as const,
        notifyOnStock: false,
    },
];
export function formatPrice(price: number): string {
    return new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
