import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { serviceApis } from '../../utils/ServiceApis';
import Container from '../../components/layouts/Container';
import { COLORS } from '../../commons/colors';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { FONT_WEIGHT } from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';

const FaqView = () => {
  const [faq, setFaq] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await serviceApis.getFaq();
      const faq = {};
      response.result.map((ele) => {
        faq[ele.faqId] = { ...ele, open: false };
      });
      setFaq(faq);
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
          <CustomText fontSize={14} fontWeight={FONT_WEIGHT.BOLD}>
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
          {Object.keys(faq).map((key, idx) => (
            <View key={key}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setFaq({
                    ...faq,
                    [key]: { ...faq[key], open: !faq[key].open },
                  });
                }}
              >
                <View style={{ flex: 1 }}>
                  <CustomText
                    fontSize={15}
                    style={{ marginBottom: 5 }}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    {faq[key].categoryName}
                  </CustomText>
                  <CustomText fontSize={15}>
                    {faq[key].question.trim()}
                  </CustomText>
                </View>
                {faq[key].open ? (
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
              {faq[key].open && (
                <>
                  <View style={styles.divider}></View>
                  <View style={styles.menuDropdown}>
                    <CustomText fontSize={15} style={{ flex: 1 }}>
                      {faq[key].answer.trim()}
                    </CustomText>
                  </View>
                </>
              )}

              {Object.keys(faq).length - 1 > idx && (
                <View style={styles.divider}></View>
              )}
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
  divider: {
    height: 2,
    backgroundColor: COLORS.light,
  },
});
