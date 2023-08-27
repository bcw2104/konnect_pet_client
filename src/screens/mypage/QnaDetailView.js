import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';
import Hr from '../../components/elements/Hr';
import moment from 'moment';

const QnaDetailView = (props) => {
  const { route } = props;
  const [qna, setQna] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getQnaDetail(route.params.qnaId);
        setQna(response.result);
      } catch (err) {
        Navigator.goBack();
      }
    };

    fetchData();
  }, []);

  return (
    <Container
      header={true}
      headerPaddingTop={0}
      bgColor={COLORS.containerGray}
      paddingHorizontal={0}
    >
      <ScrollView>
        <View style={styles.section1}>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontSize={18}
            style={{ marginBottom: 15 }}
          >
            Q&A - {qna.categoryName}
          </CustomText>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.main}
            fontSize={16}
            style={{ marginVertical: 7 }}
          >
            Question
          </CustomText>
          <CustomText
            fontSize={12}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.gray}
            style={{ marginBottom: 10 }}
          >
            {moment(qna.createdDate).format('YYYY.MM.DD HH:mm')}
          </CustomText>
          <CustomText
            fontSize={16}
            fontWeight={FONT_WEIGHT.BOLD}
            style={{ marginBottom: 10 }}
          >
            {qna.title}
          </CustomText>
          <Hr />
          <CustomText fontSize={14} style={{ marginTop: 10 }}>
            {qna.question}
          </CustomText>
        </View>
        <View style={styles.section1}>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.main}
            fontSize={16}
            style={{ marginBottom: 7 }}
          >
            Answer
          </CustomText>
          {!!qna.answeredDate ? (
            <>
              <CustomText
                fontSize={12}
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.gray}
                style={{ marginBottom: 10 }}
              >
                {moment(qna.answeredDate).format('YYYY.MM.DD HH:mm')}
              </CustomText>
              <CustomText fontSize={14} style={{ marginTop: 10 }}>
                {qna.answer}
              </CustomText>
            </>
          ) : (
            <CustomText fontSize={14} style={{ marginTop: 10 }}>
              There is no answer yet.
            </CustomText>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

export default QnaDetailView;

const styles = StyleSheet.create({
  section1: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
});
