import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import serviceApis from './../../utils/ServiceApis';

const TermsListView = () => {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getAllTerms();
        const termsGroups = response.result;
        setTerms(termsGroups);
      } catch (error) {
        Navigator.goBack();
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <View style={styles.section1}>
        <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
          이용약관
        </CustomText>
      </View>
      <View style={styles.section2}>
        {terms.map((ele) => (
          <Pressable
            key={ele.termsGroupId}
            onPress={() => {
              Navigator.navigate('terms', {
                termsGroupId: ele.termsGroupId,
              });
            }}
            style={styles.menuItem}
          >
            <CustomText fontSize={18} style={{ fontWeight: 'bold' }}>
              {ele.termsGroupName}
            </CustomText>
            <Ionicons name='chevron-forward-outline' size={28} color='black' />
          </Pressable>
        ))}
      </View>
    </Container>
  );
};

export default TermsListView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 7,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
