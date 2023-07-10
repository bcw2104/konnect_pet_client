import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import PasswordSetting from '../../components/modules/PasswordSetting';
import EmailVerify from '../../components/modules/EmailVerify';
import { FONT_WEIGHT } from '../../commons/constants';

const SignupStep2View = (props) => {
  const { route } = props;
  const [password, setPassword] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate('signup_step3', { ...params, ...route.params });
  };

  const submit = async () => {
    if (!verifyKey || !password) return;

    goToNextStep({
      emailVerifyKey: verifyKey,
      password: password,
    });
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD}  fontSize={24}>
            가입 정보를 입력해주세요.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <CustomText fontSize={16}>이메일을 입력해주세요.</CustomText>
          <EmailVerify
            verifyKey={verifyKey}
            onVerifyKeyChange={setVerifyKey}
            requestVerificationApi={serviceApis.requestJoinEmailVerification}
            submitVerificationApi={serviceApis.submitJoinEmailVerification}
          />
        </View>
        <View style={styles.section3}>
          <CustomText fontSize={16}>비밀번호를 입력해주세요.</CustomText>
          <PasswordSetting onPasswordChange={setPassword} />
        </View>
        
        <View style={styles.section4}>
          <View style={styles.helpWrap}>
            <CustomText fontSize={15}>
              인증번호가 오지 않나요?
            </CustomText>
            <CustomText fontSize={15}>
              인증번호가 오지 않나요?에 대한 내용입니다. 인증번호가 오지
              않나요?에 대한 내용입니다. 인증번호가 오지 않나요?에 대한
              내용입니다.
            </CustomText>
          </View>
        </View>
      </Container>
      <CustomButton
        fontColor={COLORS.white}
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        text='다음'
        disabled={!verifyKey || !password}
        onPress={submit}
        style={styles.submitTheme}
        height={50}
      />
    </>
  );
};
export default SignupStep2View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 3,
  },
  section3: {
    flex: 3,
  },
  section4: {
    flex:3
  },

  submitTheme: { borderRadius: 0 },
});
