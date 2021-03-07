import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, SelectScreen, ProfileScreen } from './screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from './theme.style';

const Tab = createBottomTabNavigator();

export default function HomeTabs({extraData}) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: theme.PURPLE,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size}/>
          ) 
        }}
      >
        {props => <HomeScreen {...props} extraData={extraData} />}
      </Tab.Screen>
      <Tab.Screen
        name="Select"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="camera" color={color} size={size}/>
          ) 
        }}
      >
        {props => <SelectScreen {...props} extraData={extraData} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="face" color={color} size={size}/>
          ) 
        }}
      >
        {props => <ProfileScreen {...props} extraData={extraData} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}