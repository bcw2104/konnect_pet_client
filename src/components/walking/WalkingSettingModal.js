import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomModal from '../elements/CustomModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomText from '../elements/CustomText';
import CustomSwitch from '../elements/CustomSwitch';
import COLORS from '../../commons/colors';

const WalkingSettingModal = ({ setting, handleChangeSetting, modalRef }) => {
  return (
    <CustomModal ref={modalRef} closeText={'닫기'} title={'Map Setting'}>
      <View style={styles.settingItemWrap}>
        <View style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons name="dog" size={27} color={COLORS.dark} />
          <CustomText fontSize={18} style={{ marginLeft: 7 }}>
            발자국
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
