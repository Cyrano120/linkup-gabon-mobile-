import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../state/data_controller.dart';
import '../widgets/request_card.dart';
import '../widgets/ui.dart';

class MissionsScreen extends StatefulWidget {
  const MissionsScreen({super.key});

  @override
  State<MissionsScreen> createState() => _MissionsScreenState();
}

class _MissionsScreenState extends State<MissionsScreen> {
  String _filter = 'Toutes';

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<DataController>();
    final requests =
        _filter == 'Toutes' ? data.requests : data.requests.where((r) => r.status == _filter).toList();
    final providerNames = data.providers.map((p) => p.name).toList();

    int count(String status) => data.requests.where((r) => r.status == status).length;

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
          const Text(
            'MISSIONS',
            style: TextStyle(
              color: GabonColors.yellow,
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.4,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            'Suivi des demandes',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 24),
          ),
          const SizedBox(height: AppSpacing.xs),
          const Text(
            'Change le statut, accepte un candidat et garde une trace claire de chaque mission.',
            style: TextStyle(color: Color(0xCCFFFFFF), fontSize: 13, height: 1.45),
          ),
          const SizedBox(height: AppSpacing.lg),

          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              AppBadge(label: '${count('Ouverte')} ouvertes', tone: BadgeTone.warning),
              AppBadge(label: '${count('En discussion')} en discussion', tone: BadgeTone.info),
              AppBadge(label: '${count('Confirmée')} confirmées', tone: BadgeTone.success),
              AppBadge(label: '${count('Terminée')} terminées'),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              Pill(
                label: 'Toutes',
                active: _filter == 'Toutes',
                onTap: () => setState(() => _filter = 'Toutes'),
              ),
              ...statuses.map(
                (status) => Pill(
                  label: status,
                  active: _filter == status,
                  onTap: () => setState(() => _filter = status),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          if (requests.isEmpty)
            const EmptyStateBox(
              title: 'Aucune mission ici',
              text: 'Publie une mission ou change de filtre pour voir les autres demandes.',
            )
          else
            ...requests.map(
              (request) => RequestCard(
                key: ValueKey(request.firestoreId ?? request.id.toString()),
                request: request,
                providerNames: providerNames,
                onStatus: (status) async {
                  await data.updateRequestStatus(request, status);
                  if (!mounted) return;
                  _toast('Statut mis à jour : $status.');
                },
                onAccept: (name) async {
                  await data.acceptCandidate(request, name);
                  if (!mounted) return;
                  _toast('$name retenu pour la mission.');
                },
                onApply: (name) async {
                  await data.applyToMission(request, name);
                  if (!mounted) return;
                  _toast('$name a postulé.');
                },
              ),
            ),
        ],
      ),
    );
  }
}
