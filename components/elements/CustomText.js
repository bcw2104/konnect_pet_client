import { Text } from "react-native";
import React from "react";

const CustomText = (props) => {
  return (
    <Text style={[props.style, { fontFamily: "Robato" }]}>
      {props.children}
    </Text>
  );
};

export default CustomText;
