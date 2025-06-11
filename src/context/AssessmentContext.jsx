// src/context/AssessmentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Generate UUIDv7 for assessment storage
 * UUIDv7 includes timestamp for better sorting
 */
const generateUUIDv7 = () => {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  
  const hex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  const timestampHex = timestamp.toString(16).padStart(12, '0');
  
  return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-7${hex.slice(0, 3)}-${hex.slice(3, 7)}-${hex.slice(7, 19)}`;
};

// Create context
const AssessmentContext = createContext(null);

// Areas available for assessment
const availableAreas = [
  { 
    id: 'organization', 
    name: 'Smart organisation', 
    description: 'Company readiness for the digital transformation',
    icon: 'organization',
    questions: [
      { id: 'processes', name: 'Level 1 - Processes, standards and tools', maxLevel: 5 },
      { id: 'capabilities', name: 'Level 2 - Capabilities assessment and training program', maxLevel: 5 },
      { id: 'continuous', name: 'Level 3 - Continuous improvement/World Class Manufacturing program', maxLevel: 5 },
      { id: 'digital', name: 'Level 4 - Digital strategy', maxLevel: 5 },
      { id: 'communication', name: 'Level 5 - Communication, implementation & governance strategy', maxLevel: 5 }
    ]
  },
  { 
    id: 'workforce', 
    name: 'Smart workforce', 
    description: 'High adoption of digital tools and best practices to enhance workforce efficiency',
    icon: 'workforce',
    questions: [
      { id: 'interface', name: 'Level 1 - Human to Machine interface to operate equipment', maxLevel: 5 },
      { id: 'learning', name: 'Level 2 - Anytime learning & access to best practices', maxLevel: 5 },
      { id: 'communication', name: 'Level 3 - Communication & collaboration', maxLevel: 5 },
      { id: 'guidance', name: 'Level 4 - Operator guidance - digital SOPs', maxLevel: 5 },
      { id: 'lean', name: 'Level 5 - Digital lean - learn best practices', maxLevel: 5 }
    ]
  },
  { 
    id: 'operations', 
    name: 'Smart operations', 
    description: 'Technology-enabled continuous improvement in areas like production, maintenance, quality and sustainability',
    icon: 'operations',
    questions: [
      { id: 'quality', name: 'Level 1 - Quality control', maxLevel: 5 },
      { id: 'production', name: 'Level 2 - Production management & operations reporting', maxLevel: 5 },
      { id: 'maintenance', name: 'Level 3 - Maintenance management', maxLevel: 5 },
      { id: 'traceability', name: 'Level 4 - Traceability management', maxLevel: 5 },
      { id: 'sustainability', name: 'Level 5 - Sustainability management', maxLevel: 5 }
    ]
  },
  { 
    id: 'factory', 
    name: 'Smart factory', 
    description: 'Factory\'s level of automation, integration and usage of data',
    icon: 'factory',
    questions: [
      { id: 'practices', name: 'Level 1 - Best Practices/Obsolescence', maxLevel: 5 },
      { id: 'data', name: 'Level 2 - Data collection: connected equipment & plant', maxLevel: 5 },
      { id: 'ot', name: 'Level 3 - OT (MES/MOM)', maxLevel: 5 },
      { id: 'integration', name: 'Level 4 - Integration, connectivity, cybersecurity', maxLevel: 5 },
      { id: 'analytics', name: 'Level 5 - Analytics and big data', maxLevel: 5 }
    ]
  },
  { 
    id: 'supply-chain', 
    name: 'Smart supply chain', 
    description: 'Ensure product transparency, manage distribution and claims, engage with consumers and gain insights',
    icon: 'supply-chain',
    questions: [
      { id: 'transparency', name: 'Level 1 - Plant product transparency', maxLevel: 5 },
      { id: 'claims', name: 'Level 2 - Claims management', maxLevel: 5 },
      { id: 'distribution', name: 'Level 3 - Distribution management', maxLevel: 5 },
      { id: 'engagement', name: 'Level 4 - Digital consumer engagement', maxLevel: 5 },
      { id: 'insights', name: 'Level 5 - Consumer insight and analytics', maxLevel: 5 }
    ]
  }
];

// Storage key
const STORAGE_KEY = 'tetra_pak_assessment_data';

// Provider component
export const AssessmentProvider = ({ children }) => {
  // Initialize state - FIXED: Added separate factoryLocation and assessmentLocation
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    factoryLocation: '',  // Factory location (city/country)
    assessmentLocation: 'Lund Automation Room',  // Assessment/meeting location
    productionLines: '',
    productionVolume: '',
    productTypes: []
  });
  
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [responses, setResponses] = useState({});
  
  // Add state for sidebar title
  const [sidebarTitle, setSidebarTitle] = useState('Maturity benchmark tool');
  
  // Load data from local storage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
        if (parsed.selectedAreas) setSelectedAreas(parsed.selectedAreas);
        if (parsed.responses) setResponses(parsed.responses);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        companyInfo,
        selectedAreas,
        responses
      }));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  }, [companyInfo, selectedAreas, responses]);
  
  // Update company information
  const updateCompanyInfo = (info) => {
    setCompanyInfo(info);
  };
  
  // Toggle area selection
  const toggleAreaSelection = (areaId) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaId)) {
        return prev.filter(id => id !== areaId);
      } else {
        // When an area is selected, update sidebar title
        setSidebarTitle('Maturity benchmark inputs');
        return [...prev, areaId];
      }
    });
  };
  
  // Reset sidebar title for area selection page
  const resetSidebarTitleForAreaSelection = () => {
    setSidebarTitle('Maturity benchmark areas');
  };
  
  // Update response for a specific question
  const updateResponse = (areaId, questionId, current, desired) => {
    setResponses(prev => ({
      ...prev,
      [areaId]: {
        ...prev[areaId],
        [questionId]: { current, desired }
      }
    }));
  };
  
  // Calculate results for visualization
  const calculateResults = () => {
    const results = {};
    
    selectedAreas.forEach(areaId => {
      const area = availableAreas.find(a => a.id === areaId);
      if (!area) return;
      
      let totalCurrent = 0;
      let totalDesired = 0;
      let questionCount = 0;
      
      area.questions.forEach(question => {
        const response = responses[areaId]?.[question.id];
        if (response) {
          totalCurrent += response.current;
          totalDesired += response.desired;
          questionCount++;
        }
      });
      
      // Calculate average if there are responses
      if (questionCount > 0) {
        results[areaId] = {
          current: parseFloat((totalCurrent / questionCount).toFixed(1)),
          desired: parseFloat((totalDesired / questionCount).toFixed(1))
        };
      }
    });
    
    return results;
  };
  
  // Check if all areas are completed
  const areAllAreasCompleted = () => {
    return selectedAreas.every(areaId => {
      const area = availableAreas.find(a => a.id === areaId);
      return area?.questions.every(question => 
        responses[areaId]?.[question.id]?.current !== undefined &&
        responses[areaId]?.[question.id]?.desired !== undefined
      );
    });
  };
  
  // Get the next area based on current area
  const getNextArea = (currentAreaId) => {
    const currentIndex = selectedAreas.indexOf(currentAreaId);
    if (currentIndex < selectedAreas.length - 1) {
      return selectedAreas[currentIndex + 1];
    }
    return null;
  };
  
// Save completed assessment with UUID
const saveCompletedAssessment = () => {
  try {
    // Only save if there's actual assessment data
    if (selectedAreas.length === 0 && Object.keys(responses).length === 0) {
      return null;
    }

    // Get current assessment data
    const currentData = {
      companyInfo,
      selectedAreas,
      responses,
      completedAt: new Date().toISOString(),
    };
    
    // Generate UUID key with prefix
    const uuid = generateUUIDv7();
    const storageKey = `/automation-assessment/${uuid}`;
    
    // Save completed assessment with UUID key
    localStorage.setItem(storageKey, JSON.stringify(currentData));
    
    console.log(`Assessment saved with ID: ${uuid}`);
    return uuid;
  } catch (error) {
    console.error('Error saving completed assessment:', error);
    return null;
  }
};

// Updated reset function
const resetAssessment = (saveCompleted = false) => {
  // If requested, save the current assessment before resetting
  if (saveCompleted) {
    saveCompletedAssessment();
  }
  
  // Reset to initial state
  setCompanyInfo({
    name: '',
    factoryLocation: '',
    assessmentLocation: 'Lund Automation Room',
    productionLines: '',
    productionVolume: '',
    productTypes: []
  });
  setSelectedAreas([]);
  setResponses({});
  
  // Clear the current working storage
  localStorage.removeItem(STORAGE_KEY);
};
  
  // Context value
const contextValue = {
  availableAreas,
  companyInfo,
  updateCompanyInfo,
  selectedAreas,
  toggleAreaSelection,
  responses,
  updateResponse,
  calculateResults,
  getNextArea,
  areAllAreasCompleted,
  resetAssessment,
  saveCompletedAssessment,
  sidebarTitle,
  setSidebarTitle,
  resetSidebarTitleForAreaSelection
};
  
  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
};

// Custom hook for easy access to context
export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export default AssessmentContext;