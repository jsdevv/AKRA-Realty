import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import './UserSettingsdropdown.css';
import LoginForm from '../../pages/Authpage/Login/LoginForm';
import RegisterForm from '../../pages/Authpage/RegisterForm/RegisterForm';
import ForgotPassword from "../../pages/Authpage/ForgotPassword/ForgotPassword";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserSettingsdropdown = ({ handleLogout, handleLogin }) => {

  const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { firstName } = useSelector((state) => state.auth.userDetails  || {}); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState('login');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Open dropdown and switch to login tab if no bearer token is present
  useEffect(() => {
    if (!bearerToken) {
      setDropdownOpen(true);
      setCurrentTab('login');
    }
  }, [bearerToken]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      if (!prev) setCurrentTab('login');
      return !prev;
    });
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword((prevState) => !prevState);
  };

  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
    setShowForgotPassword(false); // Reset forgot password when switching tabs
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Only close dropdown if there is a bearerToken (logged in)
        if (bearerToken) {
          setDropdownOpen(false);
        }
      }
    };

    if (!bearerToken) {
      // If there's no bearerToken, keep dropdown open when clicking outside
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // If there's a bearerToken, close dropdown on outside click
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bearerToken]);

  // Close the dropdown after a successful login
  const handleLoginAndClose = async (credentials) => {
    await handleLogin(credentials); // Perform login
    setDropdownOpen(false); // Close dropdown
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false); // Switch back to login form
    setCurrentTab('login');
  };

  const handlenavproject = () => {
    navigate('/addproject');
  }

  const handlenavcompany = () => {
    navigate('/addcompany');
  }

  return (
    <div className="navbartopdropdown-wrapper" ref={dropdownRef}>
      <FaUser
        className="navbartop-icon"
        onClick={toggleDropdown}
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-label="User settings dropdown"
      />
      {dropdownOpen && (
        <div className="navbartopdropdown-menu">
          {bearerToken ? (
           <div className='navbaritem-container'>
             <p>{firstName}</p>
           
            <p onClick={handlenavcompany}>Add Company</p>
            <p onClick={handlenavproject}>Add Project</p>
           <p onClick={handleLogout}>Sign Out</p>
         </div>
          ) : (
            <>
              <div className="navbartopdropdown-tabs">
                <span
                  className={`navbartopdropdown-item ${currentTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('login')}
                >
                  Login
                </span>
                <span
                  className={`navbartopdropdown-item ${currentTab === 'register' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('register')}
                >
                  Register
                </span>
              </div>
              {currentTab === 'login' && (
                <div>
                  {showForgotPassword ? (
                    <>
                        <ForgotPassword toggleForgotPassword={toggleForgotPassword} />
                        <button onClick={handleBackToLogin} className="back-to-login-btn">
                           Back to Login
                        </button>
                    </>
       
                  ) : (
                    
                      <LoginForm handleLogin={handleLoginAndClose} toggleForgotPassword={toggleForgotPassword} />
           
                  )}
                </div>
              )}
              {currentTab === 'register' && <RegisterForm />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSettingsdropdown;
