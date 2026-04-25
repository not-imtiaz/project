import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import AddProjectScreen from './screens/AddProjectScreen';
import ProjectDetailScreen from './screens/ProjectDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F9F9FB',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerShadowVisible: false,
          cardStyle: { backgroundColor: '#F9F9FB' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Projects' }}
        />
        <Stack.Screen
          name="AddProject"
          component={AddProjectScreen}
          options={{
            title: 'New Project',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ProjectDetail"
          component={ProjectDetailScreen}
          options={{
            title: 'Edit Project',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
