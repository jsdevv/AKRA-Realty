import React from 'react';
import { Range, getTrackBackground } from 'react-range';
import './InvestorFilter.css';

const MIN = 1;
const MAX = 50;

const MIN_RENTAL = 20000;
const MAX_RENTAL = 4000000;
const step = 1;
const growthOptions = ['0-10%', '11-20%', '21-30%', '31-40%', '40+%'];
const Invitations = ['CEO', 'FilmClub','Sports','NRIs', 'Doctors', 'Business', 'Executives', 'IAS/IPS', 'Politicians', 'Judicial'];

const InvestorFilter = ({
  isInvitationMode,
  priceRange,
  setPriceRange,
  rentalRange,
  setRentalRange,
  selectedGrowth,
  setSelectedGrowth,
  selectedRisk,
  setSelectedRisk,
  selectedUseType,
  setSelectedUseType,
  selectinvitaionType,
  setSelectinvitaionType

}) => {
  // Handle checkbox selection
  const handleCheckboxChange = (setter, label) => {
    setter((prevSelected) => {
      if (prevSelected.includes(label)) {
        // Remove the label if already selected
        return prevSelected.filter((item) => item !== label);
      } else {
        // Add the label if not selected
        return [...prevSelected, label];
      }
    });
  };

  return (
    <div className="filter-component">
      {/* Price Range Filter */}
      <div className="row progress-bar-row">
        <div className="progress-bar-container">
          <label>Price Range</label>
          <div className="slider-container">
            <Range
              step={step}
              min={MIN}
              max={MAX}
              values={priceRange}
              onChange={setPriceRange}
              renderTrack={({ props, children }) => (
                <div
                  ref={props.ref}
                  style={{
                    ...props.style,
                    position: 'relative',
                    left: '8px',
                    height: '4px',
                    width: '90%',
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ['#ccc', '#007bff', '#ccc'],
                      min: MIN,
                      max: MAX,
                    }),
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '12px',
                    width: '12px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    border: '1px solid #222',
                    cursor: 'pointer',
                  }}
                />
              )}
            />
            <div className="price-values">
              <span>₹ {priceRange[0]} Cr</span>
              <span>₹ {priceRange[1]} Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Display Based on Invitation Mode */}
      {isInvitationMode ? (
        <>
          {/* Invitations */}
          <div className="row checkboxes-row">
            <span>Invitations</span>
            <div className="checkbox-group">
            {Invitations.map((label, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectinvitaionType.includes(label)}
                    onChange={() => handleCheckboxChange(setSelectinvitaionType, label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Risk Status */}
          <div className="row checkboxes-row">
            <span>Risk Status</span>
            <div className="checkbox-group">
              {['Low', 'Medium', 'High', 'High-Risk'].map((label, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRisk.includes(label)}
                    onChange={() => handleCheckboxChange(setSelectedRisk, label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Growth % */}
          <div className="row checkboxes-row">
            <span>Growth %</span>
            <div className="checkbox-group">
              {growthOptions.map((label, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedGrowth.includes(label)}
                    onChange={() => handleCheckboxChange(setSelectedGrowth, label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Rental Amount */}
          <div className="row progress-bar-row">
            <div className="progress-bar-container">
              <label>Rental Amount</label>
              <div className="slider-container">
                <Range
                  step={step}
                  min={MIN_RENTAL}
                  max={MAX_RENTAL}
                  values={rentalRange}
                  onChange={setRentalRange}
                  renderTrack={({ props, children }) => (
                    <div
                      ref={props.ref}
                      style={{
                        ...props.style,
                        position: 'relative',
                        left: '8px',
                        height: '4px',
                        width: '90%',
                        background: getTrackBackground({
                          values: rentalRange,
                          colors: ['#ccc', '#007bff', '#ccc'],
                          min: MIN_RENTAL,
                          max: MAX_RENTAL,
                        }),
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '12px',
                        width: '12px',
                        backgroundColor: '#007bff',
                        borderRadius: '50%',
                        border: '1px solid #222',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                />
                <div className="price-values">
                  <span>₹ 20k</span>
                  <span>₹ 40L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Use Type */}
          <div className="row checkboxes-row">
            <span>Use Type</span>
            <div className="checkbox-group1">
              {['Villas','Rental','Apartments',  'Independent House', 'Office Building',  'Food Drive',  'LandExchange', 'Office Building', 'Restaurant', 'Retail', 'Shopping Mall', 'Hospital', 'Entertainment', 'College', 'Convention'].map(
                (label, index) => (
                  <label key={index} className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUseType.includes(label)}
                      onChange={() => handleCheckboxChange(setSelectedUseType, label)}
                    />
                    {label}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Risk Status */}
          <div className="row checkboxes-row">
            <span>Risk Status</span>
            <div className="checkbox-group">
              {['Low', 'Medium', 'High', 'High-Risk'].map((label, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedRisk.includes(label)}
                    onChange={() => handleCheckboxChange(setSelectedRisk, label)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestorFilter;
