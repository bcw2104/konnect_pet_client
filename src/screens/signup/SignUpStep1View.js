import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import {COLORS} from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../../commons/constants';
import SmsVerify from '../../components/modules/SmsVerify';
import { observer } from 'mobx-react-lite';

const SignupStep1View = (props) => {
  const { route } = props;
  const [nationCode, setNationCode] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

  const goToNextStep = (params) => {
    if (route.params.platform != SOCIAL_TYPE.EMAIL) {
      Navigator.navigate({ ...params, ...route.params }, 'signup_step3');
    } else {
      Navigator.navigate({ ...params, ...route.params }, 'signup_step2');
    }
  };

  const submit = async () => {
    if (!verifyKey) return;

    goToNextStep({
      smsVerifyKey: verifyKey,
      nationCode: nationCode,
    });
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
            핸드폰 번호를 인증해주세요.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <CustomText fontSize={16}>핸드폰 번호를 입력해주세요.</CustomText>
          <SmsVerify
            nationCode={nationCode}
            onNationCodeChange={setNationCode}
            verifyKey={verifyKey}
            onVerifyKeyChange={setVerifyKey}
            requestVerificationApi={serviceApis.requestJoinSmsVerification}
            submitVerificationApi={serviceApis.submitJoinSmsVerification}
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
        fontColor={COLORS.white}
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        text='다음'
        disabled={!verifyKey}
        onPress={submit}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};
export default observer(SignupStep1View);

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
