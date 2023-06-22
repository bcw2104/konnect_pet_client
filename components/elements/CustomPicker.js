import { Text, TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import colors from '../../commons/colors';
import { useEffect } from 'react';
import RNPickerSelect from '@react-native-picker/picker';

const CustomPicker = ({
  autoFocus = false,
  onValueChange = () => {},
  items = [],
  defaultValue = null,
  width = 'auto',
  height = 50,
  wrapperStyle = {},
  style = {},
  placeholder = '',
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
          ...wrapperStyle,
        }}
      >
        <RNPickerSelect
          textInputProps={{ underlineColorAndroid: 'transparent' }}
          onValueChange={onValueChange}
          placeholder={{
            label: { placeholder },
          }}
          disabled={disabled}
          fixAndroidTouchableBug={true}
          value={defaultValue}
          useNativeAndroidPickerStyle={false}
          items={items}
          style={{
            width: width,
            height: height,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.gray,
            borderRadius: 5,
            borderStyle: 'solid',
            flex: 1,
            ...style,
          }}
        />
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
