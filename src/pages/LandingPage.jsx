// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
// Import assets directly
import tetraPakLogo from '/tetra-pak-logo.svg';
import saveIcon from '/icons/save.png';
import arrowRightIcon from '/icons/arrow-right.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { resetAssessment } = useAssessment();
  const [hasSavedData, setHasSavedData] = useState(false);
  
  // Check for saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('tetra_pak_assessment_data');
    setHasSavedData(savedData !== null);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tetra-blue-900 text-white p-8">
      <div className="mb-8">
        <img 
          src={tetraPakLogo} 
          alt="Tetra Pak Logo"
          className="h-32 w-32"
        />
      </div>
      
      <h1 className="text-5xl font-bold mb-6 text-center">
        Automation and digital<br/>maturity benchmarking
      </h1>
      
      <p className="text-xl mb-12 text-center max-w-2xl">
        Gain insights into your organization's current state and identify strategic
        opportunities for growth in automation and digital capabilities
      </p>
      
      <div className="flex space-x-16">
        {hasSavedData && (
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/results')}>
            <img 
              src={saveIcon} 
              alt="Load Data"
              className="h-12 w-12 mb-3 hover:opacity-80 transition-opacity" 
            />
            <span className="text-white font-bold">Load data</span>
          </div>
        )}
        
        <div 
          className="flex flex-col items-center cursor-pointer" 
          onClick={() => {
            resetAssessment();
            navigate('/getting-started');
          }}
        >
          <img 
            src={arrowRightIcon} 
            alt="Continue"
            className="h-12 w-12 mb-3 hover:opacity-80 transition-opacity" 
          />
          <span className="text-white font-bold">Continue</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;