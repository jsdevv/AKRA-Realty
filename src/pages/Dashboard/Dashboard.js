import React, { useState } from 'react';
import Dashboardmap from '../../components/Googlemap/Dashboardmap/Dashboardmap';
import DashboardFavorites from '../../components/DashboardFavorites/DashboardFavorites';
import AddListings from '../../components/AddListings/AddListings';
import Myproperty from '../../components/Myproperty/Myproperty';
import { setSelectedEditProperty } from '../../Redux/Slices/addListingsSlice';
import { useDispatch } from 'react-redux';
import DashboardProjectFav from '../../components/DashboardProjectFav/DashboardProjectFav';
import DashboardPropertyFav from '../../components/DashboardPropertyFav/DashboardPropertyFav';
import './Dashboard.css';

const Dashboard = () => {
  const [showMap, setShowMap] = useState(false);
  const [selectedPropertyForMap, setSelectedPropertyForMap] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const dispatch = useDispatch();

  const handleEditClick = (property) => {
    dispatch(setSelectedEditProperty(property));
    setActiveTab('addlistings');
  };

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
        return <div>Buy Alerts Section</div>;
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



          <div className="dashboard-tab-dropdown-container">
            <select
              className="dashboard-tab-dropdown"
              value={activeTab === 'Property' || activeTab === 'Project' ? activeTab : ''}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="">Favorites</option>
              <option value="Property">Property Favorite</option>
              <option value="Project">Project Favorite</option>
            </select>
          </div>



          <div className="dashboard-tab-dropdown-container">
            <select
              className="dashboard-tab-dropdown"
              value={activeTab === 'Buy' || activeTab === 'Sell' ? activeTab : ''}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="">Alerts</option>
              <option value="Buy">Buy Alert</option>
              <option value="Sell">Sell Alert</option>
            </select>
          </div>


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
