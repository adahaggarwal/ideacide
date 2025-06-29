import React from 'react';
import './Footer.css';
import logo from '../../assets/images/final logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <img 
                src={logo} 
                alt="IdeaCide Logo" 
                className="footer-logo-image"
                />
              </div>
              <span className="footer-logo-text">IdeaCide</span>
            </div>
            <p className="footer-description">
              Learn from failure stories and build smarter solutions for the future.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-list">
                <li><a href="#stories" className="footer-link">Stories</a></li>
                <li><a href="#sandbox" className="footer-link">Sandbox</a></li>
                <li><a href="#failometer" className="footer-link">Failometer</a></li>
                <li><a href="#analytics" className="footer-link">Analytics</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-list">
                <li><a href="#about" className="footer-link">About</a></li>
                <li><a href="#careers" className="footer-link">Careers</a></li>
                <li><a href="#blog" className="footer-link">Blog</a></li>
                <li><a href="#press" className="footer-link">Press</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-list">
                <li><a href="#documentation" className="footer-link">Documentation</a></li>
                <li><a href="#help" className="footer-link">Help Center</a></li>
                <li><a href="#contact" className="footer-link">Contact</a></li>
                <li><a href="#community" className="footer-link">Community</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-list">
                <li><a href="#privacy" className="footer-link">Privacy</a></li>
                <li><a href="#terms" className="footer-link">Terms</a></li>
                <li><a href="#security" className="footer-link">Security</a></li>
                <li><a href="#cookies" className="footer-link">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 IdeaCide. All rights reserved.</p>
          </div>
          <div className="footer-badges">
            <span className="footer-badge">Built with 💡</span>
            <span className="footer-badge">Powered by Failure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
