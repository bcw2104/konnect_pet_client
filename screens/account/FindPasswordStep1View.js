import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import EmailVerify from '../../components/modules/EmailVerify';

const FOOT_BUTTON_HEIGHT = 50;
const VERIFY_TIMEOUT = 600;

const FindPasswordStep1View = (props) => {
  const { route } = props;

  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate('find_password_step2', { ...params, ...route.params });
  };

  const submit = async () => {
    if(!verifyKey) return;
    
    goToNextStep({
      emailVerifyKey: verifyKey,
    });
  };

  return (
    <>
      <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
        <View style={styles.section1}>
          <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>가입한 이메일을 입력해주세요.</CustomText>
        </View>
        <View style={styles.section2}>
          <CustomText fontSize={16}>이메일을 입력해주세요.</CustomText>
          <EmailVerify
            verifyKey={verifyKey}
            onVerifyKeyChange={setVerifyKey}
            requestVerificationApi={serviceApis.requestResetPasswordEmailVerification}
            submitVerificationApi={serviceApis.submitResetPasswordEmailVerification}
          />
        </View>
        <View style={styles.section3}>
          <View style={styles.helpWrap}>
            <CustomText fontSize={15}>인증번호가 오지 않나요?</CustomText>
            <CustomText fontSize={15}>
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
        disabled={!verifyKey}
        onPress={submit}
        styles={styles.submitTheme}
        height={FOOT_BUTTON_HEIGHT}
      />
    </>
  );
};
export default FindPasswordStep1View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 2,
  },
  section3: {
    flex: 2,
    justifyContent: 'space-between',
  },
  submitTheme: { borderRadius: 0 },
});
