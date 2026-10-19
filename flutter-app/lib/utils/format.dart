import 'package:intl/intl.dart';

/// Formate un montant en FCFA (séparateur de milliers français).
String formatFcfa(int value) {
  final formatted = NumberFormat.decimalPattern('fr_FR').format(value);
  return '$formatted FCFA';
}
