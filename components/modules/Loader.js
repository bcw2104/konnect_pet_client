import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import colors from '../../commons/colors';

const { width: WIN_WIDTH, height: WIN_HEIGHT } = Dimensions.get('window');

const Loader = () => {
  const { commonStore } = useStores();
  return (
    <>
      {commonStore.isLoading && (
        <View style={styles.container}>
          <ActivityIndicator
            size='large'
            color={colors.dark}
            animating={commonStore.isLoading}
          />
        </View>
      )}
    </>
  );
};

export default observer(Loader);

const styles = StyleSheet.create({
  container: {
    zIndex:9999,
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
  },
});
