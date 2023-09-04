import { Feather, AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomButton from '../../components/elements/CustomButton';
import CustomInput from '../../components/elements/CustomInput';
import CustomPicker from '../../components/elements/CustomPicker';
import Container from '../../components/layouts/Container';
import ImageUploader from '../../components/modules/ImageUploader';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from '../../utils/ServiceApis';

const window = Dimensions.get('window');

const CommunityPostFormView = () => {
  const { modalStore, systemStore } = useStores();
  const [categories, setCategories] = useState([]);

  const maxUploadImageCount = useRef(0);
  const [postImages, setPostImages] = useState([]);
  const [formData, setFormData] = useState({
    content: '',
    category: null,
    imagesPath: [],
  });
  const imageUploaderRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getPostFormData();
        setCategories(response.result.categories);
        maxUploadImageCount.current = response.result.maxImageCount;
      } catch (err) {
        Navigator.goBack();
      }
    };

    fetchData();
  }, []);

  const handleImageAdd = (images) => {
    const newImages = [...postImages];
    const canUploadCount = maxUploadImageCount.current - newImages.length;
    for (let i = 0; i < Math.min(images.length, canUploadCount); i++) {
      newImages.push(images[i]);
    }
    setPostImages(newImages);
  };

  const validation = (data) => {
    let valid = true;
    if (!data.content || !data.category) {
      valid = false;
    }

    return valid;
  };
  const submit = async () => {
    const valid = validation(formData);

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
      const response = await serviceApis.saveQna(formData);

      if (response.rsp_code == '1000') {
        modalStore.openOneButtonModal(
          'Your question has been received.',
          'Confirm',
          () => {
            goToQna();
          }
        );
      } else if (response.rsp_code == '9500') {
        modalStore.openOneButtonModal(
          response.rsp_msg_detail,
          'Confirm',
          () => {
            goToQna();
          }
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <>
      <Container header={true} headerPaddingTop={0}>
        <KeyboardAwareScrollView>
          <View style={styles.section1}>
            <CustomPicker
              title={'Category'}
              fontSize={15}
              placeholder="Select an category..."
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
              }}
              items={categories}
              wrapperStyle={{
                marginBottom: 20,
              }}
            />
            <CustomInput
              title={'Content'}
              value={formData.content}
              onValueChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
              placeholder="Please enter contents up to 2000 characters."
              wrapperStyle={{ flex: 1 }}
              maxLength={2000}
              multiline={true}
              textAlignVertical={'top'}
              fontSize={15}
              keyboardType="default"
              style={{
                paddingVertical: 15,
              }}
              minHeight={window.height - 350}
              height={'auto'}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.imageWrap}>
          <ScrollView horizontal={true} style={{ paddingVertical: 10 }}>
            <ImageUploader
              multiple={true}
              limit={6}
              onImageChange={handleImageAdd}
              ref={imageUploaderRef}
            >
              <Pressable
                onPress={() => {
                  imageUploaderRef.current.pickImage();
                }}
                style={styles.imageItem}
              >
                <Feather name="image" size={35} color={COLORS.gray} />
              </Pressable>
            </ImageUploader>
            {postImages.map((image, idx) => (
              <View style={styles.imageItem} key={idx}>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 15 }}
                  resizeMode="cover"
                />

                <Pressable
                  style={styles.imageCloseBtn}
                  hitSlop={5}
                  onPress={() => {
                    const images = [...postImages];
                    images.splice(idx, 1);
                    setPostImages(images);
                  }}
                >
                  <AntDesign name="closecircle" size={24} color={COLORS.gray} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </Container>
      <CustomButton
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        text="Submit"
        onPress={submit}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default CommunityPostFormView;

const styles = StyleSheet.create({
  section1: {
    marginVertical: 30,
    flex: 1,
  },
  imageWrap: {
    flexDirection: 'row',
  },
  imageItem: {
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightDeep,
    marginVertical: 5,
  },
  imageCloseBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  submitTheme: { borderRadius: 0 },
});
