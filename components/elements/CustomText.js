import { Text } from "react-native";
import React from "react";

const CustomText = ({ styles = {}, childrun }) => {
  return (
    <Text
      style={{
        fontFamily: "Robato",
        ...styles,
      }}
    >
      {childrun}
    </Text>
  );
};

export default CustomText;
