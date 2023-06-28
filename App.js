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

const rootStore = new RootStore();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    initFacebook();

    async function prepare() {
      try {
        const isLogin = await checkLogin();

        if (isLogin) {
          rootStore.userStore.initUserInfo();
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const initFacebook = async () => {
    const { status } = await requestTrackingPermissionsAsync();
    Settings.initializeSDK();
    if (status === 'granted') {
      await Settings.setAdvertiserTrackingEnabled(true);
    }
  };

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
    flex: 1,
    backgroundColor: '#fff',
  },
});
