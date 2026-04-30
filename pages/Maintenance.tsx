import React from 'react';
import { Construction, Clock, Mail, Phone, Globe } from 'lucide-react';
import './Maintenance.css';

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-overlay"></div>
      
      <div 
        className="maintenance-content"
      >
        <div className="logo-section">
          <img 
            src="/img/logo.png" 
            alt="lasakedu Logo" 
            className="maintenance-logo"
          />
          <h1 className="company-name">LASAK EDU</h1>
        </div>

        <div className="main-message">
          <div
            className="icon-wrapper"
          >
            <Construction size={64} className="maintenance-icon" />
          </div>
          <h2 className="title">Under Service</h2>
          <p className="subtitle">
            We're currently making some exciting changes to improve your experience. 
            We'll be back online very soon!
          </p>
        </div>

        <div className="countdown-section">
          <div className="status-badge">
            <Clock size={16} />
            <span>Coming Soon</span>
          </div>
        </div>

        <div className="contact-info">
          <p className="contact-title">Get in touch</p>
          <div className="contact-grid">
            <a href="mailto:info@lasakedu.com" className="contact-item">
              <Mail size={18} />
              <span>info@lasakedu.com</span>
            </a>
            <a href="tel:+917418732525" className="contact-item">
              <Phone size={18} />
              <span>+91 74187 32525</span>
            </a>
            <a href="https://lasakedu.com" className="contact-item">
              <Globe size={18} />
              <span>lasakedu.com</span>
            </a>
          </div>
        </div>

        <footer className="maintenance-footer">
          <p>&copy; {new Date().getFullYear()} LASAK EDU. All rights reserved.</p>
        </footer>
      </div>

      {/* Animated Background Shapes */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
    </div>
  );
};

export default Maintenance;
