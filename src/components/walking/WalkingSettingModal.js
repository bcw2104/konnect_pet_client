import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomModal from '../elements/CustomModal';
import CustomText from '../elements/CustomText';
import CustomSwitch from '../elements/CustomSwitch';
import FootprintImage from '../modules/FootprintImage';
import { FOOTPRINT_TYPE } from '../../commons/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../commons/colors';

const WalkingSettingModal = ({ setting, handleChangeSetting, modalRef }) => {
  return (
    <CustomModal ref={modalRef} closeText={'닫기'} title={'Map Setting'}>
      {setting?.footprintYn != undefined && (
        <View style={styles.settingItemWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FootprintImage size={24} type={FOOTPRINT_TYPE.MINE} />
            <CustomText fontSize={16} style={{ marginLeft: 10 }}>
              Footprint
            </CustomText>
          </View>
          <CustomSwitch
            onValueChange={() =>
              handleChangeSetting({
                ...setting,
                footprintYn: !setting?.footprintYn,
              })
            }
            scale={1}
            value={setting?.footprintYn}
          />
        </View>
      )}
      {setting?.routeYn != undefined && (
        <View style={styles.settingItemWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="route" size={24} color={COLORS.main} />
            <CustomText fontSize={16} style={{ marginLeft: 10 }}>
              Route
            </CustomText>
          </View>
          <CustomSwitch
            onValueChange={() =>
              handleChangeSetting({
                ...setting,
                routeYn: !setting?.routeYn,
              })
            }
            scale={1}
            value={setting?.routeYn}
          />
        </View>
      )}
    </CustomModal>
  );
};

export default WalkingSettingModal;

const styles = StyleSheet.create({
  settingItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
