import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { NewsContext } from '../../API/Context';

export default function TabLayout() {
    const { darkTheme } = useContext(NewsContext);

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: darkTheme ? '#007fff' : '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
                backgroundColor: darkTheme ? '#282c35' : '#FFFFFF',
                borderTopColor: darkTheme ? '#333' : '#E5E5EA',
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 5,
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}