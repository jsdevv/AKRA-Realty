import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VideoSlider.css";

const VideoSlider = ({ properties, selectedPropertyVideo, onPropertyClick }) => {
  const sliderSettings = {
    dots: false,
    infinite: false, // Infinite scroll only if more than 6 videos
    speed: 350,
    slidesToShow: properties.length < 6 ? properties.length : 6, // If less videos, only show that many
    slidesToScroll: 1,
    arrows: properties.length > 2, // Hide arrows if too few videos
    centerMode: false, // This prevents unwanted centering
    variableWidth: false, // Ensure consistent slide widths
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: properties.length < 8 ? properties.length : 8,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: properties.length < 6 ? properties.length : 6,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: properties.length < 3 ? properties.length : 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: properties.length < 2 ? properties.length : 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="property-slider-wrapper">
      <div className="property-slider">
        <Slider {...sliderSettings}>
          {properties.map((property) => (
            <div key={property.id} className="property-video-slide">
              <div
                className={`property-video-card ${
                  selectedPropertyVideo?.id === property.id ? "active" : ""
                }`}
                onClick={() => onPropertyClick(property)}
              >
                <img
                  src={`https://img.youtube.com/vi/${property.videoId}/mqdefault.jpg`}
                  alt={property.title}
                  className="property-video-thumbnail"
                  loading="lazy"
                />
                <p>{property.title}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default VideoSlider;
