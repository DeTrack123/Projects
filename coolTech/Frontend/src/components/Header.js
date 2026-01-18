import React from 'react';
import './Header.css';

const Header = ({ title, showLogo = true, position = 'default' }) => {
  return (
    <div className={`app-header ${position === 'top-left' ? 'header-top-left' : ''}`}>
      {showLogo && (
        <div className="header-logo">
          <img 
            src="/CoolTech_logo.jpeg" 
            alt="Cool Tech Logo" 
            className="logo-image"
          />
        </div>
      )}
      {title && <h1 className="header-title">{title}</h1>}
    </div>
  );
};

export default Header;
