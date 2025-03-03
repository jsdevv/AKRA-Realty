import React from 'react';
import { MdClose } from "react-icons/md";
import './InvestorCompare.css'; 

const InvestorCompare = ({ selectedProperties, closePopup }) => {
  return (
    <div className="investorpopup-overlay">
      <div className="investorcomparepopup-content">
        <button onClick={closePopup} className="close-button">
            <MdClose />
        </button>
        <h2>Compare Properties</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th></th>
                {selectedProperties.map((property) => {
                   const imageURL = require(`../../images/${property.ImageNames}`);
                  return (
                 <th key={property.PropertyID}>
                 <div className="propertypopup-header">
                   <img src={imageURL} alt={property.PropertyName} className="propertypopup-image" />
                   <div>{property.PropertyName}</div>
                 </div>
               </th>
                )})}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>{property.Amount}</td>
                ))}
              </tr>
              <tr>
                <td>PropertyStatus</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>{property.PropertyStatus}</td>
                ))}
              </tr>

              <tr>
                <td>Area in Sqft</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>{property.SqFt}</td>
                ))}
              </tr>

              <tr>
                <td>PropertyType</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>{property.PropertyType}</td>
                ))}
              </tr>
              <tr>
                <td>Bedrooms</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>3</td>
                ))}
              </tr>
              <tr>
                <td>Bathrooms</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>4</td>
                ))}
              </tr>
              <tr>
                <td>Parking features</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>Available</td>
                ))}
              </tr>
              <tr>
                <td>State</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>{property.PropertyState}</td>
                ))}
              </tr>
              <tr>
                <td>Year built</td>
                {selectedProperties.map((property) => (
                  <td key={property.PropertyID}>2024</td>
                ))}
              </tr>
            
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestorCompare;
