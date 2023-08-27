import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { serviceApis } from '../../utils/ServiceApis';
import Container from '../../components/layouts/Container';
import { COLORS } from '../../commons/colors';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { FONT_WEIGHT } from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';
import Hr from '../../components/elements/Hr';

const FaqView = () => {
  const [faqs, setFaqs] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await serviceApis.getFaq();
      const faqs = {};
      response.result.map((ele) => {
        faqs[ele.faqId] = { ...ele, open: false };
      });
      setFaqs(faqs);
    } catch (err) {
      console.log(err);
    }
  };

  const goToQnaForm = () => {
    Navigator.navigate({}, 'qna_form');
  };

  return (
    <Container header={true} paddingHorizontal={0}>
      <View style={styles.section1}>
        <Pressable
          onPress={goToQnaForm}
          style={{
            marginBottom: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <CustomText fontSize={13} fontWeight={FONT_WEIGHT.BOLD}>
            Not meet your expectations?
          </CustomText>
          <Ionicons
            name="arrow-forward-outline"
            size={20}
            color={COLORS.dark}
            style={{ marginLeft: 3 }}
          />
        </Pressable>
        <ScrollView>
          {Object.keys(faqs).map((key, idx) => (
            <View key={key}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setFaqs({
                    ...faqs,
                    [key]: { ...faqs[key], open: !faqs[key].open },
                  });
                }}
              >
                <View style={{ flex: 1 }}>
                  <CustomText
                    fontSize={15}
                    fontColor={COLORS.main}
                    style={{ marginBottom: 5 }}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {faqs[key].categoryName}
                  </CustomText>
                  <CustomText fontSize={13}>
                    {faqs[key].question.trim()}
                  </CustomText>
                </View>
                {faqs[key].open ? (
                  <Ionicons
                    name="chevron-up"
                    size={25}
                    color={COLORS.dark}
                    style={{ marginLeft: 10, width: 25 }}
                  />
                ) : (
                  <Ionicons
                    name="chevron-down"
                    size={25}
                    color={COLORS.dark}
                    style={{ marginLeft: 10, width: 25 }}
                  />
                )}
              </Pressable>
              {faqs[key].open && (
                <>
                  <Hr />
                  <View style={styles.menuDropdown}>
                    <CustomText fontSize={13} style={{ flex: 1 }}>
                      {faqs[key].answer.trim()}
                    </CustomText>
                  </View>
                </>
              )}

              {Object.keys(faqs).length - 1 > idx && <Hr />}
            </View>
          ))}
        </ScrollView>
      </View>
    </Container>
  );
};

export default FaqView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  menuItem: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuDropdown: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.light,
    paddingVertical: 15,
  },
});
