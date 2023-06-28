import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { Modal } from 'react-native';
import CustomText from './CustomText';

const GlobalModal = () => {
  const { systemStore, modalStore } = useStores();

  const close = () => {
    if (!!modalStore.firstBtnCallback) {
      modalStore.firstBtnCallback();
    }
    modalStore.closeModal();
  };

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={modalStore.open}
      onRequestClose={close}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CustomText style={styles.modalText}>{modalStore.content}</CustomText>
          <View style={styles.buttonWrap}>
            <CustomButton
              bgColor={!!modalStore.secondBtnText ? colors.light : colors.dark}
              bgColorPress={
                !!modalStore.secondBtnText ? colors.lightDeep : colors.darkDeep
              }
              fontColor={
                !!modalStore.secondBtnText ? colors.black : colors.white
              }
              fontSize={16}
              onPress={close}
              text={modalStore.firstBtnText}
            />
            {!!modalStore.secondBtnText && (
              <>
                <View style={{ marginHorizontal: 5 }}></View>
                <CustomButton
                  bgColor={colors.dark}
                  bgColorPress={colors.darkDeep}
                  fontColor={colors.white}
                  fontSize={16}
                  onPress={() => {
                    if (!!modalStore.secondBtnCallback) {
                      modalStore.secondBtnCallback();
                    }
                    modalStore.closeModal();
                  }}
                  text={modalStore.secondBtnText}
                />
              </>
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
    margin: 20,
    width: '80%',
    backgroundColor: colors.white,
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
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    marginBottom: 35,
    textAlign: 'center',
  },
});
