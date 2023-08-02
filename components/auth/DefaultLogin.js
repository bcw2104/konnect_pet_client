import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '../elements/CustomButton';
import COLORS from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import serviceApis from './../../utils/ServiceApis';
import { asyncStorage } from '../../storage/Storage';
import CustomText from '../elements/CustomText';
import { Pressable } from 'react-native';
import { Navigator } from '../../navigations/Navigator';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

const DefaultLogin = () => {
  const { userStore, systemStore } = useStores();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const loginSubmit = async () => {
    setEmailError(false);
    setPasswordError(false);

    if (!email || !password) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }
    systemStore.setIsLoading(true);

    try {
      const response = await serviceApis.login(email, password);
      if (response?.rsp_code === '1000') {
        asyncStorage.setItem('access_token', response.result.accessToken);
        asyncStorage.setItem(
          'access_token_expire_at',
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem('refresh_token', response.result.refreshToken);
        asyncStorage.setItem(
          'refresh_token_expire_at',
          response.result.refreshTokenExpireAt
        );
        setLoginFailed(false);
        userStore.initUserInfo();
      } else {
        setLoginFailed(true);
      }
    } catch (e) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.form}
    >
      <CustomInput
        value={email}
        maxLength={50}
        onValueChange={setEmail}
        wrapperStyle={styles.input}
        placeholder='Email'
        keyboardType='email-address'
        errorHandler={emailError}
        errorMsg='이메일을 입력해주세요.'
      />
      <CustomInput
        secureTextEntry={true}
        value={password}
        maxLength={50}
        onValueChange={setPassword}
        wrapperStyle={styles.input}
        placeholder='Password'
        errorHandler={passwordError}
        errorMsg='비밀번호를 입력해주세요.'
      />
      {loginFailed && (
        <CustomText
          fontColor={COLORS.danger}
          fontSize={14}
          style={{
            marginTop: 5,
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}
        >
          Invalid email or password
        </CustomText>
      )}
      <View
        style={{
          marginTop: 15,
          marginBottom: 5,
          alignSelf: 'flex-end',
        }}
      >
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'find_password_step1');
          }}
          hitSlop={10}
        >
          <CustomText fontSize={15}>Forget password?</CustomText>
        </Pressable>
      </View>
      <CustomButton
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        text='Sign In'
        fontColor={COLORS.white}
        onPress={loginSubmit}
        height={50}
        wrapperStyle={styles.submit}
      />
    </KeyboardAvoidingView>
  );
};

export default DefaultLogin;

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
  },
  submit: {
    marginTop: 10,
  },
});
