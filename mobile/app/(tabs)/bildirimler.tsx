import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, BellRing, Check, Trash2, Clock, Tag, Package, ArrowUpRight, CheckCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'expo-router';

function getIcon(type: string, color: string) {
  const size = 16;
  switch (type) {
    case 'price_drop': return <Tag size={size} color={color} />;
    case 'stock_alert': return <Package size={size} color={color} />;
    case 'price_target': return <ArrowUpRight size={size} color={color} />;
    default: return <Bell size={size} color={color} />;
  }
}

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    api.getNotifications()
      .then((res) => setNotifications(Array.isArray(res) ? res : []))
      .catch(() => showToast('Bildirimler yüklenemedi', 'error'))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const markRead = async (id: string) => {
    const res = await api.markNotificationRead(id);
    if (res._id || res.success) {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      showToast('Okundu', 'success');
    }
  };

  const deleteNotif = async (id: string) => {
    const res = await api.deleteNotification(id);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast('Bildirim silindi', 'success');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Bell size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Giriş Yapın</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Bildirimleri görmek için giriş yapmalısınız.</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/giris')}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.headerIcon}>
            <BellRing size={20} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Bildirimler</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{unreadCount} yeni bildirim</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.gradientStart} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Henüz bildiriminiz yok</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Fiyat alarmları ve stok haberleri burada görünecek.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.notifCard, {
              backgroundColor: !item.read ? `${colors.suzgecPrimary}08` : 'transparent',
              borderColor: !item.read ? `${colors.suzgecPrimary}20` : 'transparent',
            }]}>
              <LinearGradient
                colors={!item.read
                  ? [colors.gradientStart, colors.gradientMid, colors.gradientEnd]
                  : [colors.muted, colors.muted]
                }
                style={styles.notifIcon}
              >
                {getIcon(item.type, !item.read ? '#fff' : colors.mutedForeground)}
              </LinearGradient>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, { color: colors.foreground, fontWeight: !item.read ? '700' : '400' }]} numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text style={[styles.notifMsg, { color: colors.mutedForeground }]} numberOfLines={1}>{item.message}</Text>
                <View style={styles.notifMeta}>
                  <Clock size={10} color={colors.mutedForeground} />
                  <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
                    {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: tr }) : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.notifActions}>
                {!item.read && (
                  <TouchableOpacity onPress={() => markRead(item._id)} style={[styles.notifBtn, { backgroundColor: `${colors.suzgecPrimary}15` }]}>
                    <Check size={14} color={colors.suzgecPrimary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteNotif(item._id)} style={[styles.notifBtn, { backgroundColor: `${colors.suzgecDanger}10` }]}>
                  <Trash2 size={14} color={colors.suzgecDanger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSub: { fontSize: 11 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  notifIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1, gap: 2 },
  notifTitle: { fontSize: 13 },
  notifMsg: { fontSize: 11 },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  notifTime: { fontSize: 10 },
  notifActions: { flexDirection: 'row', gap: 6 },
  notifBtn: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
