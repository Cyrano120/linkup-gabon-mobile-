import 'package:flutter/material.dart';
import 'package:provider/provider.dart' hide Provider;

import '../core/theme.dart';
import '../models/provider.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../widgets/ui.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final _subject = TextEditingController();
  final _text = TextEditingController();

  /// Destinataire réel : on choisit un prestataire, pas un nom libre.
  /// Un message privé exige un UID de destinataire ; laisser saisir un nom
  /// produirait des messages que personne ne pourrait lire.
  Provider? _recipient;

  String _box = 'Tous';
  bool _composing = false;
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _subject.dispose();
    _text.dispose();
    super.dispose();
  }

  Future<void> _submit(String from) async {
    final recipient = _recipient;
    if (recipient == null ||
        _subject.text.trim().isEmpty ||
        _text.text.trim().isEmpty) {
      setState(
        () => _error = 'Choisis un destinataire, puis renseigne l’objet et le message.',
      );
      return;
    }

    final toUid = recipient.createdBy;
    if (toUid == null || toUid.isEmpty) {
      setState(
        () => _error =
            'Cette vitrine n’a pas de compte associé : impossible de lui écrire en privé.',
      );
      return;
    }

    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      await context.read<DataController>().sendMessage(
            from: from,
            to: recipient.name,
            toUid: toUid,
            subject: _subject.text.trim(),
            text: _text.text.trim(),
          );
      if (!mounted) return;
      setState(() {
        _loading = false;
        _composing = false;
        _recipient = null;
      });
      _subject.clear();
      _text.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Message envoyé.')),
      );
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _error = error.toString();
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final data = context.watch<DataController>();
    final me = auth.displayName;
    final uid = auth.user?.uid;

    // Le flux ne contient déjà que mes conversations ; ces filtres ne font que
    // séparer les reçus des envoyés, désormais sur l'identité et non sur le nom.
    final filtered = switch (_box) {
      'Reçus' => data.messages.where((m) => m.toUid == uid).toList(),
      'Envoyés' => data.messages.where((m) => m.fromUid == uid).toList(),
      _ => data.messages,
    };

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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'MESSAGERIE',
                      style: TextStyle(
                        color: GabonColors.yellow,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.4,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Tes conversations',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 24,
                      ),
                    ),
                    SizedBox(height: AppSpacing.xs),
                    Text(
                      'Échange les détails d’une mission : lieu exact, horaire et mode de paiement.',
                      style: TextStyle(color: Color(0xCCFFFFFF), fontSize: 13, height: 1.45),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              AppButton(
                label: _composing ? 'Fermer' : 'Écrire',
                variant: _composing ? AppButtonVariant.danger : AppButtonVariant.primary,
                icon: _composing ? Icons.close : Icons.edit_outlined,
                compact: true,
                onPressed: () => setState(() => _composing = !_composing),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          if (_composing)
            GlassCard(
              margin: const EdgeInsets.only(bottom: AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_error != null) ErrorNote(message: _error!),
                  AppDropdown<Provider>(
                    label: 'Destinataire',
                    value: _recipient,
                    items: data.providers,
                    isEnabled: data.providers.isNotEmpty,
                    hint: data.providers.isEmpty
                        ? 'Aucun prestataire disponible'
                        : 'Choisir un prestataire',
                    labelOf: (provider) => provider.createdBy == null
                        ? '${provider.name} (sans compte)'
                        : provider.name,
                    onChanged: (provider) => setState(() => _recipient = provider),
                  ),
                  AppTextField(label: 'Objet', controller: _subject, hint: 'Ex : Mission depannage PC'),
                  AppTextField(
                    label: 'Message',
                    controller: _text,
                    maxLines: 4,
                    hint: 'Détaille ta demande…',
                  ),
                  AppButton(
                    label: 'Envoyer',
                    icon: Icons.send,
                    fullWidth: true,
                    loading: _loading,
                    onPressed: () => _submit(me),
                  ),
                ],
              ),
            ),

          Row(
            children: ['Tous', 'Reçus', 'Envoyés']
                .map(
                  (box) => Padding(
                    padding: const EdgeInsets.only(right: AppSpacing.sm),
                    child: Pill(
                      label: box,
                      active: _box == box,
                      onTap: () => setState(() => _box = box),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: AppSpacing.lg),

          if (filtered.isEmpty)
            const EmptyStateBox(
              title: 'Aucun message',
              text: 'Écris à un prestataire ou attends une réponse à ta mission.',
            )
          else
            ...filtered.map((message) {
              final incoming = message.toUid == uid;
              return GlassCard(
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        AppAvatar(name: message.from, size: 40),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                message.subject,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: GabonColors.ink,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 15,
                                ),
                              ),
                              Text(
                                '${message.from} → ${message.to}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(color: GabonColors.muted, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        AppBadge(
                          label: incoming ? 'Reçu' : 'Envoyé',
                          tone: incoming ? BadgeTone.info : BadgeTone.neutral,
                          icon: incoming ? Icons.arrow_downward : Icons.arrow_upward,
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    const SizedBox(height: AppSpacing.md),
                    Text(
                      message.text,
                      style: const TextStyle(
                        color: GabonColors.body,
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}
