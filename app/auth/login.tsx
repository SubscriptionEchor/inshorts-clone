import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../../API/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { NewsContext } from '../../API/Context';

export default function LoginScreen() {
    const { signInWithGoogle, loading } = useAuth();
    const { darkTheme } = useContext(NewsContext);
    const router = useRouter();

    const handleLogin = async () => {
        await signInWithGoogle();
    };

    return (
        <View style={[styles.container, { backgroundColor: darkTheme ? '#282c35' : '#fff' }]}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={30} color={darkTheme ? '#fff' : '#000'} />
            </TouchableOpacity>

            <View style={styles.content}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                />

                <Text style={[styles.title, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
                    Sign in to Inshorts Clone
                </Text>

                <Text style={[styles.subtitle, { color: darkTheme ? '#ccc' : '#666' }]}>
                    Sign in to sync your bookmarks and preferences across devices
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                ) : (
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <View style={styles.googleIconContainer}>
                            <Text style={styles.googleIconPlaceholder}>G</Text>
                        </View>
                        <Text style={styles.googleButtonText}>Sign in with Google</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        marginTop: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 30,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    googleIconPlaceholder: {
        color: '#4285F4',
        fontWeight: 'bold',
        fontSize: 14,
    },
    googleButtonText: {
        color: '#fff',
        fontFamily: 'Inter-Bold',
        fontSize: 16,
    },
    loader: {
        marginVertical: 20,
    },
});