import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Trash2, Clock, ExternalLink, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function StockTrackingScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    api.getStockAlerts()
      .then((res) => setAlerts(res.data || []))
      .catch(() => showToast('Stok alarmları yüklenemedi', 'error'))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const deleteAlert = async (id: string) => {
    Alert.alert('Stok Takibini İptal Et', 'Bu ürünü takipten çıkarmak istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Evet, İptal Et', style: 'destructive', onPress: async () => {
          await api.deleteStockAlert(id);
          setAlerts((prev) => prev.filter((a) => a._id !== id));
          showToast('Stok takibi iptal edildi', 'success');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.headerIcon}>
          <Package size={20} color="#fff" />
        </LinearGradient>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Stok Takibi</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{alerts.length} ürün takipte</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}><ActivityIndicator size="large" color={colors.gradientStart} /></View>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Package size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Takip edilen ürün yok</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Stoğu tükenen ürünleri takibe alarak stok alarmı kurabilirsiniz.</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.alertCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/urun/${item.productId}`)}
            >
              <View style={[styles.alertImg, { backgroundColor: colors.muted }]}>
                {(item.product?.imageUrls?.[0] || item.product?.imageUrl) ? (
                  <Image source={{ uri: item.product?.imageUrls?.[0] || item.product?.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                ) : <Package size={20} color={colors.mutedForeground} style={{ opacity: 0.5 }} />}
              </View>
              <View style={styles.alertInfo}>
                <Text style={[styles.alertName, { color: colors.foreground }]} numberOfLines={1}>{item.product?.name || item.productName}</Text>
                <View style={[styles.stockBadge, { backgroundColor: item.product?.inStock ? `${colors.suzgecSuccess}20` : colors.muted }]}>
                  <Text style={[styles.stockText, { color: item.product?.inStock ? colors.suzgecSuccess : colors.mutedForeground }]}>
                    {item.product?.inStock ? 'Stokta Var' : 'Tükendi - Bekleniyor'}
                  </Text>
                </View>
                <View style={styles.timeBadge}>
                  <Clock size={10} color={colors.mutedForeground} />
                  <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: tr })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation?.(); deleteAlert(item._id); }}
                style={[styles.deleteBtn, { backgroundColor: `${colors.suzgecDanger}10` }]}
              >
                <Trash2 size={16} color={colors.suzgecDanger} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 11 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  alertImg: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  alertInfo: { flex: 1, gap: 4 },
  alertName: { fontSize: 13, fontWeight: '600' },
  stockBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stockText: { fontSize: 10, fontWeight: '500' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 10 },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
