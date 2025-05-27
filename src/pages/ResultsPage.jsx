// src/pages/ResultsPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { useEffect, useRef } from 'react';

// Import static assets
import diagramBarsIcon from '/icons/diagram-bars-icon.png';
import arrowLeftIcon from '/icons/arrow-left.png';
import arrowRightIcon from '/icons/arrow-right.png';
import smartOrganisationIcon from '/icons/smart-organisation.png';
import smartWorkforceIcon from '/icons/smart-workforce.png';
import smartOperationsIcon from '/icons/smart-operations.png';
import smartFactoryIcon from '/icons/smart-factory.png';
import smartSupplyChainIcon from '/icons/smart-supply-chain.png';

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
  
  // Map to store icons for each area - Updated with larger icon sizes
  const getAreaIcon = (areaId) => {
    const iconMap = {
      'organization': {
        src: smartOrganisationIcon,
        alt: "Smart Organisation",
        fallback: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20V8L12 4L21 8V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14V20H15V14H9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'workforce': {
        src: smartWorkforceIcon,
        alt: "Smart Workforce",
        fallback: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C17.7699 3.58317 19.0078 5.17787 19.0078 7.005C19.0078 8.83213 17.7699 10.4268 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'operations': {
        src: smartOperationsIcon,
        alt: "Smart Operations",
        fallback: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'factory': {
        src: smartFactoryIcon,
        alt: "Smart Factory",
        fallback: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 11H8V22H2V11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 11L14 7V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11L20 7V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 15H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      'supply-chain': {
        src: smartSupplyChainIcon,
        alt: "Smart Supply Chain",
        fallback: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3H21V8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 21H3V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 16V21H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 8V3H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      }
    };

    const iconData = iconMap[areaId];
    
    if (!iconData) return null;
    
    return (
      <div className="flex items-center justify-center mr-2" style={{ minWidth: '20px', height: '20px' }}>
        <img 
          src={iconData.src} 
          alt={iconData.alt} 
          className="w-6 h-6 object-contain filter brightness-0 invert" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} 
        />
        <div style={{ display: 'none' }}>
          {iconData.fallback}
        </div>
      </div>
    );
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
                      {getAreaIcon(area.id)}
                      <span className="text-lg whitespace-nowrap">{area.name}</span>
                    </div>
                  </div>
                  
                  {/* Score grid in remaining columns - connected to area name box */}
                  <div className="flex-1 h-12 relative">
                    {/* Industry standard background - updated with proper opacity for print */}
                    <div 
                      className="absolute inset-y-0 left-0 z-[2] rounded-r" 
                      style={{ 
                        width: standardWidth,
                        backgroundColor: 'rgba(218, 241, 253, 0.8)',
                        // Add a solid border for better print visibility
                        boxShadow: 'inset 0 0 0 1px rgba(218, 241, 253, 1)'
                      }}
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
              <div className="w-7 h-7 mr-2 flex items-center justify-center">
                <img 
                  src={diagramBarsIcon} 
                  alt="Industry standard" 
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="w-7 h-7 bg-[#daf1fd] border border-[#b5d9ed] rounded"></div>';
                  }}
                />
              </div>
              <span className="text-[#023F88]">Industry standard</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 rounded-full bg-[#023F88] mr-2"></div>
              <span className="text-[#023F88]">Current state</span>
            </div>
            <div className="flex items-center">
              <div className="w-7 h-7 rounded-full bg-[#F58220] mr-2"></div>
              <span className="text-[#023F88]">Desired state</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
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