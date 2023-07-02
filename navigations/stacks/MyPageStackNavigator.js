import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

import TermsView from '../../screens/terms/TermsView';
import LeaveView from '../../screens/mypage/LeaveView';
import LeaveConfirmView from '../../screens/mypage/LeaveConfirmView';
import MyPageHomeView from '../../screens/mypage/MyPageHomeView';
import CustomText from '../../components/elements/CustomText';

const MyPageStack = createNativeStackNavigator();

const MyPageStackNavigator = () => {
  return (
    <MyPageStack.Navigator initialRouteName='mypage'>
      <MyPageStack.Screen
        name='mypage'
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
                <Fontisto name='bell' size={24} color='black' />
              </Pressable>
              <Pressable
                onPress={() => {
                  props.navigation.navigate('leave_confirm', {});
                }}
                hitSlop={5}
              >
                <Ionicons name='settings-outline' size={24} color='black' />
              </Pressable>
            </View>
          ),
        })}
      ></MyPageStack.Screen>

      <MyPageStack.Group
        screenOptions={(props) => ({
          headerTitle:'',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name='arrow-back-sharp' size={24} color='black' />
            </Pressable>
          ),
          presentation: 'modal',
        })}
      >
        <MyPageStack.Screen
          name='leave_confirm'
          component={LeaveConfirmView}
        ></MyPageStack.Screen>
        <MyPageStack.Screen
          name='leave'
          component={LeaveView}
        ></MyPageStack.Screen>
      </MyPageStack.Group>

      <MyPageStack.Group
        screenOptions={(props) => ({
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name='arrow-back-sharp' size={24} color='black' />
            </Pressable>
          ),
          presentation: 'modal',
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
