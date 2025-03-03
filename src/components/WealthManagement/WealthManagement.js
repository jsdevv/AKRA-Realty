import React, { useState, useEffect } from 'react';
import { fetchInvitationproperties } from '../../API/api';
// import RiskGaugeChart from '../charts/RiskGaugeChart';
import { FaHeart } from "react-icons/fa";
import './WealthManagement.css';
import Investormap from '../Investormap/Investormap';
import { Line } from 'rc-progress';
import InvestorFilter from '../Investorfilters/InvestorFilter';
import { IoLocationSharp } from "react-icons/io5";
import InvestorCompare from '../InvestorCompare/InvestorCompare';
import ContactForm from "../ContactForm/ContactForm"
import { LiaRupeeSignSolid } from '../../assets/icons/Icons';

const WealthManagement = ({ bearerToken,handleViewChange  }) => {
  const [investorData, setInvestorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewport, setViewport] = useState({
    center: { lng: 78.36522338933622, lat: 17.454828024298905 },
    zoom: 10
  });
  const [favorites, setFavorites] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([1,50]);
  const [rentalRange, setRentalRange] = useState([20000, 4000000]);
  const [selectedGrowth, setSelectedGrowth] = useState([]); // Growth filter
  const [selectedRisk, setSelectedRisk] = useState([]); // Initialize as an empty array
  const [selectinvitaionType, setSelectinvitaionType] = useState([]);
  const [currentView, setCurrentView] = useState('default');
  const [invitationMode, setInvitationMode] = useState(true);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  const handleLocalViewChange = (view) => {
    setCurrentView(view);
    setInvitationMode(view === 'innercircle');
    handleViewChange(view); // Call the prop function
  };


  // Convert selected risk checkboxes to a range array
  const riskRanges = selectedRisk.map((riskLabel) => {
    switch (riskLabel) {
      case 'Low':
        return [0, 25];
      case 'Medium':
        return [25, 50];
      case 'High':
        return [50, 75];
      case 'High-Risk':
        return [75, 100];
      default:
        return [0, 100];
    }
  });

  // Fetch investor data
  useEffect(() => {
    setIsLoading(true);
    new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
      .then(() => fetchInvitationproperties(bearerToken))
      .then((data) => {
        setInvestorData(data.map(property => ({
          ...property,
        })));
        setIsLoading(false);
        
      })
      .catch((error) => {
        console.error('Detailed Error:', error);
        setIsLoading(false);
      });
  }, [bearerToken]);


  // Effect to automatically open compare button when 3 properties are selected
  useEffect(() => {
    setCompareModalOpen(selectedProperties.length > 0);
  }, [selectedProperties]);

  const handleFavorite = (property) => {
    setFavorites((prevFavorites) => {
      // Check if the property is already in the favorites list
      const isFavorite = prevFavorites.some(
        (fav) => fav.PropertyID === property.PropertyID
      );

      if (isFavorite) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.PropertyID !== property.PropertyID);
      } else {
        // Add to favorites
        return [...prevFavorites, property];
      }
    });
  };
  const handleCompareProperties = (property, isChecked) => {
    setSelectedProperties((prevSelected) => {
      if (isChecked) {
        if (!prevSelected.some((p) => p.PropertyID === property.PropertyID)) {
          return [...prevSelected, property];
        }
      } else {
        return prevSelected.filter((p) => p.PropertyID !== property.PropertyID);
      }
      return prevSelected;
    });
  };

  const openPopup = () => {
   
    if (selectedProperties.length > 1) {
      console.log("clicked popups")
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


   // Filter investor data based on price range
// Adjust the filter function
const filteredinnercircleProperties = investorData.filter((property) => {
  
  const displayAmountInCr = property.DisplayAmount / 10000000;
  const riskRating = parseFloat(property.RiskRating);
  
  // Handle invitation types
  const invitationTypes = property.InnerCircleTypes
    .split(',')
    .map(type => type.trim()); // Ensure trimming of whitespace
  
  // Check if the price is within range
  const isPriceInRange = displayAmountInCr >= priceRange[0] && displayAmountInCr <= priceRange[1];
  
  // Check if the risk rating is within any of the selected ranges
  const isRiskInRange =
    selectedRisk.length === 0 ||
    riskRanges.some(([min, max]) => riskRating >= min && riskRating <= max);
  
  // Check if the property matches any selected invitation type
  const isInvitationSelected = selectinvitaionType.length === 0 || 
    selectinvitaionType.some(type => invitationTypes.includes(type));
  
  // Only include the property if it passes all the conditions
  return isPriceInRange && isRiskInRange && isInvitationSelected;
});


  const openContactPopup = (property) => {
    setIsContactPopupOpen(true);
  };
  
  const closeContactPopup = () => {
    setIsContactPopupOpen(false);
  
  };
 

  
  return (
    <div className="innercircle-container">
      <div className="innercircle-navbar">
      <div className='innercirclenav-left'>
      <input type="text" placeholder="Search" className="searchbox" />
      <select className="dropdown">
          <option>Property Type</option>
        </select>
      </div>
    

      
        <div className='innercircle-buttons'>
      <button
            onClick={() => handleLocalViewChange('investors')}
            className={`favorites ${currentView === 'investors' ? 'active' : ''}`}
          >
            Investors
          </button>
          <button
            onClick={() => handleLocalViewChange('innercircle')}
            className={`favorites ${currentView === 'innercircle' ? 'active' : ''}`}
          >
            Inner Circle
          </button>
          <button
            onClick={() => handleViewChange('wealthmanagement')}
            className={`favorites ${currentView === 'wealthmanagement' ? 'active' : ''}`}
          >
            Wealth Management
          </button>
          <button
            onClick={() => handleViewChange('fractionalinvestments')}
            className={`favorites ${currentView === 'fractionalinvestments' ? 'active' : ''}`}
          >
            Fractional Investments
          </button>

        </div>

      
      </div>

   
      <div className="innercircle-properties">
        <div className='innercircle-filter'>
          <InvestorFilter 
            isInvitationMode={invitationMode}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rentalRange={rentalRange}
            setRentalRange={setRentalRange}
            selectedGrowth={selectedGrowth}
            setSelectedGrowth={setSelectedGrowth}
            selectedRisk={selectedRisk}
            setSelectedRisk={setSelectedRisk}
            selectinvitaionType={selectinvitaionType}
            setSelectinvitaionType={setSelectinvitaionType}
           />
        </div>
        <div className="innercircle-propertylist">
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {filteredinnercircleProperties.map((property) => {
      
              const imageURL = require(`../../images/${property.ImageNames}`);
              return (
            <div
              key={property.PropertyID}
              className={`innercircle-propertyitem ${selectedProperties.includes(property) ? 'selected' : ''}`}
            >
              <img src={imageURL} alt={property.PropertyName} className="innercircle-image" />
              {/* <img src={property.imageURL} alt={property.PropertyName} className="innercircle-image"  /> */}
              <div className="innerproperty-details">
                <div className="innerproperty-info-box">
                  <div class="innerproperty-header">
                    <div className="innerproperty-name">{property.PropertyName},
                         <span className="invprice-cell">
                                                    <LiaRupeeSignSolid className="invrupee-icon" />{property.Amount}
                          </span>
                        
                    </div>

                    <div className='innerproperty-compare'>
                      <span>Compare</span>  <input
                        type="checkbox"
                        checked={selectedProperties.some(
                          (p) => p.PropertyID === property.PropertyID
                        )}
                        onChange={(e) =>
                          handleCompareProperties(property, e.target.checked)
                        }
                        disabled={
                          !selectedProperties.some(
                            (p) => p.PropertyID === property.PropertyID
                          ) && selectedProperties.length >= 3
                        }
                      />

                    </div>
                    <div
                      className={`innerproperty-heart ${favorites.some(fav => fav.PropertyID === property.PropertyID) ? 'favorited' : ''}`}
                      onClick={() => handleFavorite(property)}
                    >
                      <FaHeart />
                    </div>
                  </div>
                  <div className="innerproperty-type"><IoLocationSharp /> {property.PropertyType}, {property.PropertyArea} </div>

                </div>

                <div className="innerprogress-bar">
                  <Line
                    percent={property.PropertyStatusPercentage}
                    strokeWidth="1"
                    strokeColor="#4caf50"
                    trailWidth="1"
                    trailColor="#f3f3f3"
                  />
                  <div className='innerprogress-content'>
                    <div>Launch</div>
                    <div>100%</div>
                  </div>
                </div>
                <div className='innerproperty-line' />
                <div className="innerproperty-annual">
                  <div>
                    <p className="text">Property Type</p>
                    <h4>{property.PropertyType}</h4>
                  </div>
                  <div className="separator"></div>
                 <div>
                    <p className="text">Occupation</p>
                    <h4>{property.InnerCircleTypes}</h4>
                  </div>

                  <div className="separator"></div>
                  <div>
                    <p className="text">Property Status</p>
                    <h4>{property.PropertyStatus}</h4>
                  </div>
                </div>
                <div className="innerrisk-box">
                  {/* <RiskGaugeChart riskValue={property.RiskRating} /> */}
                  <div className="innerrisk-box-buttons">
                    <button className='button1' onClick={() => openContactPopup(property)}>Contact</button>
                    <button className='button2'>Details</button>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>

        <Investormap viewport={viewport} investorData={investorData} favorites={favorites} />
        {compareModalOpen && (
          <div className="innercompare-button-container">

            <button
              onClick={openPopup}
              disabled={selectedProperties.length <= 1}
              className="compare-button"
            >
              Compare
            </button>
            &nbsp;&nbsp;
            <span>
              {selectedProperties.length <= 1
                ? "Select at least 2-3 properties to compare"
                : " "}
            </span>

          </div>
        )}
      </div>
      {isPopupOpen && (
        <InvestorCompare
          selectedProperties={selectedProperties}
          closePopup={closePopup}
        />
      )}

{isContactPopupOpen  && (
        <ContactForm
        
          onClose={closeContactPopup}
        />
      )}

    </div>
  );
};

export default WealthManagement;
