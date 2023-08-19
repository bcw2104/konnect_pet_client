import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from './../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';
import { COLORS } from '../../commons/colors';

const TermsListView = () => {
  const { systemStore } = useStores();
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getAllTerms();
        const termsGroups = response.result;
        setTerms(termsGroups);
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
                  <CustomText fontSize={16}>{ele.termsGroupName}</CustomText>
                  <Ionicons
                    name="chevron-forward"
                    size={25}
                    color={COLORS.dark}
                  />
                </Pressable>
                {terms.length - 1 > idx && <View style={styles.divider}></View>}
              </View>
            ))}
          </View>
        </>
      )}
    </Container>
  );
};

export default observer(TermsListView);

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
  divider: {
    height: 2,
    backgroundColor: COLORS.light,
  },
});
