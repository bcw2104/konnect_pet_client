import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../elements/CustomText';
import { utils } from '../../utils/Utils';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';

const Profile = () => {
  const { userStore } = useStores();

  const editProfile = () => {
    Navigator.navigate(
      { profile: userStore.profile },
      'mypage_nav',
      'profile_form'
    );
  };

  return (
    <>
      <View style={styles.profileCard}>
        <Image
          source={
            !!userStore.profile?.profileImgUrl
              ? { uri: userStore.profile.profileImgUrl }
              : require('../../assets/images/profile/user_default.png')
          }
          style={styles.profileImg}
        />
        <View style={styles.profile}>
          <CustomText fontSize={24} fontWeight={FONT_WEIGHT.BOLD} style={{}}>
            {userStore.profile?.nickname}
          </CustomText>
          <CustomText fontSize={17} style={{ marginTop: 5 }}>
            {utils.getAge(
              moment(userStore.profile?.birthDate, 'YYYYMMDD').toDate()
            )}
            {'Y '}({userStore.profile?.gender == 'M' ? 'Male' : 'Female'})
          </CustomText>
        </View>
        <Pressable
          style={styles.profileEditBtn}
          hitSlop={5}
          onPress={editProfile}
        >
          <AntDesign
            name="edit"
            size={20}
            color="black"
            style={{ marginRight: 8 }}
          />
          <CustomText>Edit</CustomText>
        </Pressable>
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
    </>
  );
};

export default observer(Profile);

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  profileEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: COLORS.grayLight,
    borderWidth: 1,
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
});
