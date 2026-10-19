import 'package:flutter/material.dart';

import '../core/firebase_config.dart';
import '../core/theme.dart';
import '../widgets/ui.dart';

/// Affiché si aucune clé Firebase n'est fournie : évite un plantage au démarrage.
class ConfigScreen extends StatelessWidget {
  const ConfigScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GabonBackground(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const AppLogo(),
                const SizedBox(height: AppSpacing.xl),
                const Text(
                  'Configuration requise',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 22),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Firebase n’est pas encore configuré pour cette application.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 14),
                ),
                const SizedBox(height: AppSpacing.xl),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(AppRadii.lg),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.18)),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '1. Copie env.example.json vers env.json',
                        style: TextStyle(color: Colors.white, fontSize: 13, height: 1.6),
                      ),
                      Text(
                        '2. Renseigne tes clés Firebase',
                        style: TextStyle(color: Colors.white, fontSize: 13, height: 1.6),
                      ),
                      Text(
                        '3. Relance : flutter run --dart-define-from-file=env.json',
                        style: TextStyle(color: Colors.white, fontSize: 13, height: 1.6),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text(
                  FirebaseConfig.isConfigured
                      ? 'Configuration détectée.'
                      : 'Aucune clé détectée pour le moment.',
                  style: const TextStyle(color: GabonColors.yellow, fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
