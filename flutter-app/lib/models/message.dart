class Message {
  const Message({
    this.firestoreId,
    required this.id,
    required this.from,
    required this.to,
    required this.subject,
    required this.text,
    this.createdBy,
  });

  final String? firestoreId;
  final int id;
  final String from;
  final String to;
  final String subject;
  final String text;
  final String? createdBy;

  factory Message.fromMap(String docId, Map<String, dynamic> map) => Message(
        firestoreId: docId,
        id: (map['id'] as num?)?.toInt() ?? docId.hashCode,
        from: (map['from'] ?? 'LinkUp').toString(),
        to: (map['to'] ?? 'Client').toString(),
        subject: (map['subject'] ?? '(sans objet)').toString(),
        text: (map['text'] ?? '').toString(),
        createdBy: map['createdBy']?.toString(),
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'from': from,
        'to': to,
        'subject': subject,
        'text': text,
      };
}
