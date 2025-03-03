import React, { useState } from 'react';
import Investor from '../../components/Investor/Investor';
import InnerCircle from '../../components/InnerCircle/InnerCircle';
import WealthManagement from '../../components/WealthManagement/WealthManagement';
import CrowdFund from '../../components/CrowdFund/CrowdFund';
import { useSelector } from 'react-redux';

const MainInvestors = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [currentView, setCurrentView] = useState('investors');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderComponent = () => {
    switch (currentView) {
      case 'investors':
        return <Investor bearerToken={bearerToken} handleViewChange={handleViewChange} />;
      case 'innercircle':
        return <InnerCircle bearerToken={bearerToken} handleViewChange={handleViewChange} />;
      case 'wealthmanagement':
        return <WealthManagement bearerToken={bearerToken} handleViewChange={handleViewChange}  />;
      case 'fractionalinvestments':
        return <CrowdFund bearerToken={bearerToken} handleViewChange={handleViewChange}  />;
      default:
        return <Investor bearerToken={bearerToken} handleViewChange={handleViewChange} />;
    }
  };

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default MainInvestors;
