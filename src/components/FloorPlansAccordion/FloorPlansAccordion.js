import React, { useState, useRef, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import './FloorPlansAccordion.css';
import floor1 from "../../../src/assets/floor1.jpg"

const FloorPlansAccordion = ({selectedProperty}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [contentHeight, setContentHeight] = useState({});
  const contentRefs = useRef([]);

  const floorPlans = [
    {
      floor: 'First Floor',
      image: floor1,
    },
    {
      floor: 'Second Floor',
      image: floor1,
    },
    {
      floor: 'Third Floor',
      image: floor1,
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    // Set heights of all accordion contents for animation
    const heights = floorPlans.reduce((acc, _, index) => {
      acc[index] = contentRefs.current[index]?.scrollHeight || 0;
      return acc;
    }, {});
    setContentHeight(heights);
  }, []);

  return (
    <div className="accordion">
      {floorPlans.map((plan, index) => (
        <div key={index} className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(index)}>
            <div className="floor-info">
              <h3>{plan.floor}</h3>
              <p>Beds: {selectedProperty.Bedrooms} | Baths: {selectedProperty.PropertyBathrooms} | Sqft: {selectedProperty.PropertyArea}</p>
            </div>
            <span>{activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}</span>
          </div>
          <div
            className="accordion-content"
            ref={(el) => (contentRefs.current[index] = el)}
            style={{
              maxHeight: activeIndex === index ? `${contentHeight[index]}px` : '0px',
            }}
          >
            <img src={plan.image} alt={`${plan.floor} Plan`} className="floor-image" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloorPlansAccordion;
