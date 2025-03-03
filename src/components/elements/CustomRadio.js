import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import { COLORS } from '../../commons/colors';

const CustomRadio = ({
  items = [],
  height = 50,
  fontSize = 16,
  value = null,
  onPress = () => {},
}) => {
  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      {items.map((item, index) => (
        <CustomButton
          key={index}
          bgColor={value == item.value ? COLORS.main : COLORS.light}
          bgColorPress={
            value == item.value ? COLORS.main : COLORS.lightDeep
          }
          text={item.label}
          fontColor={value == item.value ? COLORS.white : COLORS.gray}
          onPress={() => {
            onPress(item.value);
          }}
          fontSize={fontSize}
          wrapperStyle={{ flex: 1, marginRight: index != items.length ? 5 : 0 }}
          height={height}
        />
      ))}
    </View>
  );
};

export default CustomRadio;

const styles = StyleSheet.create({});
