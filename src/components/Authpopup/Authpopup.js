import React, { useState } from 'react';
import LoginForm from '../../pages/Authpage/Login/LoginForm';
import RegisterForm from '../../pages/Authpage/RegisterForm/RegisterForm';
import ForgotPassword from '../../pages/Authpage/ForgotPassword/ForgotPassword';
import './Authpopup.css';

const Authpopup = ({ handlePopupClose }) => {
  const [currentTab, setCurrentTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
    setShowForgotPassword(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setCurrentTab('login');
  };

  return (
    <div className="authpopup-overlay">
      <div className="authpopup-modal">
        <button className="authpopup-close-btn" onClick={handlePopupClose}>
          &times;
        </button>

        <nav className="navbartopdropdown-tabs">
          <span
            role="button"
            tabIndex={0}
            className={`navbartopdropdown-item ${currentTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
            onKeyDown={(e) => e.key === 'Enter' && handleTabSwitch('login')}
          >
            Login
          </span>
          <span
            role="button"
            tabIndex={0}
            className={`navbartopdropdown-item ${currentTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
            onKeyDown={(e) => e.key === 'Enter' && handleTabSwitch('register')}
          >
            Register
          </span>
        </nav>

        {currentTab === 'login' && (
          <>
            {showForgotPassword ? (
              <>
                <ForgotPassword toggleForgotPassword={() => setShowForgotPassword(false)} />
                <button onClick={handleBackToLogin} className="back-to-login-btn">
                  Back to Login
                </button>
              </>
            ) : (
              <LoginForm
                handleLogin={handlePopupClose}
                toggleForgotPassword={() => setShowForgotPassword(true)}
              />
            )}
          </>
        )}

        {currentTab === 'register' && <RegisterForm />}
      </div>
    </div>
  );
};

export default Authpopup;
