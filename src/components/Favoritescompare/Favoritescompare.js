import React, { useState, useMemo } from 'react';
import { FaTimes, FaShareAlt } from 'react-icons/fa';
import './Favoritescompare.css';
import ShareProperty from '../ShareProperty/ShareProperty';
import defaultimg from "../../images/Apartment102.jpeg"

const Favoritescompare = ({ properties, onClose }) => {
  console.log(properties,"table");
  const [isShareOpen, setIsShareOpen] = useState(false);

  const columns = useMemo(() => [
    {
      Header: 'Overview',
      accessor: 'ImageNames',
      Cell: ({ row }) => {
        const { PropertyImageUrls, ProjectImageUrls, PropertyName,PropertyCardLine2,PropertyCardLine3 } = row.original;
        const imageUrls = PropertyImageUrls?.split(',').map((url) => url.trim()) || ProjectImageUrls?.split(',').map((url) => url.trim()) || [];
        const imageSrc = imageUrls.length > 0 ? imageUrls[0] : defaultimg;
        
        return (
          <div className="fav-comparison-image">
            <img src={imageSrc} alt="Property" />
            <div className="compare-details">
              <div className="compare-name-price">
                <p className="compare-name">{PropertyName}</p>
              </div>
              <span className="compare-location">
                {PropertyCardLine2} <br/> {PropertyCardLine3}
              </span>
            </div>
          </div>
        );
      },
    },
    { Header: 'Property Type', accessor: 'PropertyType' },
    { Header: 'Size', accessor: 'SqFt' },
    { Header: 'Price', accessor: 'Amount' },
    { Header: 'Bed Rooms', accessor: 'PropertyBedrooms' },
    { Header: 'Bath Rooms', accessor: 'PropertyBathrooms' },
    { Header: 'Status', accessor: 'PropertyStatus' },
    { Header: 'Facing', accessor: 'propertymainentrancefacing' },
    { Header: 'Year', accessor: 'YearBuilt' },
    { Header: 'Rental Estimate', accessor: 'RentalEstimateAmount' },
    { Header: 'Yearly Growth %', accessor: 'YearlyGrowthPercentage' },
    { Header: 'No Of Units', accessor: 'NumberOfUnits' }, 
  ], []);

  
  // Open/close the share options
  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

  return (
    <div className="comparison-modal">
      <div className="comparison-modal-content">
        <div className="modal-header">
          <div className="comparison-modal-title">Comparison</div>
          <div className="modal-actions">
            {/* Share Icon */}
            <button className="comparison-modal-share" onClick={handleShareClick}>
              <FaShareAlt />
            </button>
            {/* Share Options Modal */}
            {isShareOpen && (
              <div className='favcompare-share'>
                    <ShareProperty/>
              </div>
                
            )}
            {/* Close Icon */}
            <button className="comparison-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="favcomparison-wrapper">
          <table className="favcomparison-table">
            <thead>
            
            </thead>
            <tbody>
            {columns.map((column) => (
              <tr key={column.accessor}>
                <td>{column.Header}</td>
                {properties.map((property, idx) => (
                  <td key={idx}>
                    {column.Cell ? column.Cell({ row: { original: property } }) : property[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Favoritescompare;
