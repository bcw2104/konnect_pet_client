import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { serviceApis } from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import EmailVerify from '../../components/modules/EmailVerify';
import { FONT_WEIGHT } from '../../commons/constants';

const FindPasswordStep1View = (props) => {
  const { route } = props;

  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate({ ...params, ...route.params }, 'find_password_step2');
  };

  const submit = async () => {
    if (!verifyKey) return;

    goToNextStep({
      emailVerifyKey: verifyKey,
    });
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
            가입한 이메일을 입력해주세요.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <CustomText fontSize={16}>이메일을 입력해주세요.</CustomText>
          <EmailVerify
            verifyKey={verifyKey}
            onVerifyKeyChange={setVerifyKey}
            requestVerificationApi={
              serviceApis.requestResetPasswordEmailVerification
            }
            submitVerificationApi={
              serviceApis.submitResetPasswordEmailVerification
            }
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
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        text="Next Step"
        disabled={!verifyKey}
        onPress={submit}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};
export default FindPasswordStep1View;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 50,
  },
  section2: {
    marginBottom: 50,
  },
  section3: {
    flex: 1,
    justifyContent: 'space-between',
  },
  submitTheme: { borderRadius: 0 },
});
