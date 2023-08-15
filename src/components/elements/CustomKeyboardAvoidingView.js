import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const CustomKeyboardAvoidingView = ({ children, aosOffset = 0, style }) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const statusBarHeight = getStatusBarHeight();
      setStatusBarHeight(statusBarHeight);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? 60 + statusBarHeight : aosOffset
      }
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={style}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {children}
        <View style={{ flex: 1 }}></View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardAvoidingView;

const styles = StyleSheet.create({});
