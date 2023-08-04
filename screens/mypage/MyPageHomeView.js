import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import COLORS from '../../commons/colors';
import { observer } from 'mobx-react-lite';
import PetList from '../../components/mypage/PetList';
import Profile from '../../components/mypage/Profile';
import serviceApis from '../../utils/ServiceApis';

const MyPageHomeView = () => {
  const [points, setPoints] = useState({});

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await serviceApis.getMyData();

        setPoints(response.result?.points);
      } catch (error) {}
    };
    fetchDate();
  }, []);

  return (
    <Container header={true}>
      <ScrollView>
        <View style={styles.section1}>
          <View style={styles.element}>
            <CustomText style={styles.title} fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
              내 프로필
            </CustomText>
            <View style={styles.profileWrap}>
              <Profile />
            </View>
          </View>
          <View style={styles.element}>
            <CustomText style={styles.title} fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
              내 반려견
            </CustomText>
            <View style={styles.petWrap}>
              <PetList />
            </View>
          </View>
        </View>

        <View style={styles.section2}></View>

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
