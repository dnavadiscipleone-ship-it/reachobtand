import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SearchScreen from './src/screens/SearchScreen';
import VehicleDetailsScreen from './src/screens/VehicleDetailsScreen';
import TowYardsScreen from './src/screens/TowYardsScreen';
import CallsScreen from './src/screens/CallsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SearchStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="SearchMain"
      component={SearchScreen}
      options={{ title: 'Find Your Vehicle' }}
    />
    <Stack.Screen
      name="VehicleDetails"
      component={VehicleDetailsScreen}
      options={{ title: 'Vehicle Details' }}
    />
  </Stack.Navigator>
);

const CallsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="CallsMain"
      component={CallsScreen}
      options={{ title: 'Calling' }}
    />
  </Stack.Navigator>
);

const TowYardsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#2c3e50',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="TowYardsMain"
      component={TowYardsScreen}
      options={{ title: 'Tow Yards' }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search';
              } else if (route.name === 'Calls') {
                iconName = focused ? 'phone' : 'phone';
              } else if (route.name === 'TowYards') {
                iconName = focused ? 'location-on' : 'location-on';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: '#95a5a6',
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="Search"
            component={SearchStack}
            options={{ title: 'Search' }}
          />
          <Tab.Screen
            name="Calls"
            component={CallsStack}
            options={{ title: 'Calls' }}
          />
          <Tab.Screen
            name="TowYards"
            component={TowYardsStack}
            options={{ title: 'Tow Yards' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
