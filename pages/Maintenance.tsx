import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Clock, Mail, Phone, Globe } from 'lucide-react';
import './Maintenance.css';

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-overlay"></div>
      
      <motion.div 
        className="maintenance-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo-section">
          <motion.img 
            src="/img/logo.png" 
            alt="lasakedu Logo" 
            className="maintenance-logo"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <h1 className="company-name">LASAK EDU</h1>
        </div>

        <div className="main-message">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="icon-wrapper"
          >
            <Construction size={64} className="maintenance-icon" />
          </motion.div>
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
      </motion.div>

      {/* Animated Background Shapes */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
    </div>
  );
};

export default Maintenance;
