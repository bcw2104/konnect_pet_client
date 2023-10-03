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
  prepend = null,
  append = null,
}) => {
  const [error, setError] = useState(false);
  const [focus, setFocus] = useState(false);

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
      <View style={{ width: width, ...wrapperStyle }}>
        {title && (
          <View
            style={{
              position: 'absolute',
              left: 5,
              backgroundColor: COLORS.white,
              paddingHorizontal: 2,
              zIndex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <CustomText
              fontSize={14}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
            >
              {title}
            </CustomText>
            {required && (
              <FontAwesome5
                name="star-of-life"
                size={8}
                color={COLORS.danger}
                style={{
                  marginLeft: 5,
                  top: 1,
                }}
              />
            )}
          </View>
        )}
        <View
          style={{
            marginTop: !!title ? 20 : 0,
            flexDirection: 'row',
            width: '100%',
            backgroundColor: COLORS.white,
            borderBottomWidth: outline ? 0 : 2,
            borderColor: focus
              ? COLORS.main
              : error
              ? COLORS.danger
              : COLORS.grayLight,
            borderStyle: 'solid',
            alignItems: 'center',
          }}
        >
          {!!prepend && (
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              {prepend}
            </View>
          )}
          <TextInput
            ref={innerRef}
            autoFocus={autoFocus}
            onFocus={() => {
              setFocus(true);
            }}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            textAlignVertical={textAlignVertical}
            value={value}
            scrollEnabled={true}
            returnKeyType="done"
            onChangeText={onValueChangeWithRegex}
            onBlur={() => {
              onBlur();
              setFocus(false);
            }}
            keyboardType={keyboardType}
            placeholder={placeholder}
            editable={editable}
            multiline={multiline}
            style={{
              minHeight: minHeight,
              height: height,
              maxHeight: maxHeight,
              fontSize: fontSize,
              paddingHorizontal: 10,
              flex: 1,
              color: editable ? COLORS.dark : COLORS.grayDeep,
              ...style,
            }}
          />
          {!!append && (
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              {append}
            </View>
          )}
        </View>
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
