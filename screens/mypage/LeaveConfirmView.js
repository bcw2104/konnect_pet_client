import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import { Navigator } from '../../navigations/Navigator';
import colors from '../../commons/colors';

const LeaveConfirmView = () => {
  const confirm = () => {
    Navigator.navigate('leave', {});
  };

  const cancel = () => {
    Navigator.goBack();
  };

  return (
    <Container>
      <View style={styles.section1}>
        <Text>정말 탈퇴하시겠습니까?</Text>
      </View>
      <View style={styles.section2}>
        <CustomButton
          fontColor={colors.dark}
          bgColor={colors.light}
          bgColorPress={colors.lightDeep}
          text='취소할게요.'
          wrapperStyle={{ flex: 1, marginRight: 10 }}
          onPress={cancel}
        />
        <CustomButton
          fontColor={colors.white}
          bgColor={colors.dark}
          bgColorPress={colors.darkDeep}
          text='그래도 탈퇴할래요.'
          wrapperStyle={{ flex: 1 }}
          onPress={confirm}
        />
      </View>
    </Container>
  );
};

export default LeaveConfirmView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 1,
    flexDirection: 'row',
  },
});
