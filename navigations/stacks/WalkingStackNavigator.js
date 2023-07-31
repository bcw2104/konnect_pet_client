import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalkingHomeView from '../../screens/walking/WalkingHomeView';
import WalkingView from '../../screens/walking/WalkingView';
import WalkingResultView from '../../screens/walking/WalkingResultView';
import PetAddFormView from '../../screens/user/PetAddFormView';
import UserInfoFormView from '../../screens/user/UserInfoFormView';

const WalkingStack = createNativeStackNavigator();

const WalkingStackNavigator = () => {
  return (
    <WalkingStack.Navigator initialRouteName="walking_home">
      <WalkingStack.Screen
        name="walking_home"
        component={WalkingHomeView}
        options={{
          headerShown: false,
        }}
      ></WalkingStack.Screen>
      <WalkingStack.Screen
        name="walking"
        component={WalkingView}
        options={{
          headerShown: false,
        }}
      ></WalkingStack.Screen>
      <WalkingStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                props.navigation.reset({
                  routes: [{ name: 'walking_home', params: {} }],
                });
              }}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
          ),
          presentation: 'containedModal',
        })}
      >
        <WalkingStack.Screen
          name="walking_pet_add_form"
          component={PetAddFormView}
        ></WalkingStack.Screen>
         <WalkingStack.Screen
          name="walking_profile_form"
          component={UserInfoFormView}
        ></WalkingStack.Screen>
        <WalkingStack.Screen
          name="walking_result"
          component={WalkingResultView}
        ></WalkingStack.Screen>
      </WalkingStack.Group>
    </WalkingStack.Navigator>
  );
};

export default WalkingStackNavigator;
