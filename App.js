import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from './contexts/StoreContext';
import { RootStore } from './contexts/RootStore';
import { StatusBar } from 'expo-status-bar';
import GlobalModal from './components/elements/GlobalModal';
import Toast from 'react-native-toast-message';
import Navigation from './navigations/Navigation';
import { asyncStorage } from './storage/Storage';
import serviceApis from './utils/ServiceApis';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import { useFonts } from 'expo-font';
import colors from './commons/colors';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useBackPressHandler } from './hooks/useBackPressHandler';

const rootStore = new RootStore();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Robato': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
  });
  useBackPressHandler();

  useEffect(() => {
    if(!fontsLoaded) return;
    async function prepare() {
      try {
        initFacebook();
        await initDeviceInfo();
        const isLogin = await checkLogin();

        if (isLogin) {
          await rootStore.userStore.initUserInfo();
        }
      } catch (e) {

      } finally {
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
    rootStore.userStore.setDeviceInfo(Device.modelName,Device.osName,
      Device.osVersion,deviceToken);
  }

  const registerForPushNotificationsAsync = async () => {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //Failed to get push token for push notification!
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      //Must use physical device for Push Notifications
    }
  
    return token;
  }

  const checkLogin = async () => {
    const accessToken = await asyncStorage.getItem('access_token');
    const accessTokenExpireAt = await asyncStorage.getItem(
      'access_token_expire_at'
    );
    const refreshToken = await asyncStorage.getItem('refresh_token');
    const refreshTokenExpireAt = await asyncStorage.getItem(
      'refresh_token_expire_at'
    );

    //강제 로그인
    if (
      !refreshToken ||
      !refreshTokenExpireAt ||
      Date.now() + 1000 * 60 * 60 * 24 > refreshTokenExpireAt
    ) {
      await asyncStorage.resetToken();
      return false;
    } else if (
      !accessToken ||
      !accessTokenExpireAt ||
      Date.now() + 1000 * 60 * 10 > accessTokenExpireAt
    ) {
      const response = await serviceApis.tokenRefresh(
        accessToken,
        refreshToken
      );

      if (response.rsp_code == '1000') {
        asyncStorage.setItem('access_token', response.result.accessToken);
        asyncStorage.setItem(
          'access_token_expire_at',
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem('refresh_token', response.result.refreshToken);
        asyncStorage.setItem(
          'refresh_token_expire_at',
          response.result.refreshTokenExpireAt
        );

        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
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
      <GlobalModal />
      <Toast />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
