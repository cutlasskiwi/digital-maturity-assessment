import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

const SelectAreasPage = () => {
  const navigate = useNavigate();
  const { 
    availableAreas, 
    selectedAreas, 
    toggleAreaSelection,
    responses,
    updateResponse
  } = useAssessment();
  
  // Track which area is currently selected for assessment
  const [activeAreaId, setActiveAreaId] = useState(selectedAreas.length > 0 ? selectedAreas[0] : null);
  
  // Track the selected levels (radio button selections) for current and desired states
  const [selectedCurrentLevel, setSelectedCurrentLevel] = useState(0);
  const [selectedDesiredLevel, setSelectedDesiredLevel] = useState(0);
  
  // Update selected levels when responses change or area changes
  useEffect(() => {
    if (activeAreaId) {
      // Find the first question with a response to determine selected levels
      const area = getAreaById(activeAreaId);
      if (area && area.questions.length > 0) {
        const firstQuestionId = area.questions[0].id;
        const response = responses[activeAreaId]?.[firstQuestionId];
        
        if (response) {
          setSelectedCurrentLevel(response.current || 0);
          setSelectedDesiredLevel(response.desired || 0);
        } else {
          // Reset selections if no response exists
          setSelectedCurrentLevel(0);
          setSelectedDesiredLevel(0);
        }
      }
    }
  }, [activeAreaId, responses]);
  
  // Handle selecting an area to view/edit its assessment options
  const handleSelectArea = (areaId) => {
    // If not already selected, select it
    if (!selectedAreas.includes(areaId)) {
      toggleAreaSelection(areaId);
    }
    // Set it as the active area
    setActiveAreaId(areaId);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (selectedAreas.length > 0) {
      navigate('/results');
    }
  };
  
  // Handle go back button click
  const handleGoBack = () => {
    navigate('/getting-started');
  };
  
  // Helper to get the area object by ID
  const getAreaById = (areaId) => {
    return availableAreas.find(area => area.id === areaId);
  };
  
  // Handle selection of current state level (radio button selection)
  const handleCurrentLevelChange = (level) => {
    if (!activeAreaId) return;
    
    // Update state
    setSelectedCurrentLevel(level);
    
    // Get the area's questions
    const area = getAreaById(activeAreaId);
    if (!area) return;
    
    // For each question in the area, set the same current level
    area.questions.forEach(question => {
      const questionId = question.id;
      const desiredValue = responses[activeAreaId]?.[questionId]?.desired || 0;
      
      updateResponse(activeAreaId, questionId, level, desiredValue);
    });
  };
  
  // Handle selection of desired state level (radio button selection)
  const handleDesiredLevelChange = (level) => {
    if (!activeAreaId) return;
    
    // Update state
    setSelectedDesiredLevel(level);
    
    // Get the area's questions
    const area = getAreaById(activeAreaId);
    if (!area) return;
    
    // For each question in the area, set the same desired level
    area.questions.forEach(question => {
      const questionId = question.id;
      const currentValue = responses[activeAreaId]?.[questionId]?.current || 0;
      
      updateResponse(activeAreaId, questionId, currentValue, level);
    });
  };
  
  // Map context icon names to actual file names
  const iconMappings = {
    'organization': 'smart-organisation',
    'workforce': 'smart-workforce',
    'operations': 'smart-operations',
    'factory': 'smart-factory',
    'supply-chain': 'smart-supply-chain'
  };
  
  // Function to get proper icon path
  const getIconPath = (area, isActive) => {
    // Get the correct filename from mappings
    const iconName = iconMappings[area.icon] || area.icon;
    
    // Icons are in /public/icons folder
    if (isActive) {
      return `/icons/b-${iconName}.png`;
    }
    return `/icons/${iconName}.png`;
  };
  
  // Get assessment criteria for the active area
  const getAssessmentCriteria = (areaId) => {
    const area = getAreaById(areaId);
    if (!area) return [];
    
    return area.questions;
  };
  
  return (
    <div className="bg-[#B9E5FB] min-h-screen">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-[#023F88] mb-12">
          Select the areas you want to assess
        </h1>
        
        {/* Areas selection */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {availableAreas.map(area => {
            const isSelected = selectedAreas.includes(area.id);
            const isActive = activeAreaId === area.id;
            
            return (
              <div key={area.id} className="flex flex-col items-center">
                <div className="h-24 flex items-center justify-center mb-4">
                  <img 
                    src={getIconPath(area, isActive)}
                    alt={area.name}
                    className="h-16 w-16"
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      e.target.style.display = 'none';
                      const parent = e.target.parentNode;
                      if (parent) {
                        const textNode = document.createElement('div');
                        textNode.textContent = area.name;
                        textNode.className = 'text-[#023F88] font-medium';
                        parent.appendChild(textNode);
                      }
                    }}
                  />
                </div>
                
                <button
                  className={`px-4 py-2 rounded-md text-center transition-colors mb-2 w-full ${
                    isActive 
                      ? 'bg-[#023F88] text-white' 
                      : 'bg-white text-[#023F88] hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectArea(area.id)}
                >
                  {area.name}
                </button>
                
                <p className="text-sm text-[#023F88] text-center px-2">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Assessment content for selected area */}
        {activeAreaId && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-xl font-bold text-[#023F88] mb-6">
              Your readiness assessment
            </h2>
            
            {/* Show active area */}
            <div className="mb-6">
              <div className="inline-flex items-center bg-[#023F88] text-white px-4 py-2 rounded-md">
                <img 
                  src={getIconPath(getAreaById(activeAreaId), true)}
                  alt={getAreaById(activeAreaId).name}
                  className="h-6 w-6 mr-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>{getAreaById(activeAreaId).name}</span>
              </div>
            </div>
            
            {/* Assessment table */}
            <div className="w-full mb-8">
              <div className="flex border-b border-gray-200 py-3">
                <div className="w-1/3 font-semibold text-[#023F88]">Assessment criteria</div>
                <div className="w-1/3 font-semibold text-[#023F88] text-center">Your current state</div>
                <div className="w-1/3 font-semibold text-[#023F88] text-center">Your desired state</div>
              </div>
              
              {getAssessmentCriteria(activeAreaId).map((criterion, index) => {
                // Get the level for this criterion (1-based index)
                const levelValue = index + 1;
                
                return (
                  <div key={criterion.id} className="flex border-b border-gray-200 py-4">
                    <div className="w-1/3 text-[#023F88]">{criterion.name}</div>
                    
                    {/* Current state section */}
                    <div className="w-1/3 flex justify-center items-center space-x-2">
                      {/* Radio button for this level */}
                      <div className="mr-2">
                        <div 
                          className={`w-6 h-6 rounded-full border-2 border-[#023F88] flex items-center justify-center cursor-pointer ${
                            selectedCurrentLevel === levelValue ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleCurrentLevelChange(levelValue)}
                        >
                          {selectedCurrentLevel === levelValue && (
                            <div className="w-3 h-3 rounded-full bg-[#023F88]"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Fixed boxes showing level (1-5 boxes filled based on level) */}
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(boxIndex => (
                          <div 
                            key={`current-box-${criterion.id}-${boxIndex}`}
                            className={`w-6 h-6 rounded-sm ${
                              boxIndex <= levelValue ? 'bg-[#023F88]' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Desired state section */}
                    <div className="w-1/3 flex justify-center items-center space-x-2">
                      {/* Radio button for this level */}
                      <div className="mr-2">
                        <div 
                          className={`w-6 h-6 rounded-full border-2 border-[#023F88] flex items-center justify-center cursor-pointer ${
                            selectedDesiredLevel === levelValue ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleDesiredLevelChange(levelValue)}
                        >
                          {selectedDesiredLevel === levelValue && (
                            <div className="w-3 h-3 rounded-full bg-[#023F88]"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Fixed boxes showing level (1-5 boxes filled based on level) */}
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(boxIndex => (
                          <div 
                            key={`desired-box-${criterion.id}-${boxIndex}`}
                            className={`w-6 h-6 rounded-sm ${
                              boxIndex <= levelValue ? 'bg-[#F58220]' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-center gap-16">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleGoBack}>
            <div className="w-16 h-16 rounded-full bg-[#023F88] flex items-center justify-center mb-3 hover:bg-[#022a5c] transition-colors">
              <img 
                src="/icons/arrow-left.png" 
                alt="Go back"
                className="h-8 w-8" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>';
                }}
              />
            </div>
            <span className="text-[#023F88] font-bold">Go back</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer" onClick={handleContinue}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
              selectedAreas.length > 0 
                ? 'bg-[#023F88] hover:bg-[#022a5c] cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}>
              <img 
                src="/icons/arrow-right.png" 
                alt="Continue"
                className="h-8 w-8" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>';
                }}
              />
            </div>
            <span className="text-[#023F88] font-bold">Continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAreasPage;