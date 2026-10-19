import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../services/notification_service.dart';

/// Gère la session Firebase Auth et expose un état simple aux écrans.
class AuthController extends ChangeNotifier {
  AuthController() {
    _subscription = FirebaseAuth.instance.authStateChanges().listen(_onAuthChanged);
  }

  StreamSubscription<User?>? _subscription;
  User? _user;
  bool _loading = true;
  String? _error;
  bool _busy = false;

  User? get user => _user;
  bool get loading => _loading;
  bool get busy => _busy;
  String? get error => _error;
  bool get isSignedIn => _user != null;

  /// Nom affiché : `displayName` sinon la partie locale de l'email.
  String get displayName {
    final name = _user?.displayName;
    if (name != null && name.trim().isNotEmpty) return name.trim();
    final email = _user?.email;
    if (email != null && email.contains('@')) return email.split('@').first;
    return 'Client';
  }

  void _onAuthChanged(User? user) {
    _user = user;
    _loading = false;
    notifyListeners();
    if (user != null) {
      // Non bloquant : l'app reste utilisable même sans config push.
      unawaited(NotificationService.registerDevice(user.uid));
    }
  }

  static String _clean(Object error) {
    final raw = error.toString();
    return raw
        .replaceFirst('FirebaseException: ', '')
        .replaceAll(RegExp(r'\[firebase_auth/[^\]]+\]'), '')
        .trim();
  }

  Future<bool> login(String email, String password) async {
    _busy = true;
    _error = null;
    notifyListeners();
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      return true;
    } catch (error) {
      _error = _clean(error);
      return false;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _busy = true;
    _error = null;
    notifyListeners();
    try {
      final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );
      if (name.trim().isNotEmpty) {
        await credential.user?.updateDisplayName(name.trim());
        await credential.user?.reload();
        _user = FirebaseAuth.instance.currentUser;
      }
      return true;
    } catch (error) {
      _error = _clean(error);
      return false;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await FirebaseAuth.instance.signOut();
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
