import { Image, StyleSheet } from 'react-native';
import React from 'react';

const FootprintImage = ({ type, size }) => {
  return (
    <Image
      source={
        type == 'others'
          ? require('../../../assets/images/icons/footprint_blue.png')
          : type == 'mine'
          ? require('../../../assets/images/icons/footprint_orange.png')
          : type == 'catched'
          ? require('../../../assets/images/icons/footprint_dark.png')
          : require('../../../assets/images/icons/footprint_gray.png')
      }
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default FootprintImage;

const styles = StyleSheet.create({});
