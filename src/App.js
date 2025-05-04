import React, { useState, useCallback, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from './context/FavoritesContext';
import LoginForm from "../src/pages/Authpage/Login/LoginForm"
import NavbarTop from './pages/Navbar/NavbarTop/NavbarTop';
import Agent from './pages/Agent/Agent';
import MainInvestors from '../src/pages/MainInvestors/MainInvestors';
import Listings from './components/Listings/Listings';
import Services from './components/Services/Services';
import NavbarBottom from './pages/Navbar/NavbarBottom/NavbarBottom';
import { setSearchTerm, setSelectedPropertyStatus, setSelectedHomeTypes, setPriceFilter } from '../src/Redux/Slices/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import FeedbackWidget from './components/FeedbackWidget/FeedbackWidget';
import Feedback from './pages/Feedback/Feedback';
import { clearBearerToken, setBearerToken } from './Redux/Slices/authSlice';
import Notification from './pages/notification/Notification';
import ForgotPassword from './pages/Authpage/ForgotPassword/ForgotPassword';
import RegisterForm from './pages/Authpage/RegisterForm/RegisterForm';
import ResetPasswordForm from './pages/Authpage/ResetPasswordForm/ResetPasswordForm';
import AddListings from './components/AddListings/AddListings';
import Dashboard from './pages/Dashboard/Dashboard';
import Owner from './components/Owner/Owner';
import AddProject from './components/AddProject/AddProject';
import Addcompany from './components/AddCompany/AddCompany';
import Videos from './pages/Videos/Videos';
import Favorites from './pages/Favorites/Favorites';
import { ToastContainer } from 'react-toastify';
import PropertiesListing from './components/PropertiesListing/PropertiesListing';
import HeroPage from './pages/HeroPage/HeroPage';
import { TypesenseProvider } from './components/PropertiesListing/context/TypesenseContext';
import Authpopup from './components/Authpopup/Authpopup';
import { handleProtectedRoute, validateAndSetToken } from './utils/authUtils';
import {setShowAuthPopup} from "./Redux/Slices/authPopupSlice"
import AddOrderImages from './components/AddOrderImages/AddOrderImages';


const ConditionalNavbarBottom = ({
  onSelectPropertyStatus,
  onSelectHomeTypes,
  onPriceFilterChange,
  handleClearSearch,
  searchInput,
  setSearchInput,
  handleSearchInputChange,
  handleSearchSubmit
}) => {
  const location = useLocation();
 
  const shouldDisplayNavbarBottom = ['/', '/home', '/owner', "/properties", "/about", '/addproject',"/addorderimages",
                                      "/addcompany", '/listedagents', '/addlistings', '/forgot-password', '/passwordreset', '/register', 
                                       '/Notification', '/feedback', '/favorites', '/agents', '/services', '/investors', '/sell']
                                       .includes(location.pathname);

  return !shouldDisplayNavbarBottom ?
    <NavbarBottom
      onSelectPropertyStatus={onSelectPropertyStatus}
      onSelectHomeTypes={onSelectHomeTypes}
      onPriceFilterChange={onPriceFilterChange}
      handleSearchSubmit={handleSearchSubmit}
      handleClearSearch={handleClearSearch}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      handleSearchInputChange={handleSearchInputChange}
    /> : null;
};

const ProtectedRoute = ({ children, setShowAuthPopup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const result = handleProtectedRoute({
      token: bearerToken,
      location,
      navigate,
      setShowAuthPopup,
      dispatch
    });
    setIsAllowed(result);
    setChecked(true);
  }, [bearerToken, location, navigate, setShowAuthPopup,dispatch]);

  if (!checked) return null;

  return isAllowed ? children : null;
};


const App = () => {
  // const [showAuthPopup, setShowAuthPopup] = useState(false);
  const showAuthPopup = useSelector((state) => state.authPopup.showAuthPopup);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state) => state.properties);

  const handlePriceFilterChange = useCallback((minPrice, maxPrice) => {
    dispatch(setPriceFilter({ minPrice, maxPrice }));
  }, [dispatch]);

  // Initialize QueryClient
  const queryClient = new QueryClient();

  const bearerToken = useSelector((state) => state.auth.bearerToken);

  useEffect(() => {
    validateAndSetToken(dispatch, setIsLoggedIn);
  }, [dispatch]);
  
  const handleLogin = (token) => {
    dispatch(setBearerToken(token));
    setIsLoggedIn(true); // Mark as logged in
    dispatch(setShowAuthPopup(false));
  };

  const handleLogout = () => {
    dispatch(clearBearerToken());
    setIsLoggedIn(false);
    dispatch(setShowAuthPopup(false));
    navigate('/');
  };

  const handleSearchInputChange = (e, { newValue = '' }) => {
    setSearchInput(newValue);
  };

  const handleSearchmainpageChange = ({ target: { value } }) => {
    setSearchInput(value); // Destructuring target to directly get value
  };

  const handlePopupClose = () => {
    dispatch(setShowAuthPopup(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();  // Prevents form from submitting and reloading the page
    dispatch(setSearchTerm(searchInput));  // Dispatch the search term to Redux
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setSearchTerm(''));
  };

  return (
    <TypesenseProvider>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />

        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>

            <NavbarTop handleLogout={handleLogout} handleLogin={handleLogin} />

            {!window.location.pathname.includes('/properties') && <ConditionalNavbarBottom
              onSelectPropertyStatus={(status) => dispatch(setSelectedPropertyStatus(status))}
              onSelectHomeTypes={(types) => dispatch(setSelectedHomeTypes(types))}
              onPriceFilterChange={handlePriceFilterChange}
              searchTerm={searchTerm}
              handleSearchSubmit={handleSearchSubmit}
              handleClearSearch={handleClearSearch}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearchInputChange={handleSearchInputChange}

            />}
            <Routes>

              <Route
                path="/"
                element={

                  <HeroPage
                    isLoggedIn={isLoggedIn}
                    handleLogin={handleLogin}
                    handleLogout={handleLogout}
                    searchTerm={searchTerm}
                    handleSearchSubmit={handleSearchSubmit}
                    handleClearSearch={handleClearSearch}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handleSearchmainpageChange={handleSearchmainpageChange}
                  />
                }
              />
              <Route
                path="/login"
                element={<LoginForm onLogin={handleLogin} />}
              />
              <Route
                 path="/properties" 
                 element={<PropertiesListing  setShowAuthPopup={setShowAuthPopup}  />} />
              <Route path="/Dashboard"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />


              <Route path="/videos"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Videos />
                  </ProtectedRoute>
                } />

              <Route path="/favorites"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Favorites />
                  </ProtectedRoute>
                } />
                
                
              <Route
                path="/listedagents"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Agent />
                  </ProtectedRoute>
                } />

              <Route
                path="/feedback"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Feedback />
                  </ProtectedRoute>
                } />

              <Route
                path='/investors'
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <MainInvestors />
                  </ProtectedRoute>
                } />

              <Route
                path="/Notification"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <Notification />
                  </ProtectedRoute>
                } />

              <Route
                  path="/addlistings"
                element={
                  <ProtectedRoute setShowAuthPopup={setShowAuthPopup}>
                    <AddListings />
                  </ProtectedRoute>
                } />

              <Route path="/services" element={<Services />} />
              <Route path="/owner" element={<Owner />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/passwordreset" element={<ResetPasswordForm />} />
              <Route path="/addproject" element={<AddProject />} />
              <Route path="/addcompany" element={<Addcompany />} />
              <Route path="/addorderimages" element={<AddOrderImages />} />

            </Routes>
            <FeedbackWidget bearerToken={bearerToken} />

          </QueryClientProvider>
        </FavoritesProvider>

        {showAuthPopup && (
          <div className="popup-backdrop">
            <Authpopup handlePopupClose={handlePopupClose} />
          </div>
        )}


      </div >
    </TypesenseProvider>

  );
};

export default App;
