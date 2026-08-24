import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DiscoveryScreen from './screens/DiscoveryScreen';
import ProfileScreen from './screens/ProfileScreen';
import MatchesScreen from './screens/MatchesScreen';
import MessagesScreen from './screens/MessagesScreen';
import VerificationScreen from './screens/VerificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DiscoveryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Discovery" component={DiscoveryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const MatchesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MatchesList" component={MatchesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="DiscoveryTab"
        component={DiscoveryStack}
        options={{ title: 'Discover', headerShown: false }}
      />
      <Tab.Screen
        name="MatchesTab"
        component={MatchesStack}
        options={{ title: 'Matches', headerShown: false }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesScreen}
        options={{ title: 'Messages', headerShown: false }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
