import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Plus, Trash2, ChevronRight, Palette } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { BorderRadius, FontSize, FontWeight } from '@/constants/Colors';

const LIST_COLORS = ['#3478F6', '#6b21a8', '#34C759', '#FF9F0A', '#FF3B30', '#00B4D8', '#4f46e5'];

export default function ListelerimScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    if (!isLoggedIn) { setLoading(false); return; }
    try {
      const res = await api.getLists();
      setLists(Array.isArray(res) ? res : res.data || []);
    } catch { showToast('Listeler yüklenemedi', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLists(); }, [isLoggedIn]);

  const handleCreateList = () => {
    Alert.prompt?.('Yeni Liste', 'Liste adını girin:', async (name) => {
      if (name?.trim()) {
        const color = LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)];
        await api.createList(name.trim(), color);
        showToast('Liste oluşturuldu', 'success');
        fetchLists();
      }
    }) || showToast('Liste oluşturma özelliği yakında', 'info');
  };

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Heart size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Giriş Yapın</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Listelerinizi görmek için giriş yapın.</Text>
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
            <Heart size={20} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Listelerim</Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{lists.length} liste</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleCreateList} style={[styles.addBtn, { backgroundColor: `${colors.suzgecPrimary}15` }]}>
          <Plus size={18} color={colors.suzgecPrimary} />
        </TouchableOpacity>
      </View>

      {lists.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Heart size={48} color={colors.mutedForeground} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Henüz liste yok</Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>Beğendiğiniz ürünleri gruplamak için liste oluşturun.</Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/listelerim/${item._id || item.id}`)}
            >
              <View style={[styles.listColor, { backgroundColor: item.color || colors.suzgecPrimary }]}>
                <Heart size={16} color="#fff" />
              </View>
              <View style={styles.listInfo}>
                <Text style={[styles.listName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.listCount, { color: colors.mutedForeground }]}>
                  {item.items?.length || item.itemCount || 0} ürün
                </Text>
              </View>
              <ChevronRight size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
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
  addBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 10 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  listCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  listColor: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  listInfo: { flex: 1, gap: 2 },
  listName: { fontSize: 15, fontWeight: '600' },
  listCount: { fontSize: 12 },
});
