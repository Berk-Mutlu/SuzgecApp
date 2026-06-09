import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator,
  Dimensions, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Heart, Bell, ExternalLink, Share2, BarChart3,
  TrendingDown, ChevronRight, Star, Package,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price || 0);
}

export default function ProductDetailScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getProduct(id), api.getProductSellers(id)])
      .then(([prodRes, sellerRes]) => {
        const p = prodRes.data || prodRes;
        setProduct(p);
        const s = sellerRes.data || (Array.isArray(sellerRes) ? sellerRes : []);
        setSellers(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingState, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={colors.gradientStart} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary, margin: 16 }]}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.emptyState}>
          <Package size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Ürün bulunamadı</Text>
        </View>
      </View>
    );
  }

  const images = product.imageUrls || (product.imageUrl ? [product.imageUrl] : []);
  const currentPrice = product.currentPrice || product.price || 0;

  const handleGoToStore = async (seller: any) => {
    try {
      const url = seller.clickUrl || seller.url;
      if (url) {
        const res = await api.resolveAdUrl(id!, url, seller.siteName);
        Linking.openURL(res.resolvedUrl || url);
      }
    } catch {
      showToast('Mağazaya yönlendirilemedi', 'error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={[styles.imageSection, { backgroundColor: colors.secondary }]}>
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.topBarBtn, { backgroundColor: colors.card }]}>
              <ArrowLeft size={20} color={colors.foreground} />
            </TouchableOpacity>
            <View style={styles.topBarRight}>
              <TouchableOpacity style={[styles.topBarBtn, { backgroundColor: colors.card }]}>
                <Share2 size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image */}
          {images.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(idx);
              }}
            >
              {images.map((img: string, i: number) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={{ width, height: 280 }}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={{ height: 280, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 64, opacity: 0.3 }}>📦</Text>
            </View>
          )}

          {/* Image indicators */}
          {images.length > 1 && (
            <View style={styles.indicators}>
              {images.map((_: any, i: number) => (
                <View key={i} style={[styles.indicator, {
                  backgroundColor: i === currentImageIndex ? colors.suzgecPrimary : colors.mutedForeground,
                  opacity: i === currentImageIndex ? 1 : 0.3,
                }]} />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.productName, { color: colors.foreground }]}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={[styles.currentPrice, { color: colors.suzgecPrimary }]}>
              {formatPrice(currentPrice)} ₺
            </Text>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                {formatPrice(product.originalPrice)} ₺
              </Text>
            )}
          </View>

          {product.category && (
            <View style={[styles.categoryBadge, { backgroundColor: `${colors.suzgecPrimary}15` }]}>
              <Text style={[styles.categoryText, { color: colors.suzgecPrimary }]}>{product.category}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Heart size={20} color={colors.suzgecPrimary} />
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Listeye Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Bell size={20} color={colors.suzgecWarning} />
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Fiyat Alarmı</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <BarChart3 size={20} color={colors.suzgecAccent} />
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Karşılaştır</Text>
          </TouchableOpacity>
        </View>

        {/* Sellers */}
        {sellers.length > 0 && (
          <View style={styles.sellersSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Satıcılar</Text>
            {sellers.map((seller, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.sellerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handleGoToStore(seller)}
              >
                <View style={styles.sellerInfo}>
                  <Text style={[styles.sellerName, { color: colors.foreground }]} numberOfLines={1}>
                    {seller.siteName || seller.seller || 'Mağaza'}
                  </Text>
                  {seller.shippingInfo && (
                    <Text style={[styles.sellerShipping, { color: colors.mutedForeground }]}>{seller.shippingInfo}</Text>
                  )}
                </View>
                <View style={styles.sellerPriceSection}>
                  <Text style={[styles.sellerPrice, { color: colors.suzgecPrimary }]}>
                    {formatPrice(seller.price)} ₺
                  </Text>
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.goStoreBtn}
                  >
                    <Text style={styles.goStoreText}>Git</Text>
                    <ExternalLink size={12} color="#fff" />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <View style={styles.specsSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Özellikler</Text>
            <View style={[styles.specsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {Object.entries(product.specs).map(([key, value], i) => (
                <View key={i} style={[styles.specRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                  <Text style={[styles.specKey, { color: colors.mutedForeground }]}>{key}</Text>
                  <Text style={[styles.specValue, { color: colors.foreground }]}>{String(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <View>
          <Text style={[styles.bottomPriceLabel, { color: colors.mutedForeground }]}>En düşük fiyat</Text>
          <Text style={[styles.bottomPrice, { color: colors.suzgecPrimary }]}>{formatPrice(currentPrice)} ₺</Text>
        </View>
        <TouchableOpacity onPress={() => sellers[0] && handleGoToStore(sellers[0])}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bottomBtn}
          >
            <Text style={styles.bottomBtnText}>Mağazaya Git</Text>
            <ExternalLink size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  imageSection: { paddingBottom: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8, zIndex: 10 },
  topBarBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  topBarRight: { flexDirection: 'row', gap: 8 },
  indicators: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 8 },
  indicator: { width: 8, height: 8, borderRadius: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  infoSection: { marginHorizontal: 16, marginTop: -10, padding: 16, borderRadius: 16, borderWidth: 1, zIndex: 5 },
  productName: { fontSize: 17, fontWeight: '700', lineHeight: 24 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 8 },
  currentPrice: { fontSize: 24, fontWeight: '800' },
  originalPrice: { fontSize: 14, textDecorationLine: 'line-through' },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  actionsSection: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 16 },
  actionCard: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  actionLabel: { fontSize: 11, fontWeight: '500' },
  sellersSection: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  sellerInfo: { flex: 1, gap: 2 },
  sellerName: { fontSize: 14, fontWeight: '600' },
  sellerShipping: { fontSize: 11 },
  sellerPriceSection: { alignItems: 'flex-end', gap: 6 },
  sellerPrice: { fontSize: 16, fontWeight: '700' },
  goStoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  goStoreText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  specsSection: { paddingHorizontal: 16, marginTop: 20 },
  specsCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  specKey: { fontSize: 13, flex: 1 },
  specValue: { fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 10 },
  bottomPriceLabel: { fontSize: 11 },
  bottomPrice: { fontSize: 20, fontWeight: '800' },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 12 },
  bottomBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
