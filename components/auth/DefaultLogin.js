import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '../elements/CustomButton';
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import serviceApis from './../../utils/ServiceApis';
import { asyncStorage } from '../../storage/Storage';
import CustomText from '../elements/CustomText';
import { Pressable } from 'react-native';
import { Navigator } from '../../navigations/Navigator';
import { platform } from '../../commons/constants';

const DefaultLogin = () => {
  const { userStore } = useStores();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const loginSubmit = async () => {
    if (!email || !password) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }
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
  };

  return (
    <View style={styles.form}>
      <CustomInput
        value={email}
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
        onValueChange={setPassword}
        wrapperStyle={styles.input}
        placeholder='Password'
        errorHandler={passwordError}
        errorMsg='비밀번호를 입력해주세요.'
      />
      {loginFailed && (
        <CustomText
          fontColor={colors.danger}
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
            Navigator.navigate('find_password_step1', {});
          }}
          hitSlop={10}
        >
          <CustomText fontSize={15}>Forget password?</CustomText>
        </Pressable>
      </View>
      <CustomButton
        bgColor={colors.dark}
        bgColorPress={colors.dangerDeep}
        text='Sign In'
        fontColor={colors.white}
        onPress={loginSubmit}
        height={50}
        wrapperStyle={styles.submit}
      />
    </View>
  );
};

export default DefaultLogin;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    flex: 0.9,
    marginTop: 20,
  },
  submit: {
    flex: 0.9,
    marginTop: 20,
  },
});
