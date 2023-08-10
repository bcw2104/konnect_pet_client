import { StyleSheet, Image } from 'react-native';
import React from 'react';

const PetImage = ({ uri, style }) => {
  return (
    <Image
      source={
        !!uri
          ? {
              uri: uri,
            }
          : require('../../../assets/images/profile/pet_default.png')
      }
      style={style}
    />
  );
};

export default PetImage;

const styles = StyleSheet.create({});
