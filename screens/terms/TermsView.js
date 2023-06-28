import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layout/Container';
import { useState } from 'react';
import { useEffect } from 'react';
import serviceApis from './../../utils/ServiceApis';
import { Navigator, navigationRef } from '../../navigations/Navigator';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import CustomText from '../../components/elements/CustomText';

const TermsView = (props) => {
  const { route } = props;
  const [terms, setTerms] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const screenData = await serviceApis.requestSignupTerms(
          route.params.termsGroupId
        );

        setTerms(screenData.result);
        setIsLoaded(true);
      } catch (error) {
        Navigator.goBack();
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoaded && (
        <Container>
          <View style={styles.section1}>
            <CustomText style={styles.guideText}>{terms.termsName}</CustomText>
            <CustomText style={styles.guideSubText}>
              created: {moment(terms.createdDate).format('yyyy-MM-DD HH:mm:ss')}
            </CustomText>
          </View>
          <View style={styles.section2}>
            <WebView
              style={{
                flex: 1,
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

export default TermsView;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
  },
  section2: {
    flex: 1,
  },
  guideText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  guideSubText: {
    fontSize: 16,
    marginTop: 5,
  },
});
