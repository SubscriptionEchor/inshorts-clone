import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import Context from '../API/Context';
import { AuthProvider } from '../API/AuthContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
    const [fontsLoaded] = useFonts({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            // Hide splash screen once fonts are loaded
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
        <AuthProvider>
            <Context>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen
                        name="auth/login"
                        options={{ presentation: 'modal' }}
                    />
                </Stack>
            </Context>
        </AuthProvider>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});