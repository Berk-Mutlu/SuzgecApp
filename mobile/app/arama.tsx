import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Sparkles, Package, ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProductCard, ProductSkeleton } from '@/components/ProductCard';

export default function SearchScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const query = q || 'telefon';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.searchProducts(query === 'all' ? '' : query)
      .then((res) => {
        const data = (res.data || (Array.isArray(res) ? res : []))
          .filter((p: any) => p.name && p.name.trim().length > 3)
          .filter((p: any) => p.condition !== 'used');
        setProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
            <ArrowLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingState}>
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={colors.gradientStart} />
            <Sparkles size={20} color={colors.gradientStart} style={styles.sparkle} />
          </View>
          <Text style={[styles.loadingTitle, { color: colors.foreground }]}>Ürünler Taranıyor...</Text>
          <Text style={[styles.loadingDesc, { color: colors.mutedForeground }]}>
            En güncel fiyatlar ve mağaza stokları kontrol ediliyor.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item, i) => item._id || item.id || String(i)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
              <ArrowLeft size={20} color={colors.foreground} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <View style={styles.headerTitleRow}>
                <Sparkles size={18} color={colors.gradientStart} />
                <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
                  "{query}" için sonuçlar
                </Text>
              </View>
              <Text style={[styles.headerCount, { color: colors.mutedForeground }]}>
                {products.length} adet ürün bulundu
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Package size={32} color={colors.mutedForeground} style={{ opacity: 0.4 }} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Ürün Bulunamadı</Text>
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              Aradığınız kriterlere uygun ürün bulunamadı. Farklı bir kelime deneyin.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1 },
  headerCount: { fontSize: 12, marginLeft: 24, marginTop: 2 },
  row: { justifyContent: 'space-between', paddingHorizontal: 16 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingHorizontal: 40 },
  spinnerContainer: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
  sparkle: { position: 'absolute' },
  loadingTitle: { fontSize: 18, fontWeight: '700' },
  loadingDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
