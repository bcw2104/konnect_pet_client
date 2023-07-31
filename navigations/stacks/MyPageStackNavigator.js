import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TermsView from '../../screens/terms/TermsView';
import LeaveView from '../../screens/mypage/LeaveView';
import LeaveConfirmView from '../../screens/mypage/LeaveConfirmView';
import MyPageHomeView from '../../screens/mypage/MyPageHomeView';
import CustomText from '../../components/elements/CustomText';
import SettingView from '../../screens/mypage/SettingView';
import TermsListView from '../../screens/terms/TermsListView';
import PetAddFormView from '../../screens/user/PetAddFormView';
import UserInfoFormView from '../../screens/user/UserInfoFormView';

const MyPageStack = createNativeStackNavigator();

const MyPageStackNavigator = ({ navigation, route }) => {
  return (
    <MyPageStack.Navigator initialRouteName="mypage_home">
      <MyPageStack.Screen
        name="mypage_home"
        component={MyPageHomeView}
        options={(props) => ({
          headerTitle: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
              <CustomText>My Page</CustomText>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', paddingRight: 15 }}>
              <Pressable
                onPress={props.navigation.goBack}
                hitSlop={5}
                style={{ marginRight: 20 }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  props.navigation.navigate('setting', {});
                }}
                hitSlop={5}
              >
                <Ionicons name="settings-outline" size={24} color="black" />
              </Pressable>
            </View>
          ),
        })}
      ></MyPageStack.Screen>
      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
          ),
          presentation: 'containedModal',
        })}
      >
        <MyPageStack.Screen
          name="setting"
          component={SettingView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name="terms_list"
          component={TermsListView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name="leave_confirm"
          component={LeaveConfirmView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name="leave"
          component={LeaveView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name="pet_add_form"
          component={PetAddFormView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name="profile_form"
          component={UserInfoFormView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>

      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
          ),
          presentation: 'fullScreenModal',
        })}
      >
        <MyPageStack.Screen
          name="terms"
          component={TermsView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>
    </MyPageStack.Navigator>
  );
};

export default MyPageStackNavigator;
