import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layout/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import PasswordSettingForm from '../../components/forms/PasswordSettingForm';
import EmailVerify from '../../components/forms/EmailVerify';

const FOOT_BUTTON_HEIGHT = 50;

const SignupStep2View = (props) => {
  const { route } = props;
  const [password, setPassword] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate('signup_step3', { ...params, ...route.params });
  };

  const submitSignupData = async () => {
    if (!verifyKey || !password) return;

    goToNextStep({
      emailVerifyKey: verifyKey,
      password: password,
    });
  };

  return (
    <>
      <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
        <View style={styles.section1}>
          <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
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
          <CustomText>비밀번호를 입력해주세요.</CustomText>
          <PasswordSettingForm onPasswordChange={setPassword} />
        </View>
        <View style={styles.section4}>
          <View style={styles.helpWrap}>
            <CustomText style={styles.helpTitle}>
              인증번호가 오지 않나요?
            </CustomText>
            <CustomText style={styles.helpContent}>
              인증번호가 오지 않나요?에 대한 내용입니다. 인증번호가 오지
              않나요?에 대한 내용입니다. 인증번호가 오지 않나요?에 대한
              내용입니다.
            </CustomText>
          </View>
        </View>
      </Container>
      <CustomButton
        fontColor={colors.white}
        bgColor={colors.dark}
        bgColorPress={colors.darkDeep}
        text='다음'
        disabled={!verifyKey || !password}
        onPress={submitSignupData}
        styles={styles.submitTheme}
        height={FOOT_BUTTON_HEIGHT}
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
    flex: 1,
  },
  section3: {
    flex: 1,
  },
  section4: {
    flex: 2,
    justifyContent: 'space-between',
  },

  submitTheme: { borderRadius: 0 },
});
