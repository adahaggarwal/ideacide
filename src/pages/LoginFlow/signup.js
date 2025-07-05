import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/final logo.svg';
import googleLogo from '../../assets/images/google_symbol.svg';
import './index.css';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  return (
    <div className="container">
      <div className="form-box signup-box">
        <div className="logo-app">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h2>Sign Up</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
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
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
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
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="or">Or</p>
        <div className="google-signin">
          <img src={googleLogo} alt="Google" />
          <span>Sign In with Google</span>
        </div>
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
