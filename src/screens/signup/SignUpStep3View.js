import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useState, useEffect } from 'react';
import { serviceApis } from './../../utils/ServiceApis';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import CheckBox from '../../components/elements/CheckBox';
import { Navigator } from './../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../contexts/StoreContext';
import { FONT_WEIGHT } from '../../commons/constants';
import { ScrollView } from 'react-native-gesture-handler';

const SignupStep3View = (props) => {
  const { route } = props;
  const { systemStore } = useStores();

  const [terms, setTerms] = useState([]);
  const [termsAgreed, setTermsAgreed] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isRequiredAllChecked, setIsRequiredAllChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getSignUpTerms();
        const termsGroups = response.result;
        setTerms(termsGroups);

        const termsAgreed = {};
        for (let i = 0; i < termsGroups?.length; i++) {
          termsAgreed[termsGroups[i].termsGroupId] = {
            checkedYn: false,
            requiredYn: termsGroups[i].requiredYn,
          };
        }
        setSelectAll(false);
        setTermsAgreed(termsAgreed);
      } catch (error) {
        Navigator.goBack();
      } finally {
        systemStore.setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToNextStep = (params) => {
    Navigator.navigate({ ...params, ...route.params }, 'signup_step4');
  };

  const toggleAll = () => {
    const termsAgreedTemp = { ...termsAgreed };

    if (selectAll) {
      Object.keys(termsAgreedTemp).map(
        (key) => (termsAgreedTemp[key].checkedYn = false)
      );
    } else {
      Object.keys(termsAgreedTemp).map(
        (key) => (termsAgreedTemp[key].checkedYn = true)
      );
    }
    setTermsAgreed(termsAgreedTemp);
    setSelectAll(!selectAll);
    setIsRequiredAllChecked(!selectAll);
  };

  const checkTerms = (newTermsAgreed) => {
    const termsAgreedTemp = { ...newTermsAgreed };
    let allChecked = true;
    let requiredAllChecked = true;

    Object.keys(termsAgreedTemp).map((key) => {
      if (!termsAgreedTemp[key].checkedYn) {
        allChecked = false;
      }
      if (!termsAgreedTemp[key].checkedYn && termsAgreedTemp[key].requiredYn) {
        requiredAllChecked = false;
      }
    });

    setIsRequiredAllChecked(requiredAllChecked);
    setSelectAll(allChecked);
  };

  const submitSignupData = async () => {
    if (!isRequiredAllChecked) return;

    goToNextStep({ termsAgreed: termsAgreed });
  };

  return (
    <>
      {!systemStore.isLoading && (
        <>
          <Container header={true} headerPaddingTop={0}>
            <ScrollView>
              <View style={styles.section1}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={20}>
                  약관 동의를 해주세요.
                </CustomText>
              </View>
              <View style={styles.section2}>
                <Pressable style={styles.termsSelectAll} onPress={toggleAll}>
                  <CheckBox checked={selectAll} size={27} onPress={toggleAll} />
                  <CustomText fontSize={17} style={{ marginLeft: 20 }}>
                    전체 선택
                  </CustomText>
                </Pressable>
                {terms.map((ele) => (
                  <View key={ele.termsGroupId}>
                    <View style={styles.termsItem}>
                      <CheckBox
                        checked={termsAgreed[ele.termsGroupId].checkedYn}
                        onPress={() => {
                          const newTermsAgreed = {
                            ...termsAgreed,
                            [ele.termsGroupId]: {
                              ...termsAgreed[ele.termsGroupId],
                              checkedYn:
                                !termsAgreed[ele.termsGroupId].checkedYn,
                            },
                          };
                          setTermsAgreed(newTermsAgreed);
                          checkTerms(newTermsAgreed);
                        }}
                        size={27}
                      />
                      <Pressable
                        onPress={() => {
                          Navigator.navigate(
                            {
                              termsGroupId: ele.termsGroupId,
                            },
                            'terms'
                          );
                        }}
                      >
                        <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                          <CustomText fontSize={15}>
                            [{ele.requiredYn ? '필수' : '선택'}]{' '}
                          </CustomText>
                          <CustomText
                            fontSize={15}
                            style={{
                              textDecorationLine: 'underline',
                            }}
                          >
                            {ele.termsGroupName}{' '}
                          </CustomText>
                          <CustomText fontSize={15}>동의</CustomText>
                        </View>
                      </Pressable>
                    </View>
                    {ele.termsGroupContent && (
                      <CustomText
                        style={{
                          marginTop: -5,
                          paddingLeft: 54,
                        }}
                        fontSize={14}
                      >
                        {ele.termsGroupContent}
                      </CustomText>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </Container>
          <CustomButton
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.white}
            bgColor={COLORS.main}
            bgColorPress={COLORS.mainDeep}
            text="Next Step"
            disabled={!isRequiredAllChecked}
            onPress={submitSignupData}
            style={styles.submitTheme}
            height={60}
          />
        </>
      )}
    </>
  );
};
export default observer(SignupStep3View);

const styles = StyleSheet.create({
  section1: {
    marginTop:20,
    marginBottom: 50,
  },
  section2: {
    flex: 1,
  },

  termsSelectAll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: COLORS.lightDeep,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  termsItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitTheme: { borderRadius: 0 },
});
