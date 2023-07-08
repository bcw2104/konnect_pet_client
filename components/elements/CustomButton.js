import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../commons/colors';
import CustomText from './CustomText';

const CustomButton = ({
  disabled = false,
  onPress = () => {},
  bgColor = colors.light,
  bgColorPress = colors.lightDeep,
  fontColor = colors.black,
  fontSize = 16,
  text = '',
  width = 'auto',
  height = 50,
  wrapperStyle = {},
  styles = {},
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
            borderColor: colors.dark,
            borderWidth: bgColor == colors.light ? 1 : 0,
            backgroundColor: pressed ? bgColorPress : bgColor,
            justifyContent:'center',
            flex: 1,
            opacity: disabled ? 0.7 : 1,
            ...styles,
          },
        ]}
      >
        <CustomText
          style={{
            textAlign: 'center',
          }}
          fontSize={fontSize}
          fontColor={fontColor}
        >
          {text}
        </CustomText>
      </Pressable>
    </View>
  );
};

export default CustomButton;
