import React, { createContext, useContext, ReactNode } from 'react';
import { useGoogleAuth, User, Session } from '../lib/auth';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    signOut: async () => {},
    isLoggedIn: false,
});

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const auth = useGoogleAuth();

    return (
        <AuthContext.Provider
            value={{
                session: auth.session,
                user: auth.user,
                loading: auth.loading,
                signInWithGoogle: auth.signInWithGoogle,
                signOut: auth.signOut,
                isLoggedIn: auth.isLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);