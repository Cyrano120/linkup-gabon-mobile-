import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../core/constants.dart';
import '../models/message.dart';
import '../models/provider.dart';
import '../models/service_request.dart';
import '../services/firestore_service.dart';
import '../services/notification_service.dart';
import '../utils/demo_data.dart';

/// Données temps réel (prestataires, missions, messages) + logique métier.
class DataController extends ChangeNotifier {
  DataController(this._auth) {
    _authSub = _auth.authStateChanges().listen(_handleAuth);
  }

  final FirebaseAuth _auth;
  StreamSubscription<User?>? _authSub;
  StreamSubscription<List<Provider>>? _providersSub;
  StreamSubscription<List<ServiceRequest>>? _requestsSub;
  StreamSubscription<List<Message>>? _messagesSub;

  final Set<String> _seenRequests = <String>{};
  final Set<String> _seenMessages = <String>{};

  List<Provider> _providers = const [];
  List<ServiceRequest> _requests = const [];
  List<Message> _messages = const [];
  bool _ready = false;
  bool _loadedRequests = false;
  bool _loadedMessages = false;
  bool _seeding = false;
  String? _uid;

  List<Provider> get providers => _providers;
  List<ServiceRequest> get requests => _requests;
  List<Message> get messages => _messages;
  bool get ready => _ready;

  /// Prestataire mis en avant (premier disponible, sinon premier tout court).
  Provider? get featured {
    if (_providers.isEmpty) return null;
    for (final provider in _providers) {
      if (provider.available) return provider;
    }
    return _providers.first;
  }

  void _handleAuth(User? user) {
    _uid = user?.uid;
    if (user == null) {
      _cancelSubscriptions();
      _providers = const [];
      _requests = const [];
      _messages = const [];
      _ready = false;
      _seeding = false;
      _loadedRequests = false;
      _loadedMessages = false;
      _seenRequests.clear();
      _seenMessages.clear();
      notifyListeners();
      return;
    }
    _subscribe();
  }

  void _cancelSubscriptions() {
    _providersSub?.cancel();
    _requestsSub?.cancel();
    _messagesSub?.cancel();
    _providersSub = null;
    _requestsSub = null;
    _messagesSub = null;
  }

  void _subscribe() {
    _cancelSubscriptions();

    _providersSub = FirestoreService.providersStream().listen((list) {
      // En release, on n'injecte jamais de démo : la base est partagée avec le
      // site, une collection vide est un choix légitime.
      if (list.isEmpty && !_seeding && isDemoDataEnabled) {
        _seeding = true;
        unawaited(_seedDemoData());
        return;
      }
      _providers = list;
      _ready = true;
      notifyListeners();
    });

    _requestsSub = FirestoreService.requestsStream().listen((list) {
      if (_loadedRequests) {
        for (final request in list) {
          final id = request.firestoreId;
          if (id != null &&
              _seenRequests.add(id) &&
              request.createdBy != null &&
              request.createdBy != _uid) {
            unawaited(NotificationService.show('Nouvelle mission', request.title));
          }
        }
      } else {
        _seenRequests.addAll(
          list.map((e) => e.firestoreId).whereType<String>(),
        );
        _loadedRequests = true;
      }
      _requests = list;
      notifyListeners();
    });

    _messagesSub = FirestoreService.messagesStream().listen((list) {
      if (_loadedMessages) {
        for (final message in list) {
          final id = message.firestoreId;
          if (id != null &&
              _seenMessages.add(id) &&
              message.createdBy != null &&
              message.createdBy != _uid) {
            unawaited(
              NotificationService.show('Message de ${message.from}', message.subject),
            );
          }
        }
      } else {
        _seenMessages.addAll(
          list.map((e) => e.firestoreId).whereType<String>(),
        );
        _loadedMessages = true;
      }
      _messages = list;
      notifyListeners();
    });
  }

  Future<void> _seedDemoData() async {
    try {
      for (final provider in seedProviders) {
        await FirestoreService.addDocument('providers', provider.toMap());
      }
      for (final request in seedRequests) {
        await FirestoreService.addDocument('requests', request.toMap());
      }
      for (final message in seedMessages) {
        await FirestoreService.addDocument('messages', message.toMap());
      }
    } catch (error) {
      debugPrint('Seed impossible : $error');
    }
  }

  // ---------------------------------------------------------------------------
  // Actions métier
  // ---------------------------------------------------------------------------

  Future<void> addRequest({
    required String client,
    required String title,
    required String category,
    required int budget,
    required String location,
    required String urgency,
    required String description,
  }) {
    return FirestoreService.addDocument('requests', {
      'id': DateTime.now().millisecondsSinceEpoch,
      'title': title,
      'category': category,
      'budget': budget,
      'location': location,
      'urgency': urgency,
      'status': 'Ouverte',
      'client': client,
      'provider': 'En attente',
      'candidates': <String>[],
      'description': description,
      'createdBy': _uid,
    });
  }

  Future<void> addProvider({
    required String name,
    required String role,
    required String category,
    required int price,
    required String location,
    required String headline,
    required List<String> skills,
  }) {
    return FirestoreService.addDocument('providers', {
      'id': DateTime.now().millisecondsSinceEpoch,
      'name': name,
      'role': role,
      'category': category,
      'rating': 4.5,
      'missions': 0,
      'price': price,
      'location': location,
      'available': true,
      'image':
          'https://ui-avatars.com/api/?name=${Uri.encodeComponent(name)}&background=009E60&color=fff&size=256',
      'cover':
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'responseTime': '30 min',
      'successRate': 90,
      'headline': headline,
      'bio': headline,
      'gallery': <String>[],
      'reviews': <Map<String, dynamic>>[],
      'skills': skills,
      'createdBy': _uid,
    });
  }

  Future<void> bookProvider({
    required Provider provider,
    required String client,
    required String title,
    required int budget,
    required String location,
    required String urgency,
    required String description,
  }) async {
    await FirestoreService.addDocument('requests', {
      'id': DateTime.now().millisecondsSinceEpoch,
      'title': title,
      'category': provider.category,
      'budget': budget,
      'location': location,
      'urgency': urgency,
      'status': 'En discussion',
      'client': client,
      'provider': provider.name,
      'candidates': <String>[],
      'description': description,
      'createdBy': _uid,
    });
    await FirestoreService.addDocument('messages', {
      'id': DateTime.now().millisecondsSinceEpoch + 1,
      'from': client,
      'to': provider.name,
      'subject': title,
      'text': 'Nouvelle demande pour ${provider.name}.',
      'createdBy': _uid,
    });
  }

  Future<void> updateRequestStatus(ServiceRequest request, String status) {
    final id = request.firestoreId;
    if (id == null) return Future<void>.value();
    return FirestoreService.updateDocument('requests', id, {'status': status});
  }

  Future<void> applyToMission(ServiceRequest request, String providerName) {
    final id = request.firestoreId;
    if (id == null || providerName.isEmpty) return Future<void>.value();
    if (request.candidates.contains(providerName)) return Future<void>.value();
    return FirestoreService.updateDocument('requests', id, {
      'candidates': [...request.candidates, providerName],
      'status': request.status == 'Ouverte' ? 'En discussion' : request.status,
    });
  }

  Future<void> acceptCandidate(ServiceRequest request, String providerName) async {
    final id = request.firestoreId;
    if (id == null) return;
    await FirestoreService.updateDocument('requests', id, {
      'provider': providerName,
      'status': 'Confirmée',
    });
    await FirestoreService.addDocument('messages', {
      'id': DateTime.now().millisecondsSinceEpoch,
      'from': 'LinkUp',
      'to': providerName,
      'subject': 'Mission confirmée',
      'text': '$providerName a été retenu pour « ${request.title} ».',
      'createdBy': _uid,
    });
  }

  Future<void> sendMessage({
    required String from,
    required String to,
    required String subject,
    required String text,
  }) {
    return FirestoreService.addDocument('messages', {
      'id': DateTime.now().millisecondsSinceEpoch,
      'from': from,
      'to': to,
      'subject': subject,
      'text': text,
      'createdBy': _uid,
    });
  }

  Future<void> resetDemoData() async {
    // Sécurité avant tout : ce bouton SUPPRIME des documents dans la base
    // partagée avec le site en production. On refuse l'opération hors debug,
    // même si l'interface ne devrait jamais l'exposer.
    if (!isDemoDataEnabled) {
      throw StateError(
        'Données de démo désactivées : elles sont partagées avec la production.',
      );
    }
    await FirestoreService.clearCollection('providers');
    await FirestoreService.clearCollection('requests');
    await FirestoreService.clearCollection('messages');
    _seeding = true;
    await _seedDemoData();
  }

  @override
  void dispose() {
    _authSub?.cancel();
    _cancelSubscriptions();
    super.dispose();
  }
}
