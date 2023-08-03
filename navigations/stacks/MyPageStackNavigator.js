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
import { CardStyleInterpolators } from '@react-navigation/stack';

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
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
          ),
          animation: 'slide_from_bottom',
        })}
      >
        <MyPageStack.Screen
          name="setting"
          component={SettingView}
        ></MyPageStack.Screen>
        
        <MyPageStack.Group
          screenOptions={{
            animation: 'slide_from_right',
          }}
        >
          <MyPageStack.Screen
            name="terms_list"
            component={TermsListView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            name="terms"
            component={TermsView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            name="leave_confirm"
            component={LeaveConfirmView}
          ></MyPageStack.Screen>
          <MyPageStack.Screen
            name="leave"
            component={LeaveView}
          ></MyPageStack.Screen>
        </MyPageStack.Group>

        <MyPageStack.Screen
          options={{ headerTitle: '내 반려견', headerTitleAlign: 'center' }}
          name="pet_add_form"
          component={PetAddFormView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          options={{
            headerTitle: '내 프로필',
            headerTitleAlign: 'center',
          }}
          name="profile_form"
          component={ProfileFormView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>
    </MyPageStack.Navigator>
  );
};

export default MyPageStackNavigator;
