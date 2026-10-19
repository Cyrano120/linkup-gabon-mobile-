class Review {
  const Review({required this.client, required this.rating, required this.text});

  final String client;
  final int rating;
  final String text;

  factory Review.fromMap(Map<String, dynamic> map) => Review(
        client: (map['client'] ?? 'Client').toString(),
        rating: (map['rating'] as num?)?.toInt() ?? 5,
        text: (map['text'] ?? '').toString(),
      );

  Map<String, dynamic> toMap() => {'client': client, 'rating': rating, 'text': text};
}

class Provider {
  const Provider({
    this.firestoreId,
    required this.id,
    required this.name,
    required this.role,
    required this.category,
    required this.rating,
    required this.missions,
    required this.price,
    required this.location,
    required this.available,
    required this.image,
    required this.cover,
    required this.responseTime,
    required this.successRate,
    required this.headline,
    required this.bio,
    this.gallery = const [],
    this.reviews = const [],
    this.skills = const [],
    this.createdBy,
  });

  final String? firestoreId;
  final int id;
  final String name;
  final String role;
  final String category;
  final double rating;
  final int missions;
  final int price;
  final String location;
  final bool available;
  final String image;
  final String cover;
  final String responseTime;
  final int successRate;
  final String headline;
  final String bio;
  final List<String> gallery;
  final List<Review> reviews;
  final List<String> skills;
  final String? createdBy;

  factory Provider.fromMap(String id, Map<String, dynamic> map) => Provider(
        firestoreId: id,
        id: (map['id'] as num?)?.toInt() ?? id.hashCode,
        name: (map['name'] ?? 'Prestataire').toString(),
        role: (map['role'] ?? '').toString(),
        category: (map['category'] ?? 'Informatique').toString(),
        rating: (map['rating'] as num?)?.toDouble() ?? 4.5,
        missions: (map['missions'] as num?)?.toInt() ?? 0,
        price: (map['price'] as num?)?.toInt() ?? 0,
        location: (map['location'] ?? 'Libreville').toString(),
        available: map['available'] as bool? ?? true,
        image: (map['image'] ?? '').toString(),
        cover: (map['cover'] ?? '').toString(),
        responseTime: (map['responseTime'] ?? '30 min').toString(),
        successRate: (map['successRate'] as num?)?.toInt() ?? 90,
        headline: (map['headline'] ?? '').toString(),
        bio: (map['bio'] ?? '').toString(),
        gallery: (map['gallery'] as List<dynamic>? ?? const [])
            .map((e) => e.toString())
            .toList(),
        reviews: (map['reviews'] as List<dynamic>? ?? const [])
            .map((e) => Review.fromMap(Map<String, dynamic>.from(e as Map)))
            .toList(),
        skills:
            (map['skills'] as List<dynamic>? ?? const []).map((e) => e.toString()).toList(),
        createdBy: map['createdBy']?.toString(),
      );

  Map<String, dynamic> toMap() => {
        'id': id,
        'name': name,
        'role': role,
        'category': category,
        'rating': rating,
        'missions': missions,
        'price': price,
        'location': location,
        'available': available,
        'image': image,
        'cover': cover,
        'responseTime': responseTime,
        'successRate': successRate,
        'headline': headline,
        'bio': bio,
        'gallery': gallery,
        'reviews': reviews.map((r) => r.toMap()).toList(),
        'skills': skills,
      };
}
