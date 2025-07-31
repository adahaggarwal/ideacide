import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { handleRedirectResult } from '../services/auth';
import { profileService } from '../services/profileService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check profile completion when user logs in
        setCheckingProfile(true);
        try {
          const completed = await profileService.isProfileCompleted(user.uid);
          setProfileCompleted(completed);
        } catch (error) {
          console.error('Error checking profile completion:', error);
          setProfileCompleted(false);
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setProfileCompleted(false);
        setCheckingProfile(false);
      }
      
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
    profileCompleted,
    checkingProfile,
    logout,
    refreshProfileStatus: async () => {
      if (currentUser) {
        setCheckingProfile(true);
        try {
          const completed = await profileService.isProfileCompleted(currentUser.uid);
          setProfileCompleted(completed);
        } catch (error) {
          console.error('Error refreshing profile status:', error);
        } finally {
          setCheckingProfile(false);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!(loading || checkingProfile) && children}
    </AuthContext.Provider>
  );
};
