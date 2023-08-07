import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { Feather } from '@expo/vector-icons';

import ImageUploader from '../../components/modules/ImageUploader';
import { utils } from '../../utils/Utils';
import { useStores } from '../../contexts/StoreContext';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import ProfileImage from '../../components/modules/ProfileImage';

const ProfileFormView = (props) => {
  const { route } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const isImageChanged = useRef(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, serProfile] = useState({
    nickname: null,
    gender: 'M',
    birthDate: new Date(),
    comment: '',
  });

  useEffect(() => {
    const profile = route.params?.profile;
    if (!!profile) {
      serProfile({
        ...profile,
        birthDate: moment(profile.birthDate, 'YYYYMMDD').toDate(),
      });
      setProfileImage(profile.profileImgUrl);
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
    try {
      const valid = validation(profile);

      if (!valid) {
        modalStore.openOneButtonModal('필수 항목을 전부 채워주세요.', '확인', () => {});
        return;
      }

      systemStore.setIsLoading(true);

      let imageUrl = null;

      if (isImageChanged.current && !!profileImage) {
        try {
          const upload = await utils.uploadImage(profileImage, '/api/v1/upload/images/profile/user');
          imageUrl = upload.imageUrl;
        } catch (err) {}
      } else if (!isImageChanged.current && !!profileImage) {
        imageUrl = profileImage;
      }

      const data = {
        ...profile,
        birthDate: moment(profile.birthDate).format('YYYYMMDD'),
        profileImgUrl: imageUrl,
      };
      const response = await serviceApis.saveProfile(data);

      if (response.rsp_code == '1000') {
        userStore.setProfile(response.result);
        modalStore.openOneButtonModal('프로필 등록이 완료되었습니다.', '확인', () => {
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
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'position' : 'height'} keyboardVerticalOffset={20}>
            <View style={styles.section1}>
              <View style={styles.profileImgWrap}>
                <ImageUploader onImageChange={handleImageChange} ref={imageUploaderRef}>
                  <Pressable
                    onPress={() => {
                      imageUploaderRef.current.pickImage();
                    }}
                  >
                    <View style={styles.upload}>
                      <Feather name="camera" size={20} color="black" />
                    </View>
                    <ProfileImage
                      uri={profileImage}
                      style={styles.profileImg}
                    />
                  </Pressable>
                </ImageUploader>
              </View>

              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Nickname
                  </CustomText>
                  <FontAwesome5 name="star-of-life" size={10} color={COLORS.warningDeep} style={styles.required} />
                </View>
                <CustomInput
                  value={profile.nickname}
                  onValueChange={(value) => {
                    serProfile({ ...profile, nickname: value });
                  }}
                  maxLength={30}
                  fontSize={16}
                  height={40}
                  wrapperStyle={styles.input}
                  placeholder="닉네임을 입력해 주세요."
                  keyboardType="default"
                  outline={true}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    Gender
                  </CustomText>
                  <FontAwesome5 name="star-of-life" size={10} color={COLORS.warningDeep} style={styles.required} />
                </View>
                <CustomRadio
                  fontSize={20}
                  height={40}
                  items={[
                    { label: 'Male', value: 'M' },
                    { label: 'Female', value: 'F' },
                  ]}
                  value={profile.gender}
                  onPress={(value) => {
                    serProfile({ ...profile, gender: value });
                  }}
                />
              </View>
              <View style={styles.inputWrap}>
                <View style={styles.title}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                    BirthDate
                  </CustomText>
                  <FontAwesome5 name="star-of-life" size={10} color={COLORS.warningDeep} style={styles.required} />
                </View>
                <Pressable
                  onPress={() => {
                    setDatePickerOpen(true);
                  }}
                  style={{
                    padding: 10,
                  }}
                >
                  <CustomText fontSize={16}>{moment(profile.birthDate).format('YYYY.MM.DD')}</CustomText>
                </Pressable>
                <DatePicker
                  modal
                  mode={'date'}
                  open={datePickerOpen}
                  date={profile.birthDate}
                  onConfirm={(date) => {
                    setDatePickerOpen(false);
                    serProfile({ ...profile, birthDate: date });
                  }}
                  onCancel={() => {
                    setDatePickerOpen(false);
                  }}
                />
              </View>
              <View
                style={{
                  paddingVertical: 20,
                }}
              >
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16} style={{ marginBottom: 20 }}>
                  Comment
                </CustomText>
                <CustomInput
                  value={profile.comment}
                  onValueChange={(value) => {
                    serProfile({ ...profile, comment: value });
                  }}
                  maxLength={150}
                  multiline={true}
                  fontSize={16}
                  wrapperStyle={styles.input}
                  placeholder="자기소개를 해주세요."
                  keyboardType="default"
                  outline={true}
                  height={100}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
      <CustomButton fontColor={COLORS.white} bgColor={COLORS.dark} bgColorPress={COLORS.darkDeep} onPress={saveProfileInfo} text="등록하기" style={styles.submitTheme} height={60} />
    </>
  );
};

export default ProfileFormView;

const styles = StyleSheet.create({
  section1: {
    marginVertical:30
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
