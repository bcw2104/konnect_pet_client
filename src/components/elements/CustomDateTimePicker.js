import { Platform, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import CustomText from './CustomText';
import DatePicker from 'react-native-date-picker';

const CustomDateTimePicker = ({
  onChange,
  value,
  maxDate,
  minDate,
  style,
  fontSize,
  fontColor,
  fontWeight,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => {
          setDatePickerOpen(true);
        }}
        style={style}
      >
        <CustomText
          fontSize={fontSize}
          fontColor={fontColor}
          fontWeight={fontWeight}
        >
          {moment(value).format('YYYY.MM.DD')}
        </CustomText>
      </Pressable>
      <DatePicker
        modal={true}
        mode={'date'}
        open={datePickerOpen}
        maximumDate={maxDate}
        minimumDate={minDate}
        date={value}
        onConfirm={(date) => {
          onChange(date);
          setDatePickerOpen(false);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
    </>
  );
};

export default CustomDateTimePicker;

const styles = StyleSheet.create({});
