import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import COLORS from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import Modal from 'react-native-modal';
import CustomText from './CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const GlobalModal = () => {
  const { systemStore, modalStore } = useStores();

  const handleClose = () => {
    if (!!modalStore.firstBtnCallback) {
      modalStore.firstBtnCallback();
    }
    modalStore.closeModal();
  };

  const handleConfirm = () => {
    if (!!modalStore.secondBtnCallback) {
      modalStore.secondBtnCallback();
    }
    modalStore.closeModal();
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      isVisible={modalStore.open}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.contentWrap}>
            <CustomText
              fontSize={18}
              style={styles.contentText}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {modalStore.content}
            </CustomText>
          </View>
          <View style={styles.buttonWrap}>
            <Pressable onPress={handleClose} style={styles.button}>
              <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                {modalStore.firstBtnText}
              </CustomText>
            </Pressable>

            {!!modalStore.secondBtnText && (
              <Pressable
                onPress={handleConfirm}
                style={[styles.button, styles.secondButton]}
              >
                <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                  {modalStore.secondBtnText}
                </CustomText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default observer(GlobalModal);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentText: {
    textAlign: 'center',
  },

  buttonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: COLORS.grayLight,
    borderTopWidth: 1,
  },

  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondButton: {
    borderLeftColor: COLORS.grayLight,
    borderLeftWidth: 1,
  },

  contentWrap: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
