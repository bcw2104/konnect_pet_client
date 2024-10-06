import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import GoogleLogin from '../components/auth/GoogleLogin';
import { observer } from 'mobx-react-lite';
import DefaultLogin from '../components/auth/DefaultLogin';
import { COLORS } from '../commons/colors';
import Container from '../components/layouts/Container';
import { Navigator } from '../navigations/Navigator';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../commons/constants';
import FacebookLogin from '../components/auth/FacebookLogin';
import CustomText from '../components/elements/CustomText';
import { asyncStorage } from '../storage/Storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Hr from '../components/elements/Hr';

const WelcomeView = () => {
  useEffect(() => {
    //산책 데이터 초기화
    asyncStorage.removeItem('walking_temp_data');
  }, []);

  return (
    <Container paddingHorizontal={30}>
      <KeyboardAwareScrollView>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={30}>
            Let's Sign You In
          </CustomText>
          <CustomText
            style={{ marginTop: 10 }}
            fontSize={16}
            fontColor={COLORS.grayDeep}
          >
            Welcome back, you've been missed!
          </CustomText>
        </View>
        <View style={styles.section2}>
          <View style={styles.loginWrap}>
            <DefaultLogin />
          </View>

          <View style={styles.optionsWrap}>
            <View style={styles.options}>
              <CustomText
                style={styles.optionText}
                fontColor={COLORS.grayDeep}
                fontSize={16}
              >
                Don't have an account?
              </CustomText>
              <Pressable
                onPress={() => {
                  Navigator.navigate(
                    {
                      platform: SOCIAL_TYPE.EMAIL,
                    },
                    'signup_step1'
                  );
                }}
                hitSlop={10}
              >
                <CustomText
                  style={{
                    marginLeft: 10,
                  }}
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontSize={16}
                >
                  Sign Up
                </CustomText>
              </Pressable>
            </View>
            <View style={styles.options}>
              <CustomText
                style={styles.optionText}
                fontColor={COLORS.grayDeep}
                fontSize={16}
              >
                Forget your password?
              </CustomText>
              <Pressable
                onPress={() => {
                  Navigator.navigate({}, 'find_password_step1');
                }}
                hitSlop={10}
              >
                <CustomText
                  style={{
                    marginLeft: 10,
                  }}
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontSize={16}
                >
                  Recover
                </CustomText>
              </Pressable>
            </View>
          </View>
          <Hr />
          <View style={styles.socialWrap}>
            <GoogleLogin />
            <FacebookLogin />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default observer(WelcomeView);

const styles = StyleSheet.create({
  section1: {
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  section2: {},
  socialWrap: {
    marginBottom: 30,
    marginTop: 20,
  },
  optionsWrap: {
    marginVertical: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
});
