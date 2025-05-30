import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import './UserSettingsdropdown.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAuthAndPopup } from "../../utils/authUtils";
import { setShowAuthPopup } from "../../Redux/Slices/authPopupSlice"
import { fetchListingsAuthority } from '../../API/api';

const UserSettingsdropdown = ({ handleLogout, onClose }) => {

  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [authority, setAuthority] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchListingsAuthority(bearerToken);
        setAuthority(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bearerToken]);

  const { firstName } = useSelector((state) => state.auth.userDetails || {});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Open dropdown and switch to login tab if no bearer token is present
  useEffect(() => {
    if (!bearerToken) {
      setDropdownOpen(false);
    }
  }, [bearerToken]);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        if (onClose) onClose(); // Close dropdown using the onClose callback
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleDropdown = () => {
    const isAllowed = checkAuthAndPopup({
      token: bearerToken,
      setShowAuthPopup,
      dispatch,
    });

    if (!isAllowed) return; // block dropdown if not logged in

    setDropdownOpen((prev) => !prev);
  };


  const handlenavproject = () => {
    navigate('/addproject');
    setDropdownOpen(false);
  };


  const handlenavOrderImages = () => {
    navigate('/addorderimages');
    setDropdownOpen(false);
  };

  const handlenavcompany = () => {
    navigate('/addcompany');
    setDropdownOpen(false); // Close dropdown after navigation
  };

  return (
    <div className="navbartopdropdown-wrapper" ref={dropdownRef}>
      <FaUser
        className="navbartop-icon"
        onClick={toggleDropdown}
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-label="User settings dropdown"
      />
      {dropdownOpen && bearerToken && (
        <div className="navbartopdropdown-menu">
          <div className='navbaritem-container'>
            <p>{firstName}</p>
            {authority?.[0]?.Authority === "Yes" && (
              <>
                <p onClick={handlenavcompany}>Add Company</p>
                <p onClick={handlenavproject}>Add Project</p>
                <p onClick={handlenavOrderImages}>Add Order Images</p>
              </>
            )}
            <p onClick={handleLogout}>Sign Out</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserSettingsdropdown;
