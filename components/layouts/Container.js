import { Platform, SafeAreaView, View } from 'react-native';
import React from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const Container = ({
  header = false,
  paddingHorizontal = 15,
  headerPaddingTop = 20,
  bgColor = '#ffffff',
  children,
}) => {
  const statusBarHeight = getStatusBarHeight();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: bgColor,
          paddingHorizontal: paddingHorizontal,
          flex: 1,
          paddingTop: header
            ? headerPaddingTop
            : Platform.OS == 'ios'
            ? 0
            : statusBarHeight + 5,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Container;
