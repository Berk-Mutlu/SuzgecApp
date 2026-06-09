import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, TrendingDown, ArrowRight, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ProductCard, ProductSkeleton } from '@/components/ProductCard';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    api.searchProducts('', 50)
      .then((res) => {
        const data = res.data || (Array.isArray(res) ? res : []);
        setFeaturedProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/arama?q=${encodeURIComponent(q)}`);
    }
  };

  const renderHeader = () => (
    <>
      {/* Hero Section */}
      <View style={styles.heroWrapper}>
        <LinearGradient
          colors={[`${colors.gradientStart}18`, `${colors.gradientMid}0A`, 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          {/* Title */}
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            En Uygun Fiyatı{' '}
          </Text>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientTextBg}
          >
            <Text style={styles.gradientText}>SüzGeç</Text>
          </LinearGradient>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>'le Bul</Text>

          <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
            Binlerce siteden milyonlarca ürünü aynı anda ara, fiyatları karşılaştır, takip et ve en iyi fırsatı yakala.
          </Text>

          {/* Search Bar */}
          <View style={[styles.searchContainer, {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.gradientStart,
          }]}>
            <Search size={18} color={colors.mutedForeground} style={{ marginLeft: 14 }} />
            <TextInput
              placeholder="Ne aramıştınız? (ör. iPhone 15)"
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            <TouchableOpacity onPress={handleSearch}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchBtn}
              >
                <Search size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <TrendingDown size={18} color={colors.suzgecSuccess} />
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Günün Fırsatları</Text>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {renderHeader()}
          <View style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={featuredProducts.slice(0, 50)}
          keyExtractor={(item, i) => item._id || item.id || String(i)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroWrapper: {
    overflow: 'hidden',
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  gradientTextBg: {
    borderRadius: 6,
    paddingHorizontal: 2,
  },
  gradientText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    height: 50,
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
