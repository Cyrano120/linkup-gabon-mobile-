import 'package:flutter/material.dart';

/// Palette LinkUp Gabon, alignée sur l'app web et l'app Expo.
class GabonColors {
  const GabonColors._();

  static const green = Color(0xFF009E60);
  static const greenDeep = Color(0xFF0F7A45);
  static const greenDark = Color(0xFF03392A);
  static const yellow = Color(0xFFFCD116);
  static const blue = Color(0xFF3A75C4);

  static const ink = Color(0xFF101827);
  static const muted = Color(0xFF586575);
  static const line = Color(0xFFE5E7EB);
  static const body = Color(0xFF374151);

  static const bgTop = Color(0xFF06160F);
  static const bgMid = Color(0xFF072A35);
  static const bgBottom = Color(0xFF0A3050);

  static const danger = Color(0xFFDC2626);
  static const dangerBg = Color(0xFFFEF2F2);
  static const warning = Color(0xFFB45309);
  static const warningBg = Color(0xFFFFFBEB);
  static const success = Color(0xFF15803D);
  static const successBg = Color(0xFFECFDF5);
  static const info = Color(0xFF3A75C4);
  static const infoBg = Color(0xFFEFF6FF);
  static const neutral = Color(0xFF586575);
  static const neutralBg = Color(0xFFF3F4F6);
}

/// Rayons cohérents dans toute l'application.
class AppRadii {
  const AppRadii._();
  static const double sm = 10;
  static const double md = 14;
  static const double lg = 20;
  static const double xl = 26;
}

class AppSpacing {
  const AppSpacing._();
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
}

/// Fond dégradé principal (haut → bas).
const heroGradient = LinearGradient(
  colors: [GabonColors.greenDark, GabonColors.bgMid, GabonColors.bgBottom],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
);

/// Dégradé d'appel à l'action.
const ctaGradient = LinearGradient(
  colors: [GabonColors.green, GabonColors.blue],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
);

/// Drapeau gabonais (vert / jaune / bleu).
const gabonGradient = LinearGradient(
  colors: [GabonColors.green, GabonColors.yellow, GabonColors.blue],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
);

ThemeData buildAppTheme() {
  final base = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: GabonColors.green,
      brightness: Brightness.dark,
    ).copyWith(
      primary: GabonColors.green,
      secondary: GabonColors.yellow,
      surface: GabonColors.bgTop,
    ),
    scaffoldBackgroundColor: GabonColors.bgTop,
  );

  return base.copyWith(
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: Color(0xFF0B1220),
      contentTextStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
      behavior: SnackBarBehavior.floating,
    ),
    textTheme: base.textTheme.apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
      fontFamily: 'Roboto',
    ),
  );
}
