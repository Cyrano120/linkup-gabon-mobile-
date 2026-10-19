import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../utils/format.dart';
import '../widgets/ui.dart';
import 'become_provider_screen.dart';
import 'provider_detail_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _heroImage =
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=85';

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final data = context.watch<DataController>();
    final featured = data.featured;
    final available = data.providers.where((p) => p.available).length;
    final openMissions = data.requests.where((r) => r.status == 'Ouverte').length;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.lg,
        AppSpacing.lg,
        AppSpacing.xxl,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // En-tête
          Row(
            children: [
              const AppLogo(size: 40),
              const SizedBox(width: AppSpacing.sm),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'LinkUp',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 15),
                  ),
                  Text(
                    'GABON',
                    style: TextStyle(
                      color: GabonColors.green,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      fontSize: 9,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Flexible(
                child: Text(
                  'Salut, ${auth.displayName}',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              AppButton(
                label: 'Quitter',
                variant: AppButtonVariant.danger,
                icon: Icons.logout,
                compact: true,
                onPressed: () => context.read<AuthController>().logout(),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Hero
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadii.xl),
            child: SizedBox(
              height: 380,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    _heroImage,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(color: GabonColors.greenDark),
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xF005140F),
                          Color(0x9E072A35),
                          Color(0x47072A35),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'SERVICES LOCAUX À LA DEMANDE',
                          style: TextStyle(
                            color: GabonColors.yellow,
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.4,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        const Text(
                          'Le bon talent, près de chez toi.',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 30,
                            height: 1.15,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          'De Nzeng-Ayong à Akanda, LinkUp connecte clients, étudiants et freelances pour des missions rapides payables en FCFA, Airtel Money ou Moov Money.',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontSize: 13,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        Wrap(
                          spacing: AppSpacing.sm,
                          runSpacing: AppSpacing.sm,
                          children: [
                            'Libreville',
                            'Akanda',
                            'Owendo',
                            'Port-Gentil',
                          ]
                              .map(
                                (area) => Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: AppSpacing.md,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.14),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(
                                      color: Colors.white.withValues(alpha: 0.35),
                                    ),
                                  ),
                                  child: Text(
                                    area,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Statistiques
          Row(
            children: [
              _StatCard(value: '${data.providers.length}', label: 'prestataires'),
              const SizedBox(width: AppSpacing.md),
              _StatCard(value: '$available', label: 'disponibles'),
              const SizedBox(width: AppSpacing.md),
              _StatCard(value: '$openMissions', label: 'missions ouvertes'),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Bandeau ancrage local
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.xl),
            decoration: BoxDecoration(
              gradient: ctaGradient,
              borderRadius: BorderRadius.circular(AppRadii.xl),
              boxShadow: const [
                BoxShadow(color: Color(0x2E000000), blurRadius: 18, offset: Offset(0, 10)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'ANCRÉE AU GABON',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.4,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                const Text(
                  'Pensée pour les vrais besoins du quotidien.',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 24,
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Quartiers connus, budgets en FCFA, contact rapide, paiement mobile et missions courtes.',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Comment ça marche
          const SectionHeader(kicker: 'Comment ça marche', title: 'Une logique simple, proche du terrain.'),
          ...howItWorksSteps.asMap().entries.map(
                (entry) => GlassCard(
                  margin: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        height: 40,
                        width: 40,
                        decoration: const BoxDecoration(
                          color: GabonColors.greenDark,
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${entry.key + 1}'.padLeft(2, '0'),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              entry.value.title,
                              style: const TextStyle(
                                color: GabonColors.ink,
                                fontWeight: FontWeight.w800,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: AppSpacing.xs),
                            Text(
                              entry.value.text,
                              style: const TextStyle(
                                color: GabonColors.muted,
                                fontSize: 13,
                                height: 1.45,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          const SizedBox(height: AppSpacing.lg),

          // À la une
          if (featured != null) ...[
            const SectionHeader(kicker: 'Disponible maintenant', title: 'Un talent à la une.'),
            GlassCard(
              padding: EdgeInsets.zero,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
                    child: SizedBox(
                      height: 180,
                      width: double.infinity,
                      child: Image.network(
                        featured.image,
                        fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => Container(color: GabonColors.greenDark),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AppBadge(
                          label: featured.available ? 'Disponible' : 'Occupé',
                          tone: featured.available ? BadgeTone.success : BadgeTone.neutral,
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          featured.name,
                          style: const TextStyle(
                            color: GabonColors.ink,
                            fontWeight: FontWeight.w900,
                            fontSize: 18,
                          ),
                        ),
                        Text(
                          '${featured.role} · ${featured.location}',
                          style: const TextStyle(color: GabonColors.muted, fontSize: 13),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          featured.headline,
                          style: const TextStyle(
                            color: GabonColors.body,
                            fontSize: 13,
                            height: 1.45,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Row(
                          children: [
                            Text(
                              formatFcfa(featured.price),
                              style: const TextStyle(
                                color: GabonColors.green,
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                              ),
                            ),
                            const Spacer(),
                            AppButton(
                              label: 'Voir le profil',
                              icon: Icons.arrow_forward,
                              compact: true,
                              onPressed: () => Navigator.of(context).push(
                                MaterialPageRoute<void>(
                                  builder: (_) => ProviderDetailScreen(providerId: featured.id),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
          ],

          // Services populaires
          const SectionHeader(kicker: 'Services populaires', title: 'Ce que tu peux demander.'),
          SizedBox(
            height: 200,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: serviceHighlights.length,
              separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
              itemBuilder: (_, index) {
                final item = serviceHighlights[index];
                return SizedBox(
                  width: 240,
                  child: GlassCard(
                    padding: EdgeInsets.zero,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
                          child: SizedBox(
                            height: 110,
                            width: double.infinity,
                            child: Image.network(
                              item.image,
                              fit: BoxFit.cover,
                              errorBuilder: (_, _, _) => Container(color: GabonColors.greenDark),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: const TextStyle(
                                  color: GabonColors.ink,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              Text(
                                item.text,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: GabonColors.muted,
                                  fontSize: 12,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          // Témoignages
          const SectionHeader(kicker: 'Ils pourraient l’utiliser', title: 'Des cas proches de la vraie vie.'),
          ...testimonials.map(
            (item) => GlassCard(
              margin: const EdgeInsets.only(bottom: AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.chat_outlined, color: GabonColors.green, size: 18),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    '« ${item.text} »',
                    style: const TextStyle(
                      color: GabonColors.body,
                      fontSize: 13,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    item.name,
                    style: const TextStyle(
                      color: GabonColors.green,
                      fontWeight: FontWeight.w900,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // CTA
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [GabonColors.greenDark, GabonColors.greenDeep],
              ),
              borderRadius: BorderRadius.circular(AppRadii.xl),
            ),
            child: Row(
              children: [
                AppAvatar(name: auth.displayName, size: 48),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Prêt à devenir prestataire ?',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        'Crée ta vitrine et reçois des demandes du quartier.',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.85),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                AppButton(
                  label: 'Créer',
                  variant: AppButtonVariant.yellow,
                  icon: Icons.add,
                  compact: true,
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(builder: (_) => const BecomeProviderScreen()),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GlassCard(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.lg,
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                color: GabonColors.ink,
                fontWeight: FontWeight.w900,
                fontSize: 22,
              ),
            ),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(color: GabonColors.muted, fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }
}
