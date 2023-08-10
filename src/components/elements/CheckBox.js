import { Pressable} from 'react-native';
import React from 'react';
import {COLORS} from '../../commons/colors';
import { Ionicons } from '@expo/vector-icons';

const CheckBox = ({
  disabled = false,
  onPress = () => {},
  checked = false,
  size = 24,
  style = {},
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
        ...style,
      }}
    >
      {checked ? (
        <Ionicons name='checkmark-circle' size={size} color={COLORS.primary} />
      ) : (
        <Ionicons
          name='checkmark-circle-outline'
          size={size}
          color={COLORS.black}
        />
      )}
    </Pressable>
  );
};

export default CheckBox;
