import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useState } from 'react';
import useInterval from '../../hooks/useInertval';
import CustomButton from '../elements/CustomButton';
import CustomInput from '../elements/CustomInput';
import Timer from '../elements/Timer';
import { REGEX } from '../../commons/regex';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';

const VERIFY_TIMEOUT = 600;

const EmailVerify = ({
  fixedEmail = '',
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

  const [email, setEmail] = useState(fixedEmail);
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
    const test = REGEX.email.test(email);

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
    <View>
      <View style={styles.emailInputWrap}>
        <CustomInput
          title="Email address"
          value={email}
          editable={!fixedEmail}
          maxLength={50}
          onValueChange={handleEmailChange}
          keyboardType="email-address"
          errorHandler={emailError}
          errorMsg="Invalid email address."
          append={
            <CustomButton
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.white}
              bgColor={COLORS.dark}
              bgColorPress={COLORS.darkDeep}
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
          }
        />
      </View>
      {verifing && (
        <View style={styles.emailVerifyWrap}>
          <CustomInput
            title="Verify code"
            value={verifyCode}
            onValueChange={setVerifyCode}
            maxLength={10}
            keyboardType="default"
            wrapperStyle={styles.emailVerifyInput}
            errorHandler={verifiyError}
            errorMsg="Incorrect verify code."
            append={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Timer
                  style={{ marginRight: 10 }}
                  remain={remain}
                  fontColor={COLORS.danger}
                  fontSize={16}
                />
                <CustomButton
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontColor={COLORS.white}
                  bgColor={COLORS.dark}
                  bgColorPress={COLORS.darkDeep}
                  width={110}
                  fontSize={15}
                  onPress={submitVerifyCode}
                  text="인증하기"
                />
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({
  emailInputWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  emailVerifyWrap: {
    marginTop: 20,
    position: 'relative',
    alignItems: 'center',
  },
});
