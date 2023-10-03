import { TextInput, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import { COLORS } from '../../commons/colors';
import { useEffect } from 'react';
import CustomText from './CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import ModalSelector from 'react-native-modal-selector';
import { FontAwesome5 } from '@expo/vector-icons';

const CustomPicker = ({
  title = null,
  required = false,
  value = '',
  onValueChange = () => {},
  placeholder = 'Select an option.',
  items = [],
  fontSize = 16,
  width = 'auto',
  height = 45,
  wrapperStyle = {},
  disabled = false,
  errorHandler = false,
  errorMsg = '',
}) => {
  const [error, setError] = useState(false);
  const [label, setLabel] = useState('');
  useEffect(() => {
    setError(errorHandler);
  }, [errorHandler]);

  useEffect(() => {
    setLabel(items.filter((ele) => ele.value === value)[0]?.label || '');
  }, [items]);

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
        <ModalSelector
          data={items.map((ele) => ({ key: ele.value, label: ele.label }))}
          onChange={(option) => {
            onValueChange(option.key);
            setLabel(option.label);
          }}
          style={{
            marginTop: !!title ? 20 : 0,
            height: height,
            width: '100%',
            backgroundColor: COLORS.white,
            borderBottomWidth: 2,
            borderColor:error
              ? COLORS.danger
              : COLORS.grayLight,
            borderStyle: 'solid',
          }}
          overlayStyle={{
            backgroundColor: COLORS.semiTransparentDark,
          }}
          optionStyle={{ paddingVertical: 15 }}
          optionContainerStyle={{ backgroundColor: COLORS.light }}
          optionTextStyle={{
            fontSize: 14,
            color: COLORS.dark,
            fontFamily: 'NSR-Regular',
          }}
          cancelStyle={{ paddingVertical: 15, backgroundColor: COLORS.main }}
          cancelTextStyle={{
            fontSize: 16,
            color: COLORS.white,
            fontFamily: 'NSR-Bold',
          }}
          disabled={disabled}
        >
          <TextInput
            style={{
              width: '100%',
              height: '100%',
              paddingHorizontal: 10,
              fontSize: fontSize,
              color: COLORS.dark,
            }}
            editable={false}
            placeholder={placeholder}
            value={label}
          />
        </ModalSelector>
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

export default CustomPicker;
