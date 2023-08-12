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
import CustomInput from '../../components/elements/CustomInput';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import moment from 'moment';
import CustomRadio from '../../components/elements/CustomRadio';

import ImageUploader from '../../components/modules/ImageUploader';
import { utils } from '../../utils/Utils';
import { useStores } from '../../contexts/StoreContext';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { observer } from 'mobx-react-lite';
import PetImage from '../../components/modules/PetImage';
import { COLORS } from '../../commons/colors';
import CustomDateTimePicker from '../../components/elements/CustomDateTimePicker';

const WEIGHT_REGEX = /^([1-9]{0,2}\d{0,1}|0{1})(\.{1}\d{0,2})?$/;

const PetAddFormView = (props) => {
  const { route } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const isImageChanged = useRef(false);
  const [petImage, setPetImage] = useState(null);
  const [petInfo, setPetInfo] = useState({
    petId: null,
    petName: null,
    petType: '001',
    petSpecies: null,
    petGender: 'M',
    petWeight: '',
    birthDate: new Date(),
    neuteredYn: false,
    inoculatedYn: false,
    petDescription: '',
  });

  useEffect(() => {
    const pet = route.params?.pet;
    if (!!pet) {
      setPetInfo({
        ...pet,
        birthDate: moment(pet.birthDate, 'YYYYMMDD').toDate(),
      });
      setPetImage(pet.petImgUrl);
    }
  }, [route.params]);

  const handleImageChange = (image) => {
    setPetImage(image.uri);
    isImageChanged.current = true;
  };

  const validation = (data) => {
    let valid = true;
    if (
      !data.petName ||
      !data.petSpecies ||
      !data.birthDate ||
      !(data.petWeight > 0 && WEIGHT_REGEX.test(data.petWeight))
    ) {
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

      let imageUrl = null;
      if (isImageChanged.current && !!petImage) {
        try {
          const upload = await utils.uploadImage(
            petImage,
            '/api/v1/upload/images/profile/pet'
          );
          imageUrl = upload.imageUrl;
        } catch (err) {}
      } else if (!isImageChanged.current && !!petImage) {
        imageUrl = petImage;
      }

      const data = {
        ...petInfo,
        birthDate: moment(petInfo.birthDate).format('YYYYMMDD'),
        petImgUrl: imageUrl,
      };
      const isNew = !petInfo.petId;
      const response = !isNew
        ? await serviceApis.editPet(petInfo.petId, data)
        : await serviceApis.savePet(data);

      if (response.rsp_code == '1000') {
        let successMsg = '';
        if (isNew) {
          userStore.addPets(response.result);
          successMsg = 'Pet saved successfully';
        } else {
          const pets = userStore.pets.map((ele) => {
            if (ele.petId == petInfo.petId) {
              return response.result;
            } else {
              return ele;
            }
          });
          userStore.setPets(pets);
          successMsg = 'Pet updated successfully';
        }
        modalStore.openOneButtonModal(successMsg, '확인', () => {
          Navigator.goBack();
        });
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
      <Container header={true} headerPaddingTop={0}>
        <ScrollView>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={20}
          >
            <View style={styles.section1}>
              <View style={styles.petImgWrap}>
                <ImageUploader
                  onImageChange={handleImageChange}
                  ref={imageUploaderRef}
                >
                  <Pressable
                    onPress={() => {
                      imageUploaderRef.current.pickImage();
                    }}
                  >
                    <View style={styles.upload}>
                      <Feather name="camera" size={20} color={COLORS.dark} />
                    </View>
                    <PetImage uri={petImage} style={styles.petImg} />
                  </Pressable>
                </ImageUploader>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Name
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={petInfo.petName}
                  onValueChange={(value) => {
                    setPetInfo({ ...petInfo, petName: value });
                  }}
                  maxLength={30}
                  fontSize={16}
                  height={40}
                  wrapperStyle={styles.input}
                  placeholder="이름을 입력해 주세요."
                  keyboardType="default"
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Species
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={petInfo.petSpecies}
                  onValueChange={(value) => {
                    setPetInfo({ ...petInfo, petSpecies: value });
                  }}
                  maxLength={30}
                  fontSize={16}
                  height={40}
                  wrapperStyle={styles.input}
                  placeholder="견종을 입력해 주세요."
                  keyboardType="default"
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Gender
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>
                <CustomRadio
                  fontSize={16}
                  height={40}
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
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Weight(kg)
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={petInfo.petWeight.toString()}
                  onValueChange={(value) => {
                    if (!WEIGHT_REGEX.test(value)) return;
                    setPetInfo({ ...petInfo, petWeight: value });
                  }}
                  keyboardType="numeric"
                  maxLength={30}
                  fontSize={16}
                  height={40}
                  wrapperStyle={styles.input}
                  placeholder="몸무게를 입력해 주세요."
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    BirthDate
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>
                <CustomDateTimePicker
                  value={petInfo.birthDate}
                  onChange={(date) => {
                    setPetInfo({ ...petInfo, birthDate: date });
                  }}
                  maxDate={new Date()}
                  style={{
                    padding: 10,
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    중성화 여부
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>

                <CustomRadio
                  fontSize={16}
                  height={40}
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
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    접종 여부
                  </CustomText>
                  <FontAwesome5
                    name="star-of-life"
                    size={10}
                    color={COLORS.main}
                    style={styles.required}
                  />
                </View>

                <CustomRadio
                  fontSize={16}
                  height={40}
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
                  fontSize={16}
                  style={{ marginBottom: 20 }}
                >
                  반려견 소개
                </CustomText>
                <CustomInput
                  value={petInfo.petDescription}
                  onValueChange={(value) => {
                    setPetInfo({ ...petInfo, petDescription: value });
                  }}
                  maxLength={150}
                  multiline={true}
                  fontSize={16}
                  wrapperStyle={styles.input}
                  placeholder="반려견을 소개해 주세요."
                  keyboardType="default"
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
        text="등록하기"
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default observer(PetAddFormView);

const styles = StyleSheet.create({
  section1: {
    marginVertical: 30,
  },
  upload: {
    position: 'absolute',
    zIndex: 100,
    height: 30,
    width: 30,
    backgroundColor: COLORS.grayLight,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    top: 45,
    left: 45,
  },
  petImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  petImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
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