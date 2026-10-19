import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme.dart';
import '../state/auth_controller.dart';
import '../widgets/ui.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthController>();
    if (_name.text.trim().isEmpty || _email.text.trim().isEmpty || _password.text.isEmpty) {
      setState(() => _error = 'Remplis tous les champs.');
      return;
    }
    if (_password.text.length < 6) {
      setState(() => _error = 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setState(() => _error = null);
    final ok = await auth.register(_name.text, _email.text, _password.text);
    if (!mounted) return;
    if (ok) {
      // Retour à la racine : la racine basculera sur l'espace connecté.
      Navigator.of(context).popUntil((route) => route.isFirst);
    } else {
      setState(() => _error = auth.error ?? 'Inscription impossible.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();

    return Scaffold(
      body: GabonBackground(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const AppLogo(size: 60),
                const SizedBox(height: AppSpacing.lg),
                GlassCard(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'INSCRIPTION',
                        style: TextStyle(
                          color: GabonColors.warning,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.4,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      const Text(
                        'Créer un compte',
                        style: TextStyle(
                          color: GabonColors.ink,
                          fontWeight: FontWeight.w900,
                          fontSize: 22,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      if (_error != null) ErrorNote(message: _error!),
                      AppTextField(label: 'Nom', controller: _name, hint: 'Ex : Ariane'),
                      AppTextField(
                        label: 'Email',
                        controller: _email,
                        keyboardType: TextInputType.emailAddress,
                        hint: 'ton@email.com',
                      ),
                      AppTextField(
                        label: 'Mot de passe',
                        controller: _password,
                        obscure: true,
                        hint: '6 caractères minimum',
                      ),
                      AppButton(
                        label: 'Créer mon compte',
                        icon: Icons.person_add_alt,
                        fullWidth: true,
                        loading: auth.busy,
                        onPressed: _submit,
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      Center(
                        child: GestureDetector(
                          onTap: () => Navigator.of(context).pop(),
                          child: const Text(
                            'Déjà un compte ? Se connecter',
                            style: TextStyle(
                              color: GabonColors.green,
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
