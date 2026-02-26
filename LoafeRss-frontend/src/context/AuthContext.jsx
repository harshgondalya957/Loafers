import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        localStorage.removeItem('customUser');
        setCurrentUser(null);
        return signOut(auth);
    };

    const customLogin = (user) => {
        localStorage.setItem('customUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const updateUserProfile = (name) => {
        return updateProfile(auth.currentUser, { displayName: name });
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    useEffect(() => {
        console.log("AuthContext: Setting up auth listener");
        let mounted = true;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("AuthContext: User state changed", user ? "User found" : "No user");
            if (mounted) {
                if (user) {
                    setCurrentUser(user);
                    // Clear custom user if firebase user exists to avoid conflicts
                    localStorage.removeItem('customUser');
                } else {
                    // Check for custom user from backend OTP login
                    const customUserStr = localStorage.getItem('customUser');
                    if (customUserStr) {
                        try {
                            const customUser = JSON.parse(customUserStr);
                            setCurrentUser(customUser);
                        } catch (e) {
                            console.error("Failed to parse custom user", e);
                            setCurrentUser(null);
                        }
                    } else {
                        setCurrentUser(null);
                    }
                }
                setLoading(false);
            }
        }, (error) => {
            console.error("AuthContext: Auth error", error);
            if (mounted) setLoading(false);
        });

        // Fallback timeout in case Firebase is blocked or slow
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("AuthContext: Firebase auth timed out, forcing app load");
                setLoading(false);
            }
        }, 1000);

        return () => {
            mounted = false;
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        googleLogin,
        logout,
        updateUserProfile,
        resetPassword,
        customLogin
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F43F97]"></div>
                <p className="text-gray-500 text-sm font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
