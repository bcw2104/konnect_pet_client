import {  StyleSheet, View } from 'react-native';
import React, { useImperativeHandle } from 'react';
import CustomButton from './CustomButton';
import COLORS from '../../commons/colors';
import { useState } from 'react';
import { forwardRef } from 'react';
import { useStores } from '../../contexts/StoreContext';
import CustomText from './CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import Modal from "react-native-modal";

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
      animationType="none"
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
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
              {title}
            </CustomText>
          )}
          <View style={styles.modalContent}>{children}</View>
          <View style={styles.buttonWrap}>
            <CustomButton
              bgColor={!!okText ? COLORS.light : COLORS.dark}
              bgColorPress={!!okText ? COLORS.lightDeep : COLORS.darkDeep}
              fontColor={!!okText ? COLORS.black : COLORS.white}
              wrapperStyle={{ flex: 1 }}
              fontSize={16}
              onPress={handleClose}
              text={closeText}
            />
            {!!okText && (
              <>
                <View style={{ marginHorizontal: 5 }}></View>
                <CustomButton
                  bgColor={COLORS.dark}
                  bgColorPress={COLORS.darkDeep}
                  fontColor={COLORS.white}
                  fontSize={16}
                  wrapperStyle={{ flex: 1 }}
                  onPress={handleConfirm}
                  text={okText}
                />
              </>
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
    margin: 20,
    width: '95%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
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
  },
  modalContent: {
    marginTop: 15,
    marginBottom: 25,
  },
});
