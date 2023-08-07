import { StyleSheet, Image } from 'react-native';
import React from 'react';

const ProfileImage = ({ uri, style }) => {
  return (
    <Image
      source={
        !!uri
          ? { uri: uri }
          : require('../../assets/images/profile/user_default.png')
      }
      style={style}
    />
  );
};

export default ProfileImage;

const styles = StyleSheet.create({});
