import React, { useState, useMemo } from 'react';
import { FaTimes, FaShareAlt, FaSortAmountDownAlt } from 'react-icons/fa';
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
    { 
      Header: 'Size (SqFt)', 
      accessor: 'SqFt',
      Cell: ({ row }) => 
        row.original.MinSqFt && row.original.MaxSqFt
          ? `${row.original.MinSqFt} - ${row.original.MaxSqFt} SqFt`
          : row.original.SqFt || '-'
    },
    {
      Header: 'Price',
      accessor: 'Amount',
      Cell: ({ row }) => {
        const {Amount, MinPrice, MaxPrice } = row.original;
        if (MinPrice && MaxPrice) return `₹ ${MinPrice} - ₹ ${MaxPrice}`;
        if (MinPrice) return `₹ ${MinPrice}`;
        if (MaxPrice) return `₹ ${MaxPrice}`;
        return `₹ ${Amount}` || '-';
      }
    },    
    {
      Header: 'Bedrooms',
      accessor: 'Bedrooms',
      Cell: ({ row }) => {
        const { MinBedrooms, MaxBedrooms, Bedrooms } = row.original;
        if (MinBedrooms && MaxBedrooms) return `${MinBedrooms} - ${MaxBedrooms}`;
        if (MinBedrooms) return MinBedrooms;
        if (MaxBedrooms) return MaxBedrooms;
        return Bedrooms || '-';
      }
    },    
    { 
      Header: 'Bathrooms', 
      accessor: 'PropertyBathrooms',
      Cell: ({ row }) => 
        row.original.MinBathrooms && row.original.MaxBathrooms
          ? `${row.original.MinBathrooms} - ${row.original.MaxBathrooms}`
          : row.original.PropertyBathrooms || '-'
    },
    { Header: 'Status', accessor: 'PropertyStatus' },
    {
      Header: 'Facing',
      accessor: 'PropertyFacings',
      Cell: ({ row }) => {
        const { PropertyFacings, PropertyMainEntranceFacing } = row.original;
        return PropertyFacings || PropertyMainEntranceFacing || '-';
      }
    },    
    { Header: 'Year Built', accessor: 'YearBuilt', Cell: ({ row }) => row.original.PropertyYear || row.original.YearBuilt || '-' },
    { Header: 'Rental Estimate', accessor: 'RentalEstimateAmount', Cell: ({ row }) => row.original.RentalEstimateAmount || '-' },
    { Header: 'Yearly Growth (%)', accessor: 'YearlyGrowthPercentage', Cell: ({ row }) => row.original.yearlyGrowthPercentage || row.original.YearlyGrowthPercentage || '-' },
    { Header: 'No. of Units', accessor: 'Units', Cell: ({ row }) => row.original.Units || row.original.NumberOfUnits || '-' },
    { Header: 'Price Per SqFt', accessor: 'PricePerSqFt', Cell: ({ row }) => row.original.PricePerSqFt || '-' },
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
