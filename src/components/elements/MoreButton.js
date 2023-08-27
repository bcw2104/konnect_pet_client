import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../commons/colors';
import CustomText from './CustomText';
import { MaterialIcons } from '@expo/vector-icons';

const MoreButton = ({ onPress }) => {
  return (
    <Pressable style={styles.more} onPress={onPress}>
      <MaterialIcons
        name='expand-more'
        size={28}
        color={COLORS.dark}
        style={{ marginRight: 5 }}
      />
      <CustomText fontSize={16}>More</CustomText>
    </Pressable>
  );
};

export default MoreButton;

const styles = StyleSheet.create({
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS.white,
  },
});
