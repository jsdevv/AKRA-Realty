import React from 'react';
import './Aboutus.css'; // Import the CSS file
import aboutImage from '../../assets/14.png'; // Update the image path accordingly

const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-image">
        <img src={aboutImage} alt="About TREALX" />
      </div>
      <div className="aboutus-content">
        <h2>About Us</h2>
        <p>
          TREALX is a platform to Buy, Sell, and Invest in Real Estate in Telangana and Andhra Pradesh, ensuring seamless and transparent transactions for Indian Residents and NRIs.
        </p>
        <p>
          We offer free property listings and end-to-end assistance on your real estate journey – from finding the right property to facilitating the paperwork and registration.
        </p>
        <p>
          Our Investor Club offers a platform for Investors, Builders, HNIs, and NRIs to discover Investment Opportunities and Partnerships.
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
