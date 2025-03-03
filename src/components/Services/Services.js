import React, { useState } from 'react';
import './Services.css'; // Import the CSS file
import { FaBriefcase, FaExchangeAlt, FaFileSignature, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import { MdMoneyOff } from 'react-icons/md'; // Added different icons

const mainservices = [
    {
        icon: <FaExchangeAlt className="service-icon buying" />,
        heading: 'Buy & Sell',
        content: 'Experience seamless buying and selling with AKRA Realty. Discover properties, connect with experts, and enjoy a stress-free real estate journey.'
    },
    {
        icon: <FaBriefcase className="service-icon home" />,
        heading: 'Documentation & Legal services',
        content: 'AKRA Realty provides comprehensive documentation and legal services, ensuring smooth transactions by managing contracts, compliance, and paperwork with expert care.'
    },
    {
        icon: <FaFileSignature  className="service-icon escrow" />,
        heading: 'Property Registration',
        content: 'AKRA Realty simplifies property registration, ensuring compliance and accuracy while guiding you through the process for a seamless experience.'
    },
    {
        icon: <MdMoneyOff className="service-icon mortgage" />,
        heading: 'Mortgage',
        content: 'AKRA Realty simplifies the mortgage process, offering personalized guidance on pre-approval, applications, and securing the best rates for your dream home.'
    },
    {
        icon: <FaShieldAlt className="service-icon selling" />,
        heading: 'Escrow Services',
        content: 'AKRA Realty ensures smooth transactions with expert escrow services, safeguarding funds and documents while providing transparency and peace of mind.'
    },
    {
        icon: <FaMoneyBillWave  className="service-icon" />,
        heading: 'Investment & Wealth Management',
        content: 'AKRA Realty offers expert investment and wealth management services, providing strategic guidance to maximize your real estate portfolio and financial growth.'
    },

];

const Services = () => {
   
    return (
        <>
         

            <div className="services-wrapper">
                <h1 className="services-title">Services Offered</h1>
    
                <div className="services-grid">
                    {mainservices.map((service, index) => (
                        <div key={index} className="service-box">
                            <div className="service-icon">{service.icon}</div>
                            <div className="service-heading">{service.heading}</div>
                            <div className="service-content">{service.content}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="servicefooter">
                <p>Copyright © 2024 Powered By AKRA Realty. All rights reserved.</p>
            </div> */}
        </>
    );
}

export default Services;
