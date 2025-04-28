// src/components/layout/Layout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// Import the logo directly
import tetraPakLogo from '/tetra-pak-logo.svg';

const Layout = ({ children, sidebarTitle }) => {
  return (
    <div className="flex min-h-screen">
      {/* Blue sidebar */}
      <div className="w-24 bg-[#023F88] text-white flex flex-col">
        {/* Logo container with Link to landing page */}
        <Link to="/" className="flex justify-center items-center hover:opacity-80 transition-opacity">
          <img 
            src={tetraPakLogo} 
            alt="Tetra Pak Logo"
            className="h-16 w-16 my-4" 
          />
        </Link>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="transform -rotate-90 whitespace-nowrap text-xl font-semibold tracking-wider origin-center">
            {sidebarTitle}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-[#B9E5FB] overflow-auto">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  sidebarTitle: PropTypes.string.isRequired
};

export default Layout;