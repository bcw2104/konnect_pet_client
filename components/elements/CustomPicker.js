import { Platform, Text, TextInput, View } from "react-native";
import React from "react";
import { useState } from "react";
import COLORS from "../../commons/colors";
import { useEffect } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import CustomText from "./CustomText";

const CustomPicker = ({
  value = "",
  onValueChange = () => {},
  items = [],
  width = "auto",
  height = 50,
  wrapperStyle = {},
  style = {},
  itemStyle = {},
  disabled = false,
  errorHandler = false,
  errorMsg = "",
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(errorHandler);
  }, [errorHandler]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          height: height,
          width: width,
          borderWidth: 1,
          borderColor: error ? COLORS.danger : COLORS.gray,
          borderRadius: 5,
          borderStyle: "solid",
          alignItems: "center",
          backgroundColor: COLORS.white,
          ...wrapperStyle,
        }}
      >
        {Platform.OS === "ios" ? (
          <PickerIOS
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
            enabled={!disabled}
            style={{
              flex: 1,
              ...style,
              justifyContent: "flex-start",
            }}
            itemStyle={{
              height: height,
              ...itemStyle,
            }}
          >
            {items.map((item, index) => (
              <PickerIOS.Item
                key={item.value}
                label={`${item.label} +${item.value}`}
                value={item.value}
              />
            ))}
          </PickerIOS>
        ) : (
          <Picker
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}
            enabled={!disabled}
            style={{
              flex: 1,
              ...style,
              justifyContent: "flex-start",
            }}
            itemStyle={{
              height: height,
              ...itemStyle,
            }}
          >
            {items.map((item, index) => (
              <Picker.Item
                key={item.value}
                label={`${item.label} +${item.value}`}
                value={item.value}
              />
            ))}
          </Picker>
        )}
      </View>
      {error && (
        <CustomText
          fontColor={COLORS.danger}
          fontSize={14}
          style={{
            marginTop: 5,
            textAlign: "left",
            alignSelf: "flex-start",
          }}
        >
          {errorMsg}
        </CustomText>
      )}
    </>
  );
};

export default CustomPicker;
