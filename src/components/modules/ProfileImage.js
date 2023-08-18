import { StyleSheet, Image } from 'react-native';
import React from 'react';

const ProfileImage = ({ path, style }) => {
  return (
    <Image
      source={
        !!path
          ? { uri: process.env.EXPO_PUBLIC_BASE_IMAGE_URL + path }
          : require('../../../assets/images/profile/user_default.png')
      }
      style={style}
    />
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
