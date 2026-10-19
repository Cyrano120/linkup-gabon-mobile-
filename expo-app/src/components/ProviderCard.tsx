import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatFcfa } from '../lib/format';
import { colors, radius, shadow, spacing } from '../theme';
import type { Provider } from '../types';
import { Badge, Btn } from './ui';

interface Props {
  provider: Provider;
  onOpen: (provider: Provider) => void;
  onBook: (provider: Provider) => void;
}

export function ProviderCard({ provider, onOpen, onBook }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: provider.cover }} style={styles.cover} />
        <View style={styles.statusWrap}>
          <Badge
            label={provider.available ? 'Disponible' : 'Occupé'}
            tone={provider.available ? 'success' : 'neutral'}
          />
        </View>
      </View>

      <View style={styles.identityRow}>
        <Image source={{ uri: provider.image }} style={styles.avatar} />
        <View style={{ flex: 1, paddingTop: spacing.lg }}>
          <Text style={styles.name} numberOfLines={1}>
            {provider.name}
          </Text>
          <Text style={styles.role} numberOfLines={1}>
            {provider.role}
          </Text>
        </View>
      </View>

      <Text style={styles.headline} numberOfLines={2}>
        {provider.headline}
      </Text>

      <View style={styles.tags}>
        <Badge label={provider.category} tone="info" />
        <Badge label={provider.location} tone="neutral" icon="location-outline" />
        <Badge label={provider.responseTime} tone="neutral" icon="time-outline" />
      </View>

      <View style={styles.skills}>
        {provider.skills.slice(0, 4).map((skill) => (
          <View key={skill} style={styles.skill}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.stats}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{formatFcfa(provider.price)}</Text>
          <Text style={styles.statLabel}>prix de départ</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>
            <Ionicons name="star" size={13} color={colors.yellow} /> {provider.rating}
          </Text>
          <Text style={styles.statLabel}>{provider.missions} missions</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{provider.successRate}%</Text>
          <Text style={styles.statLabel}>réussite</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onOpen(provider)}
          style={({ pressed }) => [styles.profileBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="person-outline" size={16} color={colors.green} />
          <Text style={styles.profileLabel}>Profil</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Btn label="Demander" icon="send" onPress={() => onBook(provider)} fullWidth compact />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  coverWrap: { height: 150 },
  cover: { width: '100%', height: '100%' },
  statusWrap: { position: 'absolute', top: spacing.md, right: spacing.md },
  identityRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xxl,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 4,
    borderColor: colors.white,
  },
  name: { color: colors.ink, fontWeight: '900', fontSize: 16 },
  role: { color: colors.muted, fontSize: 13 },
  headline: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  skill: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  skillText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statBlock: { flex: 1 },
  statValue: { color: colors.ink, fontWeight: '800', fontSize: 13 },
  statLabel: { color: '#9CA3AF', fontSize: 10, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  profileBtn: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BDEBD2',
    borderRadius: radius.sm,
  },
  profileLabel: { color: colors.green, fontWeight: '800', fontSize: 13 },
});
