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
import ProfileImage from '../modules/ProfileImage';
import { COLORS } from '../../commons/colors';

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
      <View style={styles.profileWrap}>
        <ProfileImage
          path={userStore.profile?.profileImgPath}
          style={styles.profileImg}
        />
        <View style={styles.profile}>
          <CustomText fontSize={20} fontWeight={FONT_WEIGHT.BOLD} style={{}}>
            {userStore.profile?.nickname}
          </CustomText>
          <CustomText fontSize={16} style={{ marginTop: 5 }}>
            {utils.getAge(
              moment(userStore.profile?.birthDate, 'YYYYMMDD').toDate()
            )}
            {'Y '}({userStore.profile?.gender == 'M' ? 'Male' : 'Female'})
          </CustomText>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.profileEditBtn,
            {
              backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
            },
          ]}
          hitSlop={5}
          onPress={editProfile}
        >
          <AntDesign name="edit" size={20} color={COLORS.dark} />
        </Pressable>
      </View>
      <View style={{ marginTop: 7 }}>
        <CustomText
          style={{ marginBottom: 5 }}
          fontSize={16}
          fontWeight={FONT_WEIGHT.BOLD}
        >
          Comment
        </CustomText>
        <CustomText fontSize={15}>
          {userStore.profile?.comment || '-'}
        </CustomText>
      </View>
    </>
  );
};

export default observer(Profile);

const styles = StyleSheet.create({
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileEditBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: COLORS.grayLight,
    borderWidth: 1,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profile: {
    justifyContent: 'center',
    height: 80,
    flex: 1,
  },
});
