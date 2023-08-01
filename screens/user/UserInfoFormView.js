import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import CustomText from '../../components/elements/CustomText';
import Container from '../../components/layouts/Container';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomButton from '../../components/elements/CustomButton';
import { useTabBarHandler } from '../../hooks/useTabBarHandler';
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

const UserInfoFormView = (props) => {
  useTabBarHandler(false);

  const { route } = props;
  const { userStore, modalStore, systemStore } = useStores();
  const imageUploaderRef = useRef();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, serProfile] = useState({
    nickname: null,
    gender: 'M',
    birthDate: new Date(),
    comment: '',
  });

  const handleImageChange = (image) => {
    setProfileImage(image.uri);
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
        modalStore.openOneButtonModal(
          '필수 항목을 전부 채워주세요.',
          '확인',
          () => {}
        );
        return;
      }

      systemStore.setIsLoading(true);

      let imageUrl = '';

      if (!!profileImage) {
        try {
          const upload = await utils.uploadImage(
            profileImage,
            '/api/upload/v1/images/profile/user'
          );
          imageUrl = upload.imageUrl;
        } catch (err) {}
      }

      const data = {
        ...profile,
        birthDate: moment(profile.birthDate).format('YYYYMMDD'),
        profileImgUrl: imageUrl,
      };
      const response = await serviceApis.saveProfile(data);

      if (response.rsp_code == '1000') {
        userStore.setProfile(response.result);
        modalStore.openOneButtonModal(
          '프로필 등록이 완료되었습니다.',
          '확인',
          () => {
            Navigator.goBack();}
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
      <Container header={true}>
        <ScrollView>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={10}
            behavior={'position'}
          >
            <View style={styles.section1}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
                내 프로필
              </CustomText>
            </View>
            <View style={styles.section2}>
              <View style={styles.profileImgWrap}>
                <Image
                  source={
                    !!profileImage
                      ? {
                          uri: profileImage,
                        }
                      : require('../../assets/images/profile/user_default.png')
                  }
                  style={styles.profileImg}
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
                    Nickname
                  </CustomText>
                  <FontAwesome5
                    name='star-of-life'
                    size={10}
                    color={COLORS.warningDeep}
                    style={styles.required}
                  />
                </View>
                <CustomInput
                  value={profile.nickname}
                  onValueChange={(value) => {
                    if (value.length > 30) return;
                    serProfile({ ...profile, nickname: value });
                  }}
                  fontSize={18}
                  wrapperStyle={styles.input}
                  placeholder='닉네임을 입력해 주세요.'
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
                  value={profile.gender}
                  onPress={(value) => {
                    serProfile({ ...profile, gender: value });
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
                    {moment(profile.birthDate).format('YYYY.MM.DD')}
                  </CustomText>
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
                <CustomText
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontSize={18}
                  style={{ marginBottom: 20 }}
                >
                  Comment
                </CustomText>
                <CustomInput
                  value={profile.comment}
                  onValueChange={(value) => {
                    if (value.length > 150) return;
                    serProfile({ ...profile, comment: value });
                  }}
                  multiline={true}
                  fontSize={18}
                  wrapperStyle={styles.input}
                  placeholder='자기소개를 해주세요.'
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
        onPress={saveProfileInfo}
        text='등록하기'
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default UserInfoFormView;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
  },
  section2: {
    marginBottom: 50,
  },
  profileImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImg: {
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
