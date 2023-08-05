import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT, POINT_TYPE_CODE } from '../../commons/constants';
import COLORS from '../../commons/colors';
import { observer } from 'mobx-react-lite';
import PetList from '../../components/mypage/PetList';
import Profile from '../../components/mypage/Profile';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';

const MyPageHomeView = () => {
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await serviceApis.getMyData();
        setMyData(response.result);
      } catch (error) {}
    };
    fetchDate();
  }, []);

  const openPointHistory = () => {
    Navigator.navigate(
      { pointType: myData.point?.pointType },
      'mypage_nav',
      'point_history'
    );
  };

  return (
    <Container
      header={true}
      bgColor={COLORS.light}
      paddingHorizontal={0}
      headerPaddingTop={0}
    >
      <ScrollView>
        <View style={styles.section1}>
          <View style={styles.element}>
            <CustomText
              style={styles.title}
              fontSize={18}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              My Profile
            </CustomText>
            <View style={styles.profileWrap}>
              <Profile />
            </View>
          </View>
          <View style={styles.element}>
            <CustomText
              style={styles.title}
              fontSize={18}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              My Pets
            </CustomText>
            <View style={styles.petWrap}>
              <PetList />
            </View>
          </View>
        </View>

        <View style={styles.section2}>
          {!!myData && (
            <View style={styles.element}>
              <CustomText
                style={styles.title}
                fontSize={18}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                POINT & COUPON
              </CustomText>
              <View style={styles.pointWrap}>
                <Pressable style={styles.point} onPress={openPointHistory}>
                  <CustomText
                    fontWeight={FONT_WEIGHT.BOLD}
                    fontSize={28}
                    fontColor={COLORS.warningDeep}
                  >
                    {myData.point?.balance.toLocaleString('ko-KR')}
                    {myData.point?.pointTypeSymbol}
                  </CustomText>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    {myData.point?.pointTypeName}
                  </CustomText>
                </Pressable>
                <View style={styles.divider}></View>
                <Pressable style={styles.point}>
                  <CustomText
                    fontWeight={FONT_WEIGHT.BOLD}
                    fontSize={28}
                    fontColor={COLORS.warningDeep}
                  >
                    0
                  </CustomText>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Coupon
                  </CustomText>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section3}>{/* 쇼핑,산책,커뮤니티 등등... */}</View>
      </ScrollView>
    </Container>
  );
};

export default observer(MyPageHomeView);

const styles = StyleSheet.create({
  section1: {
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  section2: {
    paddingHorizontal: 15,
    marginBottom: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
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

  divider: {
    width: 1,
    backgroundColor: COLORS.gray,
  },

  pointWrap: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  point: {
    alignItems: 'center',
  },
});
