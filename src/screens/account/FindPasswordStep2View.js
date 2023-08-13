import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { Navigator } from '../../navigations/Navigator';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { serviceApis } from '../../utils/ServiceApis';
import { useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import PasswordSetting from '../../components/modules/PasswordSetting';
import { FONT_WEIGHT } from '../../commons/constants';

const FindPasswordStep2View = (props) => {
  const { route } = props;

  const [password, setPassword] = useState(null);

  const goToNextStep = (params) => {
    Navigator.navigate(params, 'welcome');
  };

  const submit = async () => {
    if (!setPassword) return;
    try {
      const response = await serviceApis.resetPassword({
        emailVerifyKey: route.params.emailVerifyKey,
        password: password,
      });

      if (response.rsp_code == '1001') {
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
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
            Please set a new password.
          </CustomText>
          <CustomText style={{ marginTop: 10 }}>
            The new password must contain at least one character, number, and
            special character.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <PasswordSetting onPasswordChange={setPassword} />
        </View>
      </Container>
      <CustomButton
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        text="Confirm"
        disabled={!password}
        onPress={submit}
        style={styles.submitTheme}
        height={60}
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
