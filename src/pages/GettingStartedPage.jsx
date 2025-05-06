import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

// Import all static assets
import factoryBackgroundImg from '/factory-background.png';
import infoIcon from '/icons/b-info.png';
import placeIcon from '/icons/b-place.png';
import numberIcon from '/icons/b-number.png';
import volumeIcon from '/icons/b-volume.png';
import packageIcon from '/icons/b-package.png';
import arrowRightIcon from '/icons/arrow-right.png';

// Import product icons
import cowIcon from '/icons/cow.png';
import drinkIcon from '/icons/drink.png';
import cheeseIcon from '/icons/cheese.png';
import icecreamIcon from '/icons/icecream.png';
import foodIcon from '/icons/food.png';
import leafIcon from '/icons/leaf.png';
import powderIcon from '/icons/powder.png';
import otherIcon from '/icons/other.png';

const GettingStartedPage = () => {
  const navigate = useNavigate();
  const { setSidebarTitle } = useAssessment();
  
  // Set sidebar title when component mounts
  useEffect(() => {
    setSidebarTitle('Maturity benchmark tool');
  }, [setSidebarTitle]);
  
  // Initialize form data from localStorage or with empty values
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('tetraPackCompanyInfo');
    return savedData ? JSON.parse(savedData) : {
      companyName: '',
      factoryLocation: '',
      productionLines: '',
      productionVolume: '',
      location: 'Lund Automation Room', // Default value
      productTypes: []
    };
  });

  const productOptions = [
    { id: 'dairy', name: 'Dairy', icon: cowIcon },
    { id: 'jnsd', name: 'JNSD', icon: drinkIcon },
    { id: 'cheese', name: 'Cheese', icon: cheeseIcon },
    { id: 'ice-cream', name: 'Ice Cream', icon: icecreamIcon },
    { id: 'food', name: 'Food', icon: foodIcon },
    { id: 'plant-based', name: 'Plant-based', icon: leafIcon },
    { id: 'powder', name: 'Powder', icon: powderIcon },
    { id: 'other', name: 'Other', icon: otherIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleProductType = (productId) => {
    setFormData(prev => {
      const updatedTypes = prev.productTypes.includes(productId)
        ? prev.productTypes.filter(id => id !== productId)
        : [...prev.productTypes, productId];
      
      return { ...prev, productTypes: updatedTypes };
    });
  };

  const handleContinue = () => {
    // Save data to localStorage before continuing
    localStorage.setItem('tetraPackCompanyInfo', JSON.stringify(formData));
    navigate('/select-areas');
  };

  return (
    <div className="min-h-screen bg-[#B9E5FB]">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-[#023F88] mb-10">
          Getting started
        </h1>
        
        <div className="relative mb-12">
          {/* Light blue background container - adjust width to match mockup */}
          <div className="absolute top-0 bottom-0 left-0 bg-[#daf1fd] rounded-lg w-[65%]"></div>
          
          {/* Factory illustration */}
          <div className="absolute top-0 right-0 bottom-0 w-1/3 pointer-events-none z-0">
            <img 
              src={factoryBackgroundImg} 
              alt="Factory illustration" 
              className="h-full w-full object-contain object-right"
            />
          </div>
          
          {/* Form content */}
          <div className="relative z-10 p-8 space-y-8">
            {/* Company name */}
            <div className="flex items-center">
              <img src={infoIcon} alt="Info" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">Company name</div>
              <div className="w-3/5">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="w-full p-3 bg-[#023F88] text-white placeholder-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Factory location */}
            <div className="flex items-center">
              <img src={placeIcon} alt="Place" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">Factory location</div>
              <div className="w-3/5">
                <input
                  type="text"
                  name="factoryLocation"
                  value={formData.factoryLocation}
                  onChange={handleInputChange}
                  placeholder="Enter city and country"
                  className="w-full p-3 bg-[#023F88] text-white placeholder-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Number of production lines */}
            <div className="flex items-center">
              <img src={numberIcon} alt="Number" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">
                Number of production lines
              </div>
              <div className="w-3/5">
                <input
                  type="text"
                  name="productionLines"
                  value={formData.productionLines}
                  onChange={handleInputChange}
                  placeholder="Enter number of production lines"
                  className="w-full p-3 bg-[#023F88] text-white placeholder-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Production volume */}
            <div className="flex items-center">
              <img src={volumeIcon} alt="Volume" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">Production volume</div>
              <div className="w-3/5">
                <input
                  type="text"
                  name="productionVolume"
                  value={formData.productionVolume}
                  onChange={handleInputChange}
                  placeholder="Enter production volume"
                  className="w-full p-3 bg-[#023F88] text-white placeholder-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Type of products - Updated layout to match design */}
            <div className="flex items-start">
              <img src={packageIcon} alt="Package" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">Type of products</div>
              <div className="w-3/5">
                <div className="flex flex-wrap gap-6">
                  {productOptions.map(product => (
                    <div
                      key={product.id}
                      onClick={() => toggleProductType(product.id)}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className={`w-16 h-16 flex items-center justify-center rounded ${
                        formData.productTypes.includes(product.id) 
                          ? 'bg-[#F58220]' 
                          : 'bg-[#023F88]'
                      }`}>
                        <img 
                          src={product.icon} 
                          alt={product.name} 
                          className="w-12 h-12"
                        />
                      </div>
                      <span className="text-[#023F88] text-xs text-center mt-1 font-medium">{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location - Moved below Type of products and made editable */}
            <div className="flex items-center">
              <img src={placeIcon} alt="Location" className="w-12 h-12 mr-4" />
              <div className="w-40 font-bold text-[#023F88]">Location:</div>
              <div className="w-3/5">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Lund Automation Room"
                  className="w-full p-3 bg-[#023F88] text-white placeholder-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation button - Save button removed */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center cursor-pointer" onClick={handleContinue}>
            <div className="w-16 h-16 rounded-full bg-[#023F88] flex items-center justify-center mb-3 hover:bg-[#022a5c] transition-colors">
              <img src={arrowRightIcon} alt="Continue" className="h-8 w-8" />
            </div>
            <span className="text-[#023F88] font-bold">Continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPage;