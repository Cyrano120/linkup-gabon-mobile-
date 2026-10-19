import Constants from 'expo-constants';
import * as Device from 'expo-device';
import type { Notification, NotificationResponse } from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';

import { db, easProjectId } from './firebase';

/** Type du module, résolu à la compilation uniquement (aucun import runtime). */
type NotificationsApi = typeof import('expo-notifications');

const CHANNEL_ID = 'linkup';

let api: NotificationsApi | null = null;
let resolutionDone = false;

/**
 * Charge `expo-notifications` à la demande, sans jamais faire planter l'app.
 *
 * Pourquoi ce détour : au chargement, le paquet réclame immédiatement ses
 * modules natifs. Si l'un d'eux est absent — c'est le cas de
 * `ExpoTopicSubscriptionModule` dans Expo Go, où les notifications distantes
 * ne sont plus supportées sur Android depuis le SDK 53 — l'import lève une
 * exception. Comme `_layout.tsx` importe ce fichier, l'exception faisait
 * tomber *toute* l'application (et expo-router signalait ensuite, en cascade,
 * que chaque route n'avait « pas d'export par défaut »).
 *
 * En isolant le chargement, l'app reste pleinement utilisable : les
 * notifications deviennent simplement des no-op là où elles ne sont pas
 * supportées, et redeviennent complètes dans un development build.
 */
export function getNotifications(): NotificationsApi | null {
  if (resolutionDone) return api;
  resolutionDone = true;

  if (Platform.OS === 'web') return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    api = require('expo-notifications') as NotificationsApi;
  } catch (error) {
    console.warn(
      '[notifications] module indisponible dans cet environnement. ' +
        'C’est normal dans Expo Go : les notifications distantes y sont ' +
        'désactivées depuis le SDK 53. Utilise un development build.',
      error,
    );
    api = null;
  }

  return api;
}

/** `true` si les notifications sont réellement utilisables ici. */
export function isNotificationsAvailable(): boolean {
  return getNotifications() !== null;
}

/** Affiche les notifications reçues quand l'app est au premier plan. */
export function configureNotificationHandler(): void {
  const notifications = getNotifications();
  if (!notifications) return;

  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Canal Android (obligatoire pour le prompt de permission sur Android 13+). */
export async function configureAndroidChannel(): Promise<void> {
  const notifications = getNotifications();
  if (!notifications || Platform.OS !== 'android') return;

  await notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'LinkUp Gabon',
    importance: notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#009E60',
  });
}

/** Notification locale. */
export async function presentLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  const notifications = getNotifications();
  if (!notifications) return;

  await notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null,
  });
}

/** Notification sur laquelle l'utilisateur a tapé avant l'ouverture de l'app. */
export function getLastNotificationResponse(): NotificationResponse | null {
  return getNotifications()?.getLastNotificationResponse() ?? null;
}

/** Écoute les taps sur les notifications (retourne un désabonnement sûr). */
export function addNotificationResponseReceivedListener(
  listener: (response: NotificationResponse) => void,
): { remove: () => void } {
  const notifications = getNotifications();
  if (!notifications) return { remove: () => {} };
  return notifications.addNotificationResponseReceivedListener(listener);
}

export type { Notification };

/**
 * Demande la permission, récupère le token push et l'enregistre dans Firestore
 * (collection `devices/{uid}`). Nécessite un development build + un projectId
 * EAS : dans Expo Go, la fonction sort proprement sans rien tenter.
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  const notifications = getNotifications();
  if (!notifications) return null;
  if (!Device.isDevice) return null;

  await configureAndroidChannel();

  const current = await notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const asked = await notifications.requestPermissionsAsync();
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
      token = (await notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
      token = (await notifications.getDevicePushTokenAsync()).data as string;
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
