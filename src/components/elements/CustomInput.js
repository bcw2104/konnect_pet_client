import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from './CustomText';
import { FontAwesome5 } from '@expo/vector-icons';

const CustomInput = ({
  title = null,
  required = false,
  autoFocus = false,
  secureTextEntry = false,
  value = '',
  maxLength = 100,
  onValueChange = () => {},
  onBlur = () => {},
  width = 'auto',
  height = 45,
  minHeight = 45,
  maxHeight = 'auto',
  fontSize = 16,
  wrapperStyle = {},
  style = {},
  placeholder = '',
  keyboardType = 'default',
  editable = true,
  regex = '',
  errorHandler = false,
  errorMsg = '',
  outline = false,
  textAlignVertical = 'center',
  multiline = false,
  innerRef = null,
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
          minHeight: minHeight,
          width: width,
          ...wrapperStyle,
        }}
      >
        {title && (
          <View
            style={{
              position: 'absolute',
              top: -7,
              left: 5,
              backgroundColor: COLORS.white,
              paddingHorizontal: 2,
              zIndex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <CustomText fontSize={13} fontWeight={FONT_WEIGHT.BOLD}>
              {title}
            </CustomText>
            {required && (
              <FontAwesome5
                name='star-of-life'
                size={8}
                color={COLORS.main}
                style={{
                  marginLeft: 5,
                  top: 1,
                }}
              />
            )}
          </View>
        )}
        <TextInput
          ref={innerRef}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          textAlignVertical={textAlignVertical}
          value={value}
          scrollEnabled={true}
          returnKeyType='done'
          onChangeText={onValueChangeWithRegex}
          onBlur={onBlur}
          keyboardType={keyboardType}
          placeholder={placeholder}
          editable={editable}
          multiline={multiline}
          style={{
            width: width,
            height: height,
            minHeight: minHeight,
            maxHeight: maxHeight,
            fontSize: fontSize,
            paddingHorizontal: 10,
            backgroundColor: COLORS.white,
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
