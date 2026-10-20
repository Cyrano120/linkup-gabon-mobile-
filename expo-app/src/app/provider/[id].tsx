import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookingModal } from '../../components/BookingModal';
import { Avatar, Badge, Btn, Card, EmptyState, Screen, SectionTitle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatFcfa } from '../../lib/format';
import { colors, ctaGradient, radius, shadow, spacing } from '../../theme';
import type { NewRequestInput } from '../../types';

export default function ProviderDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { providers, bookProvider } = useData();
  const [bookingOpen, setBookingOpen] = useState(false);

  const provider = useMemo(
    () => providers.find((p) => String(p.id) === String(params.id)),
    [providers, params.id],
  );

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Client';

  if (!provider) {
    return (
      <Screen>
        <EmptyState title="Profil introuvable" text="Ce prestataire n’est plus disponible." />
        <View style={{ marginTop: spacing.lg }}>
          <Btn variant="ghost" label="Retour" icon="arrow-back" fullWidth onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  async function handleSubmit(input: NewRequestInput) {
    await bookProvider(provider!, input);
    toast.show(`Demande envoyée à ${provider!.name}.`);
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <Btn compact variant="ghost" icon="arrow-back" label="Retour" onPress={() => router.back()} />
        <Badge label={provider.available ? 'Disponible' : 'Occupé'} tone={provider.available ? 'success' : 'neutral'} />
      </View>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Image source={{ uri: provider.cover }} style={styles.cover} />
        <View style={styles.identity}>
          <Image source={{ uri: provider.image }} style={styles.avatar} />
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.role}>
            {provider.role} · {provider.location}
          </Text>
          <View style={styles.tags}>
            <Badge label={provider.category} tone="info" />
            <Badge label={provider.responseTime} tone="neutral" icon="time-outline" />
            <Badge label={`${provider.rating} ★`} tone="warning" />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{formatFcfa(provider.price)}</Text>
            <Text style={styles.statLabel}>prix de départ</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{provider.missions}</Text>
            <Text style={styles.statLabel}>missions</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{provider.successRate}%</Text>
            <Text style={styles.statLabel}>réussite</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: spacing.xl }} />

      <SectionTitle kicker="À propos" title={provider.headline} />
      <Card>
        <Text style={styles.bio}>{provider.bio}</Text>
      </Card>

      {provider.skills.length > 0 ? (
        <>
          <View style={{ height: spacing.lg }} />
          <SectionTitle kicker="Compétences" title="Ce qu’il sait faire." />
          <View style={styles.skills}>
            {provider.skills.map((skill) => (
              <View key={skill} style={styles.skill}>
                <Ionicons name="checkmark-circle" size={14} color={colors.green} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {provider.gallery.length > 0 ? (
        <>
          <View style={{ height: spacing.xl }} />
          <SectionTitle kicker="Réalisations" title="Quelques exemples." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
            {provider.gallery.map((url) => (
              <Image key={url} source={{ uri: url }} style={styles.galleryImage} />
            ))}
          </ScrollView>
        </>
      ) : null}

      {provider.reviews.length > 0 ? (
        <>
          <View style={{ height: spacing.xl }} />
          <SectionTitle kicker="Avis" title="Retours de clients." />
          {provider.reviews.map((review) => (
            <Card key={`${review.client}-${review.text}`} style={styles.review}>
              <View style={styles.reviewHeader}>
                <Avatar name={review.client} size={34} />
                <Text style={styles.reviewName}>{review.client}</Text>
                <Text style={styles.reviewRating}>{'★'.repeat(review.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </Card>
          ))}
        </>
      ) : null}

      <LinearGradient colors={ctaGradient} style={styles.cta}>
        <Text style={styles.ctaTitle}>Besoin de {provider.name} ?</Text>
        <Text style={styles.ctaText}>
          Envoie ta demande en quelques secondes. Tu confirmes ensuite le prix et le mode de paiement.
        </Text>
        <Btn
          variant="yellow"
          icon="send"
          label="Demander un service"
          fullWidth
          onPress={() => setBookingOpen(true)}
        />
      </LinearGradient>

      {/* Toujours monté : la feuille peut ainsi se fermer en animant. */}
      <BookingModal
        provider={provider}
        visible={bookingOpen}
        defaultClient={displayName}
        onClose={() => setBookingOpen(false)}
        onSubmit={handleSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cover: { width: '100%', height: 200 },
  identity: { padding: spacing.lg, alignItems: 'flex-start' },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    borderWidth: 4,
    borderColor: colors.white,
    marginTop: -spacing.xxl - spacing.sm,
    ...shadow.soft,
  },
  name: { color: colors.ink, fontWeight: '900', fontSize: 20, marginTop: spacing.sm },
  role: { color: colors.muted, fontSize: 13, marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statBlock: { flex: 1 },
  statValue: { color: colors.ink, fontWeight: '900', fontSize: 15 },
  statLabel: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  bio: { color: '#374151', fontSize: 14, lineHeight: 21 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skillText: { color: colors.ink, fontWeight: '700', fontSize: 13 },
  galleryRow: { gap: spacing.md, paddingRight: spacing.lg },
  galleryImage: { width: 220, height: 140, borderRadius: radius.lg },
  review: { marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewName: { color: colors.ink, fontWeight: '800', fontSize: 14, flex: 1 },
  // Ambre foncé : le jaune #FCD116 sur fond blanc ne fait que 1,47:1.
  reviewRating: { color: colors.warning, fontSize: 13 },
  reviewText: { color: '#374151', fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
  cta: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  ctaTitle: { color: colors.white, fontWeight: '900', fontSize: 20 },
  ctaText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 20, marginBottom: spacing.sm },
});
