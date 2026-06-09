import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, LogOut, LogIn, ChevronRight, TrendingDown, Package, Bell, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useToast } from '@/context/ToastContext';

export default function ProfilScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Kullanıcı'
    : '';

  const handleLogout = async () => {
    await logout();
    showToast('Çıkış yapıldı', 'success');
  };

  const menuItems = [
    { icon: TrendingDown, label: 'Fiyat Alarmları', route: '/fiyat-takibi', color: colors.suzgecWarning },
    { icon: Package, label: 'Stok Takibi', route: '/stok-takibi', color: colors.suzgecSuccess },
    { icon: Bell, label: 'Bildirimler', route: '/(tabs)/bildirimler', color: colors.suzgecPrimary },
  ];

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <User size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Hesabınıza Giriş Yapın</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            Fiyat takibi, listeler ve bildirimler için giriş yapmalısınız.
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/giris')}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtn}>
              <LogIn size={16} color="#fff" />
              <Text style={styles.emptyBtnText}>Giriş Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/kayit')}>
            <Text style={[styles.registerLink, { color: colors.suzgecPrimary }]}>Hesabınız yok mu? Kayıt Olun</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileEmail}>{user?.email || ''}</Text>
      </LinearGradient>

      {/* Menu Items */}
      <View style={[styles.menuSection, { marginTop: -20 }]}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <item.icon size={18} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: colors.suzgecDanger }]}
        onPress={handleLogout}
      >
        <LogOut size={18} color={colors.suzgecDanger} />
        <Text style={[styles.logoutText, { color: colors.suzgecDanger }]}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  registerLink: { fontSize: 13, fontWeight: '500', marginTop: 16 },
  profileHeader: { paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  menuSection: { paddingHorizontal: 16, gap: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  menuIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 24, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  logoutText: { fontSize: 15, fontWeight: '600' },
});
