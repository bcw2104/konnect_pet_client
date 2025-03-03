import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../commons/colors';
import CustomButton from '../elements/CustomButton';
import ProfileImage from '../modules/ProfileImage';
import CustomText from '../elements/CustomText';
import { Feather } from '@expo/vector-icons';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import { utils } from '../../utils/Utils';
import { PROCESS_STATUS_CODE } from '../../commons/codes';

const FriendItem = ({
  item,
  type,
  onHandleReply = () => {},
  onUserProfilePress = () => {},
}) => {
  return (
    <View style={styles.friendItem}>
      <Pressable
        style={styles.profile}
        onPress={() => {
          onUserProfilePress(item.userId);
        }}
      >
        <ProfileImage
          uri={utils.pathToUri(item.imgPath)}
          style={styles.profileImg}
        />
        <View>
          <CustomText fontSize={15} fontWeight={FONT_WEIGHT.BOLD}>
            {item.nickname}
          </CustomText>
          <CustomText fontSize={13} style={{ marginTop: 5 }}>
            {utils.getAge(moment(item.birthDate, 'YYYYMMDD').toDate())}
            {'Y '}({item.gender == 'M' ? 'Male' : 'Female'})
          </CustomText>
        </View>
      </Pressable>
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
              onPress={() => {
                onHandleReply(item.userId, PROCESS_STATUS_CODE.PERMITTED);
              }}
              render={
                <Feather
                  name="user-plus"
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
              onPress={() => {
                onHandleReply(item.userId, PROCESS_STATUS_CODE.DENIED);
              }}
              render={<Feather name="user-x" size={20} color={COLORS.white} />}
            />
          </>
        ) : type == 'request' ? (
          <>
            <CustomButton
              bgColor={COLORS.danger}
              bgColorPress={COLORS.dangerDeep}
              fontColor={COLORS.white}
              width={50}
              height={35}
              onPress={() => {
                onHandleReply(item.userId, PROCESS_STATUS_CODE.CANCELED);
              }}
              render={<Feather name="user-x" size={20} color={COLORS.white} />}
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
  friendItem: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
