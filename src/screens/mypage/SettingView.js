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
      bgColor={COLORS.light}
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
            <CustomText fontSize={16}>Sign Out</CustomText>
          </Pressable>
          <View style={styles.divider}></View>
          {userStore.platform == SOCIAL_TYPE.EMAIL && (
            <>
              <Pressable onPress={goToChangePassword} style={styles.menuItem}>
                <CustomText fontSize={16}>Change Password</CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color={COLORS.dark}
                />
              </Pressable>
              <View style={styles.divider}></View>
            </>
          )}
          <Pressable onPress={goToPushSettings} style={styles.menuItem}>
            <CustomText fontSize={16}>Push Settings</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <View style={styles.divider}></View>
          <View style={styles.menuItem}>
            <View style={{ flex: 1 }}>
              <CustomText fontSize={16} style={{ marginBottom: 7 }}>
                Marketing Information
              </CustomText>
              <CustomText fontSize={14} fontColor={COLORS.grayDeep}>
                If you receive marketing information{'\n'}you can receive
                various event information.
              </CustomText>
            </View>
            <View style={{ width: 60, alignItems: 'flex-end' }}>
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
            <CustomText fontSize={16}>Version</CustomText>
            <View style={{ flexDirection: 'row' }}>
              <CustomText fontSize={16}>
                {Constants.expoConfig.version}
              </CustomText>
              {!!systemStore.lastestAppVersion && (
                <>
                  <CustomText fontSize={16} style={{ paddingHorizontal: 5 }}>
                    /
                  </CustomText>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    {systemStore.lastestAppVersion.version}
                  </CustomText>
                </>
              )}
            </View>
          </View>
          <View style={styles.divider}></View>
          <Pressable onPress={goToTerms} style={styles.menuItem}>
            <CustomText fontSize={16}>Terms</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <View style={styles.divider}></View>
          <Pressable onPress={goToFaq} style={styles.menuItem}>
            <CustomText fontSize={16}>FAQ</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <View style={styles.divider}></View>
          <Pressable onPress={goToQna} style={styles.menuItem}>
            <CustomText fontSize={16}>Q&A</CustomText>
            <Ionicons name="chevron-forward" size={25} color={COLORS.dark} />
          </Pressable>
          <View style={styles.divider}></View>
          <Pressable onPress={goToLeave} style={styles.menuItem}>
            <CustomText fontSize={16}>Membership Withdrawal</CustomText>
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
  divider: {
    height: 2,
    backgroundColor: COLORS.light,
  },
});
