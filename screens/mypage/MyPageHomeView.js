import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import serviceApis from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';

const MyPageHomeView = () => {
  const { userStore } = useStores();

  const logout = () => {
    userStore.logout();
  };

  return (
    <Container header={true}>
      <Text>MypageView</Text>
      <CustomButton
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        text="로그아웃"
        fontColor={COLORS.white}
        onPress={logout}
        height={50}
        wrapperStyle={styles.submit}
      />
    </Container>
  );
};

export default MyPageHomeView;

const styles = StyleSheet.create({});
