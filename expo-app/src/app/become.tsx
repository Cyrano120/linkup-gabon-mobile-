import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Btn, Card, Chip, Field, Kicker, Screen, SectionTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { categories, localAreas } from '../data';
import { colors, ctaGradient, radius, spacing } from '../theme';
import type { Category } from '../types';

export default function BecomeProviderScreen() {
  const { user } = useAuth();
  const { addProvider } = useData();
  const toast = useToast();
  const router = useRouter();

  const defaultName = user?.displayName || user?.email?.split('@')[0] || '';

  const [name, setName] = useState(defaultName);
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<Category>('Informatique');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(localAreas[0]);
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    if (!name || !role || !headline || !price) {
      setError('Complète le nom, le métier, la présentation et le tarif.');
      return;
    }
    setLoading(true);
    try {
      await addProvider({
        name,
        role,
        category,
        price: Number(price) || 0,
        location,
        headline,
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      toast.show('Profil publié. Tu apparais dans la marketplace.');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publication impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <LinearGradient colors={ctaGradient} style={styles.hero}>
        <Kicker>VITRINE GRATUITE</Kicker>
        <Text style={styles.heroTitle}>Devenir prestataire</Text>
        <Text style={styles.heroText}>
          Crée un profil clair en une minute : compétence, quartier et tarif de départ en FCFA.
        </Text>
      </LinearGradient>

      <Card>
        {error ? (
          <View style={styles.error}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Field label="Nom affiché" value={name} onChangeText={setName} placeholder="Ex : Nora Mba" />
        <Field
          label="Métier / spécialité"
          value={role}
          onChangeText={setRole}
          placeholder="Ex : Développeuse front-end"
        />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.chips}>
          {categories.map((item) => (
            <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>

        <View style={{ height: spacing.lg }} />

        <Field
          label="Tarif de départ (FCFA)"
          value={price}
          onChangeText={setPrice}
          keyboardType="number-pad"
          placeholder="Ex : 8000"
        />

        <Text style={styles.label}>Quartier</Text>
        <View style={styles.chips}>
          {localAreas.map((item) => (
            <Chip key={item} label={item} active={location === item} onPress={() => setLocation(item)} />
          ))}
        </View>

        <View style={{ height: spacing.lg }} />

        <Field
          label="Présentation courte"
          value={headline}
          onChangeText={setHeadline}
          placeholder="Ex : Sites vitrines et landing pages pour petits commerces."
          multiline
          numberOfLines={3}
          style={styles.textarea}
        />
        <Field
          label="Compétences (séparées par des virgules)"
          value={skills}
          onChangeText={setSkills}
          placeholder="React, Landing page, Maquette"
        />

        <Btn label="Publier mon profil" icon="rocket" fullWidth loading={loading} onPress={submit} />
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionTitle kicker="Bon à savoir" title="Ce qui rassure les clients." />
      <Card style={styles.tipCard}>
        <Ionicons name="sparkles-outline" size={18} color={colors.green} />
        <Text style={styles.tip}>
          Un profil qui précise le quartier, le délai de réponse et un tarif de départ reçoit
          beaucoup plus de demandes.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.lg, gap: spacing.xs },
  heroTitle: { color: colors.white, fontWeight: '900', fontSize: 24 },
  heroText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 19 },
  label: { color: '#D1D5DB', fontWeight: '700', fontSize: 12, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  textarea: { minHeight: 90, textAlignVertical: 'top', paddingTop: spacing.md },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: { color: colors.danger, flex: 1, fontSize: 13, fontWeight: '600' },
  tipCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  tip: { color: '#374151', fontSize: 13, lineHeight: 20, flex: 1 },
});
