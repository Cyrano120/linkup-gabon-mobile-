import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RequestCard } from '../../components/RequestCard';
import { Badge, Btn, Chip, EmptyState, Screen } from '../../components/ui';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { statuses } from '../../data';
import { colors, spacing } from '../../theme';
import type { RequestStatus } from '../../types';

export default function MissionsScreen() {
  const { requests, providers, updateRequestStatus, applyToMission, acceptCandidate } = useData();
  const toast = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<RequestStatus | 'Toutes'>('Toutes');

  const filtered = useMemo(
    () => (filter === 'Toutes' ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { Toutes: requests.length };
    for (const status of statuses) {
      map[status] = requests.filter((r) => r.status === status).length;
    }
    return map;
  }, [requests]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>MISSIONS</Text>
          <Text style={styles.title}>Suivi des demandes</Text>
          <Text style={styles.subtitle}>
            Change le statut, accepte un candidat et garde une trace claire de chaque mission.
          </Text>
        </View>
        <Btn compact icon="add" label="Publier" onPress={() => router.push('/create')} />
      </View>

      <View style={styles.stats}>
        <Badge label={`${counts['Ouverte'] ?? 0} ouvertes`} tone="warning" icon="radio-button-on" />
        <Badge label={`${counts['En discussion'] ?? 0} en discussion`} tone="info" icon="chatbubble-ellipses" />
        <Badge label={`${counts['Confirmée'] ?? 0} confirmées`} tone="success" icon="checkmark-circle" />
        <Badge label={`${counts['Terminée'] ?? 0} terminées`} tone="neutral" icon="flag" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip label="Toutes" active={filter === 'Toutes'} onPress={() => setFilter('Toutes')} />
        {statuses.map((status) => (
          <Chip key={status} label={status} active={filter === status} onPress={() => setFilter(status)} />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune mission ici"
          text="Publie une mission ou change de filtre pour voir les autres demandes."
        />
      ) : (
        filtered.map((request) => (
          <RequestCard
            key={request._firestoreId ?? request.id}
            request={request}
            providers={providers}
            onStatusChange={(r, status) => {
              updateRequestStatus(r._firestoreId, status)
                .then(() => toast.show(`Statut mis à jour : ${status}.`))
                .catch(() => toast.show('Mise à jour impossible.'));
            }}
            onAccept={(r, name) => {
              acceptCandidate(r, name)
                .then(() => toast.show(`${name} retenu pour la mission.`))
                .catch(() => toast.show('Impossible de retenir ce candidat.'));
            }}
            onApply={(r, name) => {
              applyToMission(r, name)
                .then(() => toast.show(`${name} a postulé.`))
                .catch(() => toast.show('Candidature impossible.'));
            }}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  kicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.white, fontWeight: '900', fontSize: 24, marginTop: 2 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg, paddingBottom: spacing.lg },
});
