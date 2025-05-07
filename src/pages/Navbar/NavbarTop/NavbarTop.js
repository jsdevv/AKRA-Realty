import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaTimes, FaChevronUp, FaChevronDown, FaHome, FaRegBell } from 'react-icons/fa'; // Import the close icon
import { MdLocalPhone } from "react-icons/md";
import './NavbarTop.css';
import UserSettingsdropdown from '../../../components/UserSettingsdropdown/UserSettingsdropdown';
import { RiFeedbackFill } from "react-icons/ri";

const NavbarTop = ({ handleLogout, handleLogin, propertyStatusOptions = [], onSelectPropertyStatus }) => {

  const [selecteddefaultStatus, setSelecteddefaultStatus] = useState(null);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (propertyStatusOptions.length > 0 && !selecteddefaultStatus) {
      // Initialize with the first status option if no status is selected
      const defaultStatus = propertyStatusOptions[2];
      setSelecteddefaultStatus(defaultStatus);
      onSelectPropertyStatus(defaultStatus.value);
    }
  }, [propertyStatusOptions, selecteddefaultStatus, onSelectPropertyStatus]);


  const toggleContactForm = () => {
    setContactFormVisible((prevVisible) => !prevVisible);
  };

  const closeContactForm = () => {
    setContactFormVisible(false);
  };

  const handlemoreLinkClick = (link) => {
    setMoreDropdownOpen(!moreDropdownOpen);
  };

  const toggleMoreDropdown = () => {
    setMoreDropdownOpen(!moreDropdownOpen); // Toggle the More dropdown
  };



  return (
    <div className="navbar-top">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/" className="navbar-centerlink"> TREALX </Link>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className={`navbar-centerlink  ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome size={22} className="home-icon" />
        </Link>
        <Link to="/properties" className={`navbar-centerlink ${location.pathname ===  '/properties' ? 'active' : ''}`} >
            Properties
          </Link>
          <Link to="/videos" className={`navbar-centerlink ${location.pathname ===  '/videos' ? 'active' : ''}`} >Videos</Link>
        <Link to="/Dashboard" className={`navbar-centerlink ${location.pathname ===  '/Dashboard' ? 'active' : ''}`}>
          Dashboard
        </Link>
     
        <Link to="/services" className={`navbar-centerlink ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
        <Link to="/addlistings" className={`navbar-centerlink ${location.pathname ===  '/addlistings' ? 'active' : ''}`}>
          Add Listings
        </Link>
        {/* More Dropdown */}
        <div className="navbar-more" ref={dropdownRef}>
          <span className="more-link" onClick={toggleMoreDropdown}>
            More &nbsp;{moreDropdownOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15}  />}
          </span>
          {moreDropdownOpen && (
            <div className="more-dropdown">

              <Link
                to="/offers"
                className={`navbar-centerlink ${location.pathname ===  '/offers' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('offers')}
              >
                Offers
              </Link>
              <Link
                to="/learnings"
                className={`navbar-centerlink ${location.pathname === '/learning' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('learning')}
              >
                Learnings
              </Link>

              {/* <Link
                to="/blogs"
                className={`navbar-centerlink ${location.pathname === '/blogs' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('blogs')}
              >
                Blogs
              </Link> */}

              <Link
                to="/listedagents"
                className={`navbar-centerlink ${location.pathname === '/listedagents' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('listedagents')}
              >
                 Agents Listing
              </Link>

            </div>
          )}
        </div>

  
      </div>
      <div className="navbar-right">
        <Link to='/investors'
          className={`nav-link1 ${location.pathname === '/investors' ? 'active' : ''}`}
      
        >Investors Club</Link>

        <Link to="/favorites"
          className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
      
        >
          <FaHeart className="favorite-icon" />
        </Link>
        <Link to="/Notification"
          className={`nav-link ${location.pathname === '/Notification' ? 'active' : ''}`}
      
        >
          <FaRegBell className="favorite-icon" />
        </Link>

        <Link
          to="/feedback"
          className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
        >
          <RiFeedbackFill  className="favorite-icon"/>
        </Link>

        <Link className='nav-link'>
          <MdLocalPhone className="favorite-icon" onClick={toggleContactForm} />
        </Link>
        <div className="navbartopdropdown-wrapper">
          <UserSettingsdropdown handleLogout={handleLogout} handleLogin={handleLogin} />
          <div className={`navcontact-form ${contactFormVisible ? 'visible' : ''}`}>
            <FaTimes className="contact-form-close" onClick={closeContactForm} />
            <h3>Contact Us</h3>
            <form>
              <div>
                <label>Name:</label>
                <input type="text" name="name" />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" />
              </div>
              <div>
                <label>Phone No:</label>
                <input type="number" name="phone" />
              </div>
              <div>
                <label>Message:</label>
                <textarea name="message"></textarea>
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTop;
