import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { FaClock, FaEye, FaMapMarkerAlt, FaBed, FaBath, FaHome, FaWarehouse, FaCalendar, FaInfoCircle, FaHeart, FaStar } from 'react-icons/fa';
import { MdSquareFoot, MdLocalFireDepartment, MdAcUnit, MdKitchen, MdBalcony } from 'react-icons/md';
import { RiShareForwardFill } from "react-icons/ri";
import ScheduleTourForm from '../ListingspopupForms/ScheduleTourForm/ScheduleTourForm';
import Requestinfo from '../ListingspopupForms/Requestinfo/Requestinfo';
import Nearbyplacemap from '../Googlemap/Nearbyplacemap/Nearbyplacemap';
import ShareProperty from '../ShareProperty/ShareProperty';
import 'react-datepicker/dist/react-datepicker.css';
import ListingModal from '../ListingModal/ListingModal';
import PropertyGrid from './PropertyGrid';
import './ListingModalDetails.css';

const ListingModalDetails = ({ selectedProperty, propertyCardData, propertyType,propertycount }) => {
   console.log(selectedProperty,"selectedProperty");
  const tabs = [
    { id: 'scheduleVisit', label: 'Schedule Visit' },
    { id: 'requestInfo', label: 'Request Info' },
    { id: 'share', label: `Share ${propertyType}` },
  ];
  const { groupedProperties } = useSelector(
    (state) => state.properties
  );
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [activeTab, setActiveTab] = useState('scheduleVisit');
  const [selectedBedrooms, setSelectedBedrooms] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState(null);

  const features = [
    { icon: <FaHome size={25} />, label: 'Type', value: selectedProperty.PropertyType },
    { icon: <FaCalendar size={25} />, label: 'Year Built', value: selectedProperty.YearBuilt },
    { icon: <MdSquareFoot size={25} />, label: 'SqFt', value: selectedProperty.SqFt },
    { icon: <FaBed size={25} />, label: 'Bedrooms', value: selectedProperty.Bedrooms },
    { icon: <FaBath size={25} />, label: 'Bathrooms', value: selectedProperty.PropertyBathrooms },
    { icon: <FaWarehouse size={25} />, label: 'Facing', value: selectedProperty.PropertyMainEntranceFacing },
    { icon: <FaHome size={25} />, label: 'Furnish', value: selectedProperty.PropertyFurnishing },
    { icon: <FaInfoCircle size={25} />, label: 'Status', value: selectedProperty.PropertyPossessionStatus }
  ];


  const amenitiesdetails = selectedProperty.AmenitiesDetails.split(',').map(amenity => amenity.trim());
  const amenities = [
    { icon: <MdBalcony size={25} />, label: amenitiesdetails[0] },
    { icon: <MdLocalFireDepartment size={25} />, label: amenitiesdetails[1] },
    { icon: <MdAcUnit size={25} />, label: amenitiesdetails[2] },
    { icon: <MdKitchen size={25} />, label: amenitiesdetails[3] }
  ];


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const setSelectedPropertyForDetailHandler = (property) => {
    setSelectedPropertyForDetail(property);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPropertyForDetail(null);
    setShowModal(false);
  };

  const convertToNumber = (value) => {
    let num = parseFloat(value);
    if (value.includes("Cr")) {
      return num * 10000000;
    } else if (value.includes("L")) {
      return num * 100000;
    } else if (value.includes("K")) {
      return num * 1000;
    }
    return num;
  };

  const groupKey = `${selectedProperty.PropertyLatitude ?? selectedProperty.Propertylatitude}_${selectedProperty.PropertyLongitude ?? selectedProperty.Propertylongitude}`;
  const relatedUnits = groupedProperties[groupKey];
  const minMax = relatedUnits?.Amount.reduce(
    (acc, value) => {
      const num = convertToNumber(value);
      if (num < acc.min.value) acc.min = { value: num, original: value };
      if (num > acc.max.value) acc.max = { value: num, original: value };
      return acc;
    },
    {
      min: { value: Infinity, original: null },
      max: { value: -Infinity, original: null },
    }
  );

  const groupedByBedroomsArray = Object.entries(
    relatedUnits?.UnitTypeDetails.reduce((acc, property) => {
      const { Bedrooms } = property;
      if (!acc[Bedrooms]) {
        acc[Bedrooms] = [];
      }
      acc[Bedrooms].push(property);
      return acc;
    }, {}) ?? {}
  ).map(([Bedrooms, properties]) => ({
    Bedrooms: parseInt(Bedrooms, 10),
    properties,
  }));


  // Sort the array by number of bedrooms
  groupedByBedroomsArray.sort((a, b) => a.Bedrooms - b.Bedrooms);
  groupedByBedroomsArray.splice(0, 0, { Bedrooms: 0, properties: relatedUnits?.UnitTypeDetails ?? [] });
  let unitCount = relatedUnits?.UnitTypeDetails?.length ?? 0;

  if (propertyType === 'Property') {
    unitCount = 1;
  }
  return (
    <div className="property-details-container">
      <div className="left-section">
        <div className="listingmodal-header">

          <span className="badge for-sale">
            {selectedProperty.PropertyType}
          </span>
          {/* <span className="property-info">
            &nbsp; <FaClock aria-label="Time since listed" /> &nbsp; 2 months
            ago
          </span> */}
          <span className="property-info">
            <FaEye aria-label="Number of views" /> &nbsp;{" "}
            {propertyType === 'Project' ? selectedProperty.ProjectViewCount : selectedProperty.PropertyViewCount} views
          </span>
          {/* <span className="property-info">
            <RiShareForwardFill aria-label="Number of views" /> &nbsp;{" "}
            {selectedProperty.Shares} Shares
          </span> */}
        </div>

        <div className="listingmodal-container">
          <div className="listingmodal-name">
            <p className="listingmodal-title">
              {selectedProperty.PropertyName}
            </p>
            <p className="property-location">
              <FaMapMarkerAlt aria-label="Location" />{" "}
              {selectedProperty.propertyAddress1}
            </p>
          </div>

          <div className="listingmodal-price">
            {unitCount > 1 && minMax.min.value !== minMax.max.value ? (
              <p>
                ₹ {minMax.min.original} - ₹ {minMax.max.original}
              </p>
            ) : (
              <p>₹ {selectedProperty.Amount}</p>
            )}
            {/* <p>₹ {selectedProperty.Amount}</p> */}
            {/* <span className="price-per-sqft">{formatPrice(9350)}/SqFt</span> */}
          </div>
        </div>

        <h3>Description</h3>
        <p className="property-description">
          {selectedProperty.PropertyDescription}
        </p>

        {propertyType === 'Project' && unitCount > 1 && (

          <div className="bedrooms-tabs">
            <h5>{unitCount} Listings</h5>
            <div>
              {groupedByBedroomsArray.map(({ Bedrooms }) => (
                <button
                  key={Bedrooms}
                  className={`bedroom-tab ${Bedrooms === selectedBedrooms ? "active" : ""
                    }`}
                  onClick={() => setSelectedBedrooms(Bedrooms)}
                  aria-label={`Switch to ${Bedrooms} bedroom tab`}
                >
                  {Bedrooms === 0 ? "All" : Bedrooms + " BHK"}
                </button>
              ))}
            </div>
            <div className="bedroom-tab-details">
             
           <PropertyGrid  
           groupedByBedroomsArray={groupedByBedroomsArray} 
           selectedBedrooms={selectedBedrooms} 
           setSelectedPropertyForDetailHandler={setSelectedPropertyForDetailHandler}/>
            </div>
          </div>
        )}


        <div className="facts-features">
          <h5>Facts and Features</h5>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-item" key={index}>
                {feature.icon && <div className="icon">{feature.icon}</div>}
                <div className="text">
                  <span>{feature.label}</span>
                  <h5>{feature.value}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="amenities">
          <h3>Amenities</h3>
          <div className="amenities-grid">
            {amenities.map((amenity, index) => (
              <div className="amenity-item" key={index}>
                {amenity.icon && (
                  <div className="amenity-icon">{amenity.icon}</div>
                )}{" "}
                &nbsp; &nbsp;
                <div className="text">{amenity.label}</div>
              </div>
            ))}
          </div>
        </div>
        <Nearbyplacemap
          selectedProperty={selectedProperty}
          propertyCardData={propertyCardData}
        />
      </div>

      <div className="right-section">
        <div className="schedule-tour">
          <div className="tour-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tourtab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
                aria-label={`Switch to ${tab.label} tab`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "scheduleVisit" ? (
            <div className="tour-form">
              <ScheduleTourForm />
            </div>
          ) : activeTab === "requestInfo" ? (
            <div className="tour-form">
              <Requestinfo />
            </div>
          ) : activeTab === "share" ? (
            <div className="share-form">
              <ShareProperty />
            </div>
          ) : null}
        </div>
      </div>

      {showModal && selectedProperty && (
        <ListingModal
          propertyType="Property"
          selectedProperty={selectedPropertyForDetail}
          onClose={handleCloseModal}
          bearerToken={bearerToken}
        />
      )}
    </div>
  );
};

export default ListingModalDetails;
