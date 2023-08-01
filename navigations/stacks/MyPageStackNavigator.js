import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TermsView from '../../screens/terms/TermsView';
import LeaveView from '../../screens/mypage/LeaveView';
import LeaveConfirmView from '../../screens/mypage/LeaveConfirmView';
import SettingView from '../../screens/mypage/SettingView';
import TermsListView from '../../screens/terms/TermsListView';
import PetAddFormView from '../../screens/user/PetAddFormView';
import UserInfoFormView from '../../screens/user/UserInfoFormView';

const MyPageStack = createNativeStackNavigator();

const MyPageStackNavigator = ({ navigation, route }) => {
  return (
    <MyPageStack.Navigator>
      
      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name='arrow-back-outline' size={24} color='black' />
            </Pressable>
          ),
          presentation: 'containedModal',
        })}
      >
        <MyPageStack.Screen
          name='setting'
          component={SettingView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name='terms_list'
          component={TermsListView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name='leave_confirm'
          component={LeaveConfirmView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name='leave'
          component={LeaveView}
        ></MyPageStack.Screen>

        <MyPageStack.Screen
          name='pet_add_form'
          component={PetAddFormView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name='profile_form'
          component={UserInfoFormView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>

      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name='arrow-back-outline' size={24} color='black' />
            </Pressable>
          ),
          presentation: 'fullScreenModal',
        })}
      >
        <MyPageStack.Screen
          name='terms'
          component={TermsView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>
    </MyPageStack.Navigator>
  );
};

export default MyPageStackNavigator;
