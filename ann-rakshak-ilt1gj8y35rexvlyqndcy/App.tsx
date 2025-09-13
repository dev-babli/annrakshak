import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from 'react-query';

// Screens
import SimpleHomeScreen from './src/screens/SimpleHomeScreen';

// Services
import { initializeSimpleML } from './src/services/mlServiceSimple';
import { initializeNotifications } from './src/services/notificationService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Detection') {
                        iconName = focused ? 'camera' : 'camera-outline';
                    } else if (route.name === 'Analytics') {
                        iconName = focused ? 'analytics' : 'analytics-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#10b981',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e5e7eb',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                headerStyle: {
                    backgroundColor: '#10b981',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={SimpleHomeScreen}
                options={{ title: 'Dashboard' }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Initialize ML models
                await initializeSimpleML();

                // Initialize notifications
                await initializeNotifications();

                // Pre-load any other resources
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn('Error during app initialization:', e);
            } finally {
                setAppIsReady(true);
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <StatusBar style="light" backgroundColor="#10b981" />
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#10b981',
                        },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Main"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}
