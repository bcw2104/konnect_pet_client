import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layout/Container';
import CustomInput from '../../components/elements/CustomInput';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import CustomPicker from '../../components/elements/CustomPicker';
import { Navigator } from '../../navigations/Navigator';
import useInterval from '../../hooks/useInertval';
import regex from '../../commons/regex';
import Timer from '../../components/elements/Timer';
import CustomText from '../../components/elements/CustomText';

const FOOT_BUTTON_HEIGHT = 50;
const VERIFY_TIMEOUT = 180;

const SignupStep1View = (props) => {
  const { route } = props;
  const [screenData, setScreenData] = useState({});
  const [nationCode, setNationCode] = useState('');
  const [tel, setTel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);
  const [openRetry, setOpenRetry] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [verifyData, setVerifyData] = useState(null);

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
    Navigator.navigate('signup_step2', { ...params, ...route.params });
  };

  useInterval(() => {
    if (remain > 0) {
      if (remain == VERIFY_TIMEOUT - 5) {
        setOpenRetry(true);
      }
      setRemain(remain - 1);
    } else {
      if (verifing) {
        resetVerifyStatus();
        setVerifyData(null);
      }
    }
  }, 1000);

  const resetVerifyStatus = () => {
    setOpenRetry(false);
    setVerifing(false);
    setVerifiyError(false);
    setVerifyCode('');
  };

  const handleTelChange = (tel) => {
    resetVerifyStatus();
    setVerifyData(null);
    setTel(tel);
  };

  const requestSmsVerification = async () => {
    setVerifing(true);
    setOpenRetry(false);
    setRemain(VERIFY_TIMEOUT);
    let reqTel = tel;
    try {
      const response = await serviceApis.requestSmsVerification(
        nationCode + reqTel
      );
      setVerifyData({
        reqId: response.result.reqId,
        tel: response.result.data,
        timestamp: response.result.timestamp,
      });
    } catch (error) {
      setRemain(0);
      setVerifing(false);
    }
  };

  const submitVerifyCode = async () => {
    if (!verifyData) return;

    setVerifiyError(false);
    try {
      const response = await serviceApis.submitSmsVerification(
        verifyData.reqId,
        verifyData.timestamp,
        verifyData.tel,
        verifyCode
      );

      if (response.rsp_code === '1000') {
        goToNextStep({
          smsReqId: verifyData.reqId,
          smsTimestamp: verifyData.timestamp,
          nationCode: nationCode,
          encTel: verifyData.tel,
        });
        resetVerifyStatus();
        setVerifyData(null);
        setRemain(0);
      }
    } catch (error) {
      if(error.response.data.rsp_code != '9213') {
        setVerifiyError(true);
      }
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
            <View style={styles.section1}>
              <CustomText style={styles.guideCustomText}>핸드폰 번호를 인증해주세요.</CustomText>
            </View>
            <View style={styles.section2}>
              <CustomText style={styles.phoneVerifyCustomText}>
                핸드폰 번호를 입력해주세요.
              </CustomText>
              <CustomPicker
                value={nationCode}
                onValueChange={setNationCode}
                items={screenData.nationCodes}
                wrapperStyle={styles.phoneNumCountry}
              />
              <View style={styles.phoneInputWrap}>
                <CustomInput
                  value={tel}
                  maxLength={20}
                  onValueChange={handleTelChange}
                  regex={regex.number}
                  keyboardType='number-pad'
                  placeholder='Phone number'
                  errorMsg='Please enter numbers only.'
                  wrapperStyle={styles.phoneNumInput}
                />
                <CustomButton
                  fontColor={colors.white}
                  bgColor={colors.dark}
                  bgColorPress={colors.darkDeep}
                  wrapperStyle={styles.phoneVerifyButton}
                  width={110}
                  fontSize={15}
                  disabled={verifing && !openRetry}
                  onPress={requestSmsVerification}
                  text={verifing ? '재발송' : '인증번호 발송'}
                />
              </View>
              {verifing && (
                <View style={styles.phoneVerifyWrap}>
                  <CustomInput
                    value={verifyCode}
                    onValueChange={setVerifyCode}
                    maxLength={10}
                    keyboardType='number-pad'
                    wrapperStyle={styles.phoneVerifyInput}
                    placeholder='Verify code'
                    errorHandler={verifiyError}
                    errorMsg='Incorrect verify code.'
                  />
                  <Timer style={styles.verifyTimer} remain={remain} />
                </View>
              )}
            </View>
            <View style={styles.section3}>
              <View style={styles.helpWrap}>
                <CustomText style={styles.helpTitle}>인증번호가 오지 않나요?</CustomText>
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
            text='인증완료'
            disabled={!verifyData}
            onPress={submitVerifyCode}
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
    flex: 1,
  },
  section3: {
    flex: 3,
    justifyContent: 'space-between',
  },
  guideCustomText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  phoneVerifyCustomText: {
    fontSize: 16,
  },
  phoneNumCountry: {
    marginTop: 20,
  },
  phoneInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  phoneNumInput: {
    flex: 1,
  },
  phoneVerifyButton: {
    position: 'absolute',
    right: 0,
  },
  phoneVerifyInput: {
    marginTop: 10,
  },
  verifyTimer: {
    position: 'absolute',
    top: 23,
    right: 15,
    fontSize: 18,
    color: colors.danger,
  },

  submitTheme: { borderRadius: 0 },
});
