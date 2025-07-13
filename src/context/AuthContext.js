import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { handleRedirectResult } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle Google sign-in redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result) {
          console.log('Google sign-in successful:', result);
        }
      } catch (error) {
        console.error('Google sign-in redirect error:', error);
      }
    };

    checkRedirectResult();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
