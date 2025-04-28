// src/pages/AssessmentPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

// Since we're using icons dynamically based on area.icon, we'll handle that differently
// We'll create a helper function to get the proper icon

const AssessmentPage = () => {
  const { area } = useParams();
  const navigate = useNavigate();
  const { 
    availableAreas, 
    selectedAreas, 
    responses, 
    updateResponse,
    setSidebarTitle
  } = useAssessment();
  
  // Set sidebar title when component mounts
  useEffect(() => {
    setSidebarTitle('Maturity benchmark inputs');
  }, [setSidebarTitle]);
  
  // Get the current area details
  const currentArea = availableAreas.find(a => a.id === area);
  
  // Check if this area was selected by the user
  useEffect(() => {
    if (!currentArea || !selectedAreas.includes(area)) {
      navigate('/select-areas');
    }
  }, [area, currentArea, selectedAreas, navigate]);
  
  if (!currentArea) {
    return <div className="p-8">Loading...</div>;
  }
  
  // Handle rating change for current state
  const handleCurrentStateChange = (questionId, value) => {
    const desired = responses[area]?.[questionId]?.desired || 0;
    updateResponse(area, questionId, value, desired);
  };
  
  // Handle rating change for desired state
  const handleDesiredStateChange = (questionId, value) => {
    const current = responses[area]?.[questionId]?.current || 0;
    updateResponse(area, questionId, current, value);
  };
  
  // Get the rating for a specific question and state (current/desired)
  const getRating = (questionId, stateType) => {
    return responses[area]?.[questionId]?.[stateType] || 0;
  };
  
  // Generate radio buttons for rating
  const renderRatingOptions = (questionId, questionMaxLevel, stateType) => {
    const maxLevel = questionMaxLevel || 5;
    const currentRating = getRating(questionId, stateType);
    const handleChange = stateType === 'current' 
      ? handleCurrentStateChange 
      : handleDesiredStateChange;
    
    return (
      <div className="flex space-x-1">
        {[...Array(maxLevel)].map((_, index) => {
          const value = index + 1;
          const isSelected = currentRating === value;
          
          return (
            <button
              key={`${questionId}-${stateType}-${value}`}
              type="button"
              className={`w-6 h-6 rounded mr-1 ${
                isSelected 
                  ? stateType === 'current'
                    ? 'bg-tetra-blue-900' 
                    : 'bg-tetra-orange-500'
                  : 'bg-gray-300'
              }`}
              onClick={() => handleChange(questionId, value)}
              aria-label={`Rate ${value}`}
            ></button>
          );
        })}
      </div>
    );
  };
  
  // Check if all questions have been answered
  const isAreaComplete = () => {
    return currentArea.questions.every(question => 
      getRating(question.id, 'current') > 0 && 
      getRating(question.id, 'desired') > 0
    );
  };
  
  // Navigate to the previous area or select areas page
  const handleGoBack = () => {
    const currentIndex = selectedAreas.indexOf(area);
    if (currentIndex > 0) {
      navigate(`/assessment/${selectedAreas[currentIndex - 1]}`);
    } else {
      navigate('/select-areas');
    }
  };
  
  // Go to next area
  const handleGoNext = () => {
    const currentIndex = selectedAreas.indexOf(area);
    if (currentIndex < selectedAreas.length - 1) {
      navigate(`/assessment/${selectedAreas[currentIndex + 1]}`);
    } else {
      navigate('/results');
    }
  };
  
  // Note: For the dynamic SVG icons, we're keeping them inline since they're using SVG markup directly
  // If these were image files, we'd import them at the top
  
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-tetra-blue-900 mb-8">
        Your readiness assessment
      </h1>
      
      {/* Area selector tabs */}
      <div className="flex mb-8 overflow-x-auto pb-2">
        {selectedAreas.map(areaId => {
          const areaData = availableAreas.find(a => a.id === areaId);
          const isActive = areaId === area;
          
          return (
            <button
              key={areaId}
              className={`flex items-center px-4 py-2 rounded-t-lg mr-2 ${
                isActive 
                  ? 'bg-tetra-blue-900 text-white' 
                  : 'bg-gray-200 text-tetra-blue-900'
              }`}
              onClick={() => navigate(`/assessment/${areaId}`)}
            >
              {/* For SVG icons, we're keeping them inline for now */}
              {/* If these were image files, we'd use imported variables */}
              <span>{areaData.name}</span>
            </button>
          );
        })}
      </div>
      
      {/* Questions table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200 bg-gray-50 text-tetra-blue-900 font-semibold">
          <div className="p-4">Assessment criteria</div>
          <div className="p-4 text-center">Your current state</div>
          <div className="p-4 text-center">Your desired state</div>
        </div>
        
        {currentArea.questions.map(question => (
          <div 
            key={question.id}
            className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-200 last:border-b-0"
          >
            <div className="p-4 text-tetra-blue-900">{question.name}</div>
            <div className="p-4 flex justify-center items-center">
              {renderRatingOptions(question.id, question.maxLevel, 'current')}
            </div>
            <div className="p-4 flex justify-center items-center">
              {renderRatingOptions(question.id, question.maxLevel, 'desired')}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleGoBack}
          className="bg-tetra-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={handleGoNext}
          disabled={!isAreaComplete()}
          className={`rounded-full w-16 h-16 flex items-center justify-center ${
            isAreaComplete() 
              ? 'bg-tetra-blue-900 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AssessmentPage;