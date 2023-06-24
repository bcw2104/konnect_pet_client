import { Text, TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import colors from '../../commons/colors';
import { useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const CustomPicker = ({
  value = '',
  onValueChange = () => {},
  items = [],
  width = 'auto',
  height = 50,
  wrapperStyle = {},
  style = {},
  itemStyle = {},
  disabled = false,
  errorHandler = false,
  errorMsg = '',
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(errorHandler);
  }, [errorHandler]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          height: height,
          width: width,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.gray,
          borderRadius: 5,
          borderStyle: 'solid',
          alignItems: 'center',
          ...wrapperStyle,
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
          enabled={!disabled}
          style={{
            flex: 1,
            ...style,
          }}
          itemStyle={itemStyle}  
        >
          {items.map((item, index) => (
            <Picker.Item
              key={item.value}
              label={`${item.label} +${item.value}`}
              value={item.value}
              style={itemStyle}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text
          style={{
            color: colors.danger,
            fontSize: 14,
            marginTop: 5,
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}
        >
          {errorMsg}
        </Text>
      )}
    </>
  );
};

export default CustomPicker;
