// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import DashboardPage from './src/screens/DashboardPage';
import LoginPage from './src/screens/LoginPage';
import SettingsPage from './src/screens/SettingsPage';

const Stack = createNativeStackNavigator();

// NOTE: In a real app, this state would come from secure storage (e.g., SecureStore)
const AuthContext = React.createContext(null);

export default function App() {
  const [userToken, setUserToken] = useState(null); // 'null' means logged out

  // Simple hardcoded login/logout logic for initial testing
  const authContext = React.useMemo(() => ({
    signIn: () => setUserToken('dummy-token'),
    signOut: () => setUserToken(null),
  }), []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken == null ? (
            // No user token found, showing authentication screens
            <Stack.Screen name="Login" component={LoginPage} />
          ) : (
            // User is signed in, showing main app screens
            <>
              <Stack.Screen name="Dashboard" component={DashboardPage} />
              <Stack.Screen name="Settings" component={SettingsPage} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}