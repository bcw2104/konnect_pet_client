import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../elements/CustomButton';
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import serviceApis from './../../utils/ServiceApis';
import { asyncStorage } from '../../storage/Storage';

const DefaultLogin = () => {
  const { systemStore,userStore } = useStores();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const loginSubmit = async () => {

    if(!email || !password) {
      setEmailError(true);
      setPasswordError(true);
      return;
    }
    const payload = {
      email,
      password,
    }
    const response = await serviceApis.login(payload);
    if(response?.rsp_code === "1000"){
      
      asyncStorage.setItem('access_token', response.result.accessToken);
      asyncStorage.setItem('access_token_expire_at', response.result.accessTokenExpireAt);
      asyncStorage.setItem('refresh_token', response.result.refreshToken);
      asyncStorage.setItem('refresh_token_expire_at', response.result.refreshTokenExpireAt);
      setLoginFailed(false);
      userStore.setLoginStatus(true);
    }
    else{
      setLoginFailed(true);
    }
  };
  return (
    <View style={styles.form}>
      <CustomInput
        onChangeText={setEmail}
        wrapperStyle={styles.input}
        placeholder='Email'
        keyboardType='email-address'
        errorHandler={emailError}
        errorMsg='이메일을 입력해주세요.'
      />
      <CustomInput
        secureTextEntry={true}
        onChangeText={setPassword}
        wrapperStyle={styles.input}
        placeholder='Password'
        errorHandler={passwordError}
        errorMsg='비밀번호를 입력해주세요.'
      />
      {loginFailed && (
        <Text style={styles.loginFailed}>Invalid email or password</Text>
      )}
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
    flex:0.9,
    marginTop: 20,
  },
  submit: {
    flex:0.9,
    marginTop: 20,
  },
  loginFailed: {
    color: colors.danger,
    marginTop:5,
    alignSelf: 'flex-start'
  }
});
