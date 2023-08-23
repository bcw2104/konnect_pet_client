import { StyleSheet, Switch, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../commons/colors';
import SwitchToggle from 'react-native-switch-toggle';

const CustomSwitch = ({
  onValueChange = () => {},
  value = false,
  size = 50,
}) => {
  return (
    <SwitchToggle
      switchOn={value}
      onPress={onValueChange}
      circleColorOff={COLORS.light}
      circleColorOn={COLORS.main}
      backgroundColorOn={COLORS.mainLight}
      backgroundColorOff={COLORS.grayLight}
      containerStyle={{
        width: size,
        height: size / 2,
        borderRadius: size / 4,
      }}
      circleStyle={{
        width: size / 2,
        height: size / 2,
        borderRadius: size / 4,
      }}
    />
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({});
