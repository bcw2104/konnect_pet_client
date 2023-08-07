import { Text } from 'react-native';
import React from 'react';
import COLORS from '../../commons/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '../../commons/constants';

const CustomText = ({
  style = {},
  fontFamily = FONT_FAMILY.ROBOTO,
  fontWeight = FONT_WEIGHT.REGULAR,
  fontColor = COLORS.dark,
  fontSize = 16,
  children,
  numberOfLines = undefined,
  ellipsizeMode = undefined,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={{
        fontFamily: fontFamily + '-' + fontWeight,
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
