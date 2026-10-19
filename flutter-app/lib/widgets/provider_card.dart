import 'package:flutter/material.dart';

import '../core/theme.dart';
import '../models/provider.dart';
import '../utils/format.dart';
import 'ui.dart';

class ProviderCard extends StatelessWidget {
  const ProviderCard({
    super.key,
    required this.provider,
    required this.onOpen,
    required this.onBook,
  });

  final Provider provider;
  final VoidCallback onOpen;
  final VoidCallback onBook;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.lg),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.96),
        borderRadius: BorderRadius.circular(AppRadii.lg),
        boxShadow: const [
          BoxShadow(color: Color(0x2E000000), blurRadius: 18, offset: Offset(0, 10)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              SizedBox(
                height: 150,
                width: double.infinity,
                child: Image.network(
                  provider.cover,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => Container(color: GabonColors.greenDark),
                ),
              ),
              Positioned(
                top: AppSpacing.md,
                right: AppSpacing.md,
                child: AppBadge(
                  label: provider.available ? 'Disponible' : 'Occupé',
                  tone: provider.available ? BadgeTone.success : BadgeTone.neutral,
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.lg,
              0,
              AppSpacing.lg,
              AppSpacing.lg,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Transform.translate(
                  offset: const Offset(0, -AppSpacing.xxl),
                  child: Row(
                    children: [
                      Container(
                        height: 52,
                        width: 52,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(AppRadii.md),
                          border: Border.all(color: Colors.white, width: 4),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Image.network(
                          provider.image,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => AppAvatar(name: provider.name, size: 44),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: AppSpacing.xxl - 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                provider.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: GabonColors.ink,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                provider.role,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(color: GabonColors.muted, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Transform.translate(
                  offset: const Offset(0, -AppSpacing.lg),
                  child: Text(
                    provider.headline,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: GabonColors.body, fontSize: 13, height: 1.4),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    AppBadge(label: provider.category, tone: BadgeTone.info),
                    AppBadge(label: provider.location, icon: Icons.place_outlined),
                    AppBadge(label: provider.responseTime, icon: Icons.schedule),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: provider.skills
                      .take(4)
                      .map(
                        (skill) => Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.sm,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9FAFB),
                            borderRadius: BorderRadius.circular(AppRadii.sm),
                            border: Border.all(color: GabonColors.line),
                          ),
                          child: Text(
                            skill,
                            style: const TextStyle(
                              color: GabonColors.muted,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: AppSpacing.md),
                const Divider(height: 1, color: Color(0xFFF3F4F6)),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    _Stat(value: formatFcfa(provider.price), label: 'prix de départ'),
                    _Stat(value: '${provider.rating} ★', label: '${provider.missions} missions'),
                    _Stat(value: '${provider.successRate}%', label: 'réussite'),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        label: 'Profil',
                        variant: AppButtonVariant.success,
                        icon: Icons.person_outline,
                        compact: true,
                        onPressed: onOpen,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: AppButton(
                        label: 'Demander',
                        icon: Icons.send,
                        compact: true,
                        onPressed: onBook,
                      ),
                    ),
                  ],
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
              fontWeight: FontWeight.w800,
              fontSize: 13,
            ),
          ),
          Text(label, style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 10)),
        ],
      ),
    );
  }
}
