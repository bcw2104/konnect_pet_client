import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import serviceApis from '../../utils/ServiceApis';
import CustomBottomModal from '../elements/CustomBottomModal';
import ProfileImage from '../modules/ProfileImage';
import PetImage from '../modules/PetImage';
import CustomText from '../elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import { utils } from '../../utils/Utils';
import { Feather } from '@expo/vector-icons';
import {COLORS} from '../../commons/colors';
import CustomButton from '../elements/CustomButton';
import { PROCESS_STATUS_CODE } from '../../commons/codes';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { Entypo } from '@expo/vector-icons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Loader from '../modules/Loader';

const FootprintDetailModal = ({ footprintId, modalRef }) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userStore, systemStore } = useStores();

  useEffect(() => {
    if (!footprintId) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await serviceApis.getFootprintDetail(footprintId);
        setDetail(response.result);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [footprintId]);

  const requestFriend = async (toUserId) => {
    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.requestFriend(toUserId);

      setDetail({
        ...detail,
        friendStatus: PROCESS_STATUS_CODE.PENDING,
      });
      Toast.show({
        type: 'success',
        text1: 'Your friend request has been completed.',
      });
    } catch (error) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <CustomBottomModal ref={modalRef}>
      <Loader />
      {!isLoading && (
        <>
          <View style={styles.section1}>
            <View style={styles.profileWrap}>
              <ProfileImage
                uri={detail?.profile?.profileImgUrl}
                style={styles.profileImg}
              />
              <View style={styles.profile}>
                <CustomText fontSize={20} fontWeight={FONT_WEIGHT.BOLD}>
                  {detail?.profile?.nickname}
                </CustomText>
                <CustomText fontSize={16} style={{ marginTop: 5 }}>
                  {utils.getAge(
                    moment(detail?.profile?.birthDate, 'YYYYMMDD').toDate()
                  )}
                  {'Y '}({detail?.profile?.gender == 'M' ? 'Male' : 'Female'})
                </CustomText>
              </View>
              {detail?.userId != userStore.userId && (
                <View style={styles.optionBtnWrap}>
                  <CustomButton
                    wrapperStyle={{ marginBottom: 5 }}
                    bgColor={COLORS.main}
                    bgColorPress={COLORS.mainDeep}
                    fontColor={COLORS.white}
                    width={100}
                    height={35}
                    disabled={
                      detail?.friendStatus == PROCESS_STATUS_CODE.PENDING
                    }
                    onPress={() => {
                      if (
                        detail?.friendStatus == PROCESS_STATUS_CODE.PERMITTED
                      ) {
                      } else if (
                        detail?.friendStatus != PROCESS_STATUS_CODE.PENDING
                      ) {
                        requestFriend(detail?.userId);
                      }
                    }}
                    render={
                      <>
                        <Feather
                          name={
                            detail?.friendStatus ==
                            PROCESS_STATUS_CODE.PERMITTED
                              ? 'send'
                              : 'user-plus'
                          }
                          size={20}
                          color={COLORS.white}
                          style={{ marginRight: 5 }}
                        />
                        <CustomText
                          fontSize={14}
                          fontColor={COLORS.white}
                          fontWeight={FONT_WEIGHT.BOLD}
                        >
                          {detail?.friendStatus == PROCESS_STATUS_CODE.PERMITTED
                            ? 'Message'
                            : detail?.friendStatus ==
                              PROCESS_STATUS_CODE.PENDING
                            ? 'Waiting'
                            : 'Friend'}
                        </CustomText>
                      </>
                    }
                  />
                </View>
              )}
            </View>
            <View style={styles.locationWrap}>
              <Entypo
                name="location-pin"
                size={22}
                color={COLORS.dark}
                style={{ marginRight: 5 }}
              />
              <CustomText fontSize={16}>{detail?.residenceCity}</CustomText>
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
                {detail?.profile?.comment || '-'}
              </CustomText>
            </View>
          </View>
          <View style={styles.section2}>
            <ScrollView>
              {detail?.pets?.map((pet) => (
                <View key={pet.petId} style={styles.petWrap}>
                  <View style={styles.pet}>
                    <PetImage uri={pet.petImgUrl} style={styles.petImg} />
                    <View>
                      <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                        {pet.petName} ({pet.petSpecies})
                      </CustomText>
                      <CustomText fontSize={14} style={{ marginTop: 5 }}>
                        {utils.getAge(
                          moment(pet.birthDate, 'YYYYMMDD').toDate()
                        )}
                        {'Y '}({pet?.gender == 'M' ? 'Male' : 'Female'})
                      </CustomText>
                    </View>
                  </View>
                  <View style={styles.petDetail}>
                    <View style={styles.petDetailItem}>
                      <CustomText
                        style={styles.petDetailItemTitle}
                        fontSize={15}
                        fontWeight={FONT_WEIGHT.BOLD}
                      >
                        neutered
                      </CustomText>
                      <CustomText
                        fontSize={15}
                        style={styles.petDetailItemContent}
                      >
                        {pet.neuteredYn ? 'Yes' : 'No'}
                      </CustomText>
                    </View>
                    <View style={styles.petDetailItem}>
                      <CustomText
                        style={styles.petDetailItemTitle}
                        fontSize={15}
                        fontWeight={FONT_WEIGHT.BOLD}
                      >
                        Introduction
                      </CustomText>
                      <CustomText
                        fontSize={15}
                        style={styles.petDetailItemContent}
                      >
                        {pet.petDescription}
                      </CustomText>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </CustomBottomModal>
  );
};

export default observer(FootprintDetailModal);

const styles = StyleSheet.create({
  section1: { paddingTop: 20, marginBottom: 30 },
  section2: { marginBottom: 30, maxHeight: 230 },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
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
  petWrap: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  pet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  petImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  petDetailItem: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  petDetailItemTitle: {
    width: 100,
  },
  petDetailItemContent: {
    flex: 1,
  },
});
