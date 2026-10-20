import 'package:flutter/material.dart';
import 'package:provider/provider.dart' hide Provider;

import '../core/theme.dart';
import '../models/provider.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../utils/format.dart';
import '../widgets/booking_sheet.dart';
import '../widgets/ui.dart';

class ProviderDetailScreen extends StatelessWidget {
  const ProviderDetailScreen({super.key, required this.providerId});

  final int providerId;

  @override
  Widget build(BuildContext context) {
    final data = context.watch<DataController>();
    Provider? provider;
    for (final item in data.providers) {
      if (item.id == providerId) provider = item;
    }

    return Scaffold(
      body: GabonBackground(
        child: provider == null
            ? _NotFound(onBack: () => Navigator.of(context).pop())
            : _Detail(provider: provider),
      ),
    );
  }
}

class _NotFound extends StatelessWidget {
  const _NotFound({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        children: [
          const EmptyStateBox(
            title: 'Profil introuvable',
            text: 'Ce prestataire n’est plus disponible.',
          ),
          const SizedBox(height: AppSpacing.lg),
          AppButton(
            label: 'Retour',
            variant: AppButtonVariant.ghost,
            icon: Icons.arrow_back,
            fullWidth: true,
            onPressed: onBack,
          ),
        ],
      ),
    );
  }
}

class _Detail extends StatelessWidget {
  const _Detail({required this.provider});

  final Provider provider;

  Future<void> _book(BuildContext context) async {
    final data = context.read<DataController>();
    final client = context.read<AuthController>().displayName;
    await showBookingSheet(
      context,
      provider: provider,
      defaultClient: client,
      onSubmit: (input) async {
        await data.bookProvider(
          provider: provider,
          client: input.client,
          title: input.title,
          budget: input.budget,
          location: input.location,
          urgency: input.urgency,
          description: input.description,
        );
      },
    );
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Demande envoyée à ${provider.name}.')),
    );
  }

  @override
  Widget build(BuildContext context) {
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
          Row(
            children: [
              AppButton(
                label: 'Retour',
                variant: AppButtonVariant.ghost,
                icon: Icons.arrow_back,
                compact: true,
                onPressed: () => Navigator.of(context).pop(),
              ),
              const Spacer(),
              AppBadge(
                label: provider.available ? 'Disponible' : 'Occupé',
                tone: provider.available ? BadgeTone.success : BadgeTone.neutral,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          GlassCard(
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
                  child: SizedBox(
                    height: 200,
                    width: double.infinity,
                    child: Image.network(
                      provider.cover,
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
                      Transform.translate(
                        offset: const Offset(0, -AppSpacing.xxl),
                        child: Container(
                          height: 64,
                          width: 64,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(AppRadii.lg),
                            border: Border.all(color: Colors.white, width: 4),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Image.network(
                            provider.image,
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => AppAvatar(name: provider.name, size: 56),
                          ),
                        ),
                      ),
                      Transform.translate(
                        offset: const Offset(0, -AppSpacing.lg),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              provider.name,
                              style: const TextStyle(
                                color: GabonColors.ink,
                                fontWeight: FontWeight.w900,
                                fontSize: 20,
                              ),
                            ),
                            Text(
                              '${provider.role} · ${provider.location}',
                              style: const TextStyle(color: GabonColors.muted, fontSize: 13),
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Wrap(
                              spacing: AppSpacing.sm,
                              runSpacing: AppSpacing.sm,
                              children: [
                                AppBadge(label: provider.category, tone: BadgeTone.info),
                                AppBadge(label: provider.responseTime, icon: Icons.schedule),
                                AppBadge(label: '${provider.rating} ★', tone: BadgeTone.warning),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, color: Color(0xFFF3F4F6)),
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      _Stat(value: formatFcfa(provider.price), label: 'prix de départ'),
                      _Stat(value: '${provider.missions}', label: 'missions'),
                      _Stat(value: '${provider.successRate}%', label: 'réussite'),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),

          const SectionHeader(kicker: 'À propos', title: 'Présentation'),
          GlassCard(
            child: Text(
              provider.bio.isEmpty ? provider.headline : provider.bio,
              style: const TextStyle(color: GabonColors.body, fontSize: 14, height: 1.5),
            ),
          ),

          if (provider.skills.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.lg),
            const SectionHeader(kicker: 'Compétences', title: 'Ce qu’il sait faire.'),
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: provider.skills
                  .map(
                    (skill) => Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md,
                        vertical: AppSpacing.sm,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.94),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.check_circle, size: 14, color: GabonColors.green),
                          const SizedBox(width: AppSpacing.xs),
                          Text(
                            skill,
                            style: const TextStyle(
                              color: GabonColors.ink,
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],

          if (provider.gallery.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.xl),
            const SectionHeader(kicker: 'Réalisations', title: 'Quelques exemples.'),
            SizedBox(
              height: 140,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: provider.gallery.length,
                separatorBuilder: (_, _) => const SizedBox(width: AppSpacing.md),
                itemBuilder: (_, index) => ClipRRect(
                  borderRadius: BorderRadius.circular(AppRadii.lg),
                  child: Image.network(
                    provider.gallery[index],
                    width: 220,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      width: 220,
                      color: GabonColors.greenDark,
                    ),
                  ),
                ),
              ),
            ),
          ],

          if (provider.reviews.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.xl),
            const SectionHeader(kicker: 'Avis', title: 'Retours de clients.'),
            ...provider.reviews.map(
              (review) => GlassCard(
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        AppAvatar(name: review.client, size: 34),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: Text(
                            review.client,
                            style: const TextStyle(
                              color: GabonColors.ink,
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                            ),
                          ),
                        ),
                        Text(
                          '★' * review.rating,
                          // Ambre foncé : le jaune #FCD116 sur fond blanc ne fait
                          // que 1,47:1. #B45309 atteint 5,05:1.
                          style: const TextStyle(color: GabonColors.warning, fontSize: 13),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      review.text,
                      style: const TextStyle(
                        color: GabonColors.body,
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],

          const SizedBox(height: AppSpacing.xl),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.xl),
            decoration: BoxDecoration(
              gradient: ctaGradient,
              borderRadius: BorderRadius.circular(AppRadii.xl),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Besoin de ${provider.name} ?',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Envoie ta demande en quelques secondes. Tu confirmes ensuite le prix et le mode de paiement.',
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13),
                ),
                const SizedBox(height: AppSpacing.lg),
                AppButton(
                  label: 'Demander un service',
                  variant: AppButtonVariant.yellow,
                  icon: Icons.send,
                  fullWidth: true,
                  onPressed: () => _book(context),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              color: GabonColors.ink,
              fontWeight: FontWeight.w900,
              fontSize: 15,
            ),
          ),
          Text(label, style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 11)),
        ],
      ),
    );
  }
}
