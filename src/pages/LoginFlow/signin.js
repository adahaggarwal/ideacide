import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, getFirebaseErrorMessage } from '../../services/auth';
import logo from '../../assets/images/final logo.svg';
import googleLogo from '../../assets/images/google_symbol.svg';
import './index.css';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // Let AuthRedirectHandler handle the redirect based on profile completion
      navigate('/');
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      // This will redirect to Google, so we don't need to handle the result here
      await signInWithGoogle();
      // The page will redirect, so this code won't execute
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(getFirebaseErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box signin-box">
        <div className="logo-app">
          <img src={logo} alt="Logo" className="logo" />
          <span className="app-name">IDEACIDE</span>
        </div>
        <h2 style={{ color: '#a167ff' }}>Sign In</h2>
        
        {error && (
          <div style={{ 
            color: '#ff4444', 
            backgroundColor: '#ffebee', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            disabled={loading}
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              style={{ userSelect: 'none', cursor: 'pointer' }}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="forgot-password" style={{ textAlign: 'right', marginTop: '5px' }}>
            <Link to="/forgot-password" style={{ color: '#a167ff', textDecoration: 'underline', fontWeight: 500 }}>Forgot Password</Link>
          </div>
          <button 
            type="submit" 
            className="signin-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="or">Or</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
          <div 
            className="google-signin" 
            style={{ 
              minWidth: '180px', 
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onClick={handleGoogleSignIn}
          >
            <img src={googleLogo} alt="Google" />
            <span>{loading ? 'Signing In...' : 'Sign In with Google'}</span>
          </div>
        </div>
        <p className="signin-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
