import 'package:flutter/material.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../models/provider.dart';
import 'ui.dart';

/// Données saisies dans la feuille de demande.
class BookingInput {
  const BookingInput({
    required this.client,
    required this.title,
    required this.budget,
    required this.location,
    required this.urgency,
    required this.description,
  });

  final String client;
  final String title;
  final int budget;
  final String location;
  final String urgency;
  final String description;
}

Future<void> showBookingSheet(
  BuildContext context, {
  required Provider provider,
  required String defaultClient,
  required Future<void> Function(BookingInput input) onSubmit,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _BookingSheet(
      provider: provider,
      defaultClient: defaultClient,
      onSubmit: onSubmit,
    ),
  );
}

class _BookingSheet extends StatefulWidget {
  const _BookingSheet({
    required this.provider,
    required this.defaultClient,
    required this.onSubmit,
  });

  final Provider provider;
  final String defaultClient;
  final Future<void> Function(BookingInput input) onSubmit;

  @override
  State<_BookingSheet> createState() => _BookingSheetState();
}

class _BookingSheetState extends State<_BookingSheet> {
  late final TextEditingController _client = TextEditingController(text: widget.defaultClient);
  late final TextEditingController _title =
      TextEditingController(text: 'Demande pour ${widget.provider.role}');
  late final TextEditingController _budget =
      TextEditingController(text: widget.provider.price.toString());
  late final TextEditingController _location =
      TextEditingController(text: widget.provider.location);
  final TextEditingController _description = TextEditingController();

  String _urgency = urgencies.first;
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _client.dispose();
    _title.dispose();
    _budget.dispose();
    _location.dispose();
    _description.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_client.text.trim().isEmpty ||
        _title.text.trim().isEmpty ||
        _description.text.trim().isEmpty ||
        _budget.text.trim().isEmpty) {
      setState(() => _error = 'Complète les champs obligatoires.');
      return;
    }
    setState(() {
      _error = null;
      _loading = true;
    });
    try {
      await widget.onSubmit(
        BookingInput(
          client: _client.text.trim(),
          title: _title.text.trim(),
          budget: int.tryParse(_budget.text.replaceAll(RegExp(r'\D'), '')) ?? 0,
          location: _location.text.trim(),
          urgency: _urgency,
          description: _description.text.trim(),
        ),
      );
      if (!mounted) return;
      Navigator.of(context).pop();
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
    final media = MediaQuery.of(context);
    return Padding(
      padding: EdgeInsets.only(bottom: media.viewInsets.bottom),
      child: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0B1A14),
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadii.xl)),
        ),
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'DEMANDE DIRECTE',
                          style: TextStyle(
                            color: GabonColors.yellow,
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.4,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Contacter ${widget.provider.name}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                            fontSize: 20,
                          ),
                        ),
                      ],
                    ),
                  ),
                  AppButton(
                    label: 'Fermer',
                    variant: AppButtonVariant.danger,
                    compact: true,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                widget.provider.headline,
                style: TextStyle(color: Colors.white.withValues(alpha: 0.75), fontSize: 13),
              ),
              const SizedBox(height: AppSpacing.lg),
              if (_error != null) ErrorNote(message: _error!),
              AppTextField(label: 'Ton nom', controller: _client),
              AppTextField(label: 'Titre', controller: _title),
              AppTextField(
                label: 'Description',
                controller: _description,
                maxLines: 4,
                hint: 'Explique ton besoin, le contexte et le résultat attendu.',
              ),
              AppTextField(
                label: 'Budget (FCFA)',
                controller: _budget,
                keyboardType: TextInputType.number,
              ),
              AppTextField(label: 'Lieu', controller: _location),
              const Text(
                'Délai',
                style: TextStyle(color: Color(0xFFD1D5DB), fontWeight: FontWeight.w700, fontSize: 12),
              ),
              const SizedBox(height: AppSpacing.sm),
              Wrap(
                spacing: AppSpacing.sm,
                runSpacing: AppSpacing.sm,
                children: urgencies
                    .map(
                      (item) => Pill(
                        label: item,
                        active: _urgency == item,
                        onTap: () => setState(() => _urgency = item),
                      ),
                    )
                    .toList(),
              ),
              const SizedBox(height: AppSpacing.lg),
              AppButton(
                label: 'Envoyer la demande',
                icon: Icons.send,
                fullWidth: true,
                loading: _loading,
                onPressed: _submit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
