import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/final logo.svg';
import googleLogo from '../../assets/images/google_symbol.svg';
import './index.css';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="form-box signin-box">
        <div className="logo-app">
          <img src={logo} alt="Logo" className="logo" />
          <span className="app-name">IDEACIDE</span>
        </div>
        <h2 style={{ color: '#a167ff' }}>Sign In</h2>
        <form>
          <input type="email" placeholder="Email Address" required />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
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
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
        <p className="or">Or</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
          <div className="google-signin" style={{ minWidth: '180px', justifyContent: 'center' }}>
            <img src={googleLogo} alt="Google" />
            <span>Sign In with Google</span>
          </div>
        </div>
        <p className="signin-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
