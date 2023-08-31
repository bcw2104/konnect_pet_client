import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomBottomModal from '../elements/CustomBottomModal';
import CustomText from '../elements/CustomText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { useStores } from '../../contexts/StoreContext';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const ReportModal = ({ modalRef, userId }) => {
  const handleReport = async () => {
    try {
      console.log(userId);
      Toast.show({
        type: 'success',
        text1: 'A report has been filed.',
      });
    } catch (err) {
    } finally {
      modalRef.current.closeModal();
    }
  };
  const handleClose = () => {
    modalRef.current.closeModal();
  };
  return (
    <CustomBottomModal ref={modalRef}>
      <View style={styles.menuWrap}>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
            },
          ]}
          onPress={handleReport}
        >
          <MaterialCommunityIcons
            name="alarm-light"
            size={24}
            color={COLORS.danger}
            style={{ marginRight: 7 }}
          />
          <CustomText
            fontSize={15}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.danger}
          >
            Report
          </CustomText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
            },
          ]}
          onPress={handleClose}
        >
          <CustomText
            fontSize={15}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.dark}
          >
            Cancel
          </CustomText>
        </Pressable>
      </View>
    </CustomBottomModal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  menuWrap: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
