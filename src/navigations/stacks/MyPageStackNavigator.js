import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TermsView from '../../screens/terms/TermsView';
import LeaveView from '../../screens/mypage/LeaveView';
import LeaveConfirmView from '../../screens/mypage/LeaveConfirmView';
import SettingView from '../../screens/mypage/SettingView';
import TermsListView from '../../screens/terms/TermsListView';
import PetAddFormView from '../../screens/user/PetAddFormView';
import ProfileFormView from '../../screens/user/ProfileFormView';
import MyPointHistoryView from '../../screens/mypage/MyPointHistoryView';
import MyNotificationView from '../../screens/mypage/MyNotificationView';
import { COLORS } from '../../commons/colors';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import FriendsView from '../../screens/mypage/FriendsView';
import ChangePasswordView from '../../screens/mypage/ChangePasswordView';
import PushSettingView from '../../screens/mypage/PushSettingView';

const MyPageStack = createNativeStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const MyPageStackNavigator = ({ navigation, route }) => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle: ({ children }) => (
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              {children}
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={COLORS.dark}
              />
            </Pressable>
          ),
          animation: 'slide_from_bottom',
        })}
      >
        <MyPageStack.Screen
          options={{ title: 'Setting' }}
          name="setting"
          component={SettingView}
        ></MyPageStack.Screen>

        <MyPageStack.Group
          screenOptions={{
            animation: 'slide_from_right',
          }}
        >
          <MyPageStack.Screen
            options={{ title: 'Change Password' }}
            name="change_password"
            component={ChangePasswordView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            options={{ title: 'Push Settings' }}
            name="push_settings"
            component={PushSettingView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            name="terms_list"
            options={{ title: 'Terms' }}
            component={TermsListView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            options={{ title: 'Terms' }}
            name="terms"
            component={TermsView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            options={{ title: 'Membership Withdrawal' }}
            name="leave_confirm"
            component={LeaveConfirmView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            options={{ title: 'Membership Withdrawal' }}
            name="leave"
            component={LeaveView}
          ></MyPageStack.Screen>
        </MyPageStack.Group>
        <MyPageStack.Screen
          options={{ title: 'My Pet' }}
          name="pet_add_form"
          component={PetAddFormView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          options={{ title: 'My Profile' }}
          name="profile_form"
          component={ProfileFormView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          options={{ title: 'Point History' }}
          name="point_history"
          component={MyPointHistoryView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          options={{ title: 'Notification' }}
          name="notification_history"
          component={MyNotificationView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          options={{ title: 'My Friends' }}
          name="friends"
          component={FriendsView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>
    </MyPageStack.Navigator>
  );
};

export default MyPageStackNavigator;
