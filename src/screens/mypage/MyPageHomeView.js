import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import { COLORS } from '../../commons/colors';
import { observer } from 'mobx-react-lite';
import PetList from '../../components/mypage/PetList';
import Profile from '../../components/mypage/Profile';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { utils } from '../../utils/Utils';
import Swiper from 'react-native-swiper';

const window = Dimensions.get('window');

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
              fontSize={16}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              My Profile
            </CustomText>
            <Profile />
          </View>
          <View style={styles.element}>
            <CustomText
              style={styles.title}
              fontSize={16}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              My Pets
            </CustomText>
            <View style={styles.petWrap}>
              <PetList />
            </View>
          </View>
        </View>
        {!!myData && myData.banners?.length > 0 && (
          <Swiper
            style={styles.section2}
            autoplay={true}
            autoplayTimeout={4}
            dotColor={COLORS.gray}
            activeDotColor={COLORS.main}
          >
            {myData.banners?.map((ele) => {
              {
                return (
                  !!ele.imgUrl && (
                    <Pressable
                      key={ele.bannerId}
                      style={{ flex: 1 }}
                      onPress={() => {
                        console.log(ele.bannerId);
                      }}
                    >
                      <Image
                        key={ele.bannerId}
                        source={{ uri: ele.imgUrl }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Pressable>
                  )
                );
              }
            })}
          </Swiper>
        )}

        <View style={styles.section3}>
          {!!myData && (
            <View style={styles.element}>
              <CustomText
                style={styles.title}
                fontSize={16}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                Point & Coupon
              </CustomText>
              <View style={styles.pointWrap}>
                <Pressable style={styles.point} onPress={openPointHistory}>
                  <CustomText
                    fontWeight={FONT_WEIGHT.BOLD}
                    fontSize={28}
                    fontColor={COLORS.main}
                  >
                    {utils.toFormatNumber(myData.point?.balance)}
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
                    fontColor={COLORS.main}
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

        <View style={styles.section4}>
          {!!myData && (
            <View style={styles.element}>
              <CustomText
                style={styles.title}
                fontSize={16}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                Community
              </CustomText>
              <View style={styles.communityWrap}>
                <Pressable
                  style={styles.community}
                  onPress={() => {
                    Navigator.navigate({}, 'mypage_nav', 'friends');
                  }}
                >
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
                    {myData.friendCount}
                  </CustomText>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                    Friends
                  </CustomText>
                </Pressable>
                <View style={styles.divider}></View>
                <Pressable style={styles.community}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
                    0
                  </CustomText>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                    Posts
                  </CustomText>
                </Pressable>
                <View style={styles.divider}></View>
                <Pressable style={styles.community}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
                    0
                  </CustomText>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                    Comments
                  </CustomText>
                </Pressable>
              </View>
            </View>
          )}
        </View>
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
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            marginRight: 10,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
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
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
      >
        <Ionicons name="settings-outline" size={24} color={COLORS.dark} />
      </Pressable>
    </View>
  );
};

export default observer(MyPageHomeView);

const styles = StyleSheet.create({
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
  section1: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  section2: {
    height: window.width / 4,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  section3: {
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  section4: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  element: {
    paddingVertical: 10,
  },
  title: {
    marginBottom: 10,
  },

  divider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.gray,
  },

  pointWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    flex: 1,
    alignItems: 'center',
  },

  communityWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  community: {
    flex: 1,
    alignItems: 'center',
  },
});
