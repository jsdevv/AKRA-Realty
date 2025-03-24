import React, { useState } from 'react';
import Dashboardmap from '../../components/Googlemap/Dashboardmap/Dashboardmap';
import DashboardFavorites from '../../components/DashboardFavorites/DashboardFavorites';
import AddListings from '../../components/AddListings/AddListings';
import Myproperty from '../../components/Myproperty/Myproperty';
import './Dashboard.css';
import { setSelectedEditProperty } from '../../Redux/Slices/addListingsSlice';
import { useDispatch } from 'react-redux';
import DashboardProjectFav from '../../components/DashboardProjectFav/DashboardProjectFav';
import DashboardPropertyFav from '../../components/DashboardPropertyFav/DashboardPropertyFav';

const Dashboard = () => {
  const [showMap, setShowMap] = useState(false);
  const [selectedPropertyForMap, setSelectedPropertyForMap] = useState(null);
  const [activeTab, setActiveTab] = useState('properties'); 
   const [isEditing, setIsEditing] = useState(false);
   const dispatch = useDispatch();

      const handleEditClick = (property) => {
          dispatch(setSelectedEditProperty(property)); 
          // setIsEditing(true);
          console.log("Edit Property:", property);
          setActiveTab('addlistings');
      };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
        case 'favorites':
         return <div> <DashboardFavorites /> </div>; 
        case 'Project':
         return <div> <DashboardProjectFav propertyfavtype = "Project" /> </div>;
        case 'Property':
         return <div> <DashboardPropertyFav propertyfavtype = "Property"  /> </div>; 
        case 'addlistings':
         return <div> <AddListings /> </div>; 
        case 'alerts':
          return <div>Alerts Section</div>; 
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
            className={`dashboard-tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            My Properties
          </p>
          {/* <p
            className={`dashboard-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
           My Favorites
          </p> */}
          
          <p
            className={`dashboard-tab ${activeTab === 'Project' ? 'active' : ''}`}
            onClick={() => setActiveTab('Project')}
          >
           Project Favorites
          </p>

          <p
            className={`dashboard-tab ${activeTab === 'Property' ? 'active' : ''}`}
            onClick={() => setActiveTab('Property')}
          >
           Property Favorites
          </p>
     
     
        <p
            className={`dashboard-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </p>

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
