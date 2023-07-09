import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import COLORS from '../../commons/colors';
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
              bgColor={!!modalStore.secondBtnText ? COLORS.light : COLORS.dark}
              bgColorPress={
                !!modalStore.secondBtnText ? COLORS.lightDeep : COLORS.darkDeep
              }
              fontColor={
                !!modalStore.secondBtnText ? COLORS.black : COLORS.white
              }
              wrapperStyle={{flex:1}}
              fontSize={16}
              onPress={close}
              text={modalStore.firstBtnText}
            />
            {!!modalStore.secondBtnText && (
              <>
                <View style={{ marginHorizontal: 5 }}></View>
                <CustomButton
                  bgColor={COLORS.dark}
                  bgColorPress={COLORS.darkDeep}
                  fontColor={COLORS.white}
                  fontSize={16}
                  wrapperStyle={{flex:1}}
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
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalText: {
    marginBottom: 35,
    textAlign: 'center',
  },
});
