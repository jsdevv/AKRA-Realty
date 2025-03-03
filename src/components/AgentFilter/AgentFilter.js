import React, { useEffect, useRef, useState } from 'react';
import {  fetchPropertyHomeType } from '../../API/api';
import {
      FaSearch, 
      FaTimes, 
      FaHome, 
      MdBusiness, 
      HiCurrencyRupee, 
      IoChevronDown
    } from "../../assets/icons/Icons"
import { useDispatch, useSelector } from 'react-redux';
import {
    setSearchFilter,
    setSelectedAgentPropertyStatus,
    setSelectedAgentPropertyType,
    setSelectedAgentPriceFilter,
    fetchStatusOptions,
    clearAgentFilters,
} from '../../Redux/Slices/agentFilterSlice';
import './AgentFilter.css';

const priceRanges = [
    { value: 1, label: 'Below ₹ 10L', minPrice: 0, maxPrice: 1000000 },
    { value: 2, label: '₹ 10L - ₹ 50L', minPrice: 1000000, maxPrice: 5000000 },
    { value: 3, label: '₹ 50L - ₹ 1Cr', minPrice: 5000000, maxPrice: 10000000 },
    { value: 4, label: '₹ 1Cr - ₹ 5Cr', minPrice: 10000000, maxPrice: 50000000 },
    { value: 5, label: '₹ 5Cr - ₹ 10Cr', minPrice: 50000000, maxPrice: 100000000 },
    { value: 6, label: '₹ 10Cr - ₹ 20Cr', minPrice: 100000000, maxPrice: 200000000 },
    { value: 7, label: 'Above ₹ 20Cr', minPrice: 200000000, maxPrice: 999999999 }
]

const AgentFilter = ({  handleToggleAgentTable, showAgentTable }) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const dispatch = useDispatch();
    const {

        selectedAgentPropertyStatus,
        statusOptions
    } = useSelector(state => state.agentFilter);

    const [homeTypeOptions, setHomeTypeOptions] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [searchAgentProperty, setSearchAgentProperty] = useState('');
       const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const propertyStatusRef = useRef(null);
    // Fetch Property Status Options and Home Type Options on mount if not already loaded
    useEffect(() => {
        if (!statusOptions.length && showAgentTable) {
            dispatch(fetchStatusOptions(bearerToken));
        }
    }, [bearerToken, dispatch, statusOptions.length, showAgentTable]);


    // Fetch Property Status Options and Home Type Options on mount if not already loaded
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
                      dispatch(setSelectedAgentPropertyType(allTypes));
                      setSelectAll(true);
                      setIsInitialized(true); 
                  }
              }
               catch (error) {
                  console.error('Error fetching property home types:', error);
              }
          };
  
          fetchHomeTypes();  // Fetch only if homeTypeOptions is empty
      }, [bearerToken,isInitialized,dispatch]);


    // Toggle dropdown
    const toggleDropdown = (dropdown) => {
        setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
    };

    const handleStatusChange = (status) => {
        dispatch(setSelectedAgentPropertyStatus(status)); // Update Redux with the selected status
        setOpenDropdown(null); // Close the dropdown after selection
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
            dispatch(setSelectedAgentPriceFilter(updatedPriceRanges))
    
        };

            const handlePriceSelectAll = () => {
                if (selectedPriceRanges.length !== priceRanges.length) {
                    // Select all options
                    setSelectedPriceRanges(priceRanges);
                    dispatch(setSelectedAgentPriceFilter(priceRanges));
                } else {
                    // Deselect all options
                    setSelectedPriceRanges([]);
                    dispatch(setSelectedAgentPriceFilter([]));
                }
            }
    

    const handlePropertyTypeChange = (event) => {
            const { value, checked } = event.target;
    
            let updatedTypes;
            if (checked) {
                updatedTypes = [...selectedTypes, value];
            } else {
                updatedTypes = selectedTypes.filter(type => type !== value);
                setSelectAll(false); // Uncheck "Select All" if any type is deselected
            }
    
            setSelectedTypes(updatedTypes);
            dispatch(setSelectedAgentPropertyType(updatedTypes))
    
            // If all options are selected, recheck "Select All"
            if (updatedTypes.length === homeTypeOptions.length) {
                setSelectAll(true);
            }
        };

            const handleSelectAll = () => {
                if (!selectAll) {
                    // Select all options
                    const allTypes = homeTypeOptions.map(option => option.value);
                    setSelectedTypes(allTypes);
                    dispatch(setSelectedAgentPropertyType(allTypes))
        
                } else {
                    // Deselect all options
                    setSelectedTypes([]);
                    dispatch(setSelectedAgentPropertyType([]));
                }
                setSelectAll(!selectAll); // Toggle "Select All" checkbox state
            };

    const handleSearchChange = (e) => {
        setSearchAgentProperty(e.target.value.trimStart()); // Prevent leading spaces
    };

    // Search submit handler
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form behavior
        const trimmedSearch = searchAgentProperty.trim(); // Trim input before dispatching
        dispatch(setSearchFilter(trimmedSearch)); // Dispatch trimmed value to Redux
    };
    const handleClearSearch = () => {
        setSearchAgentProperty(''); // Clear local search input
        dispatch(setSearchFilter('')); // Clear Redux search filter
    };

    const enhancedToggleHandler = () => {
        dispatch(clearAgentFilters());
        setSearchAgentProperty('');  // Clear local search
        dispatch(setSearchFilter('')); 
        handleToggleAgentTable();
    };

    return (
        <div className="filter-bar-unique-component">
            <form className="search-container-unique-component" onSubmit={handleSearchSubmit}>
                <div className="search-input-unique-component">
                    <input
                        type="text"
                        placeholder="Address City, Pin Code"
                        value={searchAgentProperty}
                        onChange={handleSearchChange}
                        aria-label="Search"
                    />


                    {searchAgentProperty && ( // Show clear button only if there is text
                        <button
                            className="clear-button-unique-component"
                            type="button"
                            onClick={handleClearSearch} // Clear search input
                        >
                            <FaTimes />
                        </button>
                    )}
                    <button className="search-button-unique-component" type="submit" aria-label="Search" onClick={handleSearchSubmit}>
                        <FaSearch />
                    </button>
                </div>
            </form>

            <div className="dropdowns-container-unique-component">
                {/* Property Status Dropdown */}
                <div className="dropdown-container-unique-component" ref={propertyStatusRef}>
                    <button
                        className="dropdown-toggle-unique-component"
                        onClick={() => toggleDropdown('propertyStatus')}
                    >
                        <MdBusiness className='fa-home-unique-component' /> {selectedAgentPropertyStatus || 'Status'}
                        <IoChevronDown className="toggleicon-unique-component" />
                    </button>
                    {openDropdown === 'propertyStatus' && (
                        <div className="dropdown-menu-unique-component">
                            {statusOptions.map(option => (
                                <div
                                    key={option.value}
                                    className="dropdown-item-unique-component"
                                    onClick={() => handleStatusChange(option.value)} // Update status on click
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Home Type Dropdown */}
                <div className="dropdown-container-unique-component">
                    <button
                        className="dropdown-toggle-unique-component"
                        onClick={() => toggleDropdown('propertyType')}
                    >
                        <FaHome className='fa-home-unique-component' /> Type
                        <IoChevronDown className="toggleicon-unique-component" />
                    </button>
                    {openDropdown === 'propertyType' && (
                        <div className="dropdown-menu-unique-component multi-select-unique-component">
                            <label className="agent-dropdown-item agentselect-all">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                Select All
                            </label>
                            {homeTypeOptions.map(option =>

                                <label key={option.value} className="dropdown-item-unique-component">
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        checked={selectedTypes.includes(option.value)}
                                        onChange={handlePropertyTypeChange}
                                    />
                                    {option.label}
                                </label>
                            )}
                        </div>
                    )}
                </div>

                {/* Price Range Dropdown */}
                <div className="dropdown-container-unique-component">
                    <button
                        className="dropdown-toggle-unique-component"
                        onClick={() => toggleDropdown('PriceRange')}
                    >
                        <HiCurrencyRupee className='fa-home-unique-component' /> Price Range
                        <IoChevronDown className="toggleicon-unique-component" />
                    </button>
                    {openDropdown === 'PriceRange' && (
                        <div className="dropdown-menu multi-select">
                            <label className="agent-dropdown-item agentselect-all">
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRanges.length === priceRanges.length}
                                    onChange={handlePriceSelectAll}
                                />
                                Select All
                            </label>
                            {priceRanges.map(option => (
                                <label key={option.value} className="agent-dropdown-item1">
                                    <input
                                        type="checkbox"
                                        value={option.value}
                                        checked={selectedPriceRanges.some(range => range.value === option.value)}
                                        onChange={handlePriceRangeSelection}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                      )}
                </div>

                
            </div>

            {/* Submit Button */}
            <button className="showagent-unique-component" onClick={enhancedToggleHandler}>
                {showAgentTable ? 'Agents' : 'Agent Properties'}
            </button>
        </div>
    );
};

export default AgentFilter;
