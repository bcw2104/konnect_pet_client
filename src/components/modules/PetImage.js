import { StyleSheet, Image } from 'react-native';
import React from 'react';

const PetImage = ({ path, style }) => {
  return (
    <Image
      source={
        !!path
          ? {
              uri: process.env.EXPO_PUBLIC_BASE_IMAGE_URL + path,
            }
          : require('../../../assets/images/profile/pet_default.png')
      }
      style={style}
    />
  );
};

export default PetImage;

const styles = StyleSheet.create({});
