/**
 * URL Shortener Utility
 *
 * In a production app, you would integrate with a real URL shortening service.
 * For this demo, we'll create a mock implementation that generates
 * fake shortened URLs that look like inshorts links.
 */

// Simple pseudo-random string generator for URL path
const generateShortPath = (length: number = 5): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

/**
 * Mock URL shortener function
 * In a real app, this would call an actual URL shortening API
 */
export const shortenUrl = async (originalUrl: string): Promise<string> => {
    try {
        // For demo purposes, generate a fake shortened URL
        const shortPath = generateShortPath();
        return `https://shrts.in/${shortPath}`;
    } catch (error) {
        console.error('Error shortening URL:', error);
        return originalUrl; // Fallback to original URL if shortening fails
    }
};

/**
 * Function to handle expanding shortened URLs
 * This would be used if you wanted to implement link tracking
 */
export const expandShortUrl = async (shortUrl: string): Promise<string> => {
    // In a real app, you would handle URL expansion or redirection
    // This is a placeholder for demonstration
    return shortUrl;
};