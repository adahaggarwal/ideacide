import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components';

const AuthRedirectHandler = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

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

  // Show loading while processing auth state
  if (loading) {
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
