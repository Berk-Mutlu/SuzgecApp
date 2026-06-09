import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToast } from '@/context/ToastContext';

export default function RegisterScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!firstName.trim() || !email.trim() || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (res.success || res._id) {
        showToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
        router.replace('/(auth)/giris');
      } else {
        const msg = res.message || 'Kayıt başarısız oldu.';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch {
      setError('Bir hata oluştu.');
      showToast('Hata oluştu', 'error');
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
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={[colors.suzgecPrimary, colors.suzgecSecondary, colors.suzgecAccent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.topLine} />

          <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </LinearGradient>

          <Text style={[styles.title, { color: colors.foreground }]}>Kayıt Ol</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Yeni bir Süzgeç hesabı oluşturun</Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: `${colors.destructive}15`, borderColor: `${colors.destructive}30` }]}>
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          {/* Name fields */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.foreground }]}>Ad</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <User size={16} color={colors.mutedForeground} />
                <TextInput placeholder="Ad" placeholderTextColor={colors.mutedForeground} value={firstName} onChangeText={setFirstName} style={[styles.input, { color: colors.foreground }]} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.foreground }]}>Soyad</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput placeholder="Soyad" placeholderTextColor={colors.mutedForeground} value={lastName} onChangeText={setLastName} style={[styles.input, { color: colors.foreground }]} />
              </View>
            </View>
          </View>

          <Text style={[styles.label, { color: colors.foreground, marginTop: 12 }]}>E-posta</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Mail size={16} color={colors.mutedForeground} />
            <TextInput placeholder="ornek@email.com" placeholderTextColor={colors.mutedForeground} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { color: colors.foreground }]} />
          </View>

          <Text style={[styles.label, { color: colors.foreground, marginTop: 12 }]}>Şifre</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Lock size={16} color={colors.mutedForeground} />
            <TextInput placeholder="En az 8 karakter" placeholderTextColor={colors.mutedForeground} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={[styles.input, { color: colors.foreground }]} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} color={colors.mutedForeground} /> : <Eye size={16} color={colors.mutedForeground} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleRegister} disabled={loading}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.submitBtn, loading && { opacity: 0.6 }]}>
              <Text style={styles.submitText}>{loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}</Text>
              {!loading && <ArrowRight size={16} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: colors.mutedForeground }]}>Zaten hesabınız var mı? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/giris')}>
              <Text style={[styles.loginLink, { color: colors.suzgecPrimary }]}>Giriş Yapın</Text>
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
  nameRow: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, height: 44, borderRadius: 10, borderWidth: 1, marginBottom: 4 },
  input: { flex: 1, fontSize: 14, height: 44 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, marginTop: 20 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { fontSize: 13 },
  loginLink: { fontSize: 13, fontWeight: '600' },
});
