import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount, signInWithGoogle, getFirebaseErrorMessage } from '../../services/auth';
import logo from '../../assets/images/final logo.svg';
import googleLogo from '../../assets/images/google_symbol.svg';
import './index.css';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await createAccount(formData.email, formData.password, formData.fullName);
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
      <div className="form-box signup-box">
        <div className="logo-app">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h2>Sign Up</h2>
        
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
            type="text" 
            name="fullName"
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleInputChange}
            required 
            disabled={loading}
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleInputChange}
            required 
            disabled={loading}
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleInputChange}
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
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <span
              className="eye-icon"
              onClick={toggleConfirmPasswordVisibility}
              style={{ userSelect: 'none', cursor: 'pointer' }}
              title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="or">Or</p>
        <div 
          className="google-signin"
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          onClick={handleGoogleSignIn}
        >
          <img src={googleLogo} alt="Google" />
          <span>{loading ? 'Signing In...' : 'Sign In with Google'}</span>
        </div>
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
