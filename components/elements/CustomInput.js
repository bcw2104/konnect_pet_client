import { Text, TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import COLORS from '../../commons/colors';
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
  fontSize = 18,
  wrapperStyle = {},
  style = {},
  placeholder = '',
  keyboardType = 'default',
  editable = true,
  regex = '',
  errorHandler = false,
  errorMsg = '',
  outline = false,
  multiline = false,
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
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
          onChangeText={onValueChangeWithRegex}
          keyboardType={keyboardType}
          placeholder={placeholder}
          editable={editable}
          multiline={multiline}
          style={{
            width: width,
            height: height,
            fontSize: fontSize,
            paddingHorizontal: 10,
            borderWidth: outline ? 0 : 1,
            borderColor: error ? COLORS.danger : COLORS.gray,
            borderRadius: 5,
            borderStyle: 'solid',
            flex: 1,
            color: editable ? COLORS.dark : COLORS.grayDeep,
            ...style,
          }}
        />
      </View>
      {error && (
        <CustomText
          fontColor={COLORS.danger}
          fontSize={14}
          multiline={multiline}
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
