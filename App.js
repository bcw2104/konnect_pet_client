import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from './src/contexts/StoreContext';
import { RootStore } from './src/contexts/RootStore';
import { StatusBar } from 'expo-status-bar';
import GlobalModal from './src/components/elements/GlobalModal';
import Toast from 'react-native-toast-message';
import Navigation from './src/navigations/Navigation';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import { useFonts } from 'expo-font';
import { COLORS } from './src/commons/colors';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Loader from './src/components/modules/Loader';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Linking } from 'react-native';
import { Navigator } from './src/navigations/Navigator';
import { DEEP_LINK_PREFIX } from './src/commons/constants';
import { serviceApis } from './src/utils/ServiceApis';
import moment from 'moment';

const rootStore = new RootStore();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'NSR-Regular': require('./assets/fonts/nanum/NSR-Regular.ttf'),
    'NSR-Bold': require('./assets/fonts/nanum/NSR-Bold.ttf'),
    'NSR-Light': require('./assets/fonts/nanum/NSR-Light.ttf'),
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
      }
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    async function prepare() {
      let versionCheck = true;
      try {
        await initFacebook();
        await initDeviceInfo();
        await initAppInfo();
        await rootStore.userStore.initUserInfo();
        versionCheck = checkAppVersion();
      } catch (e) {
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!versionCheck) {
          rootStore.modalStore.openOneButtonModal(
            'A new version has been released.\nPlease update the app.',
            'Confirm',
            () => {}
          );
        } else {
          await SplashScreen.hideAsync();
          setAppIsReady(true);
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  const initAppInfo = async () => {
    try {
      const currentVersion = Constants.expoConfig.version;
      const response = await serviceApis.getAppInfo(currentVersion);
      rootStore.systemStore.initAppInfo(response.result);
    } catch (err) {}
  };

  const checkAppVersion = () => {
    if (!rootStore.systemStore.appVersion) {
      return false;
    }
    if (!rootStore.systemStore.lastestForcedAppVersion) {
      return true;
    }
    return moment(rootStore.systemStore.appVersion.releasedDate).isSameOrAfter(
      moment(rootStore.systemStore.lastestForcedAppVersion.releasedDate)
    );
  };

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
    return (
      <StoreProvider value={rootStore}>
        <GlobalModal />
      </StoreProvider>
    );
  }

  return (
    <StoreProvider value={rootStore}>
      <View style={styles.container}>
        <StatusBar style="dark" />
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
