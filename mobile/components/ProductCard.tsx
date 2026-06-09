import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Bell, ExternalLink, TrendingDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function getCategoryEmoji(category?: string): string {
  switch (category) {
    case 'Telefon': return '📱';
    case 'Bilgisayar': return '💻';
    case 'Televizyon': return '📺';
    case 'Kulaklık': return '🎧';
    case 'Oyun Konsolu': return '🎮';
    default: return '📦';
  }
}

interface ProductCardProps {
  product: any;
  onAddToList?: (id: string) => void;
  onAddAlert?: (id: string) => void;
}

export function ProductCard({ product, onAddToList, onAddAlert }: ProductCardProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const imageUrl = product.imageUrl || product.image;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/urun/${product._id || product.id}`)}
    >
      {/* Price Change Badge */}
      {product.priceChange && product.priceChange < 0 && (
        <View style={[styles.badge, { backgroundColor: colors.suzgecSuccess }]}>
          <TrendingDown size={10} color="#fff" />
          <Text style={styles.badgeText}>%{Math.abs(product.priceChange).toFixed(1)}</Text>
        </View>
      )}

      {/* Used Badge */}
      {product.condition === 'used' && (
        <View style={[styles.usedBadge, { backgroundColor: colors.suzgecWarning }]}>
          <Text style={[styles.badgeText, { color: '#000' }]}>2. El</Text>
        </View>
      )}

      {/* Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.secondary }]}>
        <Text style={styles.categoryEmoji}>{getCategoryEmoji(product.category)}</Text>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        ) : null}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.seller, { color: colors.mutedForeground }]} numberOfLines={1}>
          {product.priceInfo || product.seller?.replace(/^Epey\s*\(?/, '(').replace(/^\(/, '') || ''}
        </Text>
        <Text style={[styles.price, { color: colors.suzgecPrimary }]}>
          {formatPrice(product.price || product.currentPrice)} ₺
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.border }]}
            onPress={() => onAddToList?.(product._id || product.id)}
          >
            <Heart size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.border }]}
            onPress={() => onAddAlert?.(product._id || product.id)}
          >
            <Bell size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goBtn}
          >
            <TouchableOpacity style={styles.goBtnInner}>
              <Text style={styles.goBtnText}>Git</Text>
              <ExternalLink size={11} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Skeleton loader
export function ProductSkeleton() {
  const colors = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.imageContainer, { backgroundColor: colors.muted }]} />
      <View style={styles.info}>
        <View style={[styles.skeletonLine, { width: '100%', backgroundColor: colors.muted }]} />
        <View style={[styles.skeletonLine, { width: '75%', backgroundColor: colors.muted }]} />
        <View style={[styles.skeletonLine, { width: '40%', height: 16, backgroundColor: colors.muted }]} />
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
          <View style={[styles.skeletonBox, { backgroundColor: colors.muted }]} />
          <View style={[styles.skeletonBox, { backgroundColor: colors.muted }]} />
          <View style={[styles.skeletonBox, { flex: 1, backgroundColor: colors.muted }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  usedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryEmoji: {
    fontSize: 32,
    opacity: 0.3,
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
    padding: 8,
  },
  info: {
    padding: Spacing.sm,
    gap: 2,
  },
  name: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    lineHeight: 14,
    height: 28,
  },
  seller: {
    fontSize: FontSize.xs,
    lineHeight: 14,
  },
  price: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBtn: {
    flex: 1,
    height: 30,
    borderRadius: BorderRadius.sm,
    marginLeft: 'auto',
  },
  goBtnInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  goBtnText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonBox: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
  },
});
