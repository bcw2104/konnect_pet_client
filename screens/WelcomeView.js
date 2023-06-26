import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GoogleLogin from '../components/auth/GoogleLogin';
import { observer } from 'mobx-react-lite';
import DefaultLogin from '../components/auth/DefaultLogin';
import colors from '../commons/colors';
import Container from '../components/layout/Container';
import { useBackPressHandler } from '../hooks/useBackPressHandler';
import { Navigator } from '../navigations/Navigator';
import { platform } from '../commons/constants';
import FacebookLogin from '../components/auth/FacebookLogin';

const Welcome = () => {
  useBackPressHandler();

  return (
    <Container>
      <View style={styles.section1}>
        <Text style={styles.title}>반가워요!aaa</Text>
        <Text style={styles.titleSub}>산책을 시작해볼까요?</Text>
      </View>
      <View style={styles.section2}>
        <View style={styles.loginWrap}>
          <DefaultLogin />
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialWrap}>
          <GoogleLogin />
          <FacebookLogin />
          <GoogleLogin />
        </View>
        <View style={styles.optionsWrap}>
          <Text style={styles.optionText}>Find Password</Text>
          <Text style={[styles.optionText, styles.bar]}>|</Text>
          <Pressable
            onPress={() => {
              Navigator.navigate('signup_step1', { platform: platform.EMAIL });
            }}
            hitSlop={10}
          >
            <Text style={styles.optionText}>Sign Up</Text>
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
  optionText: {
    color: colors.dark,
    fontSize: 16,
  },

  divider: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 30,
    width: 200,
  },
  dividerText: {
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
