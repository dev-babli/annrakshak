import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('⚠️ Push notification permission not granted');
        return;
      }

      // Get push token
      if (Device.isDevice) {
        this.expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('📱 Expo push token:', this.expoPushToken);
      } else {
        console.warn('⚠️ Must use physical device for push notifications');
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
        });

        await Notifications.setNotificationChannelAsync('spray-alerts', {
          name: 'Spray Alerts',
          description: 'Notifications for spray system events',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
        });

        await Notifications.setNotificationChannelAsync('disease-detection', {
          name: 'Disease Detection',
          description: 'Notifications for disease detection results',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
        });
      }

      console.log('✅ Notification service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
    }
  }

  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('❌ Failed to send local notification:', error);
    }
  }

  async sendSprayAlert(sprayTimeSeconds: number, plantType: string, diseaseType: string): Promise<void> {
    const notification: NotificationData = {
      title: '🌿 Spray System Activated',
      body: `Spraying ${plantType} for ${sprayTimeSeconds} seconds to treat ${diseaseType}`,
      data: {
        type: 'spray_alert',
        sprayTime: sprayTimeSeconds,
        plantType,
        diseaseType,
      },
    };

    await this.sendLocalNotification(notification);
  }

  async sendDiseaseDetected(plantType: string, diseaseType: string, confidence: number): Promise<void> {
    const notification: NotificationData = {
      title: '🚨 Disease Detected',
      body: `${diseaseType} detected in ${plantType} with ${Math.round(confidence * 100)}% confidence`,
      data: {
        type: 'disease_detected',
        plantType,
        diseaseType,
        confidence,
      },
    };

    await this.sendLocalNotification(notification);
  }

  async sendHealthyPlant(plantType: string, confidence: number): Promise<void> {
    const notification: NotificationData = {
      title: '✅ Plant is Healthy',
      body: `${plantType} appears healthy with ${Math.round(confidence * 100)}% confidence`,
      data: {
        type: 'healthy_plant',
        plantType,
        confidence,
      },
    };

    await this.sendLocalNotification(notification);
  }

  async sendSprayComplete(sprayTimeSeconds: number, success: boolean): Promise<void> {
    const notification: NotificationData = {
      title: success ? '✅ Spray Complete' : '❌ Spray Failed',
      body: success 
        ? `Spray completed successfully (${sprayTimeSeconds}s)`
        : `Spray operation failed after ${sprayTimeSeconds}s`,
      data: {
        type: 'spray_complete',
        sprayTime: sprayTimeSeconds,
        success,
      },
    };

    await this.sendLocalNotification(notification);
  }

  async sendOfflineMode(): Promise<void> {
    const notification: NotificationData = {
      title: '📴 Offline Mode',
      body: 'App is now running in offline mode. ML models will be used for detection.',
      data: {
        type: 'offline_mode',
      },
    };

    await this.sendLocalNotification(notification);
  }

  async sendOnlineMode(): Promise<void> {
    const notification: NotificationData = {
      title: '🌐 Online Mode',
      body: 'App is now online. Gemini API is available for enhanced detection.',
      data: {
        type: 'online_mode',
      },
    };

    await this.sendLocalNotification(notification);
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Add notification listener
  addNotificationListener(listener: (notification: Notifications.Notification) => void): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Add notification response listener (when user taps notification)
  addNotificationResponseListener(listener: (response: Notifications.NotificationResponse) => void): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}

export const notificationService = new NotificationService();

// Initialize notification service
export async function initializeNotifications(): Promise<void> {
  await notificationService.initialize();
}
