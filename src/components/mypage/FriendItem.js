import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../commons/colors';
import CustomButton from '../elements/CustomButton';
import ProfileImage from '../modules/ProfileImage';
import CustomText from '../elements/CustomText';
import { AntDesign } from '@expo/vector-icons';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import { utils } from '../../utils/Utils';

const FriendItem = ({ item, type }) => {
  return (
    <View style={styles.friendItem}>
      <View style={styles.profile}>
        <ProfileImage uri={item.profileImgUrl} style={styles.profileImg} />
        <View>
          <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
            {item.nickname}
          </CustomText>
          <CustomText fontSize={14} style={{ marginTop: 5 }}>
            {utils.getAge(moment(item.birthDate, 'YYYYMMDD').toDate())}
            {'Y '}({item.gender == 'M' ? 'Male' : 'Female'})
          </CustomText>
        </View>
      </View>
      <View style={styles.optionBtnWrap}>
        {type == 'requested' ? (
          <>
            <CustomButton
              wrapperStyle={{ marginRight: 5 }}
              bgColor={COLORS.primary}
              bgColorPress={COLORS.primaryDeep}
              fontColor={COLORS.white}
              width={50}
              height={35}
              onPress={() => {}}
              render={
                <AntDesign
                  name={'adduser'}
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 5 }}
                />
              }
            />
            <CustomButton
              bgColor={COLORS.danger}
              bgColorPress={COLORS.dangerDeep}
              fontColor={COLORS.white}
              width={50}
              height={35}
              onPress={() => {}}
              render={
                <AntDesign
                  name={'deleteuser'}
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 5 }}
                />
              }
            />
          </>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default FriendItem;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  optionBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
