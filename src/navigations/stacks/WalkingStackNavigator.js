import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkingResultView from '../../screens/walking/WalkingResultView';

const WalkingStack = createNativeStackNavigator();

const WalkingStackNavigator = () => {
  return (
    <WalkingStack.Navigator>
      <WalkingStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
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
