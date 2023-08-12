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
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
              이용약관
            </CustomText>
          </View>
          <View style={styles.section2}>
            {terms.map((ele) => (
              <Pressable
                key={ele.termsGroupId}
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
                <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
                  {ele.termsGroupName}
                </CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={28}
                  color={COLORS.dark}
                />
              </Pressable>
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