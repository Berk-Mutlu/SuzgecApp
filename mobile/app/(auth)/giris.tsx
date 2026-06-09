import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { BorderRadius } from '@/constants/Colors';

export default function LoginScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login({ email: email.trim().toLowerCase(), password });
      if (res.success) {
        showToast('Giriş başarılı!', 'success');
        await checkAuth();
        router.back();
      } else {
        const msg = res.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch {
      const msg = 'Bir hata oluştu. Tekrar deneyin.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Top gradient line */}
          <LinearGradient
            colors={[colors.suzgecPrimary, colors.suzgecSecondary, colors.suzgecAccent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topLine}
          />

          {/* Logo */}
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            style={styles.logo}
          >
            <Text style={styles.logoText}>S</Text>
          </LinearGradient>

          <Text style={[styles.title, { color: colors.foreground }]}>Giriş Yap</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Süzgeç hesabınıza giriş yapın</Text>

          {/* Error */}
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: `${colors.destructive}15`, borderColor: `${colors.destructive}30` }]}>
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={[styles.label, { color: colors.foreground }]}>E-posta</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Mail size={16} color={colors.mutedForeground} />
            <TextInput
              placeholder="ornek@email.com"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>

          {/* Password */}
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.foreground }]}>Şifre</Text>
          </View>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Lock size={16} color={colors.mutedForeground} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.foreground }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} color={colors.mutedForeground} /> : <Eye size={16} color={colors.mutedForeground} />}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.submitBtn, loading && { opacity: 0.6 }]}
            >
              <Text style={styles.submitText}>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</Text>
              {!loading && <ArrowRight size={16} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: colors.mutedForeground }]}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/kayit')}>
              <Text style={[styles.registerLink, { color: colors.suzgecPrimary }]}>Kayıt Olun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  card: { borderRadius: 16, padding: 24, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 },
  topLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  logo: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 20 },
  errorBox: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16 },
  errorText: { fontSize: 12 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1, marginBottom: 4 },
  input: { flex: 1, fontSize: 14, height: 44 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, marginTop: 20 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  registerText: { fontSize: 13 },
  registerLink: { fontSize: 13, fontWeight: '600' },
});
