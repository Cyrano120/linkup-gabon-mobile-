import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, heroGradient, radius, shadow, spacing } from '../theme';

/* -------------------------------------------------------------------------- */
/*  Layout                                                                    */
/* -------------------------------------------------------------------------- */

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, padded = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const inner = (
    <View style={[padded && styles.padded, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={heroGradient} style={styles.screen}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + 96,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: insets.top }}>{inner}</View>
      )}
    </LinearGradient>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({
  kicker,
  title,
  light = true,
}: {
  kicker?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {kicker ? <Text style={styles.kicker}>{kicker.toUpperCase()}</Text> : null}
      <Text style={[styles.sectionTitle, { color: light ? colors.white : colors.ink }]}>{title}</Text>
    </View>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

/* -------------------------------------------------------------------------- */
/*  Buttons                                                                   */
/* -------------------------------------------------------------------------- */

type BtnVariant = 'primary' | 'yellow' | 'ghost' | 'outline' | 'success' | 'danger';

interface BtnProps {
  label: string;
  onPress?: () => void;
  variant?: BtnVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
}

const variantStyles: Record<BtnVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.greenAction, fg: colors.white },
  yellow: { bg: colors.yellow, fg: '#1B3A1E' },
  success: { bg: '#E7F8EE', fg: colors.green, border: '#BDEBD2' },
  ghost: { bg: 'rgba(255,255,255,0.14)', fg: colors.white, border: colors.border },
  outline: { bg: 'transparent', fg: colors.green, border: colors.green },
  danger: { bg: colors.dangerBg, fg: colors.danger, border: '#FECACA' },
};

export function Btn({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  fullWidth,
  compact,
}: BtnProps) {
  const style = variantStyles[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={inactive ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        compact && styles.btnCompact,
        fullWidth && { alignSelf: 'stretch' },
        {
          backgroundColor: style.bg,
          borderColor: style.border ?? 'transparent',
          borderWidth: style.border ? 1 : 0,
          opacity: inactive ? 0.55 : pressed ? 0.88 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={style.fg} size="small" />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={compact ? 15 : 18} color={style.fg} /> : null}
          <Text style={[styles.btnLabel, { color: style.fg, fontSize: compact ? 13 : 15 }]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form fields                                                               */
/* -------------------------------------------------------------------------- */

interface FieldProps extends TextInputProps {
  label: string;
}

export function Field({ label, style, ...props }: FieldProps) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#9AA3AF"
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
      ]}
    >
      <Text style={[styles.chipText, { color: active ? colors.white : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({
  label,
  tone = 'neutral',
  icon,
}: {
  label: string;
  tone?: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const tones = {
    success: { bg: colors.successBg, fg: colors.success },
    warning: { bg: colors.warningBg, fg: colors.warning },
    info: { bg: '#EFF6FF', fg: colors.blue },
    neutral: { bg: '#F3F4F6', fg: colors.muted },
    danger: { bg: colors.dangerBg, fg: colors.danger },
  } as const;
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {icon ? <Ionicons name={icon} size={12} color={t.fg} /> : null}
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
      <Ionicons name="search-outline" size={30} color={colors.muted} />
      <Text style={[styles.emptyTitle]}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </Card>
  );
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <LinearGradient
      colors={[colors.green, colors.blue]}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.white, fontWeight: '900', fontSize: size * 0.4 }}>{letter}</Text>
    </LinearGradient>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    ...shadow.card,
  },

  kicker: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: spacing.xs,
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', lineHeight: 28 },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  btnCompact: { minHeight: 38, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  btnLabel: { fontWeight: '800' },

  fieldLabel: { color: '#D1D5DB', fontWeight: '700', fontSize: 12, marginBottom: spacing.xs },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.line,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.06)' },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontWeight: '800', fontSize: 13 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 11, fontWeight: '800' },

  emptyTitle: { color: colors.ink, fontWeight: '800', fontSize: 16, marginTop: spacing.md },
  emptyText: { color: colors.muted, textAlign: 'center', marginTop: spacing.xs, fontSize: 13 },
});
