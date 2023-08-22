import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../commons/colors';

const Hr = () => {
  return <View style={styles.divider}></View>;
};

export default Hr;

const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: COLORS.light,
  },
});
