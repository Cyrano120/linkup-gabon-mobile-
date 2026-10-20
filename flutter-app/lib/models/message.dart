/// Message privé échangé entre deux utilisateurs.
///
/// `from` et `to` restent des **noms affichés** (lisibilité de l'interface).
/// `fromUid`, `toUid` et `participants` portent l'identité réelle et servent
/// au contrôle d'accès Firestore : seul un participant peut lire le message.
///
/// Invariants imposés par les règles :
/// - `fromUid` vaut toujours l'UID de l'expéditeur connecté ;
/// - `participants` vaut exactement `[fromUid, toUid]` ;
/// - `toUid` diffère de `fromUid`.
class Message {
  const Message({
    this.firestoreId,
    required this.id,
    required this.from,
    required this.to,
    required this.subject,
    required this.text,
    this.createdBy,
    this.fromUid,
    this.toUid,
    this.participants = const [],
  });

  final String? firestoreId;
  final int id;
  final String from;
  final String to;
  final String subject;
  final String text;

  /// Auteur du document (injecté par le service, jamais saisi).
  final String? createdBy;
  final String? fromUid;
  final String? toUid;

  /// `[fromUid, toUid]` — clé de requête et contrôle d'accès.
  final List<String> participants;

  /// Vrai si [uid] fait partie de la conversation.
  bool involves(String? uid) => uid != null && participants.contains(uid);

  factory Message.fromMap(String docId, Map<String, dynamic> map) => Message(
        firestoreId: docId,
        id: (map['id'] as num?)?.toInt() ?? docId.hashCode,
        from: (map['from'] ?? 'LinkUp').toString(),
        to: (map['to'] ?? 'Client').toString(),
        subject: (map['subject'] ?? '(sans objet)').toString(),
        text: (map['text'] ?? '').toString(),
        createdBy: map['createdBy']?.toString(),
        fromUid: map['fromUid']?.toString(),
        toUid: map['toUid']?.toString(),
        participants: (map['participants'] as List<dynamic>? ?? const [])
            .map((e) => e.toString())
            .toList(),
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'from': from,
        'to': to,
        'subject': subject,
        'text': text,
        if (fromUid != null) 'fromUid': fromUid,
        if (toUid != null) 'toUid': toUid,
        if (participants.isNotEmpty) 'participants': participants,
      };
}
