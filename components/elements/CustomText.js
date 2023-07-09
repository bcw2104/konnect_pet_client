import { Text } from 'react-native';
import React from 'react';
import COLORS from '../../commons/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '../../commons/constants';

const CustomText = ({
  style = {},
  fontFamily = FONT_FAMILY.ROBATO,
  fontWeight = FONT_WEIGHT.REGULAR,
  fontColor = COLORS.dark,
  fontSize = 18,
  children,
}) => {
  return (
    <Text
      style={{
        fontFamily: fontFamily + "-" + fontWeight,
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
