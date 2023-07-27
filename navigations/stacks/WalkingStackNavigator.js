import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalkingHomeView from '../../screens/walking/WalkingHomeView';
import WalkingView from '../../screens/walking/WalkingView';
import WalkingResultView from '../../screens/walking/WalkingResultView';
import PetAddView from '../../screens/user/PetAddView';

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
          presentation: 'modal',
        })}
      >
        <WalkingStack.Screen
          name="pet_add"
          component={PetAddView}
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
