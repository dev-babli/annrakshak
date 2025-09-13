import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from 'react-query';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DetectionScreen from './src/screens/DetectionScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';

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
                component={HomeScreen}
                options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
                name="Detection"
                component={DetectionScreen}
                options={{ title: 'Disease Detection' }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{ title: 'Analytics' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load fonts
                await Font.loadAsync({
                    'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
                    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
                });

                // Initialize ML models
                await initializeSimpleML();

                // Initialize notifications
                await initializeNotifications();

                // Pre-load any other resources
                await new Promise(resolve => setTimeout(resolve, 2000));
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
                    <Stack.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            title: 'Capture Plant Image',
                            presentation: 'modal'
                        }}
                    />
                    <Stack.Screen
                        name="Results"
                        component={ResultsScreen}
                        options={{
                            title: 'Detection Results',
                            presentation: 'modal'
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}
