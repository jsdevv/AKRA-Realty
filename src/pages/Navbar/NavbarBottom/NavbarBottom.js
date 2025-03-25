import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, 
         FaTimes, 
         FaHome, 
         MdBusiness, 
         HiCurrencyRupee, 
         IoChevronDown 
        } from '../../../assets/icons/Icons';
import { fetchPropertyStatusOptions, 
         fetchPropertyHomeType, 
         fetchCustomPropertyTypes, 
         fetchPremiumbuilders 
        } from '../../../API/api';
import { fetchPremiumListingsThunk, 
         fetchPropertyAlert, 
         setListingFilters, 
         setPriceFilter, 
         setSelectedBuilder, 
         setSelectedCenterOfMap, 
         setSelectedcustomStatus, 
         setSelectedHomeTypes, 
         setSelectedProperty, 
         setSelectedPropertyStatus, 
         toggleShowPremiumListings 
        } from '../../../Redux/Slices/propertySlice';
import Autosuggest from 'react-autosuggest';
import './NavbarBottom.css';
import FiltersComponent from '../../../components/FiltersComponent/FiltersComponent';
import { TbFilterSearch } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const priceRanges = [
  { value: 1, label: 'Below ₹ 10L', minPrice: 0, maxPrice: 1000000 },
  { value: 2, label: '₹ 10L - ₹ 50L', minPrice: 1000000, maxPrice: 5000000 },
  { value: 3, label: '₹ 50L - ₹ 1Cr', minPrice: 5000000, maxPrice: 10000000 },
  { value: 4, label: '₹ 1Cr - ₹ 2Cr', minPrice: 10000000, maxPrice: 20000000 },
  { value: 5, label: '₹ 2Cr - ₹ 4Cr', minPrice: 20000000, maxPrice: 40000000 },
  { value: 6, label: '₹ 4Cr - ₹ 6Cr', minPrice: 40000000, maxPrice: 60000000 },
  { value: 7, label: '₹ 6Cr - ₹ 10Cr', minPrice: 60000000, maxPrice: 100000000 },
  { value: 8, label: '₹ 10Cr - ₹ 15Cr', minPrice: 100000000, maxPrice: 150000000 },
  { value: 9, label: 'Above ₹ 20Cr', minPrice: 200000000, maxPrice: 999999999 }
];


const NavbarBottom = ({
    handleSearchSubmit,
    handleClearSearch,
    searchInput,
    handleSearchInputChange
}) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const {Id } = useSelector((state) => state.auth.userDetails  || {}); 
    const { filteredProperties } = useSelector((state) => state.properties);
    const dispatch = useDispatch();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedCustomStatus, setSelectedCustomStatus] = useState([]);
    const [selectAll, setSelectAll] = useState(true);
    const [propertyStatusOptions, setPropertyStatusOptions] = useState([]);
    const [homeTypeOptions, setHomeTypeOptions] = useState([]);
    const initialLoad = useRef(true);
    const [suggestions, setSuggestions] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [customPropertyTypes, setCustomPropertyTypes] = useState([]);
    const [preminumBuilders, setPreminumBuilders] = useState([]);
    const [selectedPremiumBuilders, setSelectedPremiumBuilders] = useState([]);

    const dropdownDefaultState = {
      statusDropdownOpen: false,
      typeDropdownOpen: false,
      priceDropdownOpen: false,
      customDropdownstatusOpen: false,
      premiumBuilders: false,
      filterDropdownOpen:false
    };
    const [dropdownsState, setDropdownsState] = useState(dropdownDefaultState);
    const { showPremiumListings } = useSelector((state) => state.properties);
    const statusDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);
    const priceDropdownRef = useRef(null);
    const customDropdownRef = useRef(null);
    const premiumBuildersRef = useRef(null);
    const filterDropdownRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          statusDropdownRef.current &&
          !statusDropdownRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            statusDropdownOpen: false,
          }));
        }
        if (
          typeDropdownRef.current &&
          !typeDropdownRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            typeDropdownOpen: false,
          }));
        }
        if (
          priceDropdownRef.current &&
          !priceDropdownRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            priceDropdownOpen: false,
          }));
        }
        if (
          customDropdownRef.current &&
          !customDropdownRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            customDropdownstatusOpen: false,
          }));
        }
        if (
          filterDropdownRef.current &&
          !filterDropdownRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            filterDropdownOpen: false,
          }));
        }

        if (
          premiumBuildersRef.current &&
          !premiumBuildersRef.current.contains(event.target)
        ) {
          setDropdownsState((prevState) => ({
            ...prevState,
            premiumBuilders: false,
          }));
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = await fetchPropertyStatusOptions(bearerToken);
                const mappedOptions = options.map(option => ({ value: option.PropertyStatus, label: option.PropertyStatus }));
                setPropertyStatusOptions(mappedOptions);
                if (initialLoad.current && mappedOptions.length > 0) {
                    const defaultStatus = mappedOptions[0];
                    setSelectedStatus(defaultStatus);
                    dispatch(setSelectedPropertyStatus(defaultStatus.value));
                    initialLoad.current = false;
                }
            } catch (error) {
                console.error('Error fetching property status options:', error);
            }
        };

        fetchData();

    }, [bearerToken, dispatch]);

    useEffect(() => {
        const fetchcustomData = async () => {
            try {
                const options = await fetchCustomPropertyTypes(bearerToken);
                const mappedOptions = options.map(option => ({
                    value: option.CustomPropertyTypesID,
                    label: option.CustomPropertyTypes,
                }));
                setCustomPropertyTypes(mappedOptions);
            } catch (error) {
                console.error('Error fetching custom property types:', error);
            }
        };

        fetchcustomData();
    }, [bearerToken]);

    useEffect(() => {
        const fetchHomeTypes = async () => {
            try {
                // Select all options initially if not yet initialized
                if (!isInitialized) {
                    const options = await fetchPropertyHomeType(bearerToken);
                    const mappedOptions = options.map(option => ({ value: option.PropertyTypeID, label: option.PropertyType }));
                    setHomeTypeOptions(mappedOptions);
                    const allTypes = mappedOptions.map(option => option.value);
                    setSelectedTypes(allTypes);
                    dispatch(setSelectedHomeTypes(allTypes));
                    setSelectAll(true);
                    setIsInitialized(true); // Mark as initialized
                }
            } catch (error) {
                console.error('Error fetching property home types:', error);
            }
        };

        fetchHomeTypes();  // Fetch only if homeTypeOptions is empty
    }, [bearerToken, isInitialized, dispatch]);

    useEffect(() => {
        if (propertyStatusOptions.length > 0 && !selectedStatus) {
            // Initialize with the first status option if no status is selected
            const defaultStatus = propertyStatusOptions[0];
            setSelectedStatus(defaultStatus);
            dispatch(setSelectedPropertyStatus(defaultStatus.value));
        }
    }, [propertyStatusOptions, dispatch, selectedStatus]);

    useEffect(() => {
        if (selectedStatus && propertyStatusOptions.length > 0) {
            // Ensure that selectedStatus is valid in the current list of options
            const statusExists = propertyStatusOptions.find(option => option.value === selectedStatus.value);
            if (!statusExists) {
                const newDefaultStatus = propertyStatusOptions[0];
                setSelectedStatus(newDefaultStatus);
                dispatch(setSelectedPropertyStatus(newDefaultStatus.value));
            }
        }
    }, [propertyStatusOptions, selectedStatus, dispatch]);


    // Toggle dropdown visibility
    const toggleDropdown = (dropdown) => {
        setDropdownsState(prevState => ({
            ...dropdownDefaultState,
            [dropdown]: !prevState[dropdown]
        }));
    };


    const handleStatusChange = useCallback((option) => {
        setSelectedStatus(option);
        dispatch(setSelectedPropertyStatus(option.value));
        document.body.classList.remove("for-sale-marker", "pre-launch-marker", "rental-marker", "sold-marker");
        let statusClass = "for-sale-marker";
        switch (option.value) {
            case 'For Sale':
                statusClass = 'for-sale-marker';
                break;
            case 'PreLaunch':
                statusClass = 'pre-launch-marker';
                break;
            case 'Rental':
                statusClass = 'rental-marker';
                break;
            case 'Sold':
                statusClass = 'sold-marker';
                break;
            default:
                statusClass = 'for-sale-marker';
        }
        document.body.classList.add(statusClass);
        toggleDropdown('statusDropdownOpen');
    }, [dispatch]);

    const handleTypeChange = (event) => {
        const { value, checked } = event.target;

        let updatedTypes;
        if (checked) {
            updatedTypes = [...selectedTypes, value];
        } else {
            updatedTypes = selectedTypes.filter(type => type !== value);
            setSelectAll(false); // Uncheck "Select All" if any type is deselected
        }

        setSelectedTypes(updatedTypes);
        dispatch(setSelectedHomeTypes(updatedTypes))

        // If all options are selected, recheck "Select All"
        if (updatedTypes.length === homeTypeOptions.length) {
            setSelectAll(true);
        }

        console.log(updatedTypes,"updatetypes")
    };

    const handleSelectAll = () => {
        if (!selectAll) {
            // Select all options
            const allTypes = homeTypeOptions.map(option => option.value);
            setSelectedTypes(allTypes);
            dispatch(setSelectedHomeTypes(allTypes))

        } else {
            // Deselect all options
            setSelectedTypes([]);
            dispatch(setSelectedHomeTypes([]));
        }
        setSelectAll(!selectAll); // Toggle "Select All" checkbox state
    };


    const handlePriceRangeSelection = (event) => {
        const { value, checked } = event.target;

        let updatedPriceRanges;
        if (checked) {
            updatedPriceRanges = [...selectedPriceRanges, priceRanges.find(range => range.value === parseInt(value))];
        } else {
            updatedPriceRanges = selectedPriceRanges.filter(range => range.value !== parseInt(value));
        }

        setSelectedPriceRanges(updatedPriceRanges);
        dispatch(setPriceFilter(updatedPriceRanges))

    };

    const handlePriceSelectAll = () => {
        if (selectedPriceRanges.length !== priceRanges.length) {
            // Select all options
            setSelectedPriceRanges(priceRanges);
            dispatch(setPriceFilter(priceRanges));
        } else {
            // Deselect all options
            setSelectedPriceRanges([]);
            dispatch(setPriceFilter([]));
        }
    }

    useEffect(() => {
        if (showPremiumListings) {
          dispatch(fetchPremiumListingsThunk(bearerToken));
        }
      }, [showPremiumListings, bearerToken, dispatch]);

    const handlePremiumBuildersSelection = (event) => {
        const { value, checked } = event.target;

        let updatedPremiumBuilders;
        if (checked) {
            updatedPremiumBuilders = [...selectedPremiumBuilders, preminumBuilders.find(builder => builder.PremiumCompanies === value)];
        } else {
            updatedPremiumBuilders = selectedPremiumBuilders.filter(builder => builder.PremiumCompanies !== value);
        }

        setSelectedPremiumBuilders(updatedPremiumBuilders);
        dispatch(setSelectedBuilder(updatedPremiumBuilders));
        dispatch(setListingFilters());

    };

    const handlePremiumBuildersSelectAll = () => {
        if (selectedPremiumBuilders.length !== preminumBuilders.length) {
            // Select all options
            setSelectedPremiumBuilders(preminumBuilders);
            dispatch(setSelectedBuilder(preminumBuilders));
        } else {
            // Deselect all options
            setSelectedPremiumBuilders([]);
            dispatch(setSelectedBuilder([]));
        }
        dispatch(setListingFilters());
    }

    const togglePremium = () => {
        dispatch(setSelectedBuilder([]));
        dispatch(toggleShowPremiumListings())
    }

    const handleCustomStatusSelection = (event) => {
        const { value, checked } = event.target;

        let updatedCustomStatus;
        if (checked) {
            updatedCustomStatus = [...selectedCustomStatus, value];
        } else {
            updatedCustomStatus = selectedCustomStatus.filter(status => status !== value);
        }

        setSelectedCustomStatus(updatedCustomStatus);
        dispatch(setSelectedcustomStatus(customPropertyTypes.filter(option => updatedCustomStatus.includes(option.value)).map(option => option.label)));

    };

    const handleCustomStatusSelectAll = () => {
        if (selectedCustomStatus.length !== customPropertyTypes.length) {
            // Select all options
            setSelectedCustomStatus(customPropertyTypes.map(option => option.value));
            dispatch(setSelectedcustomStatus(customPropertyTypes.map(option => option.label)));
        } else {
            // Deselect all options
            setSelectedCustomStatus([]);
            dispatch(setSelectedcustomStatus([]));
        }
    }

    const getSuggestions = (value) => {
        const inputValue = value ? value.toLowerCase() : '';
        const matches = inputValue.length === 0
        ? []
        : filteredProperties.filter((property) =>
            property.PropertyName?.toLowerCase().includes(inputValue) ||
            property.PropertyArea?.toLowerCase().includes(inputValue) ||
            property.PropertyZipCode?.toLowerCase().includes(inputValue)
        );
        return matches.reduce((acc, property) => {
            if (!acc.find((p) => p.PropertyName === property.PropertyName)) {
                acc.push(property);
            }
            return acc;
        }, []);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    useEffect(() => {
        const getBuilders = async () => {
          try {
            const data = await fetchPremiumbuilders(bearerToken);
            setPreminumBuilders(data); // Set builders in local state
          } catch (error) {
            console.error("Error fetching builders:", error);
          } finally {
          }
        };
    
        getBuilders();
      }, [showPremiumListings,bearerToken]);

    const inputProps = {
        placeholder: 'Address, City, Pin Code',
        value: searchInput || '', // Search input comes from parent component state
        onChange: handleSearchInputChange,
        'aria-label': 'Search'
    };

    const handleAutoSuggestSearch = (e) => {
        handleSearchSubmit(e);
        console.log(e);
        searchPlace(searchInput);
    }

    const handleSuggestionClick = (suggestion) => {
      console.log(suggestion,"suggestion");
        dispatch(setSelectedProperty(suggestion));
    }

    const searchPlace = async (searchText) => {
      const geocoder = new window.google.maps.Geocoder();

      if(searchText?.trim()){
      geocoder.geocode({ address: searchText }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          dispatch(setSelectedCenterOfMap({lat: location.lat(), lng: location.lng()}));
        } 
      });
    }
      else {
        dispatch(setSelectedCenterOfMap({ lat: 17.4065, lng: 78.4772 }));
      }
    };

    const getPriceRangeString = () => {
      if (selectedPriceRanges.length === 0) return "";

      const minPrice = Math.min(...selectedPriceRanges.map(range => range.minPrice));
      console.log(minPrice,",min");
      const maxPrice = Math.max(...selectedPriceRanges.map(range => range.maxPrice));

      console.log(maxPrice,"maxprice");

      return `${minPrice}-${maxPrice}`;
  };

    const handleSetAlert = (event) => {
      event.preventDefault()
      const priceRangeStr = getPriceRangeString();
      const selectedLabels = selectedTypes.map(
        (value) => homeTypeOptions.find((option) => option.value === value)?.label
    ).filter(Boolean);

    const selectedLabelsString = selectedLabels.join(", ");

      dispatch(
        fetchPropertyAlert({
          bearerToken,
          payload: {
            UserID: Id,
            PropertyStatus: selectedStatus.label,
            PropertyType: selectedLabelsString,
            PriceRange: priceRangeStr,
          },
        })
      );
      toast.success("Alert set successfully!");
    };
    
    
    return (
      <div className="navbar-bottom">
         <ToastContainer position="top-right" autoClose={3000} />
        <form className="search-container" onSubmit={handleAutoSuggestSearch}>
          <div className="search-input">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={(suggestion) => suggestion.PropertyName}
              renderSuggestion={(suggestion) => (
                <div onClick={() => {handleSuggestionClick(suggestion)}}>
                  {suggestion.PropertyName}, {suggestion.Locality},{" "} {suggestion.PropertyZipCode}
                </div>
              )}
              inputProps={inputProps}
            />
            {searchInput && (
              <button
                className="clear-button"
                type="button"
                onClick={() => {
                  // Clear the search input via parent-provided function
                  handleClearSearch();
                  dispatch(setSelectedCenterOfMap({ lat: 17.4065, lng: 78.4772 }));
                }}
                aria-label="Clear"
              >
                <FaTimes />
              </button>
            )}
            <button className="search-button" type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </form>
        <div className="dropdowns-container">
          <div className="dropdown-container" ref={statusDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => toggleDropdown("statusDropdownOpen")}
            >
              <MdBusiness className="fa-home" />{" "}
              {selectedStatus ? selectedStatus.label : "Select Status"}
              <IoChevronDown className="icon" />
            </button>
            {dropdownsState.statusDropdownOpen && (
              <div className="dropdown-menu">
                {propertyStatusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`dropdown-item ${
                      selectedStatus?.value === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleStatusChange(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown-container" ref={typeDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => toggleDropdown("typeDropdownOpen")}
            >
              <FaHome className="fa-home" /> Type
              <IoChevronDown className="icon" />
            </button>
            {dropdownsState.typeDropdownOpen && (
              <div className="dropdown-menu multi-select">
                <label className="dropdown-item select-all">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  Select All
                </label>
                {homeTypeOptions.map((option) => (
                  <label key={option.value} className="dropdown-item">
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
          <div className="dropdown-container" ref={priceDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => toggleDropdown("priceDropdownOpen")}
            >
              <HiCurrencyRupee className="fa-home" /> Price Range
              <IoChevronDown className="icon" />
            </button>
            {dropdownsState.priceDropdownOpen && (
              <div className="dropdown-menu multi-select">
                <label className="dropdown-item select-all">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.length === priceRanges.length}
                    onChange={handlePriceSelectAll}
                  />
                  Select All
                </label>
                {priceRanges.map((option) => (
                  <label key={option.value} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedPriceRanges.includes(option)}
                      onChange={handlePriceRangeSelection}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown-container" ref={customDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => toggleDropdown("customDropdownstatusOpen")}
            >
              <MdBusiness className="fa-home" /> Custom Type
              <IoChevronDown className="icon" />
            </button>

            {dropdownsState.customDropdownstatusOpen && (
              <div className="dropdown-menu multi-select">
                <label className="dropdown-item select-all">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomStatus.length === customPropertyTypes.length
                    }
                    onChange={handleCustomStatusSelectAll}
                  />
                  Select All
                </label>
                {customPropertyTypes.map((option) => (
                  <label key={option.value} className="dropdown-item">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedCustomStatus.includes(option.value)}
                      onChange={handleCustomStatusSelection}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown-container" ref={filterDropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => toggleDropdown("filterDropdownOpen")}
            >
              <TbFilterSearch className="fa-home" /> More Filters
              <IoChevronDown className="icon" />
            </button>
            {dropdownsState.filterDropdownOpen && (
              <div className="dropdown-menu">
                 <div className='dropdownfilter-item'>
                      <FiltersComponent />
                 </div>
                 
              </div>
            )}
          </div>

             <button className="save-search-button" onClick={handleSetAlert}>
              Set Alert
             </button>

        </div>
        <div className="premium-toggle-container">
        {showPremiumListings && (
              <div className="dropdown-container" ref={premiumBuildersRef}>
                <button
                  className="dropdown-toggle"
                  onClick={() => toggleDropdown("premiumBuilders")}
                >
                  Premium Builders
                  <IoChevronDown className="icon" />
                </button>
                {dropdownsState.premiumBuilders && (
                  <div className="dropdown-menu multi-select">
                    <label className="dropdown-item select-all">
                      <input
                        type="checkbox"
                        checked={
                          selectedPremiumBuilders.length === preminumBuilders.length
                        }
                        onChange={handlePremiumBuildersSelectAll}
                      />
                      Select All
                    </label>
                    {preminumBuilders.map((option) => (
                      <label key={option.value} className="dropdown-item">
                        <input
                          type="checkbox"
                          value={option.PremiumCompanies}
                          checked={selectedPremiumBuilders.includes(option)}
                          onChange={handlePremiumBuildersSelection}
                        />
                        {option.PremiumCompanies}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          <div className="premi m-builders-switch">
            <span>Premium</span>
            <label className="premium-toggle-switch">
              <input
                type="checkbox"
                checked={showPremiumListings}
                onChange={togglePremium}
              />
              <span className="premium-slider" />
            </label>
          </div>

        </div>
      </div>
    );
};

export default NavbarBottom;
