import { Platform, SafeAreaView, View } from 'react-native';
import React from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const Container = ({ header = false, children }) => {
  const statusBarHeight = getStatusBarHeight();

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
          paddingTop: header
            ? 20
            : Platform.OS == 'ios'
            ? 0
            : statusBarHeight + 15,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Container;
