import { Linking, StyleSheet } from 'react-native';
import React, { forwardRef, useImperativeHandle } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useStores } from '../../contexts/StoreContext';
import { IMAGE_EXT_TYPE } from '../../commons/constants';

const ImageUploader = (
  {
    onImageChange = () => {},
    editable = false,
    multiple = false,
    limit = 1,
    children,
  },
  ref
) => {
  const { modalStore } = useStores();

  useImperativeHandle(
    ref,
    () => {
      return {
        pickImage: pickImage,
      };
    },
    []
  );
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status != 'granted') {
      modalStore.openTwoButtonModal(
        '이미지 업로드를 위해서\n권한을 허용해주세요.',
        'Cancel',
        () => {},
        '승인하러 가기',
        () => {
          Linking.openSettings();
        }
      );
      return false;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: editable,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: multiple,
      selectionLimit: limit,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const temp = image.uri?.split('.');
      if (
        temp.length > 1 &&
        IMAGE_EXT_TYPE.includes(temp[temp.length - 1].toLowerCase())
      ) {
        onImageChange(image);
      } else {
        modalStore.openOneButtonModal(
          `Unsupported extension.\nOnly available (${IMAGE_EXT_TYPE.toString()})`,
          'Confirm',
          () => {}
        );
      }
    }
  };
  return children;
};

export default forwardRef(ImageUploader);

const styles = StyleSheet.create({});
