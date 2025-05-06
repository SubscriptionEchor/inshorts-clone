import React, { useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Share,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');

type ShareCardProps = {
    title: string;
    description: string;
    imageUrl: string | null;
    author?: string;
    source?: string;
    url?: string;
    visible: boolean;
    onClose: () => void;
    onShare: () => void;
};

const ShareCard = ({
                       title,
                       description,
                       imageUrl,
                       author,
                       source,
                       url,
                       visible,
                       onClose,
                       onShare
                   }: ShareCardProps) => {
    const viewShotRef = useRef<ViewShot>(null);

    // Generate a shortened URL (in a real app, you'd use an API)
    const shortenedUrl = url
        ? `https://shrts.in/${Math.random().toString(36).substring(2, 7)}`
        : '';

    // Current time for timestamp
    const currentTime = new Date();
    const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')} ${currentTime.getHours() >= 12 ? 'PM' : 'AM'}`;

    const shareCardContent = async () => {
        if (viewShotRef.current) {
            try {
                // Capture the card as an image
                const uri = await viewShotRef.current.capture();

                // Share the image based on platform availability
                if (typeof Platform !== 'undefined') {
                    if (Platform.OS === 'ios' || Platform.OS === 'android') {
                        const isAvailable = await Sharing.isAvailableAsync();
                        if (isAvailable) {
                            await Sharing.shareAsync(uri);
                        } else {
                            // Fallback to basic share
                            await Share.share({
                                url: uri,
                                title: title,
                                message: `${title}\n\n${shortenedUrl}\n-via inshorts`
                            });
                        }
                    } else {
                        // Web sharing
                        await Share.share({
                            title: title,
                            message: `${title}\n\n${shortenedUrl}\n-via inshorts`
                        });
                    }
                } else {
                    // Fallback for environments where Platform is not available
                    console.warn('Platform API not available in this environment');
                }
            } catch (error) {
                console.error('Error sharing card:', error);
            }
        }
    };

    if (!visible) return null;

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
                <View style={styles.card}>
                    {/* Top content area - article with image */}
                    <View style={styles.topContent}>
                        {imageUrl ? (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        ) : null}

                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>CryptoShorts</Text>
                        </View>

                        <Text style={styles.headline}>{title}</Text>

                        <Text style={styles.description} numberOfLines={5}>
                            {description}
                        </Text>

                        <Text style={styles.attribution}>
                            {author} | {source || 'News'}
                        </Text>
                    </View>

                    {/* Bottom content area - headline and link */}
                    <View style={styles.bottomContent}>
                        <Text style={styles.bottomHeadline}>{title}</Text>

                        <Text style={styles.link}>
                            {url ? (
                                <>
                                    {shortenedUrl}
                                </>
                            ) : (
                                'Read more:'
                            )}
                        </Text>

                        <Text style={styles.via}>-via CryptoShorts</Text>

                        <Text style={styles.timestamp}>{formattedTime} ✓✓</Text>
                    </View>
                </View>
            </ViewShot>

            <TouchableOpacity style={styles.shareButton} onPress={shareCardContent}>
                <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
        padding: 8,
    },
    card: {
        width: width - 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    topContent: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
        padding: 0,
    },
    image: {
        width: '100%',
        height: 200,
    },
    logoContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#f73131',
        padding: 6,
        paddingHorizontal: 8,
        borderRadius: 4,
        zIndex: 1,
    },
    logoText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Inter-Bold',
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        padding: 15,
        paddingBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    attribution: {
        fontSize: 12,
        color: '#888',
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    bottomContent: {
        backgroundColor: '#8C1D40',
        padding: 15,
        paddingTop: 20,
    },
    bottomHeadline: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    link: {
        fontSize: 15,
        color: '#fff',
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
    via: {
        fontSize: 15,
        color: '#fff',
        marginBottom: 15,
    },
    timestamp: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'right',
    },
    shareButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
});

export default ShareCard;