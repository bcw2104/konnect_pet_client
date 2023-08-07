import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import serviceApis from '../../utils/ServiceApis';
import CustomBottomModal from '../elements/CustomBottomModal';
import { useStores } from '../../contexts/StoreContext';
import ProfileImage from '../modules/ProfileImage';
import CustomText from '../elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import { utils } from '../../utils/Utils';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../commons/colors';
import CustomButton from '../elements/CustomButton';

const FootprintDetailModal = ({ footprintId, modalRef }) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!footprintId) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await serviceApis.getFootprintDetail(footprintId);
        console.log(response.result);
        setDetail(response.result);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [footprintId]);

  return (
    <CustomBottomModal ref={modalRef}>
      {!isLoading && (
        <>
          <View style={styles.section1}>
            <View style={styles.profileCard}>
              <ProfileImage
                uri={detail?.profile?.profileImgUrl}
                style={styles.profileImg}
              />
              <View style={styles.profile}>
                <CustomText
                  fontSize={20}
                  fontWeight={FONT_WEIGHT.BOLD}
                  style={{}}
                >
                  {detail?.profile?.nickname}
                </CustomText>
                <CustomText fontSize={16} style={{ marginTop: 5 }}>
                  {utils.getAge(
                    moment(detail?.profile?.birthDate, 'YYYYMMDD').toDate()
                  )}
                  {'Y '}({detail?.profile?.gender == 'M' ? 'Male' : 'Female'})
                </CustomText>
              </View>
              <View style={styles.optionBtnWrap}>
                <CustomButton
                  wrapperStyle={{ marginBottom: 5 }}
                  bgColor={COLORS.warning}
                  bgColorPress={COLORS.warningDeep}
                  fontColor={COLORS.white}
                  width={100}
                  height={35}
                  render={
                    <>
                      <Feather
                        name='user-plus'
                        size={20}
                        color={COLORS.white}
                        style={{ marginRight: 5 }}
                      />
                      <CustomText
                        fontSize={14}
                        fontColor={COLORS.white}
                        fontWeight={FONT_WEIGHT.BOLD}
                      >
                        Friend
                      </CustomText>
                    </>
                  }
                />
                <CustomButton
                  bgColor={COLORS.warning}
                  bgColorPress={COLORS.warningDeep}
                  fontColor={COLORS.white}
                  width={100}
                  height={35}
                  render={
                    <>
                      <Feather
                        name='send'
                        size={20}
                        color={COLORS.white}
                        style={{ marginRight: 5 }}
                      />
                      <CustomText
                        fontSize={14}
                        fontColor={COLORS.white}
                        fontWeight={FONT_WEIGHT.BOLD}
                      >
                        Message
                      </CustomText>
                    </>
                  }
                />
              </View>
            </View>
            <View style={{ marginTop: 7 }}>
              <CustomText
                style={{ marginBottom: 5 }}
                fontSize={16}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                Comment
              </CustomText>
              <CustomText fontSize={15}>{detail?.profile?.comment}</CustomText>
            </View>
          </View>
          <View style={styles.section2}></View>
        </>
      )}
    </CustomBottomModal>
  );
};

export default FootprintDetailModal;

const styles = StyleSheet.create({
  section1: {},
  section2: {},
  profileCard: {
    flexDirection: 'row',
    alignContent: 'center',
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
    marginBottom: 10,
    marginRight: 20,
  },
  profile: {
    justifyContent: 'center',
    height: 80,
    flex: 1,
  },
});
