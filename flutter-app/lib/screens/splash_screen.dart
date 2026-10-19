import 'package:flutter/material.dart';

import '../core/theme.dart';
import '../widgets/ui.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GabonBackground(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                height: 72,
                width: 72,
                decoration: BoxDecoration(
                  gradient: gabonGradient,
                  borderRadius: BorderRadius.circular(AppRadii.lg),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'LU',
                  style: TextStyle(
                    color: GabonColors.greenDark,
                    fontWeight: FontWeight.w900,
                    fontSize: 24,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              const Text(
                'LinkUp Gabon',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20),
              ),
              const SizedBox(height: AppSpacing.xl),
              const CircularProgressIndicator(color: GabonColors.yellow),
            ],
          ),
        ),
      ),
    );
  }
}
