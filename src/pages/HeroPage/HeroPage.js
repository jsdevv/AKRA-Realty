import React from 'react';
import './HeroPage.css';
import CarouselComponent from '../../components/MainpageCarousel/CarouselComponent';
import { useNavigate } from 'react-router-dom';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import hero1 from "../../pictures for front page/2.png"
import hero2 from "../../pictures for front page/Investors picture.png"
import hero3 from "../../pictures for front page/Image (3).jpeg"
import Aboutus from '../../components/Aboutus/Aboutus';
import Slider from 'react-slick';
import CustomerSupport from '../../components/CustomerSupport/CustomerSupport';
import { motion } from "framer-motion";
import WhatWeServe from '../../components/WhatWeServe/WhatWeServe';
import Autocomplete from '../../components/PropertiesListing/components/Autocomplete';

const HeroPage = () => {
    const slides = [
        { img: hero3, title: "Find Dream Home", subtitle: "Comfort meets elegance" },
        { img: hero1, title: "Luxury Living", subtitle: "Modern designs, premium locations" },
        { img: hero2, title: "Invest Smart", subtitle: "Properties with high ROI" }
    ];


    const navigate = useNavigate();


    const handleViewListings = () => {
        navigate('/properties');
    };


    return (
        <>
            <div className="landpage-container">

                <div className="homelanding">
                    {/* Left Section: Text */}
                    <div className="text-container">
                        <span className="small-text">Smart & Accessible</span>
                        <div className="landbold-text">
                            <span className="landbold-line">Real Estate Experience<br /> made <span style={{ color: "#a38937" }}>Simple</span> & <span style={{ color: "#a38937" }}>Transparent</span>.</span> <br /> <br />
                        </div>

                        <div className="Unique-text">
                            A Unique Platform in India that Integrates <span style={{ color: "#a38937" }}>Technology<span style={{ color: "#121212" }}>,</span> Real Estate <span style={{ color: "#121212" }}>&</span> Investment Services</span>
                            <br /> creating a Global Network of Buyers, Sellers, Investors, and Service Providers.
                        </div>

                        <div className='dreamhome'>


                            <p>Discover Your Dream Home and Investment Opportunities</p>

                        </div>

                        <div className='dreamhome'>
                            <div className="landpage-search">

                                <Autocomplete herosearch={true} />

                            </div>

                            <button
                                className="landview-listings-button"
                                onClick={handleViewListings}
                                type="button"
                            >
                                View Properties
                            </button>

                        </div>

                    </div>

                    {/* Right Section: Image */}
                    <div className="image-container">
                        <Slider
                            className="custom-slick-slider"
                            dots={false}
                            infinite={true}
                            autoplay={true}
                            autoplaySpeed={3500}
                            speed={900}
                            slidesToShow={1}
                            slidesToScroll={1}
                            arrows={false}
                            fade={true}

                        >
                            {slides.map((slide, index) => (
                                <div key={index} className="slide-wrapper">
                                    <img src={slide.img} alt={`Slide ${index + 1}`} className="hero-image" />

                                    <motion.div
                                        className="slide-text"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        key={index} // Ensure animation runs on each slide
                                    >
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.8 }}
                                        >
                                            {slide.title}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.8 }}
                                        >
                                            {slide.subtitle}
                                        </motion.p>
                                    </motion.div>
                                </div>
                            ))}

                        </Slider>

                    </div>

                </div>

                <div className="hero-stats">
                    <div className="landstat-box">
                        <h2>8K+</h2>
                        <p>Properties</p>
                    </div>
                    <div className="landstat-box">
                        <h2>100+</h2>
                        <p>Agents</p>
                    </div>
                    <div className="landstat-box">
                        <h2>6K+</h2>
                        <p>Investors</p>
                    </div>
                    <div className="landstat-box">
                        <h2>3K+</h2>
                        <p>NRIs</p>
                    </div>
                </div>
            </div>
            <div className='aboutland'>
                <Aboutus />
            </div>
            <div>
                <WhatWeServe />
            </div>

            <div className="carousel-heropage">
                <CarouselComponent />
            </div>

            <div>
                <CustomerSupport />
            </div>

            <div>
                <WhyChooseUs />
            </div>

            <footer className="footer">
                <p>Copyright © 2025 Powered By TREALX. All rights reserved.</p>
            </footer>
        </>
    );
};

export default HeroPage;
