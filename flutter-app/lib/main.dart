import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'app.dart';
import 'core/firebase_config.dart';
import 'services/notification_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Sans clés Firebase, on affiche un écran d'aide plutôt que de planter.
  if (!FirebaseConfig.isConfigured) {
    runApp(const LinkUpApp());
    return;
  }

  await Firebase.initializeApp(
    options: const FirebaseOptions(
      apiKey: FirebaseConfig.apiKey,
      appId: FirebaseConfig.appId,
      messagingSenderId: FirebaseConfig.messagingSenderId,
      projectId: FirebaseConfig.projectId,
      storageBucket: FirebaseConfig.storageBucket,
      authDomain: FirebaseConfig.authDomain,
    ),
  );

  await NotificationService.init();

  runApp(const LinkUpApp(configured: true));
}
