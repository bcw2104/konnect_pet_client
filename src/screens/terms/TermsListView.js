import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from './../../utils/ServiceApis';
import { COLORS } from '../../commons/colors';
import Hr from '../../components/elements/Hr';

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
    <Container header={true}>
      <View style={styles.section1}>
        <ScrollView>
          {terms.map((ele, idx) => (
            <View key={ele.termsGroupId}>
              <Pressable
                onPress={() => {
                  Navigator.navigate(
                    {
                      termsGroupId: ele.termsGroupId,
                    },
                    'terms'
                  );
                }}
                style={styles.menuItem}
              >
                <CustomText fontSize={16}>{ele.name}</CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color={COLORS.dark}
                />
              </Pressable>
              {terms.length - 1 > idx && <Hr />}
            </View>
          ))}
        </ScrollView>
      </View>
    </Container>
  );
};

export default TermsListView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
