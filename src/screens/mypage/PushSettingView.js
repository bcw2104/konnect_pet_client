import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../contexts/StoreContext';
import { COLORS } from '../../commons/colors';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import CustomSwitch from '../../components/elements/CustomSwitch';
import { serviceApis } from '../../utils/ServiceApis';

const MENU_TITLE = {
  walkingYn: 'Walking Push',
  friendYn: 'Friend Push',
  messageYn: 'Message Push',
  communityYn: 'Community Push',
  serviceYn: 'Service Push',
};

const PushSettingView = () => {
  const { userStore } = useStores();

  const handleChangeSetting = async (setting) => {
    try {
      const response = await serviceApis.changeSettings(setting);
      userStore.setAppSettings(setting);
    } catch (err) {}
  };

  return (
    <Container header={true}>
      <View style={styles.section1}>
        <ScrollView>
          {!!userStore.appSettings &&
            Object.keys(userStore.appSettings)
              .filter((key) => !!MENU_TITLE[key])
              .map((key, idx) => (
                <View key={key}>
                  <View style={styles.menuItem}>
                    <CustomText fontSize={16}>{MENU_TITLE[key]}</CustomText>
                    <CustomSwitch
                      onValueChange={() =>
                        handleChangeSetting({
                          ...userStore.appSettings,
                          [key]: !userStore.appSettings[key],
                        })
                      }
                      value={userStore.appSettings[key]}
                    />
                  </View>
                  {Object.keys(userStore.appSettings).length - 1 > idx && (
                    <View style={styles.divider}></View>
                  )}
                </View>
              ))}
        </ScrollView>
      </View>
    </Container>
  );
};

export default observer(PushSettingView);

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
