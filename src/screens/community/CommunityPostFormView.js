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
import { utils } from '../../utils/Utils';

const window = Dimensions.get('window');

const CommunityPostFormView = () => {
  const { modalStore, systemStore } = useStores();
  const [categories, setCategories] = useState([]);

  const [uploadableImageCount, setUploadableImageCount] = useState(0);
  const [postImages, setPostImages] = useState([]);
  const [formData, setFormData] = useState({
    content: '',
    category: null,
    imgPaths: [],
  });
  const imageUploaderRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getPostFormData();
        setCategories(response.result.categories);
        setUploadableImageCount(response.result.maxImageCount);
      } catch (err) {
        Navigator.goBack();
      }
    };

    fetchData();
  }, []);

  const handleImageAdd = (images) => {
    const newImages = [...postImages];
    const count = Math.min(images.length, uploadableImageCount);
    for (let i = 0; i < count; i++) {
      newImages.push(images[i]);
    }
    setUploadableImageCount(uploadableImageCount - count);
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
        'Please enter all required items.',
        'Confirm',
        () => {}
      );
      return;
    }
    try {
      systemStore.setIsLoading(true);

      let imgPaths = [];

      if (postImages.length > 0) {
        try {
          const uploadPath = await utils.uploadMultipleImages(
            postImages.map((image) => image.uri),
            '/api/v1/upload/images/community/post'
          );
          imgPaths = uploadPath;
        } catch (err) {}
      }

      const data = {
        ...formData,
        imgPaths: JSON.stringify(imgPaths),
      };
      const response = await serviceApis.savePost(data);

      if (response.rsp_code == '1000') {
        modalStore.openOneButtonModal(
          'Post uploaded successfully.',
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
      <Container header={true} headerPaddingTop={0} paddingHorizontal={0}>
        <KeyboardAwareScrollView>
          <View style={styles.section1}>
            <CustomPicker
              title={'Category'}
              required={true}
              fontSize={15}
              placeholder='Select an category.'
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
              required={true}
              value={formData.content}
              onValueChange={(value) => {
                setFormData({ ...formData, content: value });
              }}
              placeholder="Please enter less than 2000 characters."
              wrapperStyle={{ flex: 1 }}
              maxLength={2000}
              multiline={true}
              textAlignVertical={'top'}
              fontSize={15}
              keyboardType='default'
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
              limit={uploadableImageCount}
              onImageChange={handleImageAdd}
              ref={imageUploaderRef}
            >
              <Pressable
                onPress={() => {
                  imageUploaderRef.current.pickImage();
                }}
                disabled={uploadableImageCount < 1}
                style={[
                  styles.imageItem,
                  {
                    opticity: uploadableImageCount < 1 ? 0.6 : 1,
                    marginLeft: 15,
                  },
                ]}
              >
                <Feather name='image' size={35} color={COLORS.gray} />
              </Pressable>
            </ImageUploader>
            {postImages.map((image, idx) => (
              <View
                style={[
                  styles.imageItem,
                  { marginRight: postImages.length == idx + 1 ? 15 : 5 },
                ]}
                key={idx}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 15 }}
                  resizeMode='cover'
                />

                <Pressable
                  style={styles.imageCloseBtn}
                  hitSlop={5}
                  onPress={() => {
                    const images = [...postImages];
                    images.splice(idx, 1);
                    setPostImages(images);
                    setUploadableImageCount((prev) => prev + 1);
                  }}
                >
                  <AntDesign name='closecircle' size={24} color={COLORS.gray} />
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
        text='Submit'
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
    paddingHorizontal: 15,
  },
  imageWrap: {
    flexDirection: 'row',
  },
  imageItem: {
    marginHorizontal: 5,
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
