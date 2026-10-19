import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { urgencies } from '../data';
import { colors, radius, shadow, spacing } from '../theme';
import type { NewRequestInput, Provider, Urgency } from '../types';
import { Btn, Chip, Field } from './ui';

interface Props {
  provider: Provider | null;
  visible: boolean;
  defaultClient: string;
  onClose: () => void;
  onSubmit: (input: NewRequestInput) => Promise<void>;
}

export function BookingModal({ provider, visible, defaultClient, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [client, setClient] = useState(defaultClient);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<Urgency>("Aujourd'hui");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return;
    setClient(defaultClient);
    setTitle(`Demande pour ${provider.role}`);
    setDescription('');
    setBudget(String(provider.price));
    setLocation(provider.location);
    setUrgency("Aujourd'hui");
    setError('');
  }, [provider, defaultClient]);

  if (!provider) return null;

  async function submit() {
    setError('');
    if (!client || !title || !description || !budget) {
      setError('Complète les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        client,
        title,
        category: provider!.category,
        budget: Number(budget) || 0,
        location,
        urgency,
        description,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.kicker}>DEMANDE DIRECTE</Text>
                  <Text style={styles.title}>Contacter {provider.name}</Text>
                </View>
                <Btn compact variant="danger" label="Fermer" onPress={onClose} />
              </View>
              <Text style={styles.subtitle}>{provider.headline}</Text>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Field label="Ton nom" value={client} onChangeText={setClient} />
              <Field label="Titre" value={title} onChangeText={setTitle} />
              <Field
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.md }}
                placeholder="Explique ton besoin, le contexte et le résultat attendu."
              />
              <Field
                label="Budget (FCFA)"
                value={budget}
                onChangeText={setBudget}
                keyboardType="number-pad"
              />
              <Field label="Lieu" value={location} onChangeText={setLocation} />

              <Text style={styles.chipLabel}>Délai</Text>
              <View style={styles.chips}>
                {urgencies.map((item) => (
                  <Chip key={item} label={item} active={urgency === item} onPress={() => setUrgency(item)} />
                ))}
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <Btn
                  label="Envoyer la demande"
                  icon="send"
                  fullWidth
                  loading={loading}
                  onPress={submit}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(4,12,9,0.72)', justifyContent: 'flex-end' },
  sheetWrap: { maxHeight: '92%' },
  sheet: {
    backgroundColor: '#0B1A14',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  kicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.white, fontWeight: '900', fontSize: 20, marginTop: 2 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: spacing.sm, marginBottom: spacing.lg },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontWeight: '700',
    fontSize: 13,
  },
  chipLabel: { color: '#D1D5DB', fontWeight: '700', fontSize: 12, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
