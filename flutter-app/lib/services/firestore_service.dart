import 'package:cloud_firestore/cloud_firestore.dart';

import '../models/message.dart';
import '../models/provider.dart';
import '../models/service_request.dart';

/// Accès Firestore centralisé (collections : providers, requests, messages, devices).
class FirestoreService {
  const FirestoreService._();

  static FirebaseFirestore get _db => FirebaseFirestore.instance;

  static int _createdAt(Map<String, dynamic> data) {
    final value = data['createdAt'] ?? data['id'] ?? 0;
    if (value is int) return value;
    if (value is num) return value.toInt();
    return 0;
  }

  static Stream<List<Provider>> providersStream() {
    return _db.collection('providers').snapshots().map((snap) {
      final list = snap.docs.map((d) => Provider.fromMap(d.id, d.data())).toList();
      list.sort((a, b) => b.id.compareTo(a.id));
      return list;
    });
  }

  static Stream<List<ServiceRequest>> requestsStream() {
    return _db.collection('requests').snapshots().map((snap) {
      final docs = snap.docs
          .map((d) => (id: d.id, data: d.data()))
          .toList()
        ..sort((a, b) => _createdAt(b.data).compareTo(_createdAt(a.data)));
      return docs
          .map((d) => ServiceRequest.fromMap(d.id, d.data))
          .toList();
    });
  }

  static Stream<List<Message>> messagesStream() {
    return _db.collection('messages').snapshots().map((snap) {
      final docs = snap.docs
          .map((d) => (id: d.id, data: d.data()))
          .toList()
        ..sort((a, b) => _createdAt(b.data).compareTo(_createdAt(a.data)));
      return docs.map((d) => Message.fromMap(d.id, d.data)).toList();
    });
  }

  static Future<void> addDocument(String collection, Map<String, dynamic> data) {
    return _db.collection(collection).add({
      ...data,
      'createdAt': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static Future<void> updateDocument(
    String collection,
    String id,
    Map<String, dynamic> data,
  ) {
    return _db.collection(collection).doc(id).update({
      ...data,
      'updatedAt': DateTime.now().millisecondsSinceEpoch,
    });
  }

  static Future<void> clearCollection(String collection) async {
    final snap = await _db.collection(collection).get();
    if (snap.docs.isEmpty) return;
    final batch = _db.batch();
    for (final doc in snap.docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }
}
