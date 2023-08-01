import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import { utils } from '../../utils/Utils';
import moment from 'moment';
import COLORS from '../../commons/colors';
import { AntDesign } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';

const MyPageHomeView = () => {
  const { userStore } = useStores();

  const addNewPet = () => {
    Navigator.navigate('mypage_nav', {
      screen: 'pet_add_form',
    });
  };
  return (
    <Container header={true}>
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
            <Image
              source={
                !!userStore.profile?.profileImgUrl
                  ? { uri: userStore.profile.profileImgUrl }
                  : require('../../assets/images/profile/user_default.png')
              }
              style={styles.profileImg}
            />
            <View style={styles.profile}>
              <CustomText
                fontSize={24}
                fontWeight={FONT_WEIGHT.BOLD}
                style={{}}
              >
                {userStore.profile?.nickname}
              </CustomText>
              <CustomText fontSize={17} style={{ marginTop: 5 }}>
                {utils.getAge(
                  moment(userStore.profile?.birthDate, 'YYYYMMDD').toDate()
                )}
                {'Y '}({userStore.profile?.gender == 'M' ? 'Male' : 'Female'})
              </CustomText>
            </View>
          </View>
          <View style={{ marginTop: 7 }}>
            <CustomText
              style={styles.title}
              fontSize={17}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              내 소개
            </CustomText>
            <CustomText fontSize={16}>{userStore.profile?.comment}</CustomText>
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
            <FlatList
              data={[...userStore.pets, { id: -1 }]}
              renderItem={({ item }) => (
                <>
                  {item.id >= 0 ? (
                    <View style={styles.petItem}>
                      <Image
                        source={
                          !!item?.petImgUrl
                            ? { uri: item?.petImgUrl }
                            : require('../../assets/images/profile/pet_default.png')
                        }
                        style={styles.petImg}
                      />
                      <View style={styles.pet}>
                        <CustomText
                          fontSize={15}
                          fontWeight={FONT_WEIGHT.BOLD}
                          numberOfLines={1}
                          ellipsizeMode={'tail'}
                        >
                          {item?.petName}
                        </CustomText>
                        <CustomText fontSize={13} style={{ marginTop: 5 }}>
                          {utils.getAge(
                            moment(item?.birthDate, 'YYYYMMDD').toDate()
                          )}
                          {'Y '}({item?.petGender == 'M' ? 'Male' : 'Female'})
                        </CustomText>
                      </View>
                    </View>
                  ) : (
                    <Pressable style={styles.petItem} onPress={addNewPet}>
                      <AntDesign
                        name='pluscircleo'
                        size={40}
                        color='black'
                        style={styles.petImg}
                      />
                      <View style={styles.pet}>
                        <CustomText
                          fontSize={15}
                          fontWeight={FONT_WEIGHT.BOLD}
                          numberOfLines={1}
                        >
                          반려동물 추가
                        </CustomText>
                      </View>
                    </Pressable>
                  )}
                </>
              )}
              keyExtractor={(item, index) => item?.id}
              numColumns={2}
            />
          </View>
        </View>
      </View>

      <View style={styles.section2}>{/* 내 누적 정보 및 포인트 */}</View>

      <View style={styles.section3}>{/* 쇼핑,산책,커뮤니티 등등... */}</View>
    </Container>
  );
};

export default MyPageHomeView;

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
  profileWrap: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    marginRight: 20,
  },
  profile: {
    justifyContent: 'center',
    height: 80,
    flex: 1,
  },
  petWrap: {
    flexDirection: 'row',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.warningDeep,
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    margin: 5,
    flex: 1,
  },
  petImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  pet: {
    flex: 1,
    justifyContent: 'center',
  },
});
