import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import PasswordSetting from '../../components/modules/PasswordSetting';
import CustomText from '../../components/elements/CustomText';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import Container from '../../components/layouts/Container';
import CustomInput from '../../components/elements/CustomInput';
import { useStores } from '../../contexts/StoreContext';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';

const ChangePasswordView = () => {
  const { systemStore, modalStore } = useStores();
  const [password, setPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const submit = async () => {
    setCurrentPasswordError(false);
    systemStore.setIsLoading(true);
    if (currentPassword.length == 0) {
      setCurrentPasswordError(true);
      return;
    }

    try {
      const response = await serviceApis.changePassword(
        currentPassword,
        password
      );

      if (response.rsp_code == '1000') {
        modalStore.openOneButtonModal(
          'Password changed successfully.',
          'Confirm',
          () => {
            Navigator.goBack();
          }
        );
      } else {
        setCurrentPasswordError(true);
      }
    } catch (err) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  const handleCurrentPasswordChange = (password) => {
    setCurrentPassword(password);
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
            Please set a new password.
          </CustomText>
          <CustomText style={{ marginTop: 10 }}>
            The new password must contain at least one character, number, and
            special character.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <View
            style={{
              marginBottom: 15,
            }}
          >
            <CustomInput
              value={currentPassword}
              maxLength={16}
              onValueChange={handleCurrentPasswordChange}
              secureTextEntry={true}
              keyboardType="default"
              placeholder="Current Password"
              errorHandler={currentPasswordError}
              errorMsg="Invalid password."
            />
          </View>
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

export default ChangePasswordView;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 50,
  },
  section2: {
    flex: 1,
  },

  submitTheme: { borderRadius: 0 },
});
