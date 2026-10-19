import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../utils/format.dart';
import '../widgets/ui.dart';

class CreateRequestScreen extends StatefulWidget {
  const CreateRequestScreen({super.key});

  @override
  State<CreateRequestScreen> createState() => _CreateRequestScreenState();
}

class _CreateRequestScreenState extends State<CreateRequestScreen> {
  final _title = TextEditingController();
  final _budget = TextEditingController();
  final _description = TextEditingController();

  String _category = categories.first;
  String _location = localAreas.first;
  String _urgency = urgencies[1];
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _title.dispose();
    _budget.dispose();
    _description.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_title.text.trim().isEmpty ||
        _description.text.trim().isEmpty ||
        _budget.text.trim().isEmpty) {
      setState(() => _error = 'Complète le titre, la description et le budget.');
      return;
    }
    setState(() {
      _error = null;
      _loading = true;
    });
    final data = context.read<DataController>();
    final client = context.read<AuthController>().displayName;
    try {
      await data.addRequest(
        client: client,
        title: _title.text.trim(),
        category: _category,
        budget: int.tryParse(_budget.text.replaceAll(RegExp(r'\D'), '')) ?? 0,
        location: _location,
        urgency: _urgency,
        description: _description.text.trim(),
      );
      if (!mounted) return;
      setState(() => _loading = false);
      _title.clear();
      _description.clear();
      _budget.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Mission publiée. Retrouve-la dans Missions.')),
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
    final budgetValue = int.tryParse(_budget.text.replaceAll(RegExp(r'\D'), '')) ?? 0;

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
            'NOUVELLE MISSION',
            style: TextStyle(
              color: GabonColors.yellow,
              fontSize: 11,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.4,
            ),
          ),
          const SizedBox(height: 2),
          const Text(
            'Décris ton besoin',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 24),
          ),
          const SizedBox(height: AppSpacing.xs),
          const Text(
            'Sois précis : les prestataires du quartier répondent plus vite quand le besoin est clair.',
            style: TextStyle(color: Color(0xCCFFFFFF), fontSize: 13, height: 1.45),
          ),
          const SizedBox(height: AppSpacing.xl),

          GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_error != null) ErrorNote(message: _error!),
                AppTextField(
                  label: 'Titre de la mission',
                  controller: _title,
                  hint: 'Ex : Installer Windows et Office',
                ),
                const _Label('Catégorie'),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: categories
                      .map(
                        (item) => Pill(
                          label: item,
                          active: _category == item,
                          onTap: () => setState(() => _category = item),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: AppSpacing.lg),
                AppTextField(
                  label: 'Budget (FCFA)',
                  controller: _budget,
                  keyboardType: TextInputType.number,
                  hint: 'Ex : 10000',
                ),
                Text(
                  'Budget indicatif : ${budgetValue > 0 ? formatFcfa(budgetValue) : 'à définir'}',
                  style: const TextStyle(color: GabonColors.muted, fontSize: 12),
                ),
                const SizedBox(height: AppSpacing.md),
                const _Label('Quartier'),
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: localAreas
                      .map(
                        (item) => Pill(
                          label: item,
                          active: _location == item,
                          onTap: () => setState(() => _location = item),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: AppSpacing.lg),
                const _Label('Délai'),
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
                AppTextField(
                  label: 'Description',
                  controller: _description,
                  maxLines: 5,
                  hint: 'Contexte, contraintes, résultat attendu…',
                ),
                AppButton(
                  label: 'Publier la mission',
                  icon: Icons.send,
                  fullWidth: true,
                  loading: _loading,
                  onPressed: _submit,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          const GlassCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ASTUCE',
                  style: TextStyle(
                    color: GabonColors.warning,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.4,
                  ),
                ),
                SizedBox(height: AppSpacing.xs),
                Text(
                  'Indique un délai réaliste et un budget clair : les profils les plus fiables répondent en priorité aux demandes bien décrites.',
                  style: TextStyle(color: GabonColors.body, fontSize: 13, height: 1.5),
                ),
              ],
            ),
          ),
        ],
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
          color: Color(0xFFD1D5DB),
          fontWeight: FontWeight.w700,
          fontSize: 12,
        ),
      ),
    );
  }
}
