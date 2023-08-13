import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import { FONT_WEIGHT } from '../../commons/constants';
import { useStores } from '../../contexts/StoreContext';
import { COLORS } from '../../commons/colors';

const SettingView = () => {
  const { userStore, modalStore } = useStores();

  const logout = () => {
    modalStore.openTwoButtonModal(
      '로그아웃 하시겠습니까?',
      'Cancel',
      null,
      'Confirm',
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
            Navigator.navigate({}, 'leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            알림 설정
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            차단목록
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            문의하기
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'terms_list');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            이용약관
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            앱 정보
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable onPress={logout} style={styles.menuItem}>
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            로그아웃
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
        </Pressable>
        <Pressable
          onPress={() => {
            Navigator.navigate({}, 'leave_confirm');
          }}
          style={styles.menuItem}
        >
          <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
            회원탈퇴
          </CustomText>
          <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
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
