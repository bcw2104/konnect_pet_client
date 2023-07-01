import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomInput from '../elements/CustomInput';
import { useEffect,useState } from 'react';
import regex from '../../commons/regex';

const PasswordSettingForm = ({ 
  onPasswordChange = (value) => {} 
}) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [password2, setPassword2] = useState('');
  const [password2Error, setPassword2Error] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

  useEffect(()=>{
    if(isPasswordSuccess){
      onPasswordChange(password);
    }else{
      onPasswordChange(null);
    }
  },[isPasswordSuccess])

  const confirmPassword = (password1, password2) => {
    const test = regex.password.test(password1);

    if (!test) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (password1 != password2) {
      setIsPasswordSuccess(false);
      setPassword2Error(true);
    } else {
      setIsPasswordSuccess(test);
      setPassword2Error(false);
    }
  };

  const handlePasswordChange = (password) => {
    confirmPassword(password, password2);
    setPassword(password);
  };

  const handlePassword2Change = (password2) => {
    confirmPassword(password, password2);
    setPassword2(password2);
  };

  return (
    <View style={styles.passwordInputWrap}>
      <CustomInput
        value={password}
        maxLength={20}
        onValueChange={handlePasswordChange}
        secureTextEntry={true}
        keyboardType='default'
        placeholder='Password'
        errorHandler={passwordError}
        errorMsg='Password must contain at least one character, special character, and number.'
      />
      <CustomInput
        value={password2}
        maxLength={20}
        onValueChange={handlePassword2Change}
        secureTextEntry={true}
        keyboardType='default'
        placeholder='Verify password'
        errorHandler={password2Error}
        errorMsg='Passwords do not match.'
        wrapperStyle={styles.password2Input}
      />
    </View>
  );
};

export default PasswordSettingForm;

const styles = StyleSheet.create({
  passwordInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },

  password2Input: {
    marginTop: 10,
  },
});
