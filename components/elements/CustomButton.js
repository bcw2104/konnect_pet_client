import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../commons/colors';

const CustomButton = ({
  onPress = ()=>{},
  bgColor = colors.light,
  bgColorPress = colors.lightDeep,
  fontColor = colors.black,
  fontSize = 16,
  text = "",
  width = 100,
  height = 50,
  styles = {},
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: width,
          height: height,
          borderRadius: 5,
          borderColor: colors.dark,
          borderWidth: bgColor == colors.light ? 1 : 0,
          backgroundColor: pressed
            ? bgColorPress
            : bgColor,
          ...styles
        },
      ]}
    >
      <Text
        style={{
          fontSize: fontSize,
          color: fontColor,
          textAlign: 'center',
          lineHeight: height
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
