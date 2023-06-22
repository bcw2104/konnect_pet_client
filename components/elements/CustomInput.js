import { Text, TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import colors from '../../commons/colors';
import { useEffect } from 'react';

const CustomInput = ({
  autoFocus = false,
  secureTextEntry = false,
  onChangeText = () => {},
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

  const onChangeTextWithRegex = (value) => {
    if (!!regex) {
      const test = regex.test(value);

      if (!test) {
        setError(true);
        onChangeText(null);
      } else {
        setError(false);
        onChangeText(value);
      }
    } else {
      setError(false);
      onChangeText(value);
    }
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
          onChangeText={onChangeTextWithRegex}
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

export default CustomInput;
