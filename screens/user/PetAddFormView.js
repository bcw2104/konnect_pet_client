import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import Container from '../../components/layouts/Container';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';
import CustomInput from '../../components/elements/CustomInput';
import { FontAwesome5 } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CustomRadio from '../../components/elements/CustomRadio';

import ImageUploader from '../../components/modules/ImageUploader';
import { utils } from '../../utils/Utils';
import { useStores } from '../../contexts/StoreContext';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { observer } from 'mobx-react-lite';

const PetAddFormView = (props) => {
  const { route } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [petInfo, setPetInfo] = useState({
    petName: null,
    petType: '001',
    petSpecies: null,
    petGender: 'M',
    birthDate: new Date(),
    neuteredYn: false,
    inoculatedYn: false,
    petDescription: '',
  });

  const handleImageChange = (image) => {
    setPetImage(image.uri);
  };

  const validation = (data) => {
    let valid = true;
    if (!data.petName || !data.petSpecies || !data.birthDate) {
      valid = false;
    }

    return valid;
  };
  const savePetInfo = async () => {
    try {
      const valid = validation(petInfo);

      if (!valid) {
        modalStore.openOneButtonModal(
          '필수 항목을 전부 채워주세요.',
          '확인',
          () => {}
        );
        return;
      }

      systemStore.setIsLoading(true);

      let imageUrl = '';

      if (!!petImage) {
        try {
          const upload = await utils.uploadImage(
            petImage,
            '/api/upload/v1/images/profile/pet'
          );
          imageUrl = upload.imageUrl;
        } catch (err) {}
      }

      const data = {
        ...petInfo,
        birthDate: moment(petInfo.birthDate).format('YYYYMMDD'),
        petImgUrl: imageUrl,
      };
      const response = await serviceApis.savePet(data);

      if (response.rsp_code == '1000') {
        userStore.addPet(response.result);

        modalStore.openOneButtonModal(
          '반려동물 등록이 완료되었습니다.',
          '확인',
          () => {
            Navigator.goBack();
          }
        );
      } else if (response.rsp_code == '9400') {
        modalStore.openOneButtonModal(response.rsp_msg_detail, '확인', () => {
          Navigator.goBack();
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <>
      <Container header={true}>
        <ScrollView>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.section1}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
                신규 반려동물 등록
              </CustomText>
            </View>
            <View style={styles.section2}>
              <View style={styles.petImgWrap}>
                <Image
                  source={
                    !!petImage
                      ? {
                          uri: petImage,
                        }
                      : require('../../assets/images/profile/pet_default.png')
                  }
                  style={styles.petImg}
                />
                <ImageUploader
                  onImageChange={handleImageChange}
                  ref={imageUploaderRef}
                >
                  <CustomButton
                    bgColor={COLORS.warning}
                    bgColorPress={COLORS.warning}
                    onPress={() => {
                      imageUploaderRef.current.pickImage();
                    }}
                    text={'Pick an image'}
                    fontColor={COLORS.white}
                    fontSize={18}
                    width={150}
                    height={45}
                  />
                </ImageUploader>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    Name
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={petInfo.petName}
                  onValueChange={(value) => {
                    if (value.length > 30) return;
                    setPetInfo({ ...petInfo, petName: value });
                  }}
                  fontSize={18}
                  wrapperStyle={styles.input}
                  placeholder='이름을 입력해 주세요.'
                  keyboardType='default'
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    Species
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={petInfo.petSpecies}
                  onValueChange={(value) => {
                    if (value.length > 30) return;
                    setPetInfo({ ...petInfo, petSpecies: value });
                  }}
                  fontSize={18}
                  wrapperStyle={styles.input}
                  placeholder='견종을 입력해 주세요.'
                  keyboardType='default'
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    Gender
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>
                <CustomRadio
                  fontSize={20}
                  height={45}
                  items={[
                    { label: 'Male', value: 'M' },
                    { label: 'Female', value: 'F' },
                  ]}
                  value={petInfo.petGender}
                  onPress={(value) => {
                    setPetInfo({ ...petInfo, petGender: value });
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    BirthDate
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>
                <Pressable
                  onPress={() => {
                    setDatePickerOpen(true);
                  }}
                  style={{
                    padding: 10,
                  }}
                >
                  <CustomText fontSize={18}>
                    {moment(petInfo.birthDate).format('YYYY.MM.DD')}
                  </CustomText>
                </Pressable>
                <DatePicker
                  modal
                  mode={'date'}
                  open={datePickerOpen}
                  date={petInfo.birthDate}
                  onConfirm={(date) => {
                    setDatePickerOpen(false);
                    setPetInfo({ ...petInfo, birthDate: date });
                  }}
                  onCancel={() => {
                    setDatePickerOpen(false);
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    중성화 여부
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>

                <CustomRadio
                  fontSize={20}
                  height={45}
                  items={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                  value={petInfo.neuteredYn}
                  onPress={(value) => {
                    setPetInfo({ ...petInfo, neuteredYn: value });
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
                    접종 여부
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>

                <CustomRadio
                  fontSize={20}
                  height={45}
                  items={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                  value={petInfo.inoculatedYn}
                  onPress={(value) => {
                    setPetInfo({ ...petInfo, inoculatedYn: value });
                  }}
                />
              </View>
              <View
                style={{
                  paddingVertical: 20,
                }}
              >
                <CustomText
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontSize={18}
                  style={{ marginBottom: 20 }}
                >
                  반려견 소개
                </CustomText>
                <CustomInput
                  value={petInfo.petDescription}
                  onValueChange={(value) => {
                    if (value.length > 150) return;
                    setPetInfo({ ...petInfo, petDescription: value });
                  }}
                  multiline={true}
                  fontSize={18}
                  wrapperStyle={styles.input}
                  placeholder='반려견을 소개해 주세요.'
                  keyboardType='default'
                  outline={true}
                  height={100}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
      <CustomButton
        fontColor={COLORS.white}
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        onPress={savePetInfo}
        text='등록하기'
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default observer(PetAddFormView);

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
  },
  section2: {
    marginBottom: 50,
  },
  petImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  petImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomColor: COLORS.grayLight,
    borderBottomWidth: 1,
  },
  required: {
    marginLeft: 5,
    top: 2,
  },
  title: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    top: 1,
    flex: 1,
  },
  submitTheme: { borderRadius: 0 },
});
