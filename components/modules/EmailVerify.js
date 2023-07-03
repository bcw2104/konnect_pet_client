import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import useInterval from '../../hooks/useInertval';
import CustomButton from '../elements/CustomButton';
import CustomInput from '../elements/CustomInput';
import Timer from '../elements/Timer';
import { Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import regex from '../../commons/regex';

const VERIFY_TIMEOUT = 600;

const EmailVerify = ({
  defaultEmail = '',
  verifyKey = null,
  onVerifyKeyChange = (value) => {},
  requestVerificationApi,
  submitVerificationApi,
}) => {
  const [verifyData, setVerifyData] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);

  const [email, setEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState(false);

  const [openVerify, setOpenVerify] = useState(true);

  useInterval(() => {
    if (remain > 0) {
      if (remain == VERIFY_TIMEOUT - 5) {
        setOpenVerify(true);
      }
      setRemain(remain - 1);
    } else {
      if (verifing) {
        resetVerifyStatus();
      }
    }
  }, 1000);

  const resetVerifyStatus = () => {
    setOpenVerify(true);
    setVerifyData(null);
    setVerifing(false);
    setVerifiyError(false);
    setVerifyCode('');
  };

  const handleEmailChange = (email) => {
    resetVerifyStatus();
    onVerifyKeyChange(null);
    setVerifyData(null);
    setEmailError(false);
    setEmail(email);
  };

  const requestVerification = async () => {
    const test = regex.email.test(email);

    if (!test) {
      setEmailError(true);
      return;
    }

    setOpenVerify(false);

    try {
      const response = await requestVerificationApi(email);
      setRemain(VERIFY_TIMEOUT);
      setVerifing(true);

      setVerifyData({
        reqId: response.result.reqId,
        timestamp: response.result.timestamp,
        email: email,
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
      const response = await submitVerificationApi(
        verifyData.reqId,
        verifyData.timestamp,
        verifyData.email,
        verifyCode
      );
      if (response.rsp_code === '1000') {
        resetVerifyStatus();
        setRemain(0);
        setOpenVerify(false);
        onVerifyKeyChange(response.result.key);
      }
    } catch (error) {
      if (
        error.response.data.rsp_code == '9211' ||
        error.response.data.rsp_code == '9212'
      ) {
        setVerifiyError(true);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.emailInputWrap}>
        <CustomInput
          value={email}
          disabled={!!defaultEmail}
          maxLength={20}
          onValueChange={handleEmailChange}
          keyboardType='email-address'
          placeholder='Email address'
          errorHandler={emailError}
          errorMsg='Invalid email address.'
        />
        <CustomButton
          fontColor={colors.white}
          bgColor={colors.dark}
          bgColorPress={colors.darkDeep}
          wrapperStyle={styles.emailVerifyButton}
          width={110}
          fontSize={15}
          disabled={!openVerify}
          onPress={requestVerification}
          text={
            !!verifyKey
              ? '인증 완료'
              : !verifing && !openVerify
              ? '전송 중'
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
    </KeyboardAvoidingView>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({
  emailInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    color: colors.danger,
  },
  verifySubmitButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
