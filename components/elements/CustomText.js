import { Text } from 'react-native';
import React from 'react';
import colors from '../../commons/colors';

const CustomText = ({
  style = {},
  fontColor = colors.dark,
  fontSize = 18,
  children,
}) => {
  return (
    <Text
      style={{
        fontFamily: 'Robato',
        fontSize: fontSize,
        color: fontColor,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default CustomText;
