import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:linkup_gabon/widgets/ui.dart';

void main() {
  testWidgets('AppLogo affiche les initiales LU', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: Center(child: AppLogo()))),
    );

    expect(find.text('LU'), findsOneWidget);
  });

  testWidgets('statusBadge rend le bon libellé', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: Scaffold(body: statusBadge('Confirmée'))),
    );

    expect(find.text('Confirmée'), findsOneWidget);
  });
}
