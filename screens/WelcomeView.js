import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import GoogleLogin from '../components/auth/GoogleLogin';
import { observer } from 'mobx-react-lite';
import DefaultLogin from '../components/auth/DefaultLogin';
import colors from '../commons/colors';
import Container from '../components/layout/Container';
import { useBackPressHandler } from '../hooks/useBackPressHandler';
import { Navigator } from '../navigations/Navigator';
import { platform } from '../commons/constants';
import FacebookLogin from '../components/auth/FacebookLogin';
import CustomText from '../components/elements/CustomText';

const Welcome = () => {
  useBackPressHandler();

  return (
    <Container>
      <View style={styles.section1}>
        <CustomText style={{ fontWeight: 'bold' }} fontSize={30}>
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
            fontColor={colors.grayDeep}
            fontSize={16}
          >
            Don't have an account?
          </CustomText>
          <Pressable
            onPress={() => {
              Navigator.navigate('signup_step1', { platform: platform.EMAIL });
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

export default observer(Welcome);

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    flex: 1,
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
    backgroundColor: colors.dark,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
});
