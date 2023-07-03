import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';

const SettingView = () => {
  return (
    <Container>
      <View style={styles.section1}>
        <CustomText style={{ fontWeight: 'bold' }} fontSize={28}>
          Setting
        </CustomText>
      </View>
      <View style={styles.section2}>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>알림 설정</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>차단목록</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>문의하기</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('terms_list');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>이용약관</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>앱 정보</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>회원탈퇴</CustomText>
          <Ionicons name='chevron-forward-outline' size={28} color='black' />
        </Pressable>
      </View>
    </Container>
  );
};

export default SettingView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 7,
    paddingHorizontal:15
  },
  menuItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:15
  }
});
