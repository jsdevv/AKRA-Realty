import React, { useState, useEffect } from 'react';
import { fetchInvestorproperties, fetchPropertyHomeType } from '../../API/api';
import RiskGaugeChart from '../charts/RiskGaugeChart';
import { FaChevronDown, FaChevronUp, FaHeart } from "react-icons/fa";
import './Investor.css';
import Investormap from '../Investormap/Investormap';
import { Line } from 'rc-progress';
import InvestorFilter from '../Investorfilters/InvestorFilter';
import { IoLocationSharp } from "react-icons/io5";
import InvestorCompare from '../InvestorCompare/InvestorCompare';
import InvestorDetailsbutton from '../InvestorDetailsbutton/InvestorDetailsbutton';
import { setSelectedHomeTypes } from '../../Redux/Slices/propertySlice';
import { useDispatch } from 'react-redux';
import { LiaRupeeSignSolid } from '../../assets/icons/Icons';

const Investor = ({ bearerToken, handleViewChange }) => {
  const dispatch = useDispatch();
  const [investorData, setInvestorData] = useState([]);
  const [viewMode, setViewMode] = useState('map');
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
  const [priceRange, setPriceRange] = useState([1, 50]);
  const [rentalRange, setRentalRange] = useState([20000, 4000000]);
  const [selectedGrowth, setSelectedGrowth] = useState([]); // Growth filter
  const [selectedRisk, setSelectedRisk] = useState([]); // Initialize as an empty array
  const [selectedUseType, setSelectedUseType] = useState([]);
  const [currentView, setCurrentView] = useState('investors');
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [selectedPropertyDetails, setSelectedinvestorPropertyDetails] = useState(null);
  const [homeTypeOptions, setHomeTypeOptions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const toggleDropdown = () => {
  setIsDropdownOpen((prev) => !prev);
};


  // Convert selected growth checkboxes to a range array
  const growthRanges = selectedGrowth.map((growthLabel) => {
    switch (growthLabel) {
      case '0-10%':
        return [0, 10];
      case '11-20%':
        return [11, 20];
      case '21-30%':
        return [21, 30];
      case '31-40%':
        return [31, 40];
      case '40+%':
        return [41, 100];
      default:
        return [0, 100];
    }
  });

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
    new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      .then(() => fetchInvestorproperties(bearerToken))
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
  useEffect(() => {
    const fetchHomeTypes = async () => {
      try {
        const options = await fetchPropertyHomeType(bearerToken);
        const mappedOptions = options.map(option => ({ value: option.PropertyTypeID, label: option.PropertyType }));
        setHomeTypeOptions(mappedOptions);

        // Select all options initially if not yet initialized
        if (!isInitialized) {
          const allTypes = mappedOptions.map(option => option.value);
          setSelectedTypes(allTypes);
          dispatch(setSelectedHomeTypes(allTypes));
          setSelectAll(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error fetching property home types:', error);
      }
    };

    fetchHomeTypes();
  }, [bearerToken, isInitialized]);

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

  const handleLocationButtonClick = (property) => {
    // console.log(property, "property clicked");
    const selectedProperty = investorData.find(
      (property) => property.PropertyID === property.PropertyID
    );
    if (selectedProperty) {
      console.log(selectedProperty, "selected property");
      // Update the active property and viewport
      setActivePropertyId(property.PropertyID);
      setViewMode('map');
    }

  };

  const handleDetailsButtonClick = (property) => {
    const selectedProperty = investorData.find(
      (prop) => prop.PropertyID === property.PropertyID
    );
    if (selectedProperty) {
      setSelectedinvestorPropertyDetails(selectedProperty);
      setViewMode('details'); // Set the view to Details when Details is clicked
    }
  };



  // Handle individual checkbox selection
  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTypes((prevTypes) => [...prevTypes, value]);
    } else {
      setSelectedTypes((prevTypes) => prevTypes.filter((type) => type !== value));
    }
  };
  

  // Handle 'Select All' checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]); // Clear all selections
      dispatch(setSelectedHomeTypes([]));
    } else {
      const allTypes = homeTypeOptions.map((option) => option.value); // Select all options
      setSelectedTypes(allTypes);
      dispatch(setSelectedHomeTypes(allTypes));
    }
    setSelectAll(!selectAll);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

 
  // Filter investor data based on price range
  const filteredinvestorProperties = investorData.filter((property) => {
    const displayAmountInCr = property.DisplayAmount / 10000000;
    const rentalAmount = property.RentalDisplayAmount;
    const maxGrowth = parseFloat(property.MaxAnnualGrowth);
    const riskRating = parseFloat(property.RiskRating);
    const useTypes = property.UseType.split(', ').map(type => type.trim());
  
    const matchesSearchTerm = (searchTerm) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        property.PropertyName.toLowerCase().includes(lowerSearchTerm) ||
        property.PropertyArea.toLowerCase().includes(lowerSearchTerm) ||
        property.PropertyType.toLowerCase().includes(lowerSearchTerm) ||
        useTypes.some((type) => type.toLowerCase().includes(lowerSearchTerm))
      );
    };
  
    const isTypeSelected =
      selectedTypes.length === 0 || selectedTypes.includes(property.PropertyTypeID);
  
    const isPriceInRange =
      displayAmountInCr >= priceRange[0] && displayAmountInCr <= priceRange[1];
    const isRentalInRange =
      rentalAmount >= rentalRange[0] && rentalAmount <= rentalRange[1];
  
    // If no growth checkboxes are selected, show all properties
    const isGrowthInRange =
      selectedGrowth.length === 0 ||
      growthRanges.some(
        ([min, max]) => maxGrowth >= min && maxGrowth <= max
      );
  
    // If no risk checkboxes are selected, show all properties
    const isRiskInRange =
      selectedRisk.length === 0 ||
      riskRanges.some(([min, max]) => riskRating >= min && riskRating <= max);
  
    const isUseTypeSelected = selectedUseType.length === 0 || selectedUseType.some(type => useTypes.includes(type));
  
    // Apply the filter based on all conditions
    return (
      isPriceInRange &&
      isRentalInRange &&
      isGrowthInRange &&
      isRiskInRange &&
      isUseTypeSelected &&
      isTypeSelected &&
      matchesSearchTerm(searchTerm)
    );
  });
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      return filteredinvestorProperties;
    }
  };

  return (
    <div className="investor-container">

      <div className="investor-navbar">

        <div className='investornav-left'>

          <input  type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown} placeholder="Address, City, Pincode" className="searchbox" />

          <div className="investor-home-options-dropdown">
      <button
        className="investor-dropdown-toggle"
        onClick={toggleDropdown}
        type="button"
      >
        Type
        {isDropdownOpen ? (
          <FaChevronUp className="dropdown-icon" />
        ) : (
          <FaChevronDown className="dropdown-icon" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="investor-checkbox-dropdown">
          <label className="investor-select-all-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Select All
          </label>
          {homeTypeOptions.map((option) => (
            <label key={option.value} className="investor-checkbox-label">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedTypes.includes(option.value)}
                onChange={handleTypeChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>

        </div>

        <div className='investornav-right'>

          <button
            onClick={() => handleViewChange('investors')}
            className={`investorfav ${currentView === 'investors' ? 'active' : ''}`}
          >
            Investors
          </button>
          <button
            onClick={() => handleViewChange('innercircle')}
            className={`investorfav ${currentView === 'innercircle' ? 'active' : ''}`}
          >
            Inner Circle
          </button>
          <button
            onClick={() => handleViewChange('wealthmanagement')}
            className={`investorfav ${currentView === 'wealthmanagement' ? 'active' : ''}`}
          >
            Wealth Management
          </button>
          <button
            onClick={() => handleViewChange('fractionalinvestments')}
            className={`investorfav ${currentView === 'fractionalinvestments' ? 'active' : ''}`}
          >
            Fractional Investments
          </button>
        </div>
      </div>

      <div className="map-properties">
        <div className='investor-filters'>
          <InvestorFilter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rentalRange={rentalRange}
            setRentalRange={setRentalRange}
            selectedGrowth={selectedGrowth}
            setSelectedGrowth={setSelectedGrowth}
            selectedRisk={selectedRisk}
            setSelectedRisk={setSelectedRisk}
            selectedUseType={selectedUseType}
            setSelectedUseType={setSelectedUseType}

          />
        </div>
        <div className="investorproperty-list">
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {filteredinvestorProperties.map((property) => {
            const imageURL = require(`../../images/${property.ImageNames}`);
            return (
              <div
                key={property.PropertyID}
                className={`investorproperty-item ${selectedProperties.includes(property) ? 'selected' : ''}`}
              >
                <img src={imageURL} alt={property.PropertyName} className="property-image" />
                <div className="investorproperty-details">
                  <div className="property-info-box">
                    <div class="investorproperty-header">
                      <div className="investorproperty-name">
                        {property.PropertyName},
                        <span className="invprice-cell">
                             <LiaRupeeSignSolid className="invrupee-icon" />{property.Amount}
                        </span>
                      </div>

                      <div className='property-compare'>
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
                        className={`property-heart ${favorites.some(fav => fav.PropertyID === property.PropertyID) ? 'favorited' : ''}`}
                        onClick={() => handleFavorite(property)}
                      >
                        <FaHeart />
                      </div>
                    </div>
                    <div className="property-type"><IoLocationSharp /> {property.PropertyType}, {property.PropertyArea} </div>

                  </div>

                  <div className="progress-bar">
                    <Line
                      percent={property.PropertyStatusPercentage}
                      strokeWidth="1"
                      strokeColor="#4caf50"
                      trailWidth="1"
                      trailColor="#f3f3f3"
                    />
                    <div className='progress-content'>
                      <div>Launch</div>
                      <div>100%</div>
                    </div>
                  </div>
                  <div className='property-line' />
                  <div className="investorproperty-annual">
                    <div >
                      <p className="text">Property Type</p>
                      <h4>{property.PropertyType}</h4>
                    </div>
                    <div className="separator"></div>
                    <div>
                      <p className="text">Annual Return</p>
                      <h4>{property.MinAnnualGrowth}% + {property.MaxAnnualGrowth}%</h4>
                    </div>
                    <div className="separator"></div>
                    <div>
                      <p className="text">Rental Estimate</p>
                      <h4>{property.RentalAmountPM}</h4>
                    </div>
                    <div className="separator"></div>
                    <div>
                      <p className="text">Property Status</p>
                      <h4>{property.PropertyStatus}</h4>
                    </div>
                  </div>
                  <div className="risk-box">
                    <div className='risk-box-left'>
                      <RiskGaugeChart riskValue={property.RiskRating} />
                    </div>

                    <div className="risk-box-right">
                      <button className='button1' onClick={() => handleLocationButtonClick(property)}>Location</button>
                      <button className='button2' onClick={() => handleDetailsButtonClick(property)}>Details</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Conditionally render based on viewMode */}
        {viewMode === 'map' ? (
          <Investormap
            viewport={viewport}
            investorData={investorData}
            favorites={favorites}
            activePropertyId={activePropertyId}
            selectedPropertyDetails={selectedPropertyDetails}
          />
        ) : (
          <InvestorDetailsbutton
            property={selectedPropertyDetails}
            onClose={() => setViewMode('map')} // Optionally close details and show map again
          />
        )}


        {compareModalOpen && (
          <div className="compare-button-container">

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

    </div>
  );
};

export default Investor;
