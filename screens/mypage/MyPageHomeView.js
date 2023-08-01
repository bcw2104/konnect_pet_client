import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import COLORS from '../../commons/colors';
import { observer } from 'mobx-react-lite';
import PetList from '../../components/mypage/PetList';
import Profile from '../../components/mypage/Profile';

const MyPageHomeView = () => {
  return (
    <Container header={true}>
      <ScrollView>
        <View style={styles.section1}>
          <View style={styles.element}>
            <CustomText
              style={styles.title}
              fontSize={20}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              내 프로필
            </CustomText>
            <View style={styles.profileWrap}>
              <Profile />
            </View>
          </View>
          <View style={styles.element}>
            <CustomText
              style={styles.title}
              fontSize={20}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              내 반려견
            </CustomText>
            <View style={styles.petWrap}>
              <PetList />
            </View>
          </View>
        </View>

        <View style={styles.section2}>{/* 내 누적 정보 및 포인트 */}</View>

        <View style={styles.section3}>{/* 쇼핑,산책,커뮤니티 등등... */}</View>
      </ScrollView>
    </Container>
  );
};

export default observer(MyPageHomeView);

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
    borderBottomColor: COLORS.grayLight,
    borderBottomWidth: 3,
  },
  section2: {
    marginBottom: 50,
    borderBottomColor: COLORS.grayLight,
    borderBottomWidth: 3,
  },
  section3: {
    paddingHorizontal: 5,
  },
  element: {
    paddingVertical: 10,
  },
  title: {
    marginBottom: 10,
  },
});
