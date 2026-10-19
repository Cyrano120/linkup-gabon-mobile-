class ServiceRequest {
  const ServiceRequest({
    this.firestoreId,
    required this.id,
    required this.title,
    required this.category,
    required this.budget,
    required this.location,
    required this.urgency,
    required this.status,
    required this.client,
    required this.provider,
    this.candidates = const [],
    required this.description,
    this.createdBy,
  });

  final String? firestoreId;
  final int id;
  final String title;
  final String category;
  final int budget;
  final String location;
  final String urgency;
  final String status;
  final String client;
  final String provider;
  final List<String> candidates;
  final String description;
  final String? createdBy;

  factory ServiceRequest.fromMap(String docId, Map<String, dynamic> map) => ServiceRequest(
        firestoreId: docId,
        id: (map['id'] as num?)?.toInt() ?? docId.hashCode,
        title: (map['title'] ?? 'Mission').toString(),
        category: (map['category'] ?? 'Informatique').toString(),
        budget: (map['budget'] as num?)?.toInt() ?? 0,
        location: (map['location'] ?? 'Libreville').toString(),
        urgency: (map['urgency'] ?? 'Flexible').toString(),
        status: (map['status'] ?? 'Ouverte').toString(),
        client: (map['client'] ?? 'Client').toString(),
        provider: (map['provider'] ?? 'En attente').toString(),
        candidates: (map['candidates'] as List<dynamic>? ?? const [])
            .map((e) => e.toString())
            .toList(),
        description: (map['description'] ?? '').toString(),
        createdBy: map['createdBy']?.toString(),
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'title': title,
        'category': category,
        'budget': budget,
        'location': location,
        'urgency': urgency,
        'status': status,
        'client': client,
        'provider': provider,
        'candidates': candidates,
        'description': description,
      };
}
