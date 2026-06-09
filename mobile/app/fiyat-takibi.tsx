import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BellRing, Trash2, TrendingDown, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price || 0);
}

export default function PriceTrackingScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const [alarms, setAlarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    api.getPriceAlerts()
      .then((res) => setAlarms(res.data || (Array.isArray(res) ? res : [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const toggleAlarm = async (id: string, current: boolean) => {
    setAlarms((prev) => prev.map((a) => (a._id === id ? { ...a, enabled: !current } : a)));
    const res = await api.updatePriceAlert(id, { enabled: !current });
    if (!res.success) {
      setAlarms((prev) => prev.map((a) => (a._id === id ? { ...a, enabled: current } : a)));
      showToast('İşlem başarısız', 'error');
    }
  };

  const deleteAlarm = async (id: string) => {
    const res = await api.deletePriceAlert(id);
    if (res.success) {
      setAlarms((prev) => prev.filter((a) => a._id !== id));
      showToast('Alarm silindi', 'success');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.secondary }]}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.headerIcon}>
          <BellRing size={20} color="#fff" />
        </LinearGradient>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Fiyat Alarmları</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{alarms.length} takip edilen ürün</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}><ActivityIndicator size="large" color={colors.gradientStart} /></View>
      ) : alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <BellRing size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Henüz alarm yok</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Fiyatını takip etmek istediğiniz ürünler için alarm ekleyin.</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => {
            const product = item.product || {};
            const currentPrice = item.currentPrice || product.currentPrice || 0;
            const isEnabled = item.enabled !== false;
            return (
              <View style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: isEnabled ? 1 : 0.6 }]}>
                <TouchableOpacity style={styles.alarmInfo} onPress={() => router.push(`/urun/${product._id || item.productId}`)}>
                  <View style={[styles.alarmImg, { backgroundColor: colors.muted }]}>
                    {(product.imageUrl || product.image) ? (
                      <Image source={{ uri: product.imageUrl || product.image }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                    ) : <Text style={{ fontSize: 20 }}>📦</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alarmName, { color: colors.foreground }]} numberOfLines={1}>{product.name || item.productName}</Text>
                    <View style={[styles.priceRow, { backgroundColor: colors.muted }]}>
                      <View style={styles.priceCol}>
                        <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Şu anki</Text>
                        <Text style={[styles.priceValue, { color: colors.foreground }]}>{formatPrice(currentPrice)} ₺</Text>
                      </View>
                      <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.priceCol}>
                        <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>Hedef</Text>
                        <Text style={[styles.priceValue, { color: colors.suzgecPrimary }]}>{formatPrice(item.targetPrice)} ₺</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.alarmActions}>
                  <TouchableOpacity onPress={() => toggleAlarm(item._id, isEnabled)}>
                    {isEnabled ? <ToggleRight size={28} color={colors.suzgecPrimary} /> : <ToggleLeft size={28} color={colors.mutedForeground} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAlarm(item._id)} style={[styles.deleteBtn, { backgroundColor: `${colors.suzgecDanger}10` }]}>
                    <Trash2 size={16} color={colors.suzgecDanger} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
  alarmCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 10 },
  alarmInfo: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  alarmImg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  alarmName: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  priceRow: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden' },
  priceCol: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  priceDivider: { width: 1, marginVertical: 8 },
  priceLabel: { fontSize: 10, marginBottom: 2 },
  priceValue: { fontSize: 14, fontWeight: '700' },
  alarmActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10 },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
