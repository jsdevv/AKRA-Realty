import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import "./Mypropertymodal.css";
import { useSelector } from "react-redux";

const Mypropertymodal = ({ isOpen, onClose }) => {
  const { selectedProperty } = useSelector((state) => state.properties);
  
  if (!selectedProperty) return <></>; // Prevent errors if property is null

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="myproperty-modal-content"
      overlayClassName="myproperty-modal-overlay"
      ariaHideApp={false}
      closeTimeoutMS={300}
    >
      <div className="myproperty-modal-header">
        <h4>More Details</h4>
        <button className="myproperty-close-button" onClick={onClose}>✖</button>
      </div>

      <table className="myproperty-modal-table">
        <thead>
          <tr>
            <th>Property Value</th>
            <th>Purchase Price</th>
            <th>Growth %</th>
            <th>Rental Amount</th>
            <th>Rental %</th>
            <th>Y o Y%</th>
            <th>Avg Closing Days</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedProperty.PropertyValue}</td>
            <td>{selectedProperty.PurchasePrice}</td>
            <td>{selectedProperty.GrowthPercentage}</td>
            <td>{selectedProperty.RentalAmount}</td>
            <td>{selectedProperty.RentalPercentage}</td>
            <td>{selectedProperty.RentalGrowthPercentage}</td>
            <td>{selectedProperty.RentalGrowthPercentage}</td>
            <td>{selectedProperty.RentalGrowthPercentage}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

Mypropertymodal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Mypropertymodal;
