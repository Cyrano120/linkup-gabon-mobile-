/// Mission publiée par un client.
///
/// Les champs d'affichage (`client`, `provider`, `candidates`) contiennent des
/// **noms**. Les champs `*Uid` portent l'identité réelle et servent au contrôle
/// d'accès Firestore :
/// - `clientUid` : auteur de la mission, immuable ;
/// - `providerUid` : prestataire retenu, autorisé à faire évoluer la mission ;
/// - `candidateUids` : candidats positionnés, autorisés à modifier la mission.
///
/// `candidates` et `candidateUids` sont maintenus **en parallèle** : même ordre,
/// même longueur. L'index d'un nom dans `candidates` donne son UID dans
/// `candidateUids`.
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
    this.clientUid,
    this.providerUid,
    this.candidateUids = const [],
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

  /// Auteur du document (injecté par le service, jamais saisi).
  final String? createdBy;
  final String? clientUid;
  final String? providerUid;
  final List<String> candidateUids;

  /// UID du candidat correspondant à [providerName], si connu.
  String? uidForCandidate(String providerName) {
    final index = candidates.indexOf(providerName);
    if (index < 0 || index >= candidateUids.length) return null;
    return candidateUids[index];
  }

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
        clientUid: map['clientUid']?.toString(),
        providerUid: map['providerUid']?.toString(),
        candidateUids: (map['candidateUids'] as List<dynamic>? ?? const [])
            .map((e) => e.toString())
            .toList(),
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
        if (clientUid != null) 'clientUid': clientUid,
        if (providerUid != null) 'providerUid': providerUid,
        'candidateUids': candidateUids,
      };
}
