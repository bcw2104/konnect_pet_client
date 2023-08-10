import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useState } from 'react';
import { useEffect } from 'react';
import serviceApis from './../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import CustomText from '../../components/elements/CustomText';
import COLORS from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';

const TermsView = (props) => {
  const { route } = props;
  const { systemStore } = useStores();
  const [term, setTerm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getTermsDetail(
          route.params.termsGroupId
        );

        setTerm(response.result);
      } catch (error) {
        Navigator.goBack();
      } finally {
        systemStore.setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container header={true}>
      {!systemStore.isLoading && (
        <>
          <View style={styles.section1}>
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
              {term?.termsName}
            </CustomText>
            <CustomText style={{ marginTop: 5 }} fontSize={16}>
              created: {moment(term?.createdDate).format('yyyy-MM-DD HH:mm:ss')}
            </CustomText>
          </View>
          <View style={styles.section2}>
            <WebView
              style={{
                flex: 1,
                backgroundColor: COLORS.white,
              }}
              source={{
                html: `<html>
                <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>${term?.termsContent}</body>
                </html>`,
              }}
            />
          </View>
        </>
      )}
    </Container>
  );
};

export default observer(TermsView);

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
  },
  section2: {
    flex: 1,
  },
});
