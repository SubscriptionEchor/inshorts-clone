import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Register the redirect URI for Expo's auth session
WebBrowser.maybeCompleteAuthSession();

// User type definition
export type User = {
    id: string;
    email: string;
    user_metadata?: {
        avatar_url?: string;
        full_name?: string;
        provider?: string;
    };
};

// Session type definition
export type Session = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: User;
};

// Custom type for AuthSessionResult to fix import issues
export type AuthSessionResult = {
    type: "success" | "error" | "dismiss" | "cancel" | "opened" | "locked";
    params?: Record<string, string>;
    errorCode?: string;
    error?: Error;
    url?: string;
};

// Storage keys
const SESSION_STORAGE_KEY = 'user_session';

/**
 * Custom hook for Google authentication
 */
export function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        // Different client IDs for specific platforms
        ...(Platform.OS === 'ios'
            ? { iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID }
            : {}),
        ...(Platform.OS === 'android'
            ? { androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID }
            : {}),
        redirectUri: makeRedirectUri({
            scheme: 'inshorts-clone',
            preferLocalhost: Platform.OS === 'web'
        }),
    });

    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Load session on initial render
    useEffect(() => {
        loadStoredSession();
    }, []);

    // Handle Google auth response
    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleAuthResponse(response);
        }
    }, [response]);

    // Load stored session
    const loadStoredSession = async () => {
        try {
            const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
            if (storedSession) {
                const parsedSession = JSON.parse(storedSession) as Session;

                // Check if session is expired
                if (parsedSession.expires_at > Date.now()) {
                    setSession(parsedSession);
                    setUser(parsedSession.user);
                } else {
                    // Clear expired session
                    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('Error loading stored session:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Google auth response
    const handleGoogleAuthResponse = async (response: any) => {
        if (response.type !== 'success') return;

        setLoading(true);

        try {
            const { id_token, access_token } = response.params;

            // Get user profile from Google
            const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const userInfo = await userInfoResponse.json();

            const newUser: User = {
                id: userInfo.id,
                email: userInfo.email,
                user_metadata: {
                    avatar_url: userInfo.picture,
                    full_name: userInfo.name,
                    provider: 'google',
                }
            };

            // Create custom session
            const newSession: Session = {
                access_token,
                refresh_token: '',
                expires_at: Date.now() + 3600000, // 1 hour from now
                user: newUser
            };

            // Store session
            await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));

            setUser(newUser);
            setSession(newSession);
        } catch (error) {
            console.error('Error processing Google auth:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        if (!request) {
            console.error('Google Auth request not initialized');
            return;
        }
        await promptAsync();
    };

    // Sign out
    const signOut = async () => {
        setLoading(true);
        try {
            await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
            setUser(null);
            setSession(null);
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
        isLoggedIn: !!user
    };
}