import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomModal from '../elements/CustomModal';
import CustomText from '../elements/CustomText';
import CustomSwitch from '../elements/CustomSwitch';
import FootprintImage from '../modules/FootprintImage';
import { FOOTPRINT_TYPE } from '../../commons/constants';

const WalkingSettingModal = ({ setting, handleChangeSetting, modalRef }) => {
  return (
    <CustomModal ref={modalRef} closeText={'닫기'} title={'Map Setting'}>
      <View style={styles.settingItemWrap}>
        <View style={{ flexDirection: 'row',alignItems:'center' }}>
          <FootprintImage size={30} type={FOOTPRINT_TYPE.MINE} />
          <CustomText fontSize={18} style={{ marginLeft: 7 }}>
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
          value={setting?.footprintYn}
        />
      </View>
    </CustomModal>
  );
};

export default WalkingSettingModal;

const styles = StyleSheet.create({
  settingItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
