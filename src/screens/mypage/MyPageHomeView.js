import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { Navigator, navigationRef } from '../../navigations/Navigator';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MyPageHomeView = ({ navigation }) => {
  const [myData, setMyData] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const response = await serviceApis.getMyData();
          setMyData(response.result);
          navigation.setOptions({
            headerRight: () => (
              <HeaderRight newNotiCount={response.result.newNotiCount} />
            ),
          });
        } catch (error) {}
      };
      fetchData();
    }
  }, [isFocused]);

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
            <Profile />
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
                    fontColor={COLORS.mainDeep}
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
                    fontColor={COLORS.mainDeep}
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

const HeaderRight = ({ newNotiCount }) => {
  return (
    <View style={{ flexDirection: 'row', paddingRight: 15 }}>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'notification_history');
        }}
        hitSlop={5}
        style={{ marginRight: 20 }}
      >
        <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
        {newNotiCount > 0 && (
          <View style={styles.notiLabel}>
            <CustomText
              fontColor={COLORS.white}
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={11}
            >
              {newNotiCount}
            </CustomText>
          </View>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'setting');
        }}
        hitSlop={5}
      >
        <Ionicons name="settings-outline" size={24} color={COLORS.dark} />
      </Pressable>
    </View>
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
    alignItems: 'center',
  },
  point: {
    alignItems: 'center',
  },
  notiLabel: {
    position: 'absolute',
    right: -7,
    bottom: -5,
    backgroundColor: COLORS.dangerLight,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
});
