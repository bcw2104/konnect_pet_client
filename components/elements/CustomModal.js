import { Pressable, StyleSheet, View } from 'react-native';
import React, { useImperativeHandle } from 'react';
import CustomButton from './CustomButton';
import COLORS from '../../commons/colors';
import { useState } from 'react';
import { forwardRef } from 'react';
import { useStores } from '../../contexts/StoreContext';
import CustomText from './CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import Modal from 'react-native-modal';

const CustomModal = (
  {
    title = '',
    closeText = '',
    okText = '',
    closeCallback = null,
    okCallback = null,
    children,
  },
  ref
) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal: handleOpen,
      };
    },
    []
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!!closeCallback) {
      closeCallback();
    }
    setOpen(false);
  };

  const handleConfirm = () => {
    if (!!okCallback) {
      okCallback();
    }
    setOpen(false);
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      isVisible={open}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && (
            <View style={styles.titleWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
                {title}
              </CustomText>
            </View>
          )}
          <View style={styles.contentWrap}>{children}</View>
          <View style={styles.buttonWrap}>
            <Pressable onPress={handleClose} style={styles.button}>
              <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                {closeText}
              </CustomText>
            </Pressable>

            {!!okText && (
              <Pressable
                onPress={handleConfirm}
                style={[styles.button, styles.secondButton]}
              >
                <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                  {okText}
                </CustomText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default forwardRef(CustomModal);

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

  titleWrap: {
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  contentWrap: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});
