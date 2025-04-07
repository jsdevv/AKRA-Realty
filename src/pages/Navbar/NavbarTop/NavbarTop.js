import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

  const handleLinkClick = (link) => {
    setActiveLink(link); // Update active link state

  };


  const handlemoreLinkClick = (link) => {
    setActiveLink(link); // Update active link state
    setMoreDropdownOpen(!moreDropdownOpen);
  };

  const toggleMoreDropdown = () => {
    setMoreDropdownOpen(!moreDropdownOpen); // Toggle the More dropdown
  };



  return (
    <div className="navbar-top">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/"
            className={`navbar-centerlink  ${activeLink === 'logo' ? 'active' : ''}`}
            onClick={() => handleLinkClick('logo')}
          >
            {/* <img src={logo} alt="logo" /> */}
            TREALX
          </Link>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/"
          className={`navbar-centerlink ${activeLink === 'home' ? 'active' : ''}`}
          onClick={() => handleLinkClick('home')} >
          <FaHome size={22} className="home-icon" />
        </Link>
        <Link to="/properties"
          className={`navbar-centerlink ${activeLink === 'properties' ? 'active' : ''}`}
          onClick={() => handleLinkClick('properties')}>
          Properties
        </Link>
        <Link to="/Dashboard"
          className={`navbar-centerlink ${activeLink === 'Dashboard' ? 'active' : ''}`}
          onClick={() => handleLinkClick('Dashboard')}>
          Dashboard
        </Link>
        <Link to="/videos"
          className={`navbar-centerlink ${activeLink === 'videos' ? 'active' : ''}`}
          onClick={() => handleLinkClick('videos')}
        >Videos</Link>
        <Link to="/services"
          className={`navbar-centerlink ${activeLink === 'services' ? 'active' : ''}`}
          onClick={() => handleLinkClick('services')}
        >Services</Link>
              <Link
          to="/addlistings"
          className={`navbar-centerlink ${activeLink === 'addlistings' ? 'active' : ''}`}
          onClick={() => handleLinkClick('addlistings')}>
          Add Listings
        </Link>
        {/* More Dropdown */}
        <div className="navbar-more" ref={dropdownRef}>
          <span className="more-link" onClick={toggleMoreDropdown}>
            More&nbsp;{moreDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
          {moreDropdownOpen && (
            <div className="more-dropdown">

              <Link
                to="/offers"
                className={`navbar-centerlink ${activeLink === 'offers' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('offers')}
              >
                Offers
              </Link>
              <Link
                to="/learnings"
                className={`navbar-centerlink ${activeLink === 'learning' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('learning')}
              >
                Learnings
              </Link>
              <Link
                to="/blogs"
                className={`navbar-centerlink ${activeLink === 'blogs' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('blogs')}
              >
                Blogs
              </Link>

              <Link
                to="/listedagents"
                className={`navbar-centerlink ${activeLink === 'listedagents' ? 'active' : ''}`}
                onClick={() => handlemoreLinkClick('listedagents')}
              >
                Listed Agents
              </Link>

            </div>
          )}
        </div>

  
      </div>
      <div className="navbar-right">
        <Link to="/investors"
          className={`nav-link1 ${activeLink === 'investors' ? 'active' : ''}`}
          onClick={() => handleLinkClick('investors')}
        >Investors Club</Link>

        <Link to="/favorites"
          className={`nav-link ${activeLink === 'favorites' ? 'active' : ''}`}
          onClick={() => handleLinkClick('favorites')}
        >
          <FaHeart className="favorite-icon" />
        </Link>
        <Link to="/Notification"
          className={`nav-link ${activeLink === 'notification' ? 'active' : ''}`}
          onClick={() => handleLinkClick('notification')}
        >
          <FaRegBell className="favorite-icon" />
        </Link>

        <Link
          to="/feedback"
          className={`nav-link ${activeLink === 'feedback' ? 'active' : ''}`}

          onClick={() => handleLinkClick('feedback')}
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
