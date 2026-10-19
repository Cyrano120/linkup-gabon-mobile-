import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Btn, Card, Chip, Field, Kicker, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { categories, localAreas, urgencies } from '../../data';
import { formatFcfa } from '../../lib/format';
import { colors, radius, spacing } from '../../theme';
import type { Category, Urgency } from '../../types';

export default function CreateRequestScreen() {
  const { user } = useAuth();
  const { addRequest } = useData();
  const toast = useToast();
  const router = useRouter();

  const defaultClient = user?.displayName || user?.email?.split('@')[0] || 'Client';

  const [client, setClient] = useState(defaultClient);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Informatique');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState(localAreas[0]);
  const [urgency, setUrgency] = useState<Urgency>('Demain');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    if (!client || !title || !description || !budget) {
      setError('Complète le titre, la description et le budget.');
      return;
    }
    setLoading(true);
    try {
      await addRequest({
        client,
        title,
        category,
        budget: Number(budget) || 0,
        location,
        urgency,
        description,
      });
      toast.show('Mission publiée. Elle est visible dans Missions.');
      setTitle('');
      setDescription('');
      setBudget('');
      router.push('/missions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publication impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>NOUVELLE MISSION</Text>
        <Text style={styles.title}>Décris ton besoin</Text>
        <Text style={styles.subtitle}>
          Sois précis : les prestataires du quartier répondent plus vite quand le besoin est clair.
        </Text>
      </View>

      <Card>
        {error ? (
          <View style={styles.error}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Field label="Ton nom" value={client} onChangeText={setClient} placeholder="Ex : Ariane" />
        <Field
          label="Titre de la mission"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex : Installer Windows et Office"
        />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.chips}>
          {categories.map((item) => (
            <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>

        <View style={{ height: spacing.lg }} />

        <Field
          label="Budget (FCFA)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="number-pad"
          placeholder="Ex : 10000"
        />
        <Text style={styles.hint}>
          Budget indicatif : {budget ? formatFcfa(Number(budget) || 0) : 'à définir'}
        </Text>

        <Text style={styles.label}>Quartier</Text>
        <View style={styles.chips}>
          {localAreas.map((item) => (
            <Chip key={item} label={item} active={location === item} onPress={() => setLocation(item)} />
          ))}
        </View>

        <View style={{ height: spacing.lg }} />

        <Text style={styles.label}>Délai</Text>
        <View style={styles.chips}>
          {urgencies.map((item) => (
            <Chip key={item} label={item} active={urgency === item} onPress={() => setUrgency(item)} />
          ))}
        </View>

        <View style={{ height: spacing.lg }} />

        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Contexte, contraintes, résultat attendu…"
          multiline
          numberOfLines={5}
          style={styles.textarea}
        />

        <Btn label="Publier la mission" icon="paper-plane" fullWidth loading={loading} onPress={submit} />
      </Card>

      <Card style={styles.tipsCard}>
        <Kicker>Astuce</Kicker>
        <Text style={styles.tip}>
          Indique un délai réaliste et un budget clair : les profils les plus fiables répondent en
          priorité aux demandes bien décrites.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.xl },
  kicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.white, fontWeight: '900', fontSize: 24, marginTop: 2 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },
  label: { color: '#D1D5DB', fontWeight: '700', fontSize: 12, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hint: { color: colors.muted, fontSize: 12, marginTop: -spacing.sm, marginBottom: spacing.md },
  textarea: { minHeight: 110, textAlignVertical: 'top', paddingTop: spacing.md },
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
  tipsCard: { marginTop: spacing.lg },
  tip: { color: '#374151', fontSize: 13, lineHeight: 20 },
});
