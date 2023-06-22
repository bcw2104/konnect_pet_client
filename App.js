import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from './contexts/StoreContext';
import { RootStore } from './contexts/RootStore';
import { StatusBar } from 'expo-status-bar';
import GlobalModal from './components/elements/GlobalModal';
import Toast from 'react-native-toast-message';
import Navigation from './navigations/Navigation';
import { utils } from './utils/Utils';

const rootStore = new RootStore();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        const isLogin = await utils.checkLogin();
        rootStore.userStore.setLoginStatus(isLogin);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

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
        <StatusBar style='auto' />
        <Navigation/>
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
  
