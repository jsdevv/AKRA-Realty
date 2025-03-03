import React from 'react';
import { MdClose } from 'react-icons/md'; // Importing React Icon
import './InvestorDetailsbutton.css';

const InvestorDetailsbutton = ({ property, onClose }) => {
  const imageURL = require(`../../images/${property.ImageNames}`);
  console.log(property, "prop");

  const locationInfo = [
    { label: 'UseType', value: property.UseType },
    { label: 'Status', value: property.PropertyStatus },
    { label: 'City', value: property.PropertyCity },
    { label: 'State', value: property.PropertyState },
    { label: 'Size (SqFt)', value: property.SqFt },
  ];

  return (
    <div className="investor-details-button__container">
      <img 
        className="investor-details-button__image" 
        src={imageURL} 
        alt={property.PropertyName} 
      />
      <h2 className="investor-details-button__title">{property.PropertyName}</h2>
      <p className="investor-details-button__description">{property.PropertyDescription}</p>

      <div className="investor-details-button__location-group">
        {locationInfo.map((info, index) => (
          <p key={index} className="investor-details-button__location">
            <strong>{info.label}:</strong> {info.value}
          </p>
        ))}
      </div>

      {/* Close Icon */}
      <div className="investor-details-button__close-icon" onClick={onClose}>
        <MdClose size={30} />
      </div>
    </div>
  );
};

export default InvestorDetailsbutton;
