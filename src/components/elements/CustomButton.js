import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {COLORS} from '../../commons/colors';
import CustomText from './CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const CustomButton = ({
  disabled = false,
  onPress = () => {},
  bgColor = COLORS.light,
  bgColorPress = COLORS.lightDeep,
  fontColor = COLORS.black,
  fontSize = 16,
  fontWeight = FONT_WEIGHT.REGULAR,
  text = '',
  width = 'auto',
  height = 45,
  wrapperStyle = {},
  style = {},
  render = null,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: height,
        width: width,
        ...wrapperStyle,
      }}
    >
      <Pressable
        disabled={disabled}
        onPress={onPress}
        hitSlop={10}
        style={({ pressed }) => [
          {
            width: width,
            height: height,
            borderRadius: 5,
            borderColor: COLORS.gray,
            borderWidth: bgColor == COLORS.light ? 1 : 0,
            backgroundColor: pressed ? bgColorPress : bgColor,
            flex: 1,
            opacity: disabled ? 0.6 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
          },
        ]}
      >
        {!!render ? (
          render
        ) : (
          <CustomText
            style={{
              textAlign: 'center',
            }}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fontColor={fontColor}
          >
            {text}
          </CustomText>
        )}
      </Pressable>
    </View>
  );
};

export default CustomButton;
