import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalkingResultView from '../../screens/walking/WalkingResultView';
import { Navigator } from '../Navigator';

const WalkingStack = createNativeStackNavigator();

const WalkingStackNavigator = () => {
  return (
    <WalkingStack.Navigator>
      <WalkingStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                Navigator.reset({},'home_tabs','walking_tab','walking_home');
              }}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
          ),
          animation: 'slide_from_bottom',
        })}
      >
        <WalkingStack.Screen
          name="walking_result"
          component={WalkingResultView}
        ></WalkingStack.Screen>
      </WalkingStack.Group>
    </WalkingStack.Navigator>
  );
};

export default WalkingStackNavigator;
