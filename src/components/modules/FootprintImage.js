import { Image, StyleSheet } from 'react-native';
import React from 'react';
import { FOOTPRINT_TYPE } from '../../commons/constants';

const FootprintImage = ({ type, size }) => {
  return (
    <Image
      source={
        type == FOOTPRINT_TYPE.OTHERS
          ? require('../../../assets/images/icons/footprint_blue.png')
          : type == FOOTPRINT_TYPE.MINE
          ? require('../../../assets/images/icons/footprint_orange.png')
          : type == FOOTPRINT_TYPE.CATCHED
          ? require('../../../assets/images/icons/footprint_purple.png')
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
