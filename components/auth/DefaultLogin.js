import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../elements/CustomButton';
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import regex from '../../commons/regex';
import serviceApi from './../../utils/ServiceApis';

const DefaultLogin = () => {
  const { systemStore } = useStores();

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
    try {
      const payload = {
        email,
        password,
      }
      const response = await serviceApi.login(payload);

      console.log(response); 
    } catch (error) {
      console.log(error);
    } 
  };
  return (
    <View style={styles.form}>
      <CustomInput
        autoFocus={true}
        onChangeText={setEmail}
        style={styles.input}
        width={systemStore.winWidth * 0.8}
        placeholder='Email'
        keyboardType='email-address'
        errorHandler={emailError}
        errorMsg='이메일을 입력해주세요.'
      />
      <CustomInput
        secureTextEntry={true}
        onChangeText={setPassword}
        style={styles.input}
        width={systemStore.winWidth * 0.8}
        placeholder='Password'
        errorHandler={passwordError}
        errorMsg='비밀번호를 입력해주세요.'
      />
      {loginFailed && (
        <Text style={{ color: colors.danger }}>Invalid email or password</Text>
      )}
      <CustomButton
        bgColor={colors.dark}
        bgColorPress={colors.dangerDeep}
        text='Sign In'
        fontColor={colors.white}
        onPress={loginSubmit}
        width={systemStore.winWidth * 0.8}
        height={50}
        styles={styles.submit}
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
    marginTop: 20,
  },
  submit: {
    marginTop: 20,
  },
});
