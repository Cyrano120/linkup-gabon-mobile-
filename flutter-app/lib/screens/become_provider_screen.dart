import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/constants.dart';
import '../core/theme.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../widgets/ui.dart';

class BecomeProviderScreen extends StatefulWidget {
  const BecomeProviderScreen({super.key});

  @override
  State<BecomeProviderScreen> createState() => _BecomeProviderScreenState();
}

class _BecomeProviderScreenState extends State<BecomeProviderScreen> {
  final _name = TextEditingController();
  final _role = TextEditingController();
  final _price = TextEditingController();
  final _headline = TextEditingController();
  final _skills = TextEditingController();

  String _category = categories.first;
  String _location = localAreas.first;
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _name.text = context.read<AuthController>().displayName;
  }

  @override
  void dispose() {
    _name.dispose();
    _role.dispose();
    _price.dispose();
    _headline.dispose();
    _skills.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_name.text.trim().isEmpty ||
        _role.text.trim().isEmpty ||
        _headline.text.trim().isEmpty ||
        _price.text.trim().isEmpty) {
      setState(() => _error = 'Complète le nom, le métier, la présentation et le tarif.');
      return;
    }
    setState(() {
      _error = null;
      _loading = true;
    });
    final data = context.read<DataController>();
    try {
      await data.addProvider(
        name: _name.text.trim(),
        role: _role.text.trim(),
        category: _category,
        price: int.tryParse(_price.text.replaceAll(RegExp(r'\D'), '')) ?? 0,
        location: _location,
        headline: _headline.text.trim(),
        skills: _skills.text
            .split(',')
            .map((s) => s.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
      );
      if (!mounted) return;
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profil publié. Tu apparais dans la marketplace.')),
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
    return Scaffold(
      body: GabonBackground(
        child: SingleChildScrollView(
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
                ],
              ),
              const SizedBox(height: AppSpacing.lg),
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
                    const Text(
                      'VITRINE GRATUITE',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.4,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    const Text(
                      'Devenir prestataire',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 24,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Crée un profil clair en une minute : compétence, quartier et tarif de départ en FCFA.',
                      style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_error != null) ErrorNote(message: _error!),
                    AppTextField(label: 'Nom affiché', controller: _name, hint: 'Ex : Nora Mba'),
                    AppTextField(
                      label: 'Métier / spécialité',
                      controller: _role,
                      hint: 'Ex : Développeuse front-end',
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
                      label: 'Tarif de départ (FCFA)',
                      controller: _price,
                      keyboardType: TextInputType.number,
                      hint: 'Ex : 8000',
                    ),
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
                    AppTextField(
                      label: 'Présentation courte',
                      controller: _headline,
                      maxLines: 3,
                      hint: 'Ex : Sites vitrines et landing pages pour petits commerces.',
                    ),
                    AppTextField(
                      label: 'Compétences (séparées par des virgules)',
                      controller: _skills,
                      hint: 'React, Landing page, Maquette',
                    ),
                    AppButton(
                      label: 'Publier mon profil',
                      icon: Icons.rocket_launch,
                      fullWidth: true,
                      loading: _loading,
                      onPressed: _submit,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              const SectionHeader(kicker: 'Bon à savoir', title: 'Ce qui rassure les clients.'),
              const GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.auto_awesome, color: GabonColors.green, size: 18),
                    SizedBox(height: AppSpacing.sm),
                    Text(
                      'Un profil qui précise le quartier, le délai de réponse et un tarif de départ reçoit beaucoup plus de demandes.',
                      style: TextStyle(color: GabonColors.body, fontSize: 13, height: 1.5),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
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
