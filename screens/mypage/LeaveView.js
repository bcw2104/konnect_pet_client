import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layout/Container';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';
import SmsVerify from '../../components/modules/SmsVerify';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useStores } from '../../contexts/StoreContext';

const FOOT_BUTTON_HEIGHT = 50;

const LeaveView = () => {
  const {userStore} = useStores();

  const [screenData, setScreenData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [nationCode, setNationCode] = useState('');
  const [verifyKey, setVerifyKey] = useState(null);

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

  const submit = async () => {
    if (!verifyKey) return;

    const response = await serviceApis.leaveUser(verifyKey);

    if (response.rsp_code == '1000') {
      Toast.show({
        type: 'success',
        text1: "회원 탈퇴가 완료되었습니다.",
      });
      userStore.logout();
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
              <SmsVerify
                nationCodes={screenData.nationCodes}
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
            fontColor={colors.white}
            bgColor={colors.dark}
            bgColorPress={colors.darkDeep}
            text='인증완료'
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
export default LeaveView;

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
    color: colors.danger,
  },

  submitTheme: { borderRadius: 0 },
});
