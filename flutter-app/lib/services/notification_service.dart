import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Notifications locales + enregistrement de l'appareil auprès de FCM.
///
/// Les notifications distantes nécessitent `google-services.json` (Android) et
/// `GoogleService-Info.plist` (iOS). Sans ces fichiers, l'enregistrement échoue
/// silencieusement : les notifications locales continuent de fonctionner.
class NotificationService {
  const NotificationService._();

  static final FlutterLocalNotificationsPlugin _local =
      FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static const String _channelId = 'linkup';
  static const String _channelName = 'LinkUp Gabon';

  static Future<void> init() async {
    if (_initialized) return;
    try {
      const android = AndroidInitializationSettings('@mipmap/ic_launcher');
      const darwin = DarwinInitializationSettings();
      const settings = InitializationSettings(
        android: android,
        iOS: darwin,
        macOS: darwin,
      );
      await _local.initialize(settings: settings);

      await _local
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(
            const AndroidNotificationChannel(
              _channelId,
              _channelName,
              importance: Importance.high,
            ),
          );

      FirebaseMessaging.onMessage.listen((message) {
        final title = message.notification?.title ?? 'LinkUp Gabon';
        final body = message.notification?.body ?? '';
        if (body.isNotEmpty) {
          show(title, body);
        }
      });

      _initialized = true;
    } catch (error) {
      debugPrint('NotificationService.init a échoué : $error');
    }
  }

  static Future<void> show(String title, String body) async {
    try {
      await _local.show(
        id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
        title: title,
        body: body,
        notificationDetails: const NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId,
            _channelName,
            importance: Importance.high,
            priority: Priority.high,
          ),
          iOS: DarwinNotificationDetails(),
        ),
      );
    } catch (error) {
      debugPrint('NotificationService.show a échoué : $error');
    }
  }

  /// Demande la permission et enregistre l'identifiant d'appareil dans
  /// `devices/{uid}` (FID fourni par FCM via `onRegistered`).
  static Future<String?> registerDevice(String uid) async {
    if (kIsWeb) return null;
    try {
      final messaging = FirebaseMessaging.instance;
      final settings = await messaging.requestPermission();
      if (settings.authorizationStatus == AuthorizationStatus.denied) {
        return null;
      }

      await messaging.register();
      final String token;
      try {
        token = await messaging.onRegistered
            .first
            .timeout(const Duration(seconds: 5), onTimeout: () => '');
      } catch (_) {
        return null;
      }
      if (token.isEmpty) return null;

      await FirebaseFirestore.instance.collection('devices').doc(uid).set(
        {
          'userId': uid,
          'token': token,
          'platform': Platform.isIOS ? 'ios' : 'android',
          'updatedAt': DateTime.now().millisecondsSinceEpoch,
        },
        SetOptions(merge: true),
      );
      return token;
    } catch (error) {
      debugPrint('Enregistrement du device impossible : $error');
      return null;
    }
  }
}
