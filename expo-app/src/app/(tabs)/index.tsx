import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Btn, Card, Kicker, SectionTitle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { howItWorksSteps, serviceHighlights, testimonials } from '../../data';
import { formatFcfa } from '../../lib/format';
import { colors, ctaGradient, radius, shadow, spacing } from '../../theme';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=85';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { providers, requests } = useData();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const featured = useMemo(() => providers.find((p) => p.available) ?? providers[0], [providers]);
  const availableCount = providers.filter((p) => p.available).length;
  const openMissions = requests.filter((r) => r.status === 'Ouverte').length;
  const name = user?.displayName || user?.email?.split('@')[0] || 'toi';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgTop }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <LinearGradient colors={ctaGradient} style={styles.logo}>
            <Text style={styles.logoText}>LU</Text>
          </LinearGradient>
          <View>
            <Text style={styles.brandName}>LinkUp</Text>
            <Text style={styles.brandSub}>GABON</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.hello} numberOfLines={1}>
            Salut, {name}
          </Text>
          <Btn
            compact
            variant="danger"
            icon={menuOpen ? 'close' : 'log-out-outline'}
            label={menuOpen ? 'Fermer' : 'Quitter'}
            onPress={() => {
              if (menuOpen) {
                setMenuOpen(false);
                return;
              }
              setMenuOpen(true);
            }}
          />
        </View>
      </View>

      {menuOpen ? (
        <Card style={styles.menu}>
          <Text style={styles.menuLabel}>Compte connecté</Text>
          <Text style={styles.menuEmail}>{user?.email}</Text>
          <View style={styles.menuActions}>
            <Btn
              compact
              variant="ghost"
              icon="person-add-outline"
              label="Devenir prestataire"
              onPress={() => {
                setMenuOpen(false);
                router.push('/become');
              }}
            />
            <Btn compact variant="danger" icon="log-out-outline" label="Se déconnecter" onPress={() => logout()} />
          </View>
        </Card>
      ) : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero} imageStyle={styles.heroImage}>
          <LinearGradient
            colors={['rgba(5,20,15,0.94)', 'rgba(7,42,53,0.62)', 'rgba(7,42,53,0.28)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroKicker}>SERVICES LOCAUX À LA DEMANDE</Text>
            <Text style={styles.heroTitle}>Le bon talent, près de chez toi.</Text>
            <Text style={styles.heroText}>
              De Nzeng-Ayong à Akanda, LinkUp connecte clients, étudiants et freelances pour des
              missions rapides payables en FCFA, Airtel Money ou Moov Money.
            </Text>
            <View style={styles.heroActions}>
              <Btn label="Trouver un prestataire" icon="search" onPress={() => router.push('/market')} />
              <Btn
                label="Publier une mission"
                variant="ghost"
                icon="add-circle-outline"
                onPress={() => router.push('/create')}
              />
            </View>
            <View style={styles.areaPills}>
              {['Libreville', 'Akanda', 'Owendo', 'Port-Gentil'].map((area) => (
                <View key={area} style={styles.areaPill}>
                  <Text style={styles.areaPillText}>{area}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{providers.length}</Text>
            <Text style={styles.statLabel}>prestataires</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{availableCount}</Text>
            <Text style={styles.statLabel}>disponibles</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{openMissions}</Text>
            <Text style={styles.statLabel}>missions ouvertes</Text>
          </Card>
        </View>

        {/* Ancré au Gabon */}
        <LinearGradient colors={[colors.green, colors.blue]} style={styles.banner}>
          <Kicker>ANCRÉE AU GABON</Kicker>
          <Text style={styles.bannerTitle}>Pensée pour les vrais besoins du quotidien.</Text>
          <Text style={styles.bannerText}>
            Quartiers connus, budgets en FCFA, contact rapide, paiement mobile et missions courtes.
          </Text>
        </LinearGradient>

        {/* Comment ça marche */}
        <SectionTitle kicker="Comment ça marche" title="Une logique simple, proche du terrain." />
        {howItWorksSteps.map((step, index) => (
          <Card key={step.title} style={styles.stepCard}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          </Card>
        ))}

        {/* Prestataire à la une */}
        {featured ? (
          <>
            <SectionTitle kicker="Disponible maintenant" title="Un talent à la une." />
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <Image source={{ uri: featured.image }} style={styles.featuredImage} />
              <View style={styles.featuredBody}>
                <Badge label="Disponible" tone="success" />
                <Text style={styles.featuredName}>{featured.name}</Text>
                <Text style={styles.featuredRole}>
                  {featured.role} · {featured.location}
                </Text>
                <Text style={styles.featuredHeadline}>{featured.headline}</Text>
                <View style={styles.featuredFooter}>
                  <Text style={styles.featuredPrice}>{formatFcfa(featured.price)}</Text>
                  <Btn
                    compact
                    label="Voir le profil"
                    icon="arrow-forward"
                    onPress={() => router.push(`/provider/${featured.id}`)}
                  />
                </View>
              </View>
            </Card>
          </>
        ) : null}

        {/* Services */}
        <SectionTitle kicker="Services populaires" title="Ce que tu peux demander." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlights}>
          {serviceHighlights.map((item) => (
            <View key={item.title} style={styles.highlightCard}>
              <Image source={{ uri: item.image }} style={styles.highlightImage} />
              <View style={styles.highlightBody}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Témoignages */}
        <SectionTitle kicker="Ils pourraient l'utiliser" title="Des cas proches de la vraie vie." />
        {testimonials.map((item) => (
          <Card key={item.name} style={styles.testimonial}>
            <Ionicons name="chatbox-ellipses-outline" size={18} color={colors.green} />
            <Text style={styles.testimonialText}>« {item.text} »</Text>
            <Text style={styles.testimonialName}>{item.name}</Text>
          </Card>
        ))}

        {/* CTA */}
        <LinearGradient colors={['#03392A', '#0F7A45']} style={styles.cta}>
          <Avatar name={name} size={48} />
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Prêt à publier ta première mission ?</Text>
            <Text style={styles.ctaText}>Décris ton besoin, choisis un budget et laisse venir les profils.</Text>
          </View>
          <Btn variant="yellow" compact icon="add" label="Publier" onPress={() => router.push('/create')} />
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.md,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: colors.greenDark, fontWeight: '900', fontSize: 15 },
  brandName: { color: colors.white, fontWeight: '900', fontSize: 15 },
  brandSub: { color: colors.green, fontWeight: '900', letterSpacing: 2, fontSize: 9 },
  headerRight: { alignItems: 'flex-end', gap: spacing.xs },
  hello: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 12, maxWidth: 140 },
  menu: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  menuLabel: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  menuEmail: { color: colors.ink, fontWeight: '800', marginBottom: spacing.md },
  menuActions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },

  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  hero: { borderRadius: radius.xl, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { borderRadius: radius.xl },
  heroOverlay: { padding: spacing.xl, minHeight: 380, justifyContent: 'flex-end' },
  heroKicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: colors.white, fontWeight: '900', fontSize: 32, lineHeight: 36, marginTop: spacing.sm },
  heroText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 21, marginTop: spacing.md },
  heroActions: { gap: spacing.sm, marginTop: spacing.xl },
  areaPills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  areaPill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  areaPillText: { color: colors.white, fontWeight: '700', fontSize: 12 },

  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statValue: { color: colors.ink, fontWeight: '900', fontSize: 22 },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 2, textAlign: 'center' },

  banner: { borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xl, ...shadow.card },
  bannerTitle: { color: colors.white, fontWeight: '900', fontSize: 24, lineHeight: 30, marginTop: spacing.xs },
  bannerText: { color: 'rgba(255,255,255,0.9)', marginTop: spacing.sm, fontSize: 13, lineHeight: 20 },

  stepCard: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: colors.white, fontWeight: '900' },
  stepTitle: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  stepText: { color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 19 },

  featuredImage: { width: '100%', height: 180 },
  featuredBody: { padding: spacing.lg, gap: spacing.xs },
  featuredName: { color: colors.ink, fontWeight: '900', fontSize: 18, marginTop: spacing.sm },
  featuredRole: { color: colors.muted, fontSize: 13 },
  featuredHeadline: { color: '#374151', fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  featuredPrice: { color: colors.green, fontWeight: '900', fontSize: 16 },

  highlights: { gap: spacing.md, paddingBottom: spacing.lg, paddingRight: spacing.lg },
  highlightCard: {
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.soft,
  },
  highlightImage: { width: '100%', height: 110 },
  highlightBody: { padding: spacing.md },
  highlightTitle: { color: colors.ink, fontWeight: '800', fontSize: 14 },
  highlightText: { color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 17 },

  testimonial: { marginBottom: spacing.md, gap: spacing.sm },
  testimonialText: { color: '#374151', fontSize: 13, lineHeight: 20 },
  testimonialName: { color: colors.green, fontWeight: '900', fontSize: 13 },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  ctaTitle: { color: colors.white, fontWeight: '900', fontSize: 15 },
  ctaText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
});
