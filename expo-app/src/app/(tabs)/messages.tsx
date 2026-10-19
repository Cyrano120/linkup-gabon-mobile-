import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Btn, Card, Chip, EmptyState, Field, Screen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { colors, radius, spacing } from '../../theme';

type Box = 'Tous' | 'Reçus' | 'Envoyés';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const toast = useToast();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Client';

  const [box, setBox] = useState<Box>('Tous');
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (box === 'Reçus') return messages.filter((m) => m.to === displayName);
    if (box === 'Envoyés') return messages.filter((m) => m.from === displayName);
    return messages;
  }, [messages, box, displayName]);

  async function submit() {
    setError('');
    if (!to || !subject || !text) {
      setError('Renseigne le destinataire, l’objet et le message.');
      return;
    }
    setLoading(true);
    try {
      await sendMessage({ from: displayName, to, subject, text });
      toast.show('Message envoyé.');
      setTo('');
      setSubject('');
      setText('');
      setComposing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>MESSAGERIE</Text>
          <Text style={styles.title}>Tes conversations</Text>
          <Text style={styles.subtitle}>
            Échange les détails d’une mission : lieu exact, horaire et mode de paiement.
          </Text>
        </View>
        <Btn
          compact
          variant={composing ? 'danger' : 'primary'}
          icon={composing ? 'close' : 'create-outline'}
          label={composing ? 'Fermer' : 'Écrire'}
          onPress={() => setComposing((v) => !v)}
        />
      </View>

      {composing ? (
        <Card style={{ marginBottom: spacing.lg }}>
          {error ? (
            <View style={styles.error}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <Field label="Destinataire" value={to} onChangeText={setTo} placeholder="Nom du prestataire" />
          <Field label="Objet" value={subject} onChangeText={setSubject} placeholder="Ex : Mission depannage PC" />
          <Field
            label="Message"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            style={styles.textarea}
            placeholder="Détaille ta demande…"
          />
          <Btn label="Envoyer" icon="send" fullWidth loading={loading} onPress={submit} />
        </Card>
      ) : null}

      <View style={styles.boxRow}>
        {(['Tous', 'Reçus', 'Envoyés'] as Box[]).map((item) => (
          <Chip key={item} label={item} active={box === item} onPress={() => setBox(item)} />
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun message"
          text="Écris à un prestataire ou attends une réponse à ta mission."
        />
      ) : (
        filtered.map((message) => {
          const isIncoming = message.to === displayName;
          return (
            <Card key={message._firestoreId ?? message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Avatar name={message.from} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject} numberOfLines={1}>
                    {message.subject}
                  </Text>
                  <Text style={styles.route} numberOfLines={1}>
                    {message.from} → {message.to}
                  </Text>
                </View>
                <Badge
                  label={isIncoming ? 'Reçu' : 'Envoyé'}
                  tone={isIncoming ? 'info' : 'neutral'}
                  icon={isIncoming ? 'arrow-down' : 'arrow-up'}
                />
              </View>
              <Text style={styles.body}>{message.text}</Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  kicker: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.white, fontWeight: '900', fontSize: 24, marginTop: 2 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: spacing.xs, lineHeight: 19 },
  boxRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  messageCard: { marginBottom: spacing.md },
  messageHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  subject: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  route: { color: colors.muted, fontSize: 12, marginTop: 2 },
  body: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  textarea: { minHeight: 96, textAlignVertical: 'top', paddingTop: spacing.md },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: { color: colors.danger, flex: 1, fontSize: 13, fontWeight: '600' },
});
