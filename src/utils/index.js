/**
 * Formats a score (1-5) into a maturity level text
 * @param {number} score - Score between 1-5
 * @returns {string} - Maturity level text
 */
export const getMaturityLevelText = (score) => {
    if (score <= 1.5) return 'Basic';
    if (score <= 2.5) return 'Developing';
    if (score <= 3.5) return 'Intermediate';
    if (score <= 4.5) return 'Advanced';
    return 'Optimized';
  };
  
  /**
   * Calculates the gap between current and desired states
   * @param {number} current - Current state score
   * @param {number} desired - Desired state score
   * @returns {number} - Gap value
   */
  export const calculateGap = (current, desired) => {
    return Math.max(0, desired - current);
  };
  
  /**
   * Calculates the gap priority level
   * @param {number} gap - Gap value
   * @returns {string} - Priority level (High, Medium, Low)
   */
  export const getGapPriorityLevel = (gap) => {
    if (gap >= 3) return 'High';
    if (gap >= 2) return 'Medium';
    return 'Low';
  };
  
  /**
   * Generates a unique ID for the assessment
   * @returns {string} - Unique ID
   */
  export const generateAssessmentId = () => {
    return `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  /**
   * Formats a date object to a readable string
   * @param {Date} date - Date object
   * @returns {string} - Formatted date string
   */
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Export data to CSV format
   * @param {Object} data - Assessment results data
   * @param {string} filename - Output filename
   */
  export const exportToCSV = (data, filename = 'assessment-results') => {
    // CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Area,Current State,Desired State,Gap,Gap Priority\n";
    
    // Add data rows
    data.forEach(item => {
      const gap = calculateGap(item.currentScore, item.desiredScore);
      const priority = getGapPriorityLevel(gap);
      csvContent += `${item.title},${item.currentScore},${item.desiredScore},${gap},${priority}\n`;
    });
    
    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  /**
   * Convert assessment data to PDF format
   * Note: This is a placeholder - actual PDF generation would require a library
   * @param {Object} data - Assessment data
   * @param {string} filename - Output filename
   */
  export const exportToPDF = (data, filename = 'assessment-results') => {
    // This would use a PDF generation library like jsPDF
    console.log('PDF export functionality would be implemented here');
    console.log('Data to export:', data);
    
    // For now, we'll just alert the user
    alert('PDF export functionality will be implemented when connected to the backend');
  };
  
  /**
   * Sort array of assessment results by gap size (descending)
   * @param {Array} results - Assessment results
   * @returns {Array} - Sorted results
   */
  export const sortByGapSize = (results) => {
    return [...results].sort((a, b) => {
      const gapA = calculateGap(a.currentScore, a.desiredScore);
      const gapB = calculateGap(b.currentScore, b.desiredScore);
      return gapB - gapA;
    });
  };
  
  /**
   * Calculate overall maturity score across all areas
   * @param {Array} results - Assessment results
   * @param {string} stateType - 'current' or 'desired'
   * @returns {number} - Average score
   */
  export const calculateOverallScore = (results, stateType = 'current') => {
    if (!results || results.length === 0) return 0;
    
    const scoreProperty = stateType === 'current' ? 'currentScore' : 'desiredScore';
    const sum = results.reduce((total, item) => total + item[scoreProperty], 0);
    return Math.round((sum / results.length) * 10) / 10;
  };