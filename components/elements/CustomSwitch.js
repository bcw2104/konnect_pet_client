import { StyleSheet, Switch, Text, View } from 'react-native';
import React from 'react';
import COLORS from '../../commons/colors';

const CustomSwitch = ({
  onValueChange = () => {},
  value = false,
  scale = 1.1
}) => {
  return (
    <Switch
      onValueChange={onValueChange}
      value={value}
      style={{ transform: [{ scaleX: scale }, { scaleY: scale }] }}
      trackColor={{ false: COLORS.dark, true: COLORS.warning }}
      thumbColor={value ? COLORS.warning : COLORS.grayLight}
    />
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({});
