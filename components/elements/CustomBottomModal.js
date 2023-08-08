import { StyleSheet, View } from 'react-native';
import React, { useImperativeHandle } from 'react';
import COLORS from '../../commons/colors';
import { useState } from 'react';
import { forwardRef } from 'react';
import Modal from 'react-native-modal';

const CustomBottomModal = ({ closeCallback = null, children }, ref) => {
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

  return (
    <Modal
      animationType="none"
      isVisible={open}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      backdropColor={COLORS.transparent}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.bottomHalf}
    >
      <View style={styles.modalView}>{children}</View>
    </Modal>
  );
};

export default forwardRef(CustomBottomModal);

const styles = StyleSheet.create({
  bottomHalf: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
  },
});