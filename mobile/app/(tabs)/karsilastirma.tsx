import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function KarsilastirmaScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <BarChart3 size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Giriş Yapın</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Karşılaştırma yapabilmek için giriş yapın.</Text>
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.headerIcon}>
            <BarChart3 size={20} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Karşılaştırma</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Ürünleri kıyasla</Text>
          </View>
        </View>
      </View>
      <View style={styles.emptyState}>
        <BarChart3 size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Henüz karşılaştırma yok</Text>
        <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Ürün detay sayfasından ürünleri karşılaştırmaya ekleyin.</Text>
      </View>
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
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
