import { StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/layout/Container';
import { useState } from 'react';
import { useEffect } from 'react';
import serviceApis from './../../utils/ServiceApis';
import CustomButton from '../../components/elements/CustomButton';
import colors from '../../commons/colors';
import { Pressable } from 'react-native';
import CheckBox from '../../components/elements/CheckBox';
import { Navigator } from './../../navigations/Navigator';
import CustomText from '../../components/elements/CustomText';

const FOOT_BUTTON_HEIGHT = 50;

const SignupStep3View = (props) => {
  const { route } = props;
  const [screenData, setScreenData] = useState({});
  const [termsAgreed, setTermsAgreed] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isRequiredAllChecked, setIsRequiredAllChecked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log(route.params);
    const fetchData = async () => {
      try {
        const screenData = await serviceApis.screenSignupStep3();
        const termsGroups = screenData.result;
        setScreenData({ termsGroups: termsGroups });

        const termsAgreed = {};
        for (let i = 0; i < termsGroups?.length; i++) {
          termsAgreed[termsGroups[i].termsGroupId] = {
            checkedYn: false,
            requiredYn: termsGroups[i].requiredYn,
          };
        }
        setSelectAll(false);
        setTermsAgreed(termsAgreed);
        setIsLoaded(true);
      } catch (error) {
        Navigator.goBack();
      }
    };

    fetchData();
  }, []);

  const goToNextStep = (params) => {
    Navigator.navigate('signup_step4', { ...params, ...route.params });
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
    if (!isRequiredAllChecked) {
      return;
    }
    goToNextStep({ termsAgreed: termsAgreed });
  };

  return (
    <>
      {isLoaded && (
        <>
          <Container outerElementHeight={FOOT_BUTTON_HEIGHT}>
            <View style={styles.section1}>
              <CustomText style={{ fontWeight: 'bold' }} fontSize={24}>
                약관 동의를 해주세요.
              </CustomText>
            </View>
            <View style={styles.section2}>
              <Pressable style={styles.termsSelectAll} onPress={toggleAll}>
                <CheckBox checked={selectAll} size={27} onPress={toggleAll} />
                <CustomText fontSize={17} style={styles.termsCustomText}>
                  전체 선택
                </CustomText>
              </Pressable>
              {screenData.termsGroups.map((ele) => (
                <View key={ele.termsGroupId}>
                  <View style={styles.termsItem}>
                    <CheckBox
                      checked={termsAgreed[ele.termsGroupId].checkedYn}
                      onPress={() => {
                        const newTermsAgreed = {
                          ...termsAgreed,
                          [ele.termsGroupId]: {
                            ...termsAgreed[ele.termsGroupId],
                            checkedYn: !termsAgreed[ele.termsGroupId].checkedYn,
                          },
                        };
                        setTermsAgreed(newTermsAgreed);
                        checkTerms(newTermsAgreed);
                      }}
                      size={27}
                    />
                    <Pressable
                      style={styles.termsCustomText}
                      onPress={() => {
                        Navigator.navigate('terms', {
                          termsGroupId: ele.termsGroupId,
                        });
                      }}
                    >
                      <CustomText
                        fontSize={15}
                        style={{
                          CustomTextDecorationLine: 'underline',
                        }}
                      >
                        [{ele.requiredYn ? '필수' : '선택'}]{ele.termsGroupName}{' '}
                        동의
                      </CustomText>
                    </Pressable>
                  </View>
                  {ele.termsGroupContent && (
                    <CustomText style={styles.termsContent}>
                      {ele.termsGroupContent}
                    </CustomText>
                  )}
                </View>
              ))}
            </View>
          </Container>
          <CustomButton
            fontColor={colors.white}
            bgColor={colors.dark}
            bgColorPress={colors.darkDeep}
            text='다음'
            disabled={!isRequiredAllChecked}
            onPress={submitSignupData}
            styles={styles.submitTheme}
            height={FOOT_BUTTON_HEIGHT}
          />
        </>
      )}
    </>
  );
};
export default SignupStep3View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 4,
  },

  termsSelectAll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: colors.lightDeep,
    borderRadius: 10,
    marginBottom: 20,
  },
  termsItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  termsCustomText: { marginLeft: 20 },
  termsContent: {
    marginTop: -5,
    paddingLeft: 54,
  },
  submitTheme: { borderRadius: 0 },
});
