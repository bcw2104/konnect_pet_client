import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layout/Container';
import CustomInput from '../../components/elements/CustomInput';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from './../../utils/ServiceApis';
import CustomPicker from './../../components/elements/CustomPicker';
import { navigate } from '../../navigations/Navigator';
import moment from 'moment/moment';
import useInterval from './../../hooks/useInertval';

const SignUpStep1View = () => {
  const FOOT_BUTTON_HEIGHT = 50;
  const [screenData, setScreenData] = useState({});
  const [countryCode, setCountryCode] = useState('');
  const [tel, setTel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [verifyData, setVerifyData] = useState(null);

  const VERIFY_TIMEOUT = 180;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const screenData = await serviceApis.screenSignUpStep1();

        setScreenData(screenData.result);
        setCountryCode(screenData.result.countryCodes[0].value);
        setIsLoaded(true);
      } catch (error) {
        navigate('welcome', {});
      }
    };
    fetchData();
  }, []);

  useInterval(() => {
    if (remain > 0) {
      setRemain(remain - 1);
    } else {
      if(verifing){
        setVerifing(false);
        setVerifyData(null);
        setVerifiyError(false);
        setVerifyCode('');
      }
    }
  }, 1000);

  const handleTelChange = (tel) => {
    setTel(tel);
  };

  const requestSmsVerification = async () => {
    setVerifing(true);
    setRemain(VERIFY_TIMEOUT);
    try {
      const response = await serviceApis.requestSmsVerification(
        countryCode + tel
      );
      setVerifyData({
        reqId: response.result.reqId,
        timestamp: response.result.timestamp,
      });
    } catch (error) {
      setRemain(0);
      setVerifing(false);
    }
  };

  const submitVerifyCode = async () => {
    if(!verifyData) return;

    setVerifiyError(false);
    try {
      const response = await serviceApis.submitSmsVerification(
        verifyData.reqId,
        verifyData.timestamp,
        verifyCode
      );

      if (response.rsp_code === '1000') {
        setRemain(0);
        navigate('signup_step2', {
          smsReqId: verifyData.reqId,
          smsTimestamp: verifyData.timestamp,
        });
      }
    } catch (error) {
      setVerifiyError(true);
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
            <View style={styles.section1}>
              <Text style={styles.guideText}>핸드폰 번호를 인증해주세요.</Text>
            </View>
            <View style={styles.section2}>
              <Text style={styles.phoneVerifyText}>
                핸드폰 번호를 입력해주세요.
              </Text>
              <CustomPicker
                value={countryCode}
                onValueChange={setCountryCode}
                items={screenData.countryCodes}
                wrapperStyle={styles.phoneNumCountry}
              />
              <View style={styles.phoneVerifyWrap}>
                <CustomInput
                  value={tel}
                  maxLength={20}
                  onValueChange={handleTelChange}
                  regex={/^[0-9]+$/}
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
                  disabled={verifing}
                  onPress={requestSmsVerification}
                  text='인증번호 발송'
                />
              </View>
              {verifing && (
                <View>
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
                  <Text style={styles.verifyTimer}>
                    {`${moment.duration(remain, 's').minutes()}:${("00"+moment.duration(remain, 's').seconds())?.slice(-2)}`}</Text>
                </View>
              )}
            </View>
            <View style={styles.section3}>
              <View style={styles.helpWrap}>
                <Text style={styles.helpTitle}>인증번호가 오지 않나요?</Text>
                <Text style={styles.helpContent}>
                  인증번호가 오지 않나요?에 대한 내용입니다. 인증번호가 오지
                  않나요?에 대한 내용입니다. 인증번호가 오지 않나요?에 대한
                  내용입니다.
                </Text>
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
export default SignUpStep1View;

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
  guideText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  phoneVerifyText: {
    fontSize: 16,
  },
  phoneNumCountry: {
    marginTop: 20,
  },
  phoneVerifyWrap: {
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
