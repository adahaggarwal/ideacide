import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword, getFirebaseErrorMessage } from '../../services/auth';
import logo from '../../assets/images/final logo.svg';
import './index.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(getFirebaseErrorMessage(error));
    } finally {
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
        <h2 style={{ color: '#a167ff' }}>Forgot Password</h2>
        
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
        
        {success && (
          <div style={{ 
            color: '#4caf50', 
            backgroundColor: '#e8f5e8', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {success}
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
          <button 
            type="submit" 
            className="signin-btn" 
            style={{ 
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'SENDING...' : 'VERIFY'}
          </button>
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
