import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import CustomText from '../../components/elements/CustomText';
import SmsVerify from '../../components/modules/SmsVerify';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';

const LeaveView = () => {
  const { userStore } = useStores();

  const [nationCode, setNationCode] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

  const submit = async () => {
    if (!verifyKey) return;

    const response = await serviceApis.leaveUser(verifyKey);

    if (response.rsp_code == '1000') {
      Toast.show({
        type: 'success',
        text1: '회원 탈퇴가 완료되었습니다.',
      });
      userStore.logout();
    }
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD}  fontSize={24}>
            핸드폰 번호를 인증해주세요.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <SmsVerify
            fixedTel={userStore.tel}
            nationCode={nationCode}
            onNationCodeChange={setNationCode}
            verifyKey={verifyKey}
            onVerifyKeyChange={setVerifyKey}
            requestVerificationApi={serviceApis.requestSmsVerification}
            submitVerificationApi={serviceApis.submitSmsVerification}
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
        text='인증완료'
        disabled={!verifyKey}
        onPress={submit}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};
export default observer(LeaveView);

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 3,
  },
  section3: {
    flex: 2,
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
    color: COLORS.danger,
  },

  submitTheme: { borderRadius: 0 },
});
