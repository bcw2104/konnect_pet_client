import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from './contexts/StoreContext';
import { RootStore } from './contexts/RootStore';
import { StatusBar } from 'expo-status-bar';
import GlobalModal from './components/elements/GlobalModal';
import Toast from 'react-native-toast-message';
import Navigation from './navigations/Navigation';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import { useFonts } from 'expo-font';
import COLORS from './commons/colors';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useBackPressHandler } from './hooks/useBackPressHandler';
import Loader from './components/modules/Loader';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Linking } from 'react-native';
import { Navigator } from './navigations/Navigator';
import { DEEP_LINK_PREFIX } from './commons/constants';

const rootStore = new RootStore();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
    'Roboto-Thin': require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
  });

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    Linking.addEventListener('url', (event) => {
      if (event.url == DEEP_LINK_PREFIX.DEFAULT + 'walking') {
        Navigator.navigate(params,'home_tabs', "walking_tab","walking");
      }
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    async function prepare() {
      try {
        await initFacebook();
        await initDeviceInfo();
        await rootStore.userStore.initUserInfo();
      } catch (e) {
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  const initFacebook = async () => {
    const { status } = await requestTrackingPermissionsAsync();
    Settings.initializeSDK();
    if (status === 'granted') {
      await Settings.setAdvertiserTrackingEnabled(true);
    }
  };

  const initDeviceInfo = async () => {
    const deviceToken = await registerForPushNotificationsAsync();
    rootStore.userStore.setDeviceInfo(
      Device.modelName,
      Device.osName,
      Device.osVersion,
      deviceToken
    );
  };

  const registerForPushNotificationsAsync = async () => {
    let token = null;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //Failed to get push token for push notification!
        return;
      }
      try {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
          })
        ).data;
      } catch (e) {
        token = null;
      }
    } else {
      //Must use physical device for Push Notifications
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <StoreProvider value={rootStore}>
      <View style={styles.container}>
        <StatusBar style='dark' />
        <Navigation />
      </View>
      <Loader />
      <GlobalModal />
      <Toast />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
