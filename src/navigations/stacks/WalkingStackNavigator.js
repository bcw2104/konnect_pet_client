import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalkingResultView from '../../screens/walking/WalkingResultView';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const WalkingStack = createNativeStackNavigator();

const WalkingStackNavigator = () => {
  return (
    <WalkingStack.Navigator>
      <WalkingStack.Group
        screenOptions={(props) => ({
          headerTitle: ({ children }) => (
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              {children}
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          animation: 'slide_from_bottom',
        })}
      >
        <WalkingStack.Screen
          options={{ title: 'Walking Report' }}
          name="walking_result"
          component={WalkingResultView}
        ></WalkingStack.Screen>
      </WalkingStack.Group>
    </WalkingStack.Navigator>
  );
};

export default WalkingStackNavigator;
