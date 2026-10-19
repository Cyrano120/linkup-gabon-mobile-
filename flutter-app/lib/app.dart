import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme.dart';
import 'screens/config_screen.dart';
import 'screens/home_shell.dart';
import 'screens/login_screen.dart';
import 'screens/splash_screen.dart';
import 'state/auth_controller.dart';
import 'state/data_controller.dart';

class LinkUpApp extends StatelessWidget {
  const LinkUpApp({super.key, this.configured = false});

  /// Vrai si Firebase a bien été initialisé dans `main.dart`.
  final bool configured;

  @override
  Widget build(BuildContext context) {
    if (!configured) {
      return MaterialApp(
        title: 'LinkUp Gabon',
        theme: buildAppTheme(),
        debugShowCheckedModeBanner: false,
        home: const ConfigScreen(),
      );
    }

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthController>(create: (_) => AuthController()),
        ChangeNotifierProvider<DataController>(
          create: (_) => DataController(FirebaseAuth.instance),
        ),
      ],
      child: MaterialApp(
        title: 'LinkUp Gabon',
        theme: buildAppTheme(),
        debugShowCheckedModeBanner: false,
        home: const _RootGate(),
      ),
    );
  }
}

/// Bascule entre chargement, connexion et espace connecté.
class _RootGate extends StatelessWidget {
  const _RootGate();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    if (auth.loading) return const SplashScreen();
    return auth.isSignedIn ? const HomeShell() : const LoginScreen();
  }
}
