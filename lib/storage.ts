import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const BOOKMARKS_KEY = 'user_bookmarks';
const SETTINGS_KEY = 'user_settings';

// Types
export type Bookmark = {
    url: string;
    title: string;
    image_url: string;
    created_at: string;
};

export type UserSettings = {
    dark_theme: boolean;
    updated_at: string;
};

/**
 * User Storage Service
 * A simpler alternative to Supabase that uses AsyncStorage
 */
export class UserStorage {
    private userId: string | null = null;

    /**
     * Set the current user ID
     */
    setUser(userId: string | null) {
        this.userId = userId;
    }

    /**
     * Gets the storage key with user ID if available
     */
    private getKey(baseKey: string): string {
        return this.userId ? `${baseKey}_${this.userId}` : baseKey;
    }

    /**
     * Save user settings
     */
    async saveSettings(settings: UserSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(
                this.getKey(SETTINGS_KEY),
                JSON.stringify(settings)
            );
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }

    /**
     * Load user settings
     */
    async loadSettings(): Promise<UserSettings | null> {
        try {
            const data = await AsyncStorage.getItem(this.getKey(SETTINGS_KEY));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading settings:', error);
            return null;
        }
    }

    /**
     * Save a bookmark
     */
    async addBookmark(bookmark: Omit<Bookmark, 'created_at'>): Promise<void> {
        try {
            const bookmarks = await this.getBookmarks();

            // Check if bookmark already exists
            if (bookmarks.some(b => b.url === bookmark.url)) {
                return;
            }

            // Add new bookmark with timestamp
            const newBookmark: Bookmark = {
                ...bookmark,
                created_at: new Date().toISOString()
            };

            bookmarks.push(newBookmark);

            await AsyncStorage.setItem(
                this.getKey(BOOKMARKS_KEY),
                JSON.stringify(bookmarks)
            );
        } catch (error) {
            console.error('Error adding bookmark:', error);
            throw error;
        }
    }

    /**
     * Remove a bookmark
     */
    async removeBookmark(url: string): Promise<void> {
        try {
            const bookmarks = await this.getBookmarks();
            const updatedBookmarks = bookmarks.filter(b => b.url !== url);

            await AsyncStorage.setItem(
                this.getKey(BOOKMARKS_KEY),
                JSON.stringify(updatedBookmarks)
            );
        } catch (error) {
            console.error('Error removing bookmark:', error);
            throw error;
        }
    }

    /**
     * Get all bookmarks
     */
    async getBookmarks(): Promise<Bookmark[]> {
        try {
            const data = await AsyncStorage.getItem(this.getKey(BOOKMARKS_KEY));
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    }

    /**
     * Check if a URL is bookmarked
     */
    async isBookmarked(url: string): Promise<boolean> {
        try {
            const bookmarks = await this.getBookmarks();
            return bookmarks.some(b => b.url === url);
        } catch (error) {
            console.error('Error checking bookmark:', error);
            return false;
        }
    }

    /**
     * Clear all user data
     */
    async clearUserData(): Promise<void> {
        if (!this.userId) return;

        try {
            await AsyncStorage.removeItem(this.getKey(BOOKMARKS_KEY));
            await AsyncStorage.removeItem(this.getKey(SETTINGS_KEY));
        } catch (error) {
            console.error('Error clearing user data:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const userStorage = new UserStorage();