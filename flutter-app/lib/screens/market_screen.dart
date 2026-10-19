import 'package:flutter/material.dart';
import 'package:provider/provider.dart' hide Provider;

import '../core/constants.dart';
import '../core/theme.dart';
import '../models/provider.dart';
import '../state/auth_controller.dart';
import '../state/data_controller.dart';
import '../utils/demo_data.dart';
import '../widgets/booking_sheet.dart';
import '../widgets/provider_card.dart';
import '../widgets/ui.dart';
import 'become_provider_screen.dart';
import 'provider_detail_screen.dart';

class MarketScreen extends StatefulWidget {
  const MarketScreen({super.key});

  @override
  State<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends State<MarketScreen> {
  final TextEditingController _search = TextEditingController();
  final TextEditingController _budget = TextEditingController();
  String _category = 'Toutes';
  String _area = 'Tous';
  bool _onlyAvailable = false;

  @override
  void dispose() {
    _search.dispose();
    _budget.dispose();
    super.dispose();
  }

  List<Provider> _filter(List<Provider> providers) {
    final needle = _search.text.trim().toLowerCase();
    final budget = int.tryParse(_budget.text.replaceAll(RegExp(r'\D'), '')) ?? 0;
    return providers.where((provider) {
      final haystack = [
        provider.name,
        provider.role,
        provider.headline,
        ...provider.skills,
      ].join(' ').toLowerCase();
      if (needle.isNotEmpty && !haystack.contains(needle)) return false;
      if (_category != 'Toutes' && provider.category != _category) return false;
      if (_area != 'Tous' && provider.location != _area) return false;
      if (budget > 0 && provider.price > budget) return false;
      if (_onlyAvailable && !provider.available) return false;
      return true;
    }).toList();
  }

  Future<void> _book(Provider provider) async {
    final data = context.read<DataController>();
    final client = context.read<AuthController>().displayName;
    await showBookingSheet(
      context,
      provider: provider,
      defaultClient: client,
      onSubmit: (input) async {
        await data.bookProvider(
          provider: provider,
          client: input.client,
          title: input.title,
          budget: input.budget,
          location: input.location,
          urgency: input.urgency,
          description: input.description,
        );
      },
    );
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Demande envoyée à ${provider.name}.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final data = context.watch<DataController>();
    final filtered = _filter(data.providers);

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.lg,
        AppSpacing.lg,
        AppSpacing.lg,
        AppSpacing.xxl,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'MARKETPLACE',
                      style: TextStyle(
                        color: GabonColors.yellow,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.4,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Trouve le bon profil',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 24,
                      ),
                    ),
                    SizedBox(height: AppSpacing.xs),
                    Text(
                      'Filtre par compétence, quartier et budget en FCFA, puis contacte directement.',
                      style: TextStyle(color: Color(0xCCFFFFFF), fontSize: 13, height: 1.45),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              AppButton(
                label: 'Prestataire',
                variant: AppButtonVariant.ghost,
                icon: Icons.person_add_alt,
                compact: true,
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const BecomeProviderScreen()),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Recherche
          TextField(
            controller: _search,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(color: GabonColors.ink, fontSize: 15),
            decoration: InputDecoration(
              hintText: 'Compétence, nom, besoin…',
              hintStyle: const TextStyle(color: Color(0xFF9AA3AF)),
              prefixIcon: const Icon(Icons.search, color: GabonColors.muted),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppRadii.md),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          const _FilterLabel('Catégorie'),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              Pill(
                label: 'Toutes',
                active: _category == 'Toutes',
                onTap: () => setState(() => _category = 'Toutes'),
              ),
              ...categories.map(
                (item) => Pill(
                  label: item,
                  active: _category == item,
                  onTap: () => setState(() => _category = item),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          const _FilterLabel('Quartier'),
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              Pill(
                label: 'Tous',
                active: _area == 'Tous',
                onTap: () => setState(() => _area = 'Tous'),
              ),
              ...localAreas.map(
                (item) => Pill(
                  label: item,
                  active: _area == item,
                  onTap: () => setState(() => _area = item),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Budget + disponibilité
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _budget,
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                  style: const TextStyle(color: GabonColors.ink, fontSize: 15),
                  decoration: InputDecoration(
                    hintText: 'Budget max (FCFA)',
                    hintStyle: const TextStyle(color: Color(0xFF9AA3AF)),
                    prefixIcon: const Icon(Icons.local_offer_outlined, color: GabonColors.muted),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadii.md),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Pill(
                label: _onlyAvailable ? 'Disponibles ✓' : 'Disponibles',
                active: _onlyAvailable,
                onTap: () => setState(() => _onlyAvailable = !_onlyAvailable),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          Row(
            children: [
              AppBadge(
                label: '${filtered.length} prestataire${filtered.length > 1 ? 's' : ''}',
                tone: BadgeTone.info,
                icon: Icons.people_outline,
              ),
              const SizedBox(width: AppSpacing.md),
              if (isDemoDataEnabled)
                Expanded(
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: AppButton(
                      label: 'Réinitialiser les données',
                      variant: AppButtonVariant.ghost,
                      icon: Icons.refresh,
                      compact: true,
                      onPressed: () async {
                        final messenger = ScaffoldMessenger.of(context);
                        try {
                          await data.resetDemoData();
                          if (!mounted) return;
                          messenger.showSnackBar(
                            const SnackBar(
                              content: Text('Données de démo réinitialisées.'),
                            ),
                          );
                        } catch (_) {
                          if (!mounted) return;
                          messenger.showSnackBar(
                            const SnackBar(
                              content: Text('Réinitialisation impossible.'),
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          const SectionHeader(kicker: 'Résultats', title: 'Profils correspondants.'),

          if (filtered.isEmpty)
            const EmptyStateBox(
              title: 'Aucun profil trouvé',
              text: 'Essaie un autre quartier, une autre catégorie ou retire le filtre de budget.',
            )
          else
            ...filtered.map(
              (provider) => ProviderCard(
                key: ValueKey(provider.firestoreId ?? provider.id.toString()),
                provider: provider,
                onOpen: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => ProviderDetailScreen(providerId: provider.id),
                  ),
                ),
                onBook: () => _book(provider),
              ),
            ),
        ],
      ),
    );
  }
}

class _FilterLabel extends StatelessWidget {
  const _FilterLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Text(
        text,
        style: const TextStyle(
          color: Color(0xBFFFFFFF),
          fontWeight: FontWeight.w800,
          fontSize: 12,
        ),
      ),
    );
  }
}
