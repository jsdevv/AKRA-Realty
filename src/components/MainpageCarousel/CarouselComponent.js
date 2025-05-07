import React from 'react';
import { FaShieldAlt, FaChartBar, FaExchangeAlt, FaBriefcase } from 'react-icons/fa'; 
import { MdMoneyOff } from 'react-icons/md';
import './CarouselComponent.css';

const CarouselComponent = () => {
    const items = [
        { icon: <FaExchangeAlt className="carousel-icon" />, text: 'Buy & Sell' },
        { icon: <FaBriefcase className="carousel-icon" />, text: 'Documentation & Legal Services' },
        { icon: <FaChartBar className="carousel-icon" />, text: 'Property Registration' },
        { icon: <MdMoneyOff className="carousel-icon" />, text: 'Mortgage' },
        { icon: <FaShieldAlt className="carousel-icon" />, text: 'Escrow Services' },
        { icon: <FaChartBar className="carousel-icon" />, text: 'Investment & Wealth Management' },
    ];

    return (
        <div className="carousel-wrapper">
            <h2 className="carousel-heading">Services Offered</h2>
            <div className="carousel-box">
                {items.map((item, index) => (
                    <div key={index} className="carousel-item">
                        <div className="carousel-icon">{item.icon}</div>
                        <div className="carousel-text">{item.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselComponent;
