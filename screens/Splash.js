import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const screen = Dimensions.get('screen');

const Splash = () => {
  return <ImageBackground source={require('../assets/splash.png')} style={styles.splash} />;
};

export default Splash;

const styles = StyleSheet.create({
  splash: {
    width: "100%",
    height: "100%",
  },
});
