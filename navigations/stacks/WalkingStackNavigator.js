import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WalkingResultView from '../../screens/walking/WalkingResultView';

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
                props.navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'home_tabs',
                      state: {
                        routes: [
                          {
                            name: 'walking_tab',
                            state: {
                              routes: [{ name: 'walking_home', params: {} }],
                            },
                          },
                        ],
                      },
                    },
                  ],
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
          name="walking_result"
          component={WalkingResultView}
        ></WalkingStack.Screen>
      </WalkingStack.Group>
    </WalkingStack.Navigator>
  );
};

export default WalkingStackNavigator;
