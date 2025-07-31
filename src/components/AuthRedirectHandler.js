import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components';

const AuthRedirectHandler = ({ children }) => {
  const { currentUser, loading, profileCompleted, checkingProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we just completed a Google sign-in redirect
    const urlParams = new URLSearchParams(window.location.search);
    const isRedirect =
      window.location.pathname === '/' &&
      (document.referrer.includes('accounts.google.com') ||
        sessionStorage.getItem('google-signin-redirect'));

    if (isRedirect && currentUser) {
      // Clear the redirect flag
      sessionStorage.removeItem('google-signin-redirect');

      // Navigate to home page
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Redirect to profile if user is authenticated but profile is not completed
  // This is now disabled - only redirect when user clicks CTAs
  /*
  useEffect(() => {
    // Don't redirect if we're already on profile page, login pages, or checking profile
    const excludedPaths = ['/profile', '/signin', '/signup', '/forgot-password'];
    if (currentUser && !checkingProfile && !profileCompleted && !excludedPaths.includes(location.pathname)) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, profileCompleted, checkingProfile, location.pathname, navigate]);
  */

  // Show loading while processing auth state or checking profile
  if (loading || checkingProfile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)'
        }}
      >
        <Loading size="large" text="Authenticating..." />
      </div>
    );
  }

  return children;
};

export default AuthRedirectHandler;
