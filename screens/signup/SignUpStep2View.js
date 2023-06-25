import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layout/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import CustomInput from '../../components/elements/CustomInput';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { useState } from 'react';
import { useEffect } from 'react';
import regex from '../../commons/regex';
import { platform } from './../../commons/constants';
import Timer from '../../components/elements/Timer';

const FOOT_BUTTON_HEIGHT = 50;
const VERIFY_TIMEOUT = 600;

const SignupStep2View = (props) => {
  const { route } = props;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [password2, setPassword2] = useState('');
  const [password2Error, setPassword2Error] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);
  const [openRetry, setOpenRetry] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [isVerifySuccess, setIsVerifySuccess] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

  useEffect(() => {
    console.log(route.params);
    if (route.params.platform != platform.EMAIL) {
      goToNextStep({});
    }
  }, []);

  const goToNextStep = (params) => {
    Navigator.navigate('signup_step3', { ...params, ...route.params });
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
        if (!isVerifySuccess) {
          setVerifyData(null);
        }
      }
    }
  }, 1000);

  const resetVerifyStatus = () => {
    setOpenRetry(false);
    setVerifing(false);
    setVerifiyError(false);
    setVerifyCode('');
  };

  const handleEmailChange = (email) => {
    resetVerifyStatus();
    setIsVerifySuccess(false);
    setVerifyData(null);
    setEmailError(false);
    setEmail(email);
  };

  const confirmPassword = (password1, password2) => {
    const test = regex.password.test(password1);

    if (!test) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (password1 != password2) {
      setIsPasswordSuccess(false);
      setPassword2Error(true);
    } else {
      setIsPasswordSuccess(test);
      setPassword2Error(false);
    }
  };

  const handlePasswordChange = (password) => {
    confirmPassword(password, password2);
    setPassword(password);
  };

  const handlePassword2Change = (password2) => {
    confirmPassword(password, password2);
    setPassword2(password2);
  };

  const requestSmsVerification = async () => {
    const test = regex.email.test(email);

    if (!test) {
      setEmailError(true);
      return;
    }
    setOpenRetry(false);
    setVerifing(true);
    setRemain(VERIFY_TIMEOUT);
    try {
      const response = await serviceApis.requestEmailVerification(email);
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
    if (!verifyData) return;

    setVerifiyError(false);
    try {
      const response = await serviceApis.submitEmailVerification(
        verifyData.reqId,
        verifyData.timestamp,
        verifyCode
      );
      2;
      if (response.rsp_code === '1000') {
        setIsVerifySuccess(true);
        resetVerifyStatus();
        setRemain(0);
      }
    } catch (error) {
      setVerifiyError(true);
    }
  };

  const submitSignupData = async () => {
    goToNextStep({
      emailReqId: verifyData.reqId,
      emailTimestamp: verifyData.timestamp,
      email: email,
      password: password,
    });
  };

  return (
    <>
      <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
        <View style={styles.section1}>
          <Text style={styles.guideText}>가입 정보를 입력해주세요.</Text>
        </View>
        <View style={styles.section2}>
          <Text style={styles.emailVerifyText}>이메일을 입력해주세요.</Text>
          <View style={styles.emailInputWrap}>
            <CustomInput
              value={email}
              maxLength={20}
              onValueChange={handleEmailChange}
              keyboardType='email-address'
              placeholder='Email address'
              errorHandler={emailError}
              errorMsg='Invalid email address.'
              wrapperStyle={styles.emailAddressInput}
            />
            <CustomButton
              fontColor={colors.white}
              bgColor={colors.dark}
              bgColorPress={colors.darkDeep}
              wrapperStyle={styles.emailVerifyButton}
              width={110}
              fontSize={15}
              disabled={isVerifySuccess || (verifing && !openRetry)}
              onPress={requestSmsVerification}
              text={
                isVerifySuccess
                  ? '인증 완료'
                  : verifing
                  ? '재발송'
                  : '인증번호 발송'
              }
            />
          </View>
          {verifing && (
            <View style={styles.emailVerifyWrap}>
              <CustomInput
                value={verifyCode}
                onValueChange={setVerifyCode}
                maxLength={10}
                keyboardType='default'
                wrapperStyle={styles.emailVerifyInput}
                placeholder='Verify code'
                errorHandler={verifiyError}
                errorMsg='Incorrect verify code.'
              />
              <Timer style={styles.verifyTimer} remain={remain} />
              <CustomButton
                fontColor={colors.white}
                bgColor={colors.dark}
                bgColorPress={colors.darkDeep}
                wrapperStyle={styles.verifySubmitButton}
                width={110}
                fontSize={15}
                onPress={submitVerifyCode}
                text='인증하기'
              />
            </View>
          )}
        </View>
        <View style={styles.section3}>
          <Text style={styles.passwordText}>비밀번호를 입력해주세요.</Text>
          <View style={styles.passwordInputWrap}>
            <CustomInput
              value={password}
              maxLength={20}
              onValueChange={handlePasswordChange}
              secureTextEntry={true}
              keyboardType='default'
              placeholder='Password'
              errorHandler={passwordError}
              errorMsg='Password must contain at least one character, special character, and number.'
            />
            <CustomInput
              value={password2}
              maxLength={20}
              onValueChange={handlePassword2Change}
              secureTextEntry={true}
              keyboardType='default'
              placeholder='Verify password'
              errorHandler={password2Error}
              errorMsg='Passwords do not match.'
              wrapperStyle={styles.password2Input}
            />
          </View>
        </View>
        <View style={styles.section4}>
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
        text='다음'
        disabled={!isVerifySuccess || !isPasswordSuccess}
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
  guideText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailVerifyText: {
    fontSize: 16,
  },
  emailAddressCountry: {
    marginTop: 20,
  },
  emailInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  emailAddressInput: {
    flex: 1,
  },
  emailVerifyButton: {
    position: 'absolute',
    right: 0,
  },
  emailVerifyWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },
  verifyTimer: {
    position: 'absolute',
    top: 13,
    right: 125,
    fontSize: 18,
    color: colors.danger,
  },
  verifySubmitButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  passwordInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },

  password2Input: {
    marginTop: 10,
  },

  submitTheme: { borderRadius: 0 },
});
