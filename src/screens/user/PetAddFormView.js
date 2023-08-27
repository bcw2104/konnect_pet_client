import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import Container from '../../components/layouts/Container';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomButton from '../../components/elements/CustomButton';
import CustomInput from '../../components/elements/CustomInput';
import { FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const WEIGHT_REGEX = /^([1-9]{0,2}\d{0,1}|0{1})(\.{1}\d{0,2})?$/;

const PetAddFormView = (props) => {
  const { route, navigation } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const isImageChanged = useRef(false);
  const originImgPath = useRef(null);
  const [petImage, setPetImage] = useState(null);
  const [petInfo, setPetInfo] = useState({
    petId: null,
    name: null,
    type: '001',
    species: null,
    gender: 'M',
    weight: '',
    birthDate: new Date(),
    neuteredYn: false,
    inoculatedYn: false,
    description: '',
  });

  useEffect(() => {
    const pet = route.params?.pet;
    if (!!pet) {
      setPetInfo({
        ...pet,
        birthDate: moment(pet.birthDate, 'YYYYMMDD').toDate(),
      });
      originImgPath.current = pet.imgPath;
      setPetImage(utils.pathToUri(pet.imgPath));
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            onPress={async () => {
              try {
                const response = await serviceApis.removePet(pet.petId);

                const pets = userStore.pets.filter(
                  (ele) => ele.petId != pet.petId
                );
                userStore.setPets(pets);
                modalStore.openOneButtonModal(
                  `Pet removed successfully`,
                  'Confirm',
                  () => {
                    navigation.goBack();
                  }
                );
              } catch (error) {}
            }}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.dark} />
          </Pressable>
        ),
      });
    }
  }, [route.params]);

  const handleImageChange = (image) => {
    setPetImage(image.uri);
    isImageChanged.current = true;
  };

  const validation = (data) => {
    let valid = true;
    if (
      !data.name ||
      !data.species ||
      !data.birthDate ||
      !(data.weight > 0 && WEIGHT_REGEX.test(data.weight))
    ) {
      valid = false;
    }

    return valid;
  };
  const savePetInfo = async () => {
    const valid = validation(petInfo);

    if (!valid) {
      modalStore.openOneButtonModal(
        'Please fill in all the required items.',
        'Confirm',
        () => {}
      );
      return;
    }
    try {
      systemStore.setIsLoading(true);

      let imagePath = originImgPath.current;
      if (isImageChanged.current && !!petImage) {
        try {
          const upload = await utils.uploadImage(
            petImage,
            '/api/v1/upload/images/profile/pet'
          );
          imagePath = upload.imagePath;
        } catch (err) {}
      }

      const data = {
        ...petInfo,
        birthDate: moment(petInfo.birthDate).format('YYYYMMDD'),
        imgPath: imagePath,
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
        modalStore.openOneButtonModal(successMsg, 'Confirm', () => {
          Navigator.goBack();
        });
      } else if (response.rsp_code == '9400') {
        modalStore.openOneButtonModal(
          response.rsp_msg_detail,
          'Confirm',
          () => {
            Navigator.goBack();
          }
        );
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
        <KeyboardAwareScrollView>
          <View style={styles.section1}>
            <View style={styles.petImgWrap}>
              <ImageUploader
                editable={true}
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
                  <PetImage
                    uri={petImage}
                    style={styles.petImg}
                    viewer={false}
                  />
                </Pressable>
              </ImageUploader>
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
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
                value={petInfo.name}
                onValueChange={(value) => {
                  setPetInfo({ ...petInfo, name: value });
                }}
                maxLength={30}
                fontSize={15}
                height={40}
                wrapperStyle={styles.input}
                placeholder="Please enter pet name."
                keyboardType="default"
                outline={true}
              />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
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
                value={petInfo.species}
                onValueChange={(value) => {
                  setPetInfo({ ...petInfo, species: value });
                }}
                maxLength={30}
                fontSize={15}
                height={40}
                wrapperStyle={styles.input}
                placeholder="Please enter pet species."
                keyboardType="default"
                outline={true}
              />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
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
                fontSize={15}
                height={40}
                items={[
                  { label: 'Male', value: 'M' },
                  { label: 'Female', value: 'F' },
                ]}
                value={petInfo.gender}
                onPress={(value) => {
                  setPetInfo({ ...petInfo, gender: value });
                }}
              />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
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
                value={petInfo.weight.toString()}
                onValueChange={(value) => {
                  if (!WEIGHT_REGEX.test(value)) return;
                  setPetInfo({ ...petInfo, weight: value });
                }}
                keyboardType="numeric"
                maxLength={30}
                fontSize={15}
                height={40}
                wrapperStyle={styles.input}
                placeholder="Please enter pet weight."
                outline={true}
              />
            </View>
            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
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
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                  Neutered
                </CustomText>
                <FontAwesome5
                  name="star-of-life"
                  size={10}
                  color={COLORS.main}
                  style={styles.required}
                />
              </View>

              <CustomRadio
                fontSize={15}
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
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                  Inoculated
                </CustomText>
                <FontAwesome5
                  name="star-of-life"
                  size={10}
                  color={COLORS.main}
                  style={styles.required}
                />
              </View>

              <CustomRadio
                fontSize={15}
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
                paddingTop: 20,
              }}
            >
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={15}
                style={{ marginBottom: 20 }}
              >
                Introduction of pet
              </CustomText>
              <CustomInput
                value={petInfo.description}
                onValueChange={(value) => {
                  setPetInfo({ ...petInfo, description: value });
                }}
                maxLength={200}
                multiline={true}
                fontSize={15}
                wrapperStyle={styles.input}
                placeholder="Please introduce your pet."
                keyboardType="default"
                outline={true}
                height={'auto'}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
      <CustomButton
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        onPress={savePetInfo}
        text="Save"
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
