import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../../commons/constants';
import { useStores } from '../../contexts/StoreContext';
import { COLORS } from '../../commons/colors';
import CustomSwitch from '../../components/elements/CustomSwitch';
import { observer } from 'mobx-react-lite';
import { serviceApis } from '../../utils/ServiceApis';
import Constants from 'expo-constants';
import Hr from '../../components/elements/Hr';

const SettingView = () => {
  const { userStore, modalStore, systemStore } = useStores();

  const logout = () => {
    modalStore.openTwoButtonModal(
      'Do you want to sign out?',
      'Cancel',
      null,
      'Confirm',
      () => {
        userStore.logout();
      }
    );
  };

  const goToChangePassword = () => {
    Navigator.navigate({}, 'change_password');
  };

  const goToPushSettings = () => {
    Navigator.navigate({}, 'push_settings');
  };

  const goToTerms = () => {
    Navigator.navigate({}, 'terms_list');
  };
  const goToFaq = () => {
    Navigator.navigate({}, 'faq');
  };
  const goToQnaForm = () => {
    Navigator.navigate({}, 'qna_form');
  };
  const goToQna = () => {
    Navigator.navigate({}, 'qna');
  };
  const goToLeave = () => {
    Navigator.navigate({}, 'leave_confirm');
  };
  const changeMarketing = async () => {
    const marketingYn = !userStore.marketingYn;
    try {
      const response = await serviceApis.changeMarketingAgreement(marketingYn);
      userStore.setMarketingYn(marketingYn);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      header={true}
      bgColor={COLORS.containerGray}
      paddingHorizontal={0}
      headerPaddingTop={0}
    >
      <ScrollView>
        <View style={styles.section1}>
          <View style={styles.menuTitle}>
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              Account
            </CustomText>
          </View>
          <Pressable onPress={logout} style={styles.menuItem}>
            <CustomText fontSize={15}>Sign Out</CustomText>
          </Pressable>

          <Hr />
          {userStore.platform == SOCIAL_TYPE.EMAIL && (
            <>
              <Pressable onPress={goToChangePassword} style={styles.menuItem}>
                <CustomText fontSize={15}>Change Password</CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color={COLORS.dark}
                />
              </Pressable>
              <Hr />
            </>
          )}
          <Pressable onPress={goToPushSettings} style={styles.menuItem}>
            <CustomText fontSize={15}>Push Settings</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <Hr />
          <View style={styles.menuItem}>
            <View style={{ flex: 1 }}>
              <CustomText fontSize={15} style={{ marginBottom: 7 }}>
                Marketing Information
              </CustomText>
              <CustomText fontSize={12} fontColor={COLORS.grayDeep}>
                If you receive marketing information{'\n'}you can receive
                various event information.
              </CustomText>
            </View>
            <View style={{ width: 70, alignItems: 'flex-end' }}>
              <CustomSwitch
                onValueChange={changeMarketing}
                value={userStore.marketingYn}
              />
            </View>
          </View>
        </View>
        <View style={styles.section2}>
          <View style={styles.menuTitle}>
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              Service
            </CustomText>
          </View>
          <View style={styles.menuItem}>
            <CustomText fontSize={15}>Version</CustomText>
            <View style={{ flexDirection: 'row' }}>
              <CustomText fontSize={12}>
                Now v{Constants.expoConfig.version}
              </CustomText>
              {!!systemStore.lastestAppVersion && (
                <>
                  <CustomText fontSize={12} style={{ paddingHorizontal: 5 }}>
                    /
                  </CustomText>
                  <CustomText fontSize={12} fontWeight={FONT_WEIGHT.BOLD}>
                    New v{systemStore.lastestAppVersion.version}
                  </CustomText>
                </>
              )}
            </View>
          </View>
          <Hr />
          <Pressable onPress={goToTerms} style={styles.menuItem}>
            <CustomText fontSize={15}>Terms</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <Hr />
          <Pressable onPress={goToFaq} style={styles.menuItem}>
            <CustomText fontSize={15}>FAQ</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <Hr />
          <Pressable onPress={goToQnaForm} style={styles.menuItem}>
            <CustomText fontSize={15}>Q&A</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <Hr />
          <Pressable onPress={goToQna} style={styles.menuItem}>
            <CustomText fontSize={15}>My Q&A</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <Hr />
          <Pressable onPress={goToLeave} style={styles.menuItem}>
            <CustomText fontSize={15}>Membership Withdrawal</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
        </View>
      </ScrollView>
    </Container>
  );
};

export default observer(SettingView);

const styles = StyleSheet.create({
  section1: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
  },
  section2: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
  },
  menuTitle: {
    justifyContent: 'center',
    height: 50,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
