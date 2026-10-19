import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { statuses } from '../data';
import { formatFcfa } from '../lib/format';
import { colors, radius, shadow, spacing } from '../theme';
import type { Provider, RequestStatus, ServiceRequest } from '../types';
import { Badge, Btn, Chip } from './ui';

interface Props {
  request: ServiceRequest;
  providers: Provider[];
  onStatusChange: (request: ServiceRequest, status: RequestStatus) => void;
  onAccept: (request: ServiceRequest, providerName: string) => void;
  onApply: (request: ServiceRequest, providerName: string) => void;
}

function statusTone(status: RequestStatus) {
  switch (status) {
    case 'Ouverte':
      return 'warning' as const;
    case 'En discussion':
      return 'info' as const;
    case 'Confirmée':
      return 'success' as const;
    default:
      return 'neutral' as const;
  }
}

export function RequestCard({ request, providers, onStatusChange, onAccept, onApply }: Props) {
  const candidates = request.candidates ?? [];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Badge label={request.category} tone="info" />
        <Badge label={request.status} tone={statusTone(request.status)} />
      </View>

      <Text style={styles.title}>{request.title}</Text>
      <Text style={styles.description}>{request.description || 'Aucune description ajoutée.'}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Client : {request.client}</Text>
        <Text style={styles.meta}>Budget : {formatFcfa(request.budget)}</Text>
        <Text style={styles.meta}>Lieu : {request.location}</Text>
        <Text style={styles.meta}>Délai : {request.urgency}</Text>
        <Text style={styles.meta}>Prestataire : {request.provider || 'En attente'}</Text>
      </View>

      <Text style={styles.blockLabel}>Statut</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {statuses.map((status) => (
          <Chip
            key={status}
            label={status}
            active={request.status === status}
            onPress={() => onStatusChange(request, status)}
          />
        ))}
      </ScrollView>

      <Text style={styles.blockLabel}>Candidatures</Text>
      {candidates.length === 0 ? (
        <Text style={styles.empty}>Aucune candidature pour le moment.</Text>
      ) : (
        <View style={styles.candidates}>
          {candidates.map((name) => (
            <Btn
              key={name}
              compact
              variant="success"
              icon="checkmark-circle-outline"
              label={`Accepter ${name}`}
              onPress={() => onAccept(request, name)}
            />
          ))}
        </View>
      )}

      <Text style={styles.blockLabel}>Postuler comme…</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {providers.slice(0, 10).map((provider) => (
          <Btn
            key={provider.id}
            compact
            variant="ghost"
            icon="hand-left-outline"
            label={provider.name}
            onPress={() => onApply(request, provider.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  header: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  title: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  description: { color: colors.muted, fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  meta: {
    backgroundColor: '#F9FAFB',
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  blockLabel: { color: '#374151', fontWeight: '800', fontSize: 13, marginTop: spacing.lg, marginBottom: spacing.sm },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg },
  candidates: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  empty: { color: '#9CA3AF', fontSize: 13 },
});
