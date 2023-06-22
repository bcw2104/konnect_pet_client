import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layout/Container';
import CustomInput from '../../components/elements/CustomInput';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import CustomPicker from '../../components/elements/CustomPicker';

const SignUpStep1View = () => {
  const FOOT_BUTTON_HEIGHT = 50;
  
  return (
    <>
      <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
        <View style={styles.section1}>
          <Text style={styles.guideText}>핸드폰 번호를 인증해주세요.</Text>
        </View>
        <View style={styles.section2}>
          <Text style={styles.phoneAuthText}>핸드폰 번호를 입력해주세요.</Text>
          <View style={styles.phoneAuthWrap}>
            <CustomPicker
              defaultValue={}
            />
            <CustomInput
              keyboardType='phone-pad'
              wrapperStyle={styles.phoneNumInput}
            />
            <CustomButton
              fontColor={colors.white}
              bgColor={colors.dark}
              bgColorPress={colors.darkDeep}
              width={110}
              fontSize={15}
              onPress={() => {}}
              text='인증번호 발송'
            />
          </View>
          <CustomInput
            keyboardType='number-pad'
            wrapperStyle={styles.phoneAuthInput}
            placeholder='인증번호 입력'
          />
        </View>
        <View style={styles.section3}>
          <View style={styles.helpWrap}>
            <Text style={styles.helpTitle}>인증번호가 오지 않나요?</Text>
            <Text style={styles.helpContent}>
              인증번호가 오지 않나요?에 대한 내용입니다. 인증번호가 오지
              않나요?에 대한 내용입니다. 인증번호가 오지 않나요?에 대한
              내용입니다.
            </Text>
          </View>
        </View>
      </Container>
      <CustomButton
        fontColor={colors.white}
        bgColor={colors.dark}
        bgColorPress={colors.darkDeep}
        text='인증완료'
        styles={styles.submitTheme}
        height={FOOT_BUTTON_HEIGHT}
      />
    </>
  );
};
export default SignUpStep1View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 1,
  },
  section3: {
    flex: 3,
    justifyContent: 'space-between',
  },
  guideText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  phoneAuthText: {
    fontSize: 16,
  },
  phoneAuthWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  phoneNumInput: {
    flexGrow: 1,
    marginRight: 10,
  },
  phoneAuthInput: {
    flex: 1,
    marginTop: 10,
  },

  submitTheme: {borderRadius:0},
});
