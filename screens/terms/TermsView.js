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
import colors from '../../commons/colors';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';

const TermsView = (props) => {
  const { route } = props;
  const { commonStore } = useStores();
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      commonStore.setIsLoading(true);
      try {
        const screenData = await serviceApis.requestSignupTerms(
          route.params.termsGroupId
        );

        setTerms(screenData.result);
      } catch (error) {
        Navigator.goBack();
      } finally {
        commonStore.setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {!commonStore.isLoading && (
        <Container>
          <View style={styles.section1}>
            <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
              {terms.termsName}
            </CustomText>
            <CustomText style={{ marginTop: 5 }} fontSize={16}>
              created: {moment(terms.createdDate).format('yyyy-MM-DD HH:mm:ss')}
            </CustomText>
          </View>
          <View style={styles.section2}>
            <WebView
              style={{
                flex: 1,
                backgroundColor: colors.white,
              }}
              source={{
                html: `<html>
                <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"></head>
                <body>${terms.termsContent}</body>
                </html>`,
              }}
            />
          </View>
        </Container>
      )}
    </>
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
