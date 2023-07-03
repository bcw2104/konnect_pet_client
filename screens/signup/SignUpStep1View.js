import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';
import { platform } from '../../commons/constants';
import SmsVerify from '../../components/modules/SmsVerify';

const FOOT_BUTTON_HEIGHT = 50;

const SignupStep1View = (props) => {
  const { route } = props;
  const [screenData, setScreenData] = useState({});
  const [nationCode, setNationCode] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [verifyKey, setVerifyKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const screenData = await serviceApis.screenSignupStep1();
        setScreenData(screenData.result);
        setNationCode(screenData.result.nationCodes[0].value);
        setIsLoaded(true);
      } catch (error) {
        Navigator.reset('welcome', {});
      }
    };
    fetchData();
  }, []);

  const goToNextStep = (params) => {
    if (route.params.platform != platform.EMAIL) {
      Navigator.navigate('signup_step3', { ...params, ...route.params });
    } else {
      Navigator.navigate('signup_step2', { ...params, ...route.params });
    }
  };

  const submit = async () => {
    if (!verifyKey) return;

    goToNextStep({
      smsVerifyKey: verifyKey,
      nationCode:nationCode,
    });
  };

  return (
    <>
      {isLoaded && (
        <>
          <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
            <View style={styles.section1}>
              <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
                핸드폰 번호를 인증해주세요.
              </CustomText>
            </View>
            <View style={styles.section2}>
              <SmsVerify
                nationCodes={screenData.nationCodes}
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
      )}
    </>
  );
};
export default SignupStep1View;

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
