import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import serviceApis from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import PasswordSetting from '../../components/modules/PasswordSetting';

const FOOT_BUTTON_HEIGHT = 50;

const FindPasswordStep2View = (props) => {
  const { route } = props;

  const [password, setPassword] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate('welcome', params);
  };

  const submit = async () => {
    if(!setPassword) return;
    try {
      const response = await serviceApis.resetPassword({
        emailVerifyKey: route.params.emailVerifyKey,
        password: password
      });

      if(response.rsp_code=="1001"){
        Toast.show({
          type: 'success',
          text1: response.rsp_msg_detail,
        });
        goToNextStep({});
      }
    } catch (error) {}
  };

  return (
    <>
      <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
        <View style={styles.section1}>
          <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
            Please set a new password.
          </CustomText>
          <CustomText style={{ marginTop: 10 }}>
            The new password must contain at least one character, number, and
            special character.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <PasswordSetting onPasswordChange={setPassword}/>
        </View>
      </Container>
      <CustomButton
        fontColor={colors.white}
        bgColor={colors.dark}
        bgColorPress={colors.darkDeep}
        text='변경하기'
        disabled={!password}
        onPress={submit}
        styles={styles.submitTheme}
        height={FOOT_BUTTON_HEIGHT}
      />
    </>
  );
};
export default FindPasswordStep2View;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 50,
  },
  section2: {
    flex: 1,
  },

  submitTheme: { borderRadius: 0 },
});
