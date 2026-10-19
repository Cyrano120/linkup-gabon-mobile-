import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';

import { db, easProjectId } from './firebase';

const CHANNEL_ID = 'linkup';

/** Affiche les notifications reçues quand l'app est au premier plan (SDK 58). */
export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Crée le canal Android (obligatoire pour le prompt de permission sur Android 13+). */
export async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'LinkUp Gabon',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#009E60',
  });
}

/** Notification locale (fonctionne dans Expo Go, sans serveur). */
export async function presentLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null,
  });
}

/**
 * Demande la permission, récupère le token Expo et l'enregistre dans Firestore
 * (collection `devices/{uid}`). Les notifications distantes nécessitent un
 * development build + un EAS projectId.
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) return null;

  await configureAndroidChannel();

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync();
    status = asked.status;
  }
  if (status !== 'granted') return null;

  const projectId =
    easProjectId ||
    Constants?.expoConfig?.extra?.eas?.projectId ||
    Constants?.easConfig?.projectId;

  let token: string | null = null;
  try {
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
      token = (await Notifications.getDevicePushTokenAsync()).data as string;
    }
  } catch (error) {
    console.warn('[notifications] token indisponible (development build requis)', error);
    return null;
  }

  if (token && db) {
    try {
      await setDoc(
        doc(db, 'devices', userId),
        {
          userId,
          token,
          platform: Platform.OS,
          deviceName: Device.deviceName ?? null,
          updatedAt: Date.now(),
        },
        { merge: true },
      );
    } catch (error) {
      console.warn('[notifications] enregistrement du device échoué', error);
    }
  }

  return token;
}
