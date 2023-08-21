import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../../components/elements/CustomText';
import { serviceApis } from '../../utils/ServiceApis';
import CustomPicker from './../../components/elements/CustomPicker';
import CustomInput from '../../components/elements/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/elements/CustomButton';
import { Dimensions } from 'react-native';
import { useStores } from '../../contexts/StoreContext';

const window = Dimensions.get('window');

const QnaView = (props) => {
  const { route } = props;

  const [refreshQna, setRefreshQna] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Question' },
    { key: 'second', title: 'My Questions' },
  ]);

  useEffect(() => {
    if (!!route.params?.tab) {
      setIndex(route.params.tab);
    }
  }, [route.params]);

  const FirstRoute = useCallback(
    () => <QnaFormView setRefreshQna={setRefreshQna} setIndex={setIndex} />,
    []
  );
  const SecondRoute = useCallback(() => <QnaListView />, [refreshQna]);

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.light}
    >
      <TabView
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#fff', paddingVertical: 5 }}
            renderLabel={({ route, focused, color }) => (
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={16}
                fontColor={focused ? COLORS.dark : COLORS.gray}
              >
                {route.title}
              </CustomText>
            )}
            indicatorStyle={{
              height: 3,
              backgroundColor: COLORS.main,
            }}
          />
        )}
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={setIndex}
      />
    </Container>
  );
};

export default QnaView;

const QnaFormView = ({ setRefreshQna, setIndex }) => {
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
        setCategory([
          { label: 'Select Category', value: '' },
          ...response.result.categories,
        ]);
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
            setRefreshQna((prev) => (prev += 1));
            setIndex(1);
            setFormData({
              title: '',
              category: null,
              question: '',
            });
          }
        );
      } else if (response.rsp_code == '9500') {
        modalStore.openOneButtonModal(
          response.rsp_msg_detail,
          'Confirm',
          () => {
            setIndex(1);
          }
        );
      } else {
        setIndex(1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView>
        <View style={styles.section1}>
          <CustomPicker
            title={'Category'}
            value={formData.category}
            onValueChange={(value) => {
              setFormData({ ...formData, category: value });
            }}
            items={category}
            itemStyle={{ fontSize: 16 }}
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
            fontSize={15}
            wrapperStyle={{ marginBottom: 20 }}
            keyboardType='default'
          />
          <CustomInput
            title={'Question'}
            value={formData.question}
            onValueChange={(value) => {
              setFormData({ ...formData, question: value });
            }}
            multiline={true}
            fontSize={15}
            style={{ paddingVertical: 10 }}
            keyboardType='default'
            height={window.height / 2}
          />
        </View>
      </KeyboardAwareScrollView>
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

const QnaListView = () => {
  return <View style={styles.section1}></View>;
};

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  submitTheme: { borderRadius: 0 },
});
