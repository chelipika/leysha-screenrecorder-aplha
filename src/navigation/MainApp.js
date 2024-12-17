import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppSelectionScreen from '../screens/AppSelectionScreen';
import RecordingsListScreen from '../screens/RecordingsListScreen';
import DeveloperScreen from '../screens/DeveloperScreen';
import RecordingService from '../services/RecordingService';

const Tab = createBottomTabNavigator();

const MainApp = () => {
  useEffect(() => {
    RecordingService.init();
    return () => {
      RecordingService.stopAppTracking();
    };
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Apps') {
              iconName = focused ? 'apps' : 'apps-box';
            } else if (route.name === 'Recordings') {
              iconName = focused ? 'video' : 'video-outline';
            } else if (route.name === 'Developer') {
              iconName = focused ? 'developer-board' : 'developer-board';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Apps" 
          component={AppSelectionScreen}
          options={{ title: 'Select Apps' }}
        />
        <Tab.Screen 
          name="Recordings" 
          component={RecordingsListScreen}
          options={{ title: 'Recordings' }}
        />
        <Tab.Screen 
          name="Developer" 
          component={DeveloperScreen}
          options={{ title: 'Developer' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainApp; 