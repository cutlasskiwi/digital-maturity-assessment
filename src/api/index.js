// src/api/index.js

// Base URL for API endpoints (change to your actual API URL in production)
const BASE_URL = 'https://api.example.com/assessment';

/**
 * Save assessment data to the server
 * @param {Object} assessmentData - Complete assessment data
 * @returns {Promise} - Promise containing the save response
 */
export const saveAssessment = async (assessmentData) => {
  try {
    const response = await fetch(`${BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessmentData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving assessment:', error);
    // For demo purposes, simulate a successful save when API is not available
    return { success: true, message: 'Assessment data saved (simulated)' };
  }
};

/**
 * Load assessment data from the server
 * @param {string} assessmentId - ID of the assessment to load
 * @returns {Promise} - Promise containing the assessment data
 */
export const loadAssessment = async (assessmentId) => {
  try {
    const response = await fetch(`${BASE_URL}/load/${assessmentId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading assessment:', error);
    // Return null when API is not available
    return null;
  }
};

/**
 * Get industry benchmark data
 * @param {string} industry - Industry category 
 * @returns {Promise} - Promise containing the benchmark data
 */
export const getIndustryBenchmarks = async (industry) => {
  try {
    const response = await fetch(`${BASE_URL}/benchmarks/${industry}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    // Return mock data when API is not available
    return {
      organization: 3.2,
      workforce: 2.8,
      operations: 3.5,
      factory: 3.1,
      'supply-chain': 2.9
    };
  }
};

/**
 * Get recommendations based on assessment results
 * @param {Object} results - Assessment results object
 * @returns {Promise} - Promise containing the recommendations
 */
export const getRecommendations = async (results) => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Return mock data when API is not available
    return {
      organization: "Focus on developing a comprehensive digital strategy with clear objectives and KPIs.",
      workforce: "Invest in training programs to enhance digital skills across the organization.",
      operations: "Implement real-time monitoring systems to improve operational visibility.",
      factory: "Integrate existing systems and establish data collection standards.",
      'supply-chain': "Develop end-to-end tracking capabilities and improve forecasting models."
    };
  }
};

/**
 * Export assessment results as PDF (placeholder)
 * @param {Object} results - Assessment results object
 * @returns {Promise} - Promise containing the PDF URL or blob
 */
export const exportResultsAsPDF = async (results) => {
  try {
    const response = await fetch(`${BASE_URL}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting results:', error);
    // For demo purposes, alert that export would be available in production
    alert('PDF export functionality would be available in production environment');
    return null;
  }
};