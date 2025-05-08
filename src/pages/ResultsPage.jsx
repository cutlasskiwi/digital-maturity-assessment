// src/pages/ResultsPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { useEffect, useRef } from 'react';

// Import static assets
import diagramBarsIcon from '/icons/diagram-bars-icon.png';
import arrowLeftIcon from '/icons/arrow-left.png';
import arrowRightIcon from '/icons/arrow-right.png';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { 
    availableAreas, 
    selectedAreas, 
    calculateResults 
  } = useAssessment();
  
  // Ref for the results container
  const resultsContainerRef = useRef(null);
  
  // Get the results data
  const results = calculateResults();
  
  // Filter only the selected areas
  const areasList = availableAreas.filter(area => selectedAreas.includes(area.id));
  
  // Define correct industry standard values for each area (from 1 to 5)
  const industryStandards = {
    'organization': 2,
    'workforce': 1,
    'operations': 3,
    'factory': 3,
    'supply-chain': 4
  };
  
  // Handle exit button
  const handleExit = () => {
    navigate('/');
  };
  
  // Handle go back button
  const handleGoBack = () => {
    navigate('/select-areas');
  };
  
  // Add SVG lines after component renders
  useEffect(() => {
    // Function to draw connecting lines between dots of the same type
    const drawConnectingLines = () => {
      if (!resultsContainerRef.current) return;
      
      // Remove any existing SVG lines
      const existingSvg = resultsContainerRef.current.querySelector('.connection-lines');
      if (existingSvg) {
        existingSvg.remove();
      }
      
      // Create a new SVG element for all the lines
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "connection-lines");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.zIndex = "5";
      svg.style.pointerEvents = "none"; // Make sure it doesn't interfere with clicks
      
      // Get all current and desired state dots
      const currentDots = resultsContainerRef.current.querySelectorAll('.current-dot');
      const desiredDots = resultsContainerRef.current.querySelectorAll('.desired-dot');
      
      // Function to draw a line between two dots
      const drawLineBetweenDots = (dot1, dot2, color) => {
        if (!dot1 || !dot2) return;
        
        const containerRect = resultsContainerRef.current.getBoundingClientRect();
        const dot1Rect = dot1.getBoundingClientRect();
        const dot2Rect = dot2.getBoundingClientRect();
        
        const x1 = dot1Rect.left + (dot1Rect.width / 2) - containerRect.left;
        const y1 = dot1Rect.top + (dot1Rect.height / 2) - containerRect.top;
        const x2 = dot2Rect.left + (dot2Rect.width / 2) - containerRect.left;
        const y2 = dot2Rect.top + (dot2Rect.height / 2) - containerRect.top;
        
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "4,4");
        
        svg.appendChild(line);
      };
      
      // Connect current state dots (blue)
      for (let i = 0; i < currentDots.length - 1; i++) {
        drawLineBetweenDots(currentDots[i], currentDots[i + 1], "#023F88");
      }
      
      // Connect desired state dots (orange)
      for (let i = 0; i < desiredDots.length - 1; i++) {
        drawLineBetweenDots(desiredDots[i], desiredDots[i + 1], "#F58220");
      }
      
      // Add SVG to the container
      resultsContainerRef.current.appendChild(svg);
    };
    
    // Draw the lines after a short delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      drawConnectingLines();
    }, 500);
    
    // Add window resize listener to redraw lines
    window.addEventListener('resize', drawConnectingLines);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', drawConnectingLines);
    };
  }, [areasList, results]);
  
  // Check if no areas are selected
  if (selectedAreas.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-[#023F88] mb-8">
          No areas selected
        </h1>
        <p className="mb-8">Please go back and select at least one area to assess.</p>
        <button
          onClick={() => navigate('/select-areas')}
          className="bg-[#023F88] text-white px-6 py-3 rounded-full"
        >
          Go to area selection
        </button>
      </div>
    );
  }
  
  // Map to store icons for each area
  const areaIcons = {
    'organization': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="white"/>
      </svg>
    ),
    'workforce': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="white"/>
      </svg>
    ),
    'operations': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 5H11L5.5 19H10L15.5 5ZM18 5L12.5 19H17L22.5 5H18Z" fill="white"/>
        <path d="M3 5L4 7H7L3 19L2 17H0L3 5Z" fill="white"/>
      </svg>
    ),
    'factory': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="white"/>
      </svg>
    ),
    'supply-chain': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.73 12.02L21.76 8L17.73 3.98L16.31 5.4L18.91 8L16.31 10.6L17.73 12.02ZM6.27 12.02L3.5 9.25L1 11.75V3H19V9.5H21V3C21 1.9 20.1 1 19 1H1C0.45 1 0 1.45 0 2V21C0 22.1 0.9 23 2 23H19C20.1 23 21 22.1 21 21V14.5H19V21H3V13L6.27 12.02Z" fill="white"/>
      </svg>
    )
  };

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <h1 className="text-4xl font-bold text-[#023F88] mb-8 text-center">
        Your results
      </h1>
      
      <div className="mb-12">
        <div ref={resultsContainerRef} className="relative">
          {/* Score header */}
          <div className="flex relative mb-4">
            <div className="w-56 font-semibold text-[#023F88] text-xl px-4 py-2">
              <span>Score</span>
            </div>
            <div className="flex-1">
              <div className="relative">
                {/* Score numbers positioned directly above grid lines */}
                {[1, 2, 3, 4, 5].map(score => (
                  <div 
                    key={score} 
                    className="absolute font-semibold text-[#023F88] text-xl py-2"
                    style={{
                      left: `${(score) * 20}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {score}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Vertical grid lines with fixed positions */}
          <div className="absolute z-[3] pointer-events-none" style={{
            top: "48px", /* Height of the score header */
            bottom: "0px",
            left: "224px", /* Width of left column + padding - adjusted value */
            right: "0px",
            height: `${areasList.length * 72}px`, /* Adjusted height to match increased row spacing */
          }}>
            {/* Create vertical grid lines at score positions */}
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <div 
                key={`gridline-${score}`} 
                className="absolute top-0 bottom-0 w-px bg-white" 
                style={{ 
                  left: `${(score - 1) * 20}%`,
                  height: "100%"
                }}
              ></div>
            ))}
          </div>
          
          {/* Maturity areas */}
          <div>
            {areasList.map((area, index) => {
              const areaResult = results[area.id] || { current: 0, desired: 0 };
              const industryStandard = industryStandards[area.id];
              
              // Calculate the width for the industry standard background
              // Width calculation fixed to align with grid lines
              const standardWidth = `${industryStandard * 20}%`;
              
              return (
                <div key={area.id} className="flex relative mb-6">
                  {/* Area name in left column with icon */}
                  <div className="w-56">
                    {/* Removed right padding to connect with industry standard box */}
                    <div className="bg-[#023F88] text-white py-1 px-4 h-12 rounded-l flex items-center">
                      {areaIcons[area.id] && (
                        <span className="mr-2">{areaIcons[area.id]}</span>
                      )}
                      <span className="text-lg whitespace-nowrap">{area.name}</span>
                    </div>
                  </div>
                  
                  {/* Score grid in remaining columns - connected to area name box */}
                  <div className="flex-1 h-12 relative">
                    {/* Industry standard background - updated width calculation */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#daf1fd] z-[2] rounded-r" 
                      style={{ width: standardWidth }}
                    ></div>
                    
                    {/* Current state dot (blue) */}
                    {areaResult.current > 0 && (
                      <div 
                        className="current-dot absolute top-1/2 w-6 h-6 rounded-full bg-[#023F88] z-[10]"
                        style={{ 
                          left: `${areaResult.current * 20}%`, // Position on grid line
                          transform: 'translate(-50%, -50%)'
                        }}
                      ></div>
                    )}
                    
                    {/* Desired state dot (orange) */}
                    {areaResult.desired > 0 && (
                      <div 
                        className="desired-dot absolute top-1/2 w-6 h-6 rounded-full bg-[#F58220] z-[10]"
                        style={{ 
                          left: `${areaResult.desired * 20}%`, // Position on grid line
                          transform: 'translate(-50%, -50%)'
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex flex-col mt-10 mb-4 ml-4">
            <div className="flex items-center mb-2">
              <img src={diagramBarsIcon} alt="Industry standard" className="w-6 h-6 mr-2" />
              <span className="text-[#023F88]">Industry standard</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full bg-[#023F88] mr-2"></div>
              <span className="text-[#023F88]">Current state</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#F58220] mr-2"></div>
              <span className="text-[#023F88]">Desired state</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons - styled like SelectAreasPage */}
      <div className="flex justify-center gap-16 mt-16">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleGoBack}>
          <div className="w-16 h-16 rounded-full bg-[#023F88] flex items-center justify-center mb-3 hover:bg-[#022a5c] transition-colors">
            <img 
              src={arrowLeftIcon}
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
        
        <div className="flex flex-col items-center cursor-pointer" onClick={handleExit}>
          <div className="w-16 h-16 rounded-full bg-[#023F88] flex items-center justify-center mb-3 hover:bg-[#022a5c] transition-colors">
            <img 
              src={arrowRightIcon}
              alt="Exit"
              className="h-8 w-8" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>';
              }}
            />
          </div>
          <span className="text-[#023F88] font-bold">Exit</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;