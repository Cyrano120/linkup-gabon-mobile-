import 'package:flutter/material.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../models/service_request.dart';
import '../utils/format.dart';
import 'ui.dart';

class RequestCard extends StatelessWidget {
  const RequestCard({
    super.key,
    required this.request,
    required this.providerNames,
    required this.onStatus,
    required this.onAccept,
    required this.onApply,
  });

  final ServiceRequest request;
  final List<String> providerNames;
  final void Function(String status) onStatus;
  final void Function(String providerName) onAccept;
  final void Function(String providerName) onApply;

  @override
  Widget build(BuildContext context) {
    final candidates = request.candidates;

    return GlassCard(
      margin: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppBadge(label: request.category, tone: BadgeTone.info),
              const SizedBox(width: AppSpacing.sm),
              statusBadge(request.status),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            request.title,
            style: const TextStyle(
              color: GabonColors.ink,
              fontWeight: FontWeight.w900,
              fontSize: 17,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            request.description.isEmpty ? 'Aucune description ajoutée.' : request.description,
            style: const TextStyle(color: GabonColors.muted, fontSize: 13, height: 1.45),
          ),
          const SizedBox(height: AppSpacing.md),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              _meta('Client : ${request.client}'),
              _meta('Budget : ${formatFcfa(request.budget)}'),
              _meta('Lieu : ${request.location}'),
              _meta('Délai : ${request.urgency}'),
              _meta('Prestataire : ${request.provider}'),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          const _Label('Statut'),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: statuses
                .map(
                  (status) => Pill(
                    label: status,
                    active: request.status == status,
                    onTap: () => onStatus(status),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: AppSpacing.lg),
          const _Label('Candidatures'),
          if (candidates.isEmpty)
            const Text(
              'Aucune candidature pour le moment.',
              style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 13),
            )
          else
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: candidates
                  .map(
                    (name) => AppButton(
                      label: 'Accepter $name',
                      variant: AppButtonVariant.success,
                      icon: Icons.check_circle_outline,
                      compact: true,
                      onPressed: () => onAccept(name),
                    ),
                  )
                  .toList(),
            ),
          const SizedBox(height: AppSpacing.lg),
          const _Label('Postuler comme…'),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: providerNames
                .take(10)
                .map(
                  (name) => AppButton(
                    label: name,
                    variant: AppButtonVariant.ghost,
                    icon: Icons.pan_tool_outlined,
                    compact: true,
                    onPressed: () => onApply(name),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _meta(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: const TextStyle(color: GabonColors.muted, fontSize: 11, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _Label extends StatelessWidget {
  const _Label(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Text(
        text,
        style: const TextStyle(
          color: GabonColors.body,
          fontWeight: FontWeight.w800,
          fontSize: 13,
        ),
      ),
    );
  }
}
