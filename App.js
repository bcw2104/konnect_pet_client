import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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

const rootStore = new RootStore();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
    'Roboto-Thin': require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
  });
  useBackPressHandler();

  useEffect(() => {
    if (!fontsLoaded) return;
    async function prepare() {
      try {
        initFacebook();
        await initDeviceInfo();
        await rootStore.userStore.initUserInfo();
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: "error1" + e,
        });
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
    try {
      const deviceToken = await registerForPushNotificationsAsync();
      rootStore.userStore.setDeviceInfo(
        Device.modelName,
        Device.osName,
        Device.osVersion,
        deviceToken
      );
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: "error2" + e,
      });

      throw e;
    }
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      Toast.show({
        type: 'success',
        text1: token,
      });
    } else {
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <StoreProvider value={rootStore}>
      <View onLayout={onLayoutRootView} style={styles.container}>
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
