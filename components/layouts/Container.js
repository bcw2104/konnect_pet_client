import { Platform, SafeAreaView, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';

const Container = ({ children }) => {
  const { systemStore } = useStores();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          paddingHorizontal: 15,
          flex: 1,
          marginTop: Platform.OS == 'ios' ? 0 : systemStore.statusBarHeight + 15,
        }} 
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Container;
