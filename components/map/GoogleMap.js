import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapView, {PROVIDER_GOOGLE,PROVIDER_DEFAULT} from 'react-native-maps';
import { useStores } from '../../contexts/StoreContext';

const GoogleMap = () => {
  const {systemStore} = useStores();

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        width={systemStore.winWidth}
        height={systemStore.winHeight}
      />
    </View>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {

  },
});
