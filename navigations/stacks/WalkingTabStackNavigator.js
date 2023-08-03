import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalkingHomeView from '../../screens/walking/WalkingHomeView';
import WalkingView from '../../screens/walking/WalkingView';
import WalkingResultView from '../../screens/walking/WalkingResultView';
import PetAddFormView from '../../screens/user/PetAddFormView';
import ProfileFormView from '../../screens/user/ProfileFormView';

const WalkingTabStack = createNativeStackNavigator();

const WalkingTabStackNavigator = () => {
  return (
    <WalkingTabStack.Navigator
      initialRouteName="walking_home"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <WalkingTabStack.Screen
        name="walking_home"
        component={WalkingHomeView}
        options={{
          headerShown: false,
        }}
      ></WalkingTabStack.Screen>
      <WalkingTabStack.Screen
        name="walking"
        component={WalkingView}
        options={{
          headerShown: false,
        }}
      ></WalkingTabStack.Screen>
    </WalkingTabStack.Navigator>
  );
};

export default WalkingTabStackNavigator;
