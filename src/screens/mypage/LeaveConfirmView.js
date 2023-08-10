import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import { Navigator } from '../../navigations/Navigator';
import {COLORS} from '../../commons/colors';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const LeaveConfirmView = () => {
  const confirm = () => {
    Navigator.navigate({}, 'leave');
  };

  const cancel = () => {
    Navigator.goBack();
  };

  return (
    <Container header={true}>
      <View style={styles.section1}>
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
          정말 탈퇴하시겠습니까?
        </CustomText>
        <CustomText style={{ marginTop: 20 }} fontSize={18}>
          탈퇴하시면 모든 정보가 삭제됩니다.{'\n'}
          그래도 탈퇴하시겠습니까?
        </CustomText>
      </View>
      <View style={styles.section2}>
        <CustomButton
          fontColor={COLORS.dark}
          bgColor={COLORS.light}
          bgColorPress={COLORS.lightDeep}
          text='취소할게요'
          wrapperStyle={{ flex: 1, marginRight: 10 }}
          onPress={cancel}
        />
        <CustomButton
          fontColor={COLORS.white}
          bgColor={COLORS.dark}
          bgColorPress={COLORS.darkDeep}
          text='그래도 탈퇴할래요'
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
    paddingBottom: 20,
    flexDirection: 'row',
  },
});
