import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookingModal } from '../../components/BookingModal';
import { ProviderCard } from '../../components/ProviderCard';
import { Badge, Btn, Chip, EmptyState, Screen, SectionTitle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { categories, localAreas } from '../../data';
import { colors, radius, shadow, spacing } from '../../theme';
import type { Category, NewRequestInput, Provider } from '../../types';

export default function MarketScreen() {
  const { user } = useAuth();
  const { providers, bookProvider, resetDemoData } = useData();
  const toast = useToast();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'Toutes'>('Toutes');
  const [area, setArea] = useState<string | 'Tous'>('Tous');
  const [maxBudget, setMaxBudget] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [booking, setBooking] = useState<Provider | null>(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Client';

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const budget = Number(maxBudget.replace(/\D/g, '')) || 0;
    return providers.filter((provider) => {
      const matchesSearch =
        !needle ||
        [provider.name, provider.role, provider.headline, ...provider.skills]
          .join(' ')
          .toLowerCase()
          .includes(needle);
      const matchesCategory = category === 'Toutes' || provider.category === category;
      const matchesArea = area === 'Tous' || provider.location === area;
      const matchesBudget = !budget || provider.price <= budget;
      const matchesAvailable = !onlyAvailable || provider.available;
      return matchesSearch && matchesCategory && matchesArea && matchesBudget && matchesAvailable;
    });
  }, [providers, search, category, area, maxBudget, onlyAvailable]);

  async function handleSubmitBooking(input: NewRequestInput) {
    if (!booking) return;
    await bookProvider(booking, input);
    toast.show(`Demande envoyée à ${booking.name}.`);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>MARKETPLACE</Text>
          <Text style={styles.title}>Trouve le bon profil</Text>
          <Text style={styles.subtitle}>
            Filtre par compétence, quartier et budget en FCFA, puis contacte directement.
          </Text>
        </View>
        <Btn compact variant="ghost" icon="person-add-outline" label="Prestataire" onPress={() => router.push('/become')} />
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Compétence, nom, besoin…"
          placeholderTextColor="#9AA3AF"
          style={styles.searchInput}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {/* Catégories */}
      <Text style={styles.filterLabel}>Catégorie</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip label="Toutes" active={category === 'Toutes'} onPress={() => setCategory('Toutes')} />
        {categories.map((item) => (
          <Chip key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
        ))}
      </ScrollView>

      {/* Quartiers */}
      <Text style={styles.filterLabel}>Quartier</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip label="Tous" active={area === 'Tous'} onPress={() => setArea('Tous')} />
        {localAreas.map((item) => (
          <Chip key={item} label={item} active={area === item} onPress={() => setArea(item)} />
        ))}
      </ScrollView>

      {/* Budget + dispo */}
      <View style={styles.row}>
        <View style={styles.budgetBox}>
          <Ionicons name="pricetag-outline" size={16} color={colors.muted} />
          <TextInput
            value={maxBudget}
            onChangeText={setMaxBudget}
            keyboardType="number-pad"
            placeholder="Budget max (FCFA)"
            placeholderTextColor="#9AA3AF"
            style={styles.searchInput}
          />
        </View>
        <Chip
          label={onlyAvailable ? 'Disponibles ✓' : 'Disponibles'}
          active={onlyAvailable}
          onPress={() => setOnlyAvailable((v) => !v)}
        />
      </View>

      <View style={styles.resultRow}>
        <Badge
          label={`${filtered.length} prestataire${filtered.length > 1 ? 's' : ''}`}
          tone="info"
          icon="people-outline"
        />
        <Btn
          compact
          variant="ghost"
          icon="refresh"
          label="Réinitialiser les données"
          onPress={() => {
            resetDemoData()
              .then(() => toast.show('Données de démo réinitialisées.'))
              .catch(() => toast.show('Réinitialisation impossible.'));
          }}
        />
      </View>

      <SectionTitle kicker="Résultats" title="Profils correspondants." />

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun profil trouvé"
          text="Essaie un autre quartier, une autre catégorie ou retire le filtre de budget."
        />
      ) : (
        filtered.map((provider) => (
          <ProviderCard
            key={provider._firestoreId ?? provider.id}
            provider={provider}
            onOpen={(p) => router.push(`/provider/${p.id}`)}
            onBook={(p) => setBooking(p)}
          />
        ))
      )}

      <BookingModal
        provider={booking}
        visible={Boolean(booking)}
        defaultClient={displayName}
        onClose={() => setBooking(null)}
        onSubmit={handleSubmitBooking}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  kicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.white, fontWeight: '900', fontSize: 24, marginTop: 2 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    marginBottom: spacing.lg,
    ...shadow.soft,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15, paddingVertical: spacing.sm },

  filterLabel: { color: 'rgba(255,255,255,0.75)', fontWeight: '800', fontSize: 12, marginBottom: spacing.sm },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg, paddingBottom: spacing.md },

  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  budgetBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
