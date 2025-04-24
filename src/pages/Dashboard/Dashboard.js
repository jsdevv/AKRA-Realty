import React, { useEffect, useState } from 'react';
import Dashboardmap from '../../components/Googlemap/Dashboardmap/Dashboardmap';
import AddListings from '../../components/AddListings/AddListings';
import Myproperty from '../../components/Myproperty/Myproperty';
import { setSelectedEditProperty } from '../../Redux/Slices/addListingsSlice';
import { useDispatch } from 'react-redux';
import DashboardProjectFav from '../../components/DashboardProjectFav/DashboardProjectFav';
import DashboardPropertyFav from '../../components/DashboardPropertyFav/DashboardPropertyFav';
import './Dashboard.css';
import { FaChevronDown } from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import Notification from '../notification/Notification';

const Dashboard = () => {
  const [showMap, setShowMap] = useState(false);
  const [selectedPropertyForMap, setSelectedPropertyForMap] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [selectedFavoriteLabel, setSelectedFavoriteLabel] = useState('Favorites');
  const [selectedAlertLabel, setSelectedAlertLabel] = useState('Alerts');

  const dispatch = useDispatch();

  const handleEditClick = (property) => {
    dispatch(setSelectedEditProperty(property));
    setActiveTab('addlistings');
  };

  useEffect(() => {
    // Reset both labels only when going to the main tabs
    if (activeTab === 'properties' || activeTab === 'addlistings') {
      setSelectedFavoriteLabel('Favorites');
      setSelectedAlertLabel('Alerts');
    }
  
    // If switching to Favorites tab only, reset Alerts label
    if (activeTab === 'Property' || activeTab === 'Project') {
      setSelectedAlertLabel('Alerts');
    }
  
    // If switching to Alerts tab only, reset Favorites label
    if (activeTab === 'Buy' || activeTab === 'Sell') {
      setSelectedFavoriteLabel('Favorites');
    }
  }, [activeTab]);
  
  

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Project':
        return <div> <DashboardProjectFav propertyfavtype="Project" /> </div>;
      case 'Property':
        return <div> <DashboardPropertyFav propertyfavtype="Property" /> </div>;
      case 'addlistings':
        return <div> <AddListings /> </div>;
      case 'Buy':
        return <div className='buyalert'><Notification/></div>;
      case 'Sell':
        return <div>Sell Alerts Section</div>;

      case 'properties':
      default:
        return (
          <>
            <Myproperty
              handleEditClick={handleEditClick}
              showMap={showMap}
              setShowMap={setShowMap}
              selectedPropertyForMap={selectedPropertyForMap}
              setSelectedPropertyForMap={setSelectedPropertyForMap}
            />
            {showMap && (
              <div className="dashboard-map-container">
                <Dashboardmap onClose={() => setShowMap(false)} />
              </div>
            )}
          </>
        );
    }
  };
  return (
    <div className="dashboard-container">
      {/* Dashboard section */}

      <div className="dashboard-tabs">
        <div className="dashboard-tab-group-left">
          <p
            className={`dashboard-tab  ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            My Properties
          </p>
          {/* FAVORITES DROPDOWN */}
<Menu as="div" className="relative">
  <Menu.Button className="dashboard-dropdown-toggle">
    {selectedFavoriteLabel} <FaChevronDown className="inline" />
  </Menu.Button>
  <Menu.Items className="dashboard-dropdown-menu">
    <Menu.Item>
      {() => (
        <button
          onClick={() => {
            setActiveTab('Property');
            setSelectedFavoriteLabel('Property Favorite');
          }}
          className={`dashboard-dropdown-item ${activeTab === 'Property' ? 'active' : ''}`}
        >
          Property Favorite
        </button>
      )}
    </Menu.Item>
    <Menu.Item>
      {() => (
        <button
          onClick={() => {
            setActiveTab('Project');
            setSelectedFavoriteLabel('Project Favorite');
          }}
          className={`dashboard-dropdown-item ${activeTab === 'Project' ? 'active' : ''}`}
        >
          Project Favorite
        </button>
      )}
    </Menu.Item>
  </Menu.Items>
</Menu>

{/* ALERTS DROPDOWN */}
<Menu as="div" className="relative">
  <Menu.Button className="dashboard-dropdown-toggle">
    {selectedAlertLabel} <FaChevronDown className="inline" />
  </Menu.Button>
  <Menu.Items className="dashboard-dropdown-menu">
    <Menu.Item>
      {() => (
        <button
          onClick={() => {
            setActiveTab('Buy');
            setSelectedAlertLabel('Buy Alert');
          }}
          className={`dashboard-dropdown-item ${activeTab === 'Buy' ? 'active' : ''}`}
        >
          Buy Alert
        </button>
      )}
    </Menu.Item>
    <Menu.Item>
      {() => (
        <button
          onClick={() => {
            setActiveTab('Sell');
            setSelectedAlertLabel('Sell Alert');
          }}
          className={`dashboard-dropdown-item ${activeTab === 'Sell' ? 'active' : ''}`}
        >
          Sell Alert
        </button>
      )}
    </Menu.Item>
  </Menu.Items>
</Menu>


          <p
            role="tab"
            aria-selected={activeTab === 'addlistings'}
            className={`dashboard-tab add-listing ${activeTab === 'addlistings' ? 'active' : ''}`}
            onClick={() => setActiveTab('addlistings')}
          >
            Add Listing
          </p>

        </div>

        <div className="dashboard-tab-group-right">

        </div>
      </div>
      {renderTabContent()}

    </div>
  );
};

export default Dashboard;
