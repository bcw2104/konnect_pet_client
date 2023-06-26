import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import serviceApis from '../../utils/ServiceApis';
import { platform } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';


const FacebookLogin = () => {
  const { userStore } = useStores();

  const signIn = async () => {
    const data = await AccessToken.getCurrentAccessToken();

    console.log(data);
  };

  return (
    <>
      <Pressable
        title='Sign in with Google'
        onPress={signIn}
        style={styles.button}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default FacebookLogin;
