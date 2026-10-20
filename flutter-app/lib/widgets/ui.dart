import 'package:flutter/material.dart';

import '../core/theme.dart';

/// Fond dégradé + SafeArea : base visuelle de tous les écrans.
class GabonBackground extends StatelessWidget {
  const GabonBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: heroGradient),
      child: SafeArea(child: child),
    );
  }
}

/// Carte claire translucide, effet « verre » sur fond sombre.
class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.lg),
    this.margin,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.96),
        borderRadius: BorderRadius.circular(AppRadii.lg),
        border: Border.all(color: Colors.white.withValues(alpha: 0.35)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x2E000000),
            blurRadius: 18,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: child,
    );
  }
}

enum AppButtonVariant { primary, yellow, ghost, outline, success, danger }

class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.icon,
    this.loading = false,
    this.fullWidth = false,
    this.compact = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final IconData? icon;
  final bool loading;
  final bool fullWidth;
  final bool compact;

  ({Color background, Color foreground, Color? border}) get _style {
    switch (variant) {
      case AppButtonVariant.primary:
        return (background: GabonColors.green, foreground: Colors.white, border: null);
      case AppButtonVariant.yellow:
        return (background: GabonColors.yellow, foreground: GabonColors.greenDark, border: null);
      case AppButtonVariant.ghost:
        return (
          background: Colors.white.withValues(alpha: 0.14),
          foreground: Colors.white,
          border: Colors.white.withValues(alpha: 0.22),
        );
      case AppButtonVariant.outline:
        return (background: Colors.transparent, foreground: GabonColors.green, border: GabonColors.green);
      case AppButtonVariant.success:
        return (background: GabonColors.successBg, foreground: GabonColors.success, border: const Color(0xFFBDEBD2));
      case AppButtonVariant.danger:
        return (background: GabonColors.dangerBg, foreground: GabonColors.danger, border: const Color(0xFFFECACA));
    }
  }

  @override
  Widget build(BuildContext context) {
    final style = _style;
    final inactive = loading || onPressed == null;

    return Opacity(
      opacity: inactive ? 0.6 : 1,
      child: Material(
        color: style.background,
        borderRadius: BorderRadius.circular(compact ? AppRadii.sm : AppRadii.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(compact ? AppRadii.sm : AppRadii.md),
          onTap: inactive ? null : onPressed,
          child: Container(
            width: fullWidth ? double.infinity : null,
            height: compact ? 38 : 48,
            padding: EdgeInsets.symmetric(horizontal: compact ? AppSpacing.md : AppSpacing.lg),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(compact ? AppRadii.sm : AppRadii.md),
              border: style.border != null ? Border.all(color: style.border!) : null,
            ),
            child: Row(
              mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (loading)
                  SizedBox(
                    height: compact ? 14 : 18,
                    width: compact ? 14 : 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: style.foreground),
                  )
                else ...[
                  if (icon != null) Icon(icon, size: compact ? 15 : 18, color: style.foreground),
                  if (icon != null) const SizedBox(width: AppSpacing.sm),
                  Text(
                    label,
                    style: TextStyle(
                      color: style.foreground,
                      fontWeight: FontWeight.w800,
                      fontSize: compact ? 13 : 15,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    required this.label,
    required this.controller,
    this.hint,
    this.keyboardType,
    this.obscure = false,
    this.maxLines = 1,
    this.textCapitalization = TextCapitalization.none,
  });

  final String label;
  final TextEditingController controller;
  final String? hint;
  final TextInputType? keyboardType;
  final bool obscure;
  final int maxLines;
  final TextCapitalization textCapitalization;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFD1D5DB),
            fontWeight: FontWeight.w700,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscure,
          maxLines: obscure ? 1 : maxLines,
          textCapitalization: textCapitalization,
          style: const TextStyle(color: GabonColors.ink, fontSize: 15),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF9AA3AF)),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.md,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.line),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.line),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.green, width: 1.5),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
      ],
    );
  }
}

/// Liste déroulante au style d'`AppTextField`.
///
/// On utilise `DropdownButton` dans un `InputDecorator` plutôt que
/// `DropdownButtonFormField` : le premier garde une API stable et permet de
/// contrôler la valeur depuis le parent, sans dépendre du cycle de vie du champ.
class AppDropdown<T> extends StatelessWidget {
  const AppDropdown({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    required this.labelOf,
    this.hint,
    this.isEnabled = true,
  });

  final String label;
  final T? value;
  final List<T> items;
  final ValueChanged<T?> onChanged;
  final String Function(T item) labelOf;
  final String? hint;
  final bool isEnabled;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFD1D5DB),
            fontWeight: FontWeight.w700,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        InputDecorator(
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.xs,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.line),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.line),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.md),
              borderSide: const BorderSide(color: GabonColors.green, width: 1.5),
            ),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              isExpanded: true,
              isDense: true,
              hint: hint == null
                  ? null
                  : Text(
                      hint!,
                      style: const TextStyle(color: Color(0xFF9AA3AF), fontSize: 15),
                    ),
              icon: const Icon(Icons.expand_more, color: GabonColors.muted),
              style: const TextStyle(color: GabonColors.ink, fontSize: 15),
              items: items
                  .map(
                    (item) => DropdownMenuItem<T>(
                      value: item,
                      child: Text(
                        labelOf(item),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  )
                  .toList(),
              onChanged: isEnabled ? onChanged : null,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
      ],
    );
  }
}

/// Puce sélectionnable (filtres, catégories, statuts).
class Pill extends StatelessWidget {
  const Pill({
    super.key,
    required this.label,
    this.active = false,
    this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? GabonColors.green : Colors.white.withValues(alpha: 0.9),
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: active ? GabonColors.green : Colors.black.withValues(alpha: 0.06),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: active ? Colors.white : GabonColors.ink,
              fontWeight: FontWeight.w800,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }
}

enum BadgeTone { success, warning, info, neutral }

class AppBadge extends StatelessWidget {
  const AppBadge({super.key, required this.label, this.tone = BadgeTone.neutral, this.icon});

  final String label;
  final BadgeTone tone;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    late final Color background;
    late final Color foreground;
    switch (tone) {
      case BadgeTone.success:
        background = GabonColors.successBg;
        foreground = GabonColors.success;
      case BadgeTone.warning:
        background = GabonColors.warningBg;
        foreground = GabonColors.warning;
      case BadgeTone.info:
        background = GabonColors.infoBg;
        foreground = GabonColors.info;
      case BadgeTone.neutral:
        background = GabonColors.neutralBg;
        foreground = GabonColors.neutral;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 4),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: foreground),
            const SizedBox(width: 3),
          ],
          Text(
            label,
            style: TextStyle(color: foreground, fontWeight: FontWeight.w800, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({super.key, required this.title, this.kicker});

  final String title;
  final String? kicker;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (kicker != null)
            Text(
              kicker!.toUpperCase(),
              style: const TextStyle(
                color: GabonColors.yellow,
                fontSize: 11,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.4,
              ),
            ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.w900,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}

class EmptyStateBox extends StatelessWidget {
  const EmptyStateBox({super.key, required this.title, required this.text});

  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      child: Column(
        children: [
          const Icon(Icons.search_off, color: GabonColors.muted, size: 30),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: GabonColors.ink,
              fontWeight: FontWeight.w800,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            text,
            textAlign: TextAlign.center,
            style: const TextStyle(color: GabonColors.muted, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class AppAvatar extends StatelessWidget {
  const AppAvatar({super.key, required this.name, this.size = 44});

  final String name;
  final double size;

  @override
  Widget build(BuildContext context) {
    final letter = name.trim().isEmpty ? '?' : name.trim()[0].toUpperCase();
    return Container(
      height: size,
      width: size,
      decoration: const BoxDecoration(
        gradient: ctaGradient,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        letter,
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w900,
          fontSize: size * 0.4,
        ),
      ),
    );
  }
}

/// Encadré d'erreur réutilisable.
class ErrorNote extends StatelessWidget {
  const ErrorNote({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: GabonColors.dangerBg,
        borderRadius: BorderRadius.circular(AppRadii.md),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, size: 16, color: GabonColors.danger),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: GabonColors.danger,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Badge de statut d'une mission.
AppBadge statusBadge(String status) {
  switch (status) {
    case 'Ouverte':
      return const AppBadge(label: 'Ouverte', tone: BadgeTone.warning, icon: Icons.radio_button_checked);
    case 'En discussion':
      return const AppBadge(label: 'En discussion', tone: BadgeTone.info, icon: Icons.chat_bubble_outline);
    case 'Confirmée':
      return const AppBadge(label: 'Confirmée', tone: BadgeTone.success, icon: Icons.check_circle_outline);
    default:
      return const AppBadge(label: 'Terminée');
  }
}

/// Logo LinkUp réutilisable (carré dégradé drapeau).
class AppLogo extends StatelessWidget {
  const AppLogo({super.key, this.size = 68});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: size,
      width: size,
      decoration: BoxDecoration(
        gradient: gabonGradient,
        borderRadius: BorderRadius.circular(AppRadii.lg),
        boxShadow: const [
          BoxShadow(color: Color(0x2E000000), blurRadius: 18, offset: Offset(0, 10)),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        'LU',
        style: TextStyle(
          color: GabonColors.greenDark,
          fontWeight: FontWeight.w900,
          fontSize: size * 0.32,
        ),
      ),
    );
  }
}
