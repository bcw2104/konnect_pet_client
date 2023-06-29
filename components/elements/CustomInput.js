import { Text, TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import colors from '../../commons/colors';
import { useEffect } from 'react';
import CustomText from './CustomText';

const CustomInput = ({
  autoFocus = false,
  secureTextEntry = false,
  value = '',
  maxLength = 100,
  onValueChange = () => {},
  width = 'auto',
  height = 50,
  wrapperStyle = {},
  style = {},
  placeholder = '',
  keyboardType = 'default',
  editable = true,
  regex = '',
  errorHandler = false,
  errorMsg = '',
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(errorHandler);
  }, [errorHandler]);

  const onValueChangeWithRegex = (value) => {
    if (maxLength < value?.length) {
      return;
    }
    if (value?.length > 0 && !!regex) {
      const test = regex.test(value);

      if (!test) {
        return;
      }
    }

    onValueChange(value);
  };

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
        <TextInput
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          value={value}
          onChangeText={onValueChangeWithRegex}
          keyboardType={keyboardType}
          placeholder={placeholder}
          editable={editable}
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
        <CustomText
          fontColor={colors.danger}
          fontSize={14}
          style={{
            marginTop: 5,
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}
        >
          {errorMsg}
        </CustomText>
      )}
    </>
  );
};

export default CustomInput;
