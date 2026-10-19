import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme.dart';
import '../state/auth_controller.dart';
import '../widgets/ui.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = context.read<AuthController>();
    if (_email.text.trim().isEmpty || _password.text.isEmpty) {
      setState(() => _error = 'Renseigne ton email et ton mot de passe.');
      return;
    }
    setState(() => _error = null);
    final ok = await auth.login(_email.text, _password.text);
    if (!mounted) return;
    if (!ok) {
      setState(() => _error = auth.error ?? 'Connexion impossible.');
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
                const AppLogo(),
                const SizedBox(height: AppSpacing.md),
                const Text(
                  'LinkUp',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 30),
                ),
                const Text(
                  'GABON',
                  style: TextStyle(
                    color: GabonColors.green,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 4,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Le bon talent, au bon moment, près de chez toi.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.8)),
                ),
                const SizedBox(height: AppSpacing.xl),
                GlassCard(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'CONNEXION',
                        style: TextStyle(
                          color: GabonColors.warning,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.4,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      const Text(
                        'Se connecter',
                        style: TextStyle(
                          color: GabonColors.ink,
                          fontWeight: FontWeight.w900,
                          fontSize: 22,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      if (_error != null) ErrorNote(message: _error!),
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
                        hint: '••••••',
                      ),
                      AppButton(
                        label: 'Se connecter',
                        icon: Icons.login,
                        fullWidth: true,
                        loading: auth.busy,
                        onPressed: _submit,
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Pas encore de compte ? ',
                            style: TextStyle(color: GabonColors.muted, fontSize: 13),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute<void>(
                                builder: (_) => const RegisterScreen(),
                              ),
                            ),
                            child: const Text(
                              'Créer un compte',
                              style: TextStyle(
                                color: GabonColors.green,
                                fontWeight: FontWeight.w900,
                                fontSize: 13,
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
        ),
      ),
    );
  }
}
