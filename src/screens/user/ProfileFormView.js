import { Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import Container from '../../components/layouts/Container';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomButton from '../../components/elements/CustomButton';
import CustomInput from '../../components/elements/CustomInput';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import CustomRadio from '../../components/elements/CustomRadio';
import { Feather } from '@expo/vector-icons';

import ImageUploader from '../../components/modules/ImageUploader';
import { utils } from '../../utils/Utils';
import { useStores } from '../../contexts/StoreContext';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import ProfileImage from '../../components/modules/ProfileImage';
import { COLORS } from '../../commons/colors';
import CustomDateTimePicker from '../../components/elements/CustomDateTimePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ProfileFormView = (props) => {
  const { route } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const isImageChanged = useRef(false);
  const originImgPath = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    nickname: null,
    gender: 'M',
    birthDate: new Date(),
    comment: '',
  });

  useEffect(() => {
    const profile = route.params?.profile;
    if (!!profile) {
      setProfile({
        ...profile,
        birthDate: moment(profile.birthDate, 'YYYYMMDD').toDate(),
      });
      originImgPath.current = profile.imgPath;
      setProfileImage(utils.pathToUri(profile.imgPath));
    }
  }, [route.params]);

  const handleImageChange = (image) => {
    setProfileImage(image.uri);
    isImageChanged.current = true;
  };

  const validation = (data) => {
    let valid = true;
    if (!data.nickname || !data.birthDate) {
      valid = false;
    }

    return valid;
  };
  const saveProfileInfo = async () => {
    const valid = validation(profile);

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

      if (isImageChanged.current && !!profileImage) {
        try {
          const uploadPath = await utils.uploadImage(
            profileImage,
            '/api/v1/upload/images/profile/user'
          );
          imagePath = uploadPath;
        } catch (err) {}
      }

      const data = {
        ...profile,
        birthDate: moment(profile.birthDate).format('YYYYMMDD'),
        imgPath: imagePath,
      };
      const response = await serviceApis.saveProfile(data);

      if (response.rsp_code == '1000') {
        userStore.setProfile(response.result);
        modalStore.openOneButtonModal(
          'Profile registered successfully.',
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
            <View style={styles.profileImgWrap}>
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
                  <ProfileImage
                    uri={profileImage}
                    style={styles.profileImg}
                    viewer={false}
                  />
                </Pressable>
              </ImageUploader>
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.title}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                  Nickname
                </CustomText>
                <FontAwesome5
                  name="star-of-life"
                  size={10}
                  color={COLORS.main}
                  style={styles.required}
                />
              </View>
              <CustomInput
                value={profile.nickname}
                onValueChange={(value) => {
                  setProfile({ ...profile, nickname: value });
                }}
                maxLength={15}
                fontSize={15}
                height={40}
                wrapperStyle={styles.input}
                placeholder="Please enter your nickname."
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
                value={profile.gender}
                onPress={(value) => {
                  setProfile({ ...profile, gender: value });
                }}
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
                value={profile.birthDate}
                onChange={(date) => {
                  setProfile({ ...profile, birthDate: date });
                }}
                maxDate={new Date()}
                style={{
                  padding: 10,
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
                Comment
              </CustomText>
              <CustomInput
                value={profile.comment}
                onValueChange={(value) => {
                  setProfile({ ...profile, comment: value });
                }}
                maxLength={200}
                multiline={true}
                fontSize={15}
                wrapperStyle={styles.input}
                placeholder="Please introduce yourself."
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
        onPress={saveProfileInfo}
        text="Save"
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default ProfileFormView;

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
  profileImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImg: {
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
    minHeight: 60,
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
