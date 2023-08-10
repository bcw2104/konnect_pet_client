import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from '../elements/CustomText';
import CustomPicker from '../elements/CustomPicker';
import CustomInput from '../elements/CustomInput';
import CustomButton from '../elements/CustomButton';
import Timer from '../elements/Timer';
import { useState } from 'react';
import useInterval from './../../hooks/useInertval';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import {REGEX} from '../../commons/regex';
import serviceApis from './../../utils/ServiceApis';
import { useEffect } from 'react';
import { Navigator } from '../../navigations/Navigator';
import {COLORS} from '../../commons/colors';

const VERIFY_TIMEOUT = 180;

const SmsVerify = ({
  fixedTel = null,
  nationCode = null,
  onNationCodeChange = (value) => {},
  verifyKey = null,
  onVerifyKeyChange = (value) => {},
  requestVerificationApi,
  submitVerificationApi,
}) => {
  const [nationCodes, setNationCodes] = useState([]);

  const [tel, setTel] = useState(fixedTel);
  const [telError, setTelError] = useState(false);

  const [verifyCode, setVerifyCode] = useState('');
  const [verifiyError, setVerifiyError] = useState(false);
  const [remain, setRemain] = useState(0);
  const [verifing, setVerifing] = useState(false);
  const [openVerify, setOpenVerify] = useState(true);
  const [verifyData, setVerifyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.telNations();
        const nationCodes = response.result.nationCodes;
        setNationCodes(nationCodes);
        onNationCodeChange(nationCodes[0].value);
      } catch (error) {
        Navigator.reset({}, 'welcome');
      }
    };

    if (!fixedTel) fetchData();
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

  const handleNationCodeChange = (nationCode) => {
    resetVerifyStatus();
    onVerifyKeyChange(null);
    setVerifyData(null);
    onNationCodeChange(nationCode);
  };

  const handleTelChange = (tel) => {
    resetVerifyStatus();
    onVerifyKeyChange(null);
    setVerifyData(null);
    setTel(tel);
    setTelError(false);
  };

  const requestVerification = async () => {
    if (!fixedTel) {
      const test = REGEX.tel.test(tel);

      if (!test) {
        setTelError(true);
        return;
      }
    }

    setOpenVerify(false);

    let reqTel = tel;
    try {
      const response = await requestVerificationApi(nationCode + reqTel);
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
      const response = await submitVerificationApi(
        verifyData.reqId,
        verifyData.timestamp,
        verifyData.tel,
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
      {!fixedTel && (
        <CustomPicker
          value={nationCode}
          onValueChange={handleNationCodeChange}
          items={nationCodes}
          itemStyle={{ fontSize: 16 }}
          wrapperStyle={{
            marginTop: 20,
          }}
        />
      )}
      <View style={styles.phoneInputWrap}>
        <CustomInput
          value={tel}
          maxLength={20}
          editable={!fixedTel}
          onValueChange={handleTelChange}
          regex={REGEX.number}
          keyboardType="number-pad"
          placeholder="Phone number"
          errorHandler={telError}
          errorMsg="Invalid phone number."
        />
        <CustomButton
          fontColor={COLORS.white}
          bgColor={COLORS.dark}
          bgColorPress={COLORS.darkDeep}
          wrapperStyle={styles.phoneVerifyButton}
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
        <View style={styles.phoneVerifyWrap}>
          <CustomInput
            value={verifyCode}
            onValueChange={setVerifyCode}
            maxLength={6}
            keyboardType="number-pad"
            wrapperStyle={styles.phoneVerifyInput}
            placeholder="Verify code"
            errorHandler={verifiyError}
            errorMsg="Incorrect verify code."
          />
          <Timer
            style={styles.verifyTimer}
            remain={remain}
            fontColor={COLORS.danger}
            fontSize={16}
          />
          <CustomButton
            fontColor={COLORS.white}
            bgColor={COLORS.dark}
            bgColorPress={COLORS.darkDeep}
            wrapperStyle={styles.verifySubmitButton}
            width={110}
            fontSize={15}
            onPress={submitVerifyCode}
            text="인증하기"
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default SmsVerify;

const styles = StyleSheet.create({
  phoneInputWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  phoneVerifyButton: {
    position: 'absolute',
    right: 0,
  },

  phoneVerifyWrap: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },
  verifyTimer: {
    position: 'absolute',
    top: 11,
    right: 125,
  },
  verifySubmitButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
