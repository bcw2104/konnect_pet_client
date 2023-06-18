import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import Welcome from './screens/Welcome';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from './contexts/StoreContext';
import { RootStore } from './contexts/RootStore';
import { StatusBar } from 'expo-status-bar';
import GlobalModal from './components/elements/GlobalModal';
import Toast from 'react-native-toast-message';

const rootStore = new RootStore();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
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
      <ScrollView>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <StatusBar style='auto' />
          <Welcome></Welcome>
        </View>
      </ScrollView>
      <GlobalModal/>
      <Toast/>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: rootStore.systemStore.statusBarHeight,
    minHeight: rootStore.systemStore.winHeight - rootStore.systemStore.statusBarHeight,
  },
});
