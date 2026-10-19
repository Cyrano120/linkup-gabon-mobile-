import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataContext';
import { ToastProvider } from '../context/ToastContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { configureNotificationHandler } from '../lib/notifications';
import { colors, spacing } from '../theme';

configureNotificationHandler();

/** Ouvre l'écran ciblé quand l'utilisateur tape une notification (deep link). */
function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url as never);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) redirect(response.notification);

    const subscription = Notifications.addNotificationResponseReceivedListener((res) => {
      redirect(res.notification);
    });

    return () => subscription.remove();
  }, []);
}

function NotConfigured() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>LinkUp Gabon</Text>
      <Text style={styles.text}>
        Firebase n’est pas encore configuré.{'\n\n'}
        Copie <Text style={styles.code}>.env.example</Text> vers{' '}
        <Text style={styles.code}>.env</Text>, renseigne tes clés, puis relance l’app.
      </Text>
    </View>
  );
}

export default function RootLayout() {
  useNotificationObserver();

  if (!isFirebaseConfigured) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NotConfigured />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bgTop },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="provider/[id]" options={{ presentation: 'modal' }} />
              <Stack.Screen name="become" options={{ presentation: 'modal' }} />
            </Stack>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.bgTop },
  title: { color: colors.white, fontSize: 26, fontWeight: '900', marginBottom: spacing.lg },
  text: { color: '#CBD5E1', textAlign: 'center', lineHeight: 22 },
  code: { color: colors.yellow, fontWeight: '800' },
});
