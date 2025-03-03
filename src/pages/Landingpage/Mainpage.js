import React from 'react';
import './Mainpage.css';
import { FaSearch } from 'react-icons/fa';
import CarouselComponent from '../../components/MainpageCarousel/CarouselComponent';
import { useNavigate } from 'react-router-dom';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import CustomerSupport from '../../components/CustomerSupport/CustomerSupport';

const Mainpage = ({  searchInput, handleSearchSubmit, handleSearchmainpageChange }) => {
   
    const navigate = useNavigate();

    const handlenavlistings = (e) => {
        e.preventDefault();
        handleSearchSubmit(e);
        navigate('/properties');
    };

    const handleViewListings = () => {
        navigate('/properties');
    };

    return (
        <>
            <div className="mainpage-container">
            
                <div className="landing-section">
                    <div className="landing-content">
                        {/* Left Section: Text */}
                        <div className="text-container">
                            <span className="small-text">Simple, Smart & Accessible</span>
                            <div className="bold-text">
                                <span className="bold-line">Real Estate</span>
                                <span className="bold-line1">Made Simple & Transparent</span>
                            </div>
                            <h5>Find Your Dream Home & Property In The Best Location</h5>
                            <form onSubmit={handleSearchSubmit}>
                                <div className="mainpage-search">
                                    <input
                                        type="text"
                                        placeholder="Enter an address or city"
                                        className="search-field"
                                        value={searchInput}
                                        onChange={handleSearchmainpageChange}
                                    />
                                    <button className="search-icon11" onClick={handlenavlistings}>
                                        <FaSearch />
                                    </button>
                                    <button
                                        className="view-listings-button"
                                        onClick={handleViewListings}
                                    >
                                        View Listings
                                    </button>
                                </div>
                            </form>
                        </div>

    
                    </div>
                </div>
            </div>

            <div className="carousel-mainpage">
                <CarouselComponent />
            </div>

            <div>
                <CustomerSupport />
            </div>

            <div>
                <WhyChooseUs />
            </div>

            <footer className="footer">
                <p>Copyright © 2024 Powered By AKRA Realty. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Mainpage;
