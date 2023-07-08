import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useEffect } from 'react';
import colors from './../../commons/colors';
import CustomButton from './../../components/elements/CustomButton';
import serviceApis from './../../utils/ServiceApis';
import { Navigator } from './../../navigations/Navigator';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const SignupStep4View = (props) => {
  const { route } = props;
  const { userStore } = useStores();

  useEffect(() => {
    console.log(route.params);
  }, []);

  const submitSignupData = async () => {
    try {
      const response = await serviceApis.join({
        ...route.params,
      });
      console.log(response);
      if (response?.rsp_code === '1002') {
        Toast.show({
          type: 'success',
          text1: response.rsp_msg_detail,
        });
        asyncStorage.setItem('access_token', response.result.accessToken);
        asyncStorage.setItem(
          'access_token_expire_at',
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem('refresh_token', response.result.refreshToken);
        asyncStorage.setItem(
          'refresh_token_expire_at',
          response.result.refreshTokenExpireAt
        );
        userStore.initUserInfo();
      }
    } catch (error) {
      console.log(error);
      //Navigator.reset('welcome', {});
    }
  };

  return (
    <>
      <Container>
        <View style={styles.section1}>
          <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>거주지를 입력해주세요.</CustomText>
        </View>
        <View style={styles.section2}></View>
      </Container>
      <CustomButton
        fontColor={colors.white}
        bgColor={colors.dark}
        bgColorPress={colors.darkDeep}
        text='가입 완료'
        onPress={submitSignupData}
        styles={styles.submitTheme}
        height={50}
      />
    </>
  );
};

export default SignupStep4View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 4,
  },

  submitTheme: { borderRadius: 0 },
});
