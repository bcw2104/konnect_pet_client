import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomButton from '../../components/elements/CustomButton';
import { Navigator } from '../../navigations/Navigator';
import { COLORS } from '../../commons/colors';
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
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
          Are You Sure?
        </CustomText>
        <CustomText style={{ marginTop: 10 }} fontSize={16}>
          If you go ahead and withdraw your membership,{'\n'}
          please understand that the cherished memories you've shared with your
          pet will be permanently{'\n'}
          removed and cannot be restored. {'\n'}
          {'\n'}
          Are you still certain you wish to proceed with the withdrawal?
        </CustomText>
      </View>
      <View style={styles.section2}>
        <CustomButton
          fontColor={COLORS.dark}
          bgColor={COLORS.light}
          bgColorPress={COLORS.lightDeep}
          text="취소할게요"
          wrapperStyle={{ flex: 1, marginRight: 10 }}
          onPress={cancel}
        />
        <CustomButton
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.white}
          bgColor={COLORS.main}
          bgColorPress={COLORS.mainDeep}
          text="그래도 탈퇴할래요"
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
