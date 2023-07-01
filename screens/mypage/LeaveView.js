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
import { platform } from '../../commons/constants';

const FOOT_BUTTON_HEIGHT = 50;
const VERIFY_TIMEOUT = 180;

const LeaveView = (props) => {
  const { route } = props;
  const [screenData, setScreenData] = useState({});
  const [nationCode, setNationCode] = useState('');
  const [tel, setTel] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);
  const [openVerify, setOpenVerify] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [verifyData, setVerifyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const screenData = await serviceApis.screenLeave();
        setScreenData(screenData.result);
        setNationCode(screenData.result.nationCodes[0].value);
        setIsLoaded(true);
      } catch (error) {
        Navigator.reset('home', {});
      }
    };
    fetchData();
  }, []);

  useInterval(() => {
    if (remain > 0) {
      if (remain == VERIFY_TIMEOUT - 5) {
        setOpenVerify(true);
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
    setOpenVerify(true);
    setVerifing(false);
    setVerifiyError(false);
    setVerifyCode('');
  };

  const handleTelChange = (tel) => {
    resetVerifyStatus();
    setVerifyData(null);
    setTel(tel);
  };

  const requestVerification = async () => {
    setOpenVerify(false);

    let reqTel = tel;
    try {
      const response = await serviceApis.requestJoinSmsVerification(
        nationCode + reqTel
      );

      setRemain(VERIFY_TIMEOUT);
      setVerifing(true);

      setVerifyData({
        reqId: response.result.reqId,
        tel: response.result.tel,
        timestamp: response.result.timestamp,
      });
    } catch (error) {
      setRemain(0);
      setVerifing(false);
      setOpenVerify(true);
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
          smsVerifyKey: response.result.key,
          nationCode: nationCode,
        });
        resetVerifyStatus();
        setVerifyData(null);
        setRemain(0);
      }
    } catch (error) {
      if (error.response.data.rsp_code != '9213') {
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
              <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
                핸드폰 번호를 인증해주세요.
              </CustomText>
            </View>
            <View style={styles.section2}>
              <CustomText fontSize={16}>핸드폰 번호를 입력해주세요.</CustomText>
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
                  disabled={!openVerify}
                  onPress={requestVerification}
                  text={
                    !verifing && !openVerify
                      ? '전송 중'
                      : verifing
                      ? '재발송'
                      : '인증번호 발송'
                  }
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
export default LeaveView;

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
    color: colors.danger,
  },

  submitTheme: { borderRadius: 0 },
});
