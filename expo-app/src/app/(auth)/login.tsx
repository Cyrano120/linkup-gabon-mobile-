import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Btn, Field } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { colors, gabonGradient, heroGradient, radius, shadow, spacing } from '../../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    if (!email || !password) {
      setError('Renseigne ton email et ton mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxl }]}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient colors={gabonGradient} style={styles.logo}>
            <Text style={styles.logoText}>LU</Text>
          </LinearGradient>
          <Text style={styles.brand}>LinkUp</Text>
          <Text style={styles.brandSub}>GABON</Text>
          <Text style={styles.tagline}>
            Le bon talent, au bon moment, près de chez toi.
          </Text>

          <View style={styles.card}>
            <Text style={styles.kicker}>CONNEXION</Text>
            <Text style={styles.title}>Se connecter</Text>

            {error ? (
              <View style={styles.error}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="ton@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="off"
            />
            <Field
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
            />

            <Btn label="Se connecter" onPress={onSubmit} loading={loading} fullWidth icon="log-in-outline" />

            <Text style={styles.footer}>
              Pas encore de compte ?{' '}
              <Link href="/register" style={styles.link}>
                Créer un compte
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.xl, alignItems: 'center' },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  logoText: { color: colors.greenDark, fontWeight: '900', fontSize: 22 },
  brand: { color: colors.white, fontWeight: '900', fontSize: 30, marginTop: spacing.md },
  brandSub: { color: colors.green, fontWeight: '900', letterSpacing: 4, fontSize: 12 },
  tagline: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: spacing.md, maxWidth: 300 },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.xxl,
    ...shadow.card,
  },
  kicker: { color: colors.warning, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.ink, fontWeight: '900', fontSize: 22, marginBottom: spacing.lg },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: { color: colors.danger, flex: 1, fontSize: 13, fontWeight: '600' },
  footer: { textAlign: 'center', color: colors.muted, marginTop: spacing.lg, fontSize: 13 },
  link: { color: colors.green, fontWeight: '900' },
});
