import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '../elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../elements/CustomInput';
import { asyncStorage } from '../../storage/Storage';
import CustomText from '../elements/CustomText';
import { Pressable } from 'react-native';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from '../../utils/ServiceApis';
import { FONT_WEIGHT } from '../../commons/constants';
import { Feather, MaterialIcons } from '@expo/vector-icons';

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
    <View style={styles.form}>
      <CustomInput
        value={email}
        maxLength={50}
        onValueChange={setEmail}
        wrapperStyle={styles.input}
        keyboardType="email-address"
        errorHandler={emailError}
        errorMsg="이메일을 입력해주세요."
        title={'Email'}
        prepend={<Feather name="user" size={24} color={COLORS.dark} />}
      />
      <CustomInput
        secureTextEntry={true}
        value={password}
        maxLength={16}
        onValueChange={setPassword}
        wrapperStyle={styles.input}
        errorHandler={passwordError}
        errorMsg="비밀번호를 입력해주세요."
        title={'Password'}
        prepend={<Feather name="lock" size={24} color={COLORS.dark} />}
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
      <CustomButton
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        render={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <CustomText
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.white}
              fontSize={18}
            >
              SIGN IN
            </CustomText>
            <MaterialIcons
              name="login"
              size={28}
              color={COLORS.white}
              style={{ position: 'absolute', right: 20 }}
            />
          </View>
        }
        onPress={loginSubmit}
        height={50}
        wrapperStyle={styles.submit}
        style={{
          borderRadius: 30,
        }}
      />
    </View>
  );
};

export default DefaultLogin;

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
  },
  input: {
    marginTop: 20,
  },
  submit: {
    marginTop: 20,
  },
});
