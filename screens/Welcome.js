import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import GoogleLogin from '../components/auth/GoogleLogin';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import DefaultLogin from '../components/auth/DefaultLogin';
import colors from '../commons/colors';

WebBrowser.maybeCompleteAuthSession();

const Welcome = () => {
  const { userStore } = useStores();

  return (
    <>
      {userStore.token != null ? (
        <></>
      ) : (
        <View style={styles.container}>
          <View style={styles.section1}>
            <Text style={styles.title}>반가워요!</Text>
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
              <GoogleLogin />
              <GoogleLogin />
            </View>
            <View style={styles.optionsWrap}>
              <Text style={styles.optionText}>Find Password</Text>
              <Text style={[styles.optionText, styles.bar]}>|</Text>
              <Text style={styles.optionText}>Sign Up</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default observer(Welcome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
