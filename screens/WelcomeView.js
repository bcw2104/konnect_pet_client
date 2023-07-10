import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import GoogleLogin from '../components/auth/GoogleLogin';
import { observer } from 'mobx-react-lite';
import DefaultLogin from '../components/auth/DefaultLogin';
import COLORS from '../commons/colors';
import Container from '../components/layouts/Container';
import { Navigator } from '../navigations/Navigator';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../commons/constants';
import FacebookLogin from '../components/auth/FacebookLogin';
import CustomText from '../components/elements/CustomText';

const WelcomeView = () => {

  return (
    <Container>
      <View style={styles.section1}>
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={30}>
          반가워요!
        </CustomText>
        <CustomText style={{ marginTop: 10 }}>산책을 시작해볼까요?</CustomText>
      </View>
      <View style={styles.section2}>
        <View style={styles.loginWrap}>
          <DefaultLogin />
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <CustomText style={styles.dividerText} fontSize={13}>OR</CustomText>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialWrap}>
          <GoogleLogin />
          <FacebookLogin />
          <GoogleLogin />
        </View>
        <View style={styles.optionsWrap}>
          <CustomText
            style={styles.optionText}
            fontColor={COLORS.grayDeep}
            fontSize={16}
          >
            Don't have an account?
          </CustomText>
          <Pressable
            onPress={() => {
              Navigator.navigate('signup_step4', { platform: SOCIAL_TYPE.EMAIL });
            }}
            hitSlop={10}
          >
            <CustomText
              style={{
                marginLeft: 10,
                textDecorationLine: 'underline',
              }}
              fontSize={16}
            >
              Sign Up
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Container>
  );
};

export default observer(WelcomeView);

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    flex: 3,
  },
  loginWrap: {
    alignItems: 'center',
  },
  socialWrap: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  optionsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  divider: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 30,
    width: 200,
  },
  dividerText: {
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  dividerLine: {
    backgroundColor: COLORS.dark,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
});
