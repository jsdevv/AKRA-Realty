import React, { useState, useCallback, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from './context/FavoritesContext';
import LoginForm from "../src/pages/Authpage/Login/LoginForm"
import NavbarTop from './pages/Navbar/NavbarTop/NavbarTop';
import Mainpage from './pages/Landingpage/Mainpage';
import Agent from './pages/Agent/Agent';
import MainInvestors from '../src/pages/MainInvestors/MainInvestors';
import Services from './components/Services/Services';
import Listings from './components/Listings/Listings';
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
  const shouldDisplayNavbarBottom = ['/','/home','/owner', '/addproject', '/listedagents','/addlistings', '/forgot-password','/passwordreset', '/register', '/Notification', '/feedback', '/favorites', '/agents', '/services', '/investors', '/sell'].includes(location.pathname);

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

const App = () => {
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
    // Check if token exists in localStorage to persist login state
    const token = localStorage.getItem('bearerToken');
    if (token) {
      dispatch(setBearerToken(token));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [dispatch]);


  const handleLogin = (token) => {
    dispatch(setBearerToken(token));
    setIsLoggedIn(true); // Update login state
    navigate('/'); // Redirect to mainpage
  };

  const handleLogout = () => {
    dispatch(clearBearerToken());
    setIsLoggedIn(false); // Reset login state
    navigate('/'); // Redirect to login
  };

  const handleSearchInputChange = (e, { newValue = '' }) => {
    setSearchInput(newValue);
  };

  const handleSearchmainpageChange = ({ target: { value } }) => {
    setSearchInput(value); // Destructuring target to directly get value
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
    <div className="App">

      <FavoritesProvider>
        <QueryClientProvider client={queryClient}>

          <NavbarTop handleLogout={handleLogout} handleLogin={handleLogin} />

          <ConditionalNavbarBottom 
            onSelectPropertyStatus={(status) => dispatch(setSelectedPropertyStatus(status))}
            onSelectHomeTypes={(types) => dispatch(setSelectedHomeTypes(types))}
            onPriceFilterChange={handlePriceFilterChange}
            searchTerm={searchTerm}
            handleSearchSubmit={handleSearchSubmit}
            handleClearSearch={handleClearSearch}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearchInputChange={handleSearchInputChange}

          />
          <Routes>

            <Route
              path="/"
              element={

                <Mainpage
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
              element={ <LoginForm onLogin={handleLogin} />}
            />
            <Route
              path="/properties"
              element={
                isLoggedIn ? (
                  <Listings bearerToken={bearerToken} handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/services"
              element={
                isLoggedIn ? (
                  <Services bearerToken={bearerToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/favorites" element={isLoggedIn ? (<Favorites bearerToken={bearerToken} />) : (
              <Navigate to="/" />
            )} />
            <Route
              path="/listedagents"
              element={
                isLoggedIn ? (
                  <Agent bearerToken={bearerToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/feedback"
              element={
                isLoggedIn ? (
                  <Feedback bearerToken={bearerToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/investors"
              element={
                isLoggedIn ? (
                  <MainInvestors bearerToken={bearerToken} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/Notification"
              element={
                isLoggedIn ? (
                  <Notification />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
             <Route path="/owner" element={<Owner />} />  
             <Route path="/dashboard" element={<Dashboard />} />    
            <Route path="/addlistings" element={<AddListings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/passwordreset" element={<ResetPasswordForm />} />
            <Route path="/addproject" element={<AddProject />} />
            <Route path="/addcompany" element={<Addcompany />} />
            <Route path="/videos" element={<Videos />} />
          
          </Routes>
          <FeedbackWidget bearerToken={bearerToken} />

        </QueryClientProvider>
      </FavoritesProvider>

    </div >
  );
};

export default App;
