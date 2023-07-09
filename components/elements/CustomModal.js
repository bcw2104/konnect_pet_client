import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Modal } from 'native-base';
import CustomButton from './CustomButton';
import COLORS from '../../commons/colors';
import { useState } from 'react';
import { forwardRef } from 'react';
import { useStores } from '../../contexts/StoreContext';
import CustomText from './CustomText';

const CustomModal = ({
  content = '',
  closeText = null,
  okText = null,
  closeCallback = null,
  okCallback = null,
  ref,
}) => {
  const [open, setOpen] = useState(false);
  const { systemStore } = useStores();

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal: openModal,
      };
    },
    []
  );

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    if (closeCallback) {
      closeCallback();
    }
    setOpen(false);
  };

  const confirm = () => {
    if (okCallback) {
      okCallback();
    }
    setOpen(false);
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={open}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CustomText style={styles.modalText}>{content}</CustomText>
          <View stlye={styles.buttonWrap}>
            <CustomButton
              bgColor={COLORS.light}
              bgColorPress={COLORS.lightDeep}
              fontColor={COLORS.black}
              fontSize={14}
              onPress={closeModal}
              text={closeText}
            />
            {!!okText && (
              <CustomButton
                bgColor={COLORS.dark}
                bgColorPress={COLORS.darkDeep}
                fontColor={COLORS.white}
                fontSize={14}
                onPress={confirm}
                text={okText}
              />
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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

  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
