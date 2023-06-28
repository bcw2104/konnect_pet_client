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
        <CustomText style={styles.title}>반가워요!aaa</CustomText>
        <CustomText style={styles.titleSub}>산책을 시작해볼까요?</CustomText>
      </View>
      <View style={styles.section2}>
        <View style={styles.loginWrap}>
          <DefaultLogin />
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <CustomText style={styles.dividerCustomText}>OR</CustomText>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialWrap}>
          <GoogleLogin />
          <FacebookLogin />
          <GoogleLogin />
        </View>
        <View style={styles.optionsWrap}>
          <CustomText style={styles.optionCustomText}>Find Password</CustomText>
          <CustomText style={[styles.optionCustomText, styles.bar]}>|</CustomText>
          <Pressable
            onPress={() => {
              Navigator.navigate('signup_step1', { platform: platform.EMAIL });
            }}
            hitSlop={10}
          >
            <CustomText style={styles.optionCustomText}>Sign Up</CustomText>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  titleSub: {
    marginTop: 10,
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
  optionCustomText: {
    color: colors.dark,
    fontSize: 16,
  },

  divider: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 30,
    width: 200,
  },
  dividerCustomText: {
    color: colors.dark,
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: 13,
  },
  dividerLine: {
    backgroundColor: colors.dark,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  bar: {
    marginHorizontal: 10,
    color: colors.dark,
  },
});
