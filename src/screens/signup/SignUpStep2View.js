import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { serviceApis } from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import PasswordSetting from '../../components/modules/PasswordSetting';
import EmailVerify from '../../components/modules/EmailVerify';
import { FONT_WEIGHT } from '../../commons/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignupStep2View = (props) => {
  const { route } = props;
  const [password, setPassword] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate({ ...params, ...route.params }, 'signup_step3');
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
      <Container header={true} headerPaddingTop={0}>
        <KeyboardAwareScrollView>
          <View style={styles.section1}>
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
              가입 정보를 입력해주세요.
            </CustomText>
          </View>
          <View style={styles.section2}>
            <EmailVerify
              verifyKey={verifyKey}
              onVerifyKeyChange={setVerifyKey}
              requestVerificationApi={serviceApis.requestJoinEmailVerification}
              submitVerificationApi={serviceApis.submitJoinEmailVerification}
            />
          </View>
          <View style={styles.section3}>
            <PasswordSetting onPasswordChange={setPassword} />
          </View>

          <View style={styles.section4}>
            <View style={styles.helpWrap}>
              <CustomText fontSize={15}>인증번호가 오지 않나요?</CustomText>
              <CustomText fontSize={15}>
                인증번호가 오지 않나요?에 대한 내용입니다. 인증번호가 오지
                않나요?에 대한 내용입니다. 인증번호가 오지 않나요?에 대한
                내용입니다.
              </CustomText>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
      <CustomButton
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        text="Next Step"
        disabled={!verifyKey || !password}
        onPress={submit}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};
export default SignupStep2View;

const styles = StyleSheet.create({
  section1: {
    marginTop: 20,
    marginBottom: 50,
  },
  section2: {
    marginBottom: 20,
  },
  section3: {
    marginBottom: 50,
  },
  section4: {
    flex: 1,
  },

  submitTheme: { borderRadius: 0 },
});
