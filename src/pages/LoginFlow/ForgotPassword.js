import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/final logo.svg';
import './index.css';

const ForgotPassword = () => {
  return (
    <div className="container">
      <div className="form-box signin-box">
        <div className="logo-app">
          <img src={logo} alt="Logo" className="logo" />
          <span className="app-name">IDEACIDE</span>
        </div>
        <h2 style={{ color: '#a167ff' }}>Forgot Password</h2>
        <form>
          <input type="email" placeholder="Email Address" required />
          <button type="submit" className="signin-btn" style={{ fontWeight: 700 }}>VERIFY</button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <Link to="/signin" className="signin-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', background: '#181028', color: '#a167ff', fontWeight: 600, border: '1px solid #a167ff', padding: '12px 0', borderRadius: '8px', width: '100%' }}>
            Go back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 