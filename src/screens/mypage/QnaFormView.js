import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { serviceApis } from '../../utils/ServiceApis';
import CustomPicker from '../../components/elements/CustomPicker';
import CustomInput from '../../components/elements/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/elements/CustomButton';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';

const window = Dimensions.get('window');

const QnaFormView = () => {
  const { modalStore, systemStore } = useStores();
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: null,
    question: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getQnaNew();
        setCategory(response.result.categories);
      } catch (err) {}
    };

    fetchData();
  }, []);

  const validation = (data) => {
    let valid = true;
    if (!data.title || !data.question || !data.category) {
      valid = false;
    }

    return valid;
  };

  const goToQna = () => {
    Navigator.reset({}, 'qna');
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
              items={category}
              wrapperStyle={{
                marginBottom: 20,
              }}
            />
            <CustomInput
              title={'Title'}
              value={formData.title}
              onValueChange={(value) => {
                setFormData({ ...formData, title: value });
              }}
              maxLength={200}
              fontSize={15}
              wrapperStyle={{ marginBottom: 20 }}
              keyboardType="default"
            />
            <CustomInput
              title={'Question'}
              value={formData.question}
              onValueChange={(value) => {
                setFormData({ ...formData, question: value });
              }}
              wrapperStyle={{ flex: 1 }}
              maxLength={800}
              multiline={true}
              textAlignVertical={'top'}
              fontSize={15}
              keyboardType="default"
              style={{
                paddingVertical: 15,
              }}
              minHeight={window.height / 2}
              height={'auto'}
            />
          </View>
        </KeyboardAwareScrollView>
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

export default QnaFormView;

const styles = StyleSheet.create({
  section1: {
    marginVertical: 30,
    flex: 1,
  },
  submitTheme: { borderRadius: 0 },
});
