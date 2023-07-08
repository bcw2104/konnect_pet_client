import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../commons/colors';
import { Ionicons } from '@expo/vector-icons';

const CheckBox = ({
  disabled = false,
  onPress = () => {},
  checked = false,
  size = 24,
  styles = {},
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      hitSlop={10}
      style={{
        width: size,
        height: size,
        opacity: disabled ? 0.7 : 1,
        ...styles,
      }}
    >
      {checked ? (
        <Ionicons name='checkmark-circle' size={size} color={colors.primary} />
      ) : (
        <Ionicons
          name='checkmark-circle-outline'
          size={size}
          color={colors.black}
        />
      )}
    </Pressable>
  );
};

export default CheckBox;
