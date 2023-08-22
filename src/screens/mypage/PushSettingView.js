import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../contexts/StoreContext';
import { COLORS } from '../../commons/colors';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import CustomSwitch from '../../components/elements/CustomSwitch';
import { serviceApis } from '../../utils/ServiceApis';
import { FONT_WEIGHT } from '../../commons/constants';
import Hr from '../../components/elements/Hr';

const MENU_TITLE = {
  walkingYn: 'Walking Push',
  friendYn: 'Friend Push',
  messageYn: 'Message Push',
  communityYn: 'Community Push',
  serviceYn: 'Service Push',
};

const PushSettingView = () => {
  const { userStore } = useStores();
  const [all, setAll] = useState();

  useEffect(() => {
    checkAll(userStore.appSettings);
  }, []);

  const checkAll = (setting) => {
    const hasTrue = Object.values(setting).filter((ele) => ele).length > 0;
    setAll(hasTrue);
  };

  const handleChangeAll = async () => {
    const setting = {};
    Object.keys(userStore.appSettings).forEach((key) => (setting[key] = !all));

    try {
      const response = await serviceApis.changeSettings(setting);
      userStore.setAppSettings(setting);
      setAll(!all);
    } catch (err) {}
  };

  const handleSettingChange = async (setting) => {
    try {
      const response = await serviceApis.changeSettings(setting);
      userStore.setAppSettings(setting);
      checkAll(setting);
    } catch (err) {}
  };

  return (
    <Container header={true}>
      <ScrollView>
        <View style={styles.section1}>
          <View>
            <View style={styles.menuItem}>
              <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                All Push
              </CustomText>
              <CustomSwitch onValueChange={handleChangeAll} value={all} />
            </View>
          </View>
          {!!userStore.appSettings &&
            Object.keys(userStore.appSettings)
              .filter((key) => !!MENU_TITLE[key])
              .map((key, idx) => (
                <View key={key}>
                  <View style={styles.menuItem}>
                    <CustomText fontSize={16}>{MENU_TITLE[key]}</CustomText>
                    <CustomSwitch
                      onValueChange={() =>
                        handleSettingChange({
                          ...userStore.appSettings,
                          [key]: !userStore.appSettings[key],
                        })
                      }
                      value={userStore.appSettings[key]}
                    />
                  </View>
                  {Object.keys(userStore.appSettings).length - 1 > idx && (
                    <Hr />
                  )}
                </View>
              ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default observer(PushSettingView);

const styles = StyleSheet.create({
  section1: {},
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
