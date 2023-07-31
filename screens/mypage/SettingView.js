import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import { FONT_WEIGHT } from '../../commons/constants';
import { useTabBarHandler } from '../../hooks/useTabBarHandler';
import { useStores } from '../../contexts/StoreContext';

const SettingView = () => {
  const { userStore, modalStore } = useStores();
  useTabBarHandler(false);

  const logout = () => {
    modalStore.openTwoButtonModal(
      '로그아웃 하시겠습니까?',
      '취소',
      null,
      '확인',
      () => {
        userStore.logout();
      }
    );
  };

  return (
    <Container header={true}>
      <View style={styles.section1}>
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
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
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            알림 설정
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            차단목록
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            문의하기
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('terms_list');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            이용약관
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            앱 정보
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable onPress={logout} style={styles.menuItem}>
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            로그아웃
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate('leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            회원탈퇴
          </CustomText>
          <Ionicons name="chevron-forward-outline" size={28} color="black" />
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
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
