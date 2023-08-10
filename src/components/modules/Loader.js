import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import {COLORS} from '../../commons/colors';

const { width: WIN_WIDTH, height: WIN_HEIGHT } = Dimensions.get('window');

const Loader = () => {
  const { systemStore } = useStores();
  return (
    <>
      {systemStore.isLoading && (
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={COLORS.dark}
            animating={systemStore.isLoading}
          />
        </View>
      )}
    </>
  );
};

export default observer(Loader);

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    width: WIN_WIDTH,
    height: '100%',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.semiTransparent,
  },
});
