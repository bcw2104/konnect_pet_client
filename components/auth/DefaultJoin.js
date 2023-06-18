import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '../elements/CustomButton';
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import regex from '../../commons/regex';

const DefaultLogin = () => {
  const { systemStore,modalStore } = useStores();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginSubmit = async () => {
    try {
      await systemStore.login(email, password);
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
        regex={regex.email}
        errorMsg='Please enter a valid email'
      />
      <CustomInput
        secureTextEntry={true}
        onChangeText={setPassword}
        style={styles.input}
        width={systemStore.winWidth * 0.8}
        placeholder='Password'
        regex={regex.password}
        errorMsg='Please enter a valid password'
      />
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
