import { createNativeStackNavigator } from '@react-navigation/native-stack';

const CommunityTabStack = createNativeStackNavigator();

const CommunityTabStackNavigator = () => {
  return (
    <CommunityTabStack.Navigator
      initialRouteName='community_home'
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <CommunityTabStack.Screen
        name='community_home'
        component={CommunityHomeView}
        options={{
          headerShown: false,
        }}
      ></CommunityTabStack.Screen>
    </CommunityTabStack.Navigator>
  );
};

export default CommunityTabStackNavigator;
