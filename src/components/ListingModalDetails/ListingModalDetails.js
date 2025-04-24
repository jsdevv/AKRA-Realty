import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { FaEye, FaMapMarkerAlt, FaBed, FaBath, FaHome, FaWarehouse, FaCalendar, FaInfoCircle } from 'react-icons/fa';
import { MdSquareFoot, MdLocalFireDepartment, MdAcUnit, MdKitchen, MdBalcony } from 'react-icons/md';
import ScheduleTourForm from '../ListingspopupForms/ScheduleTourForm/ScheduleTourForm';
import Requestinfo from '../ListingspopupForms/Requestinfo/Requestinfo';
import Nearbyplacemap from '../Googlemap/Nearbyplacemap/Nearbyplacemap';
import ShareProperty from '../ShareProperty/ShareProperty';
import 'react-datepicker/dist/react-datepicker.css';
import ListingModal from '../ListingModal/ListingModal';
import PropertyGrid from './PropertyGrid';
import './ListingModalDetails.css';

const ListingModalDetails = ({ selectedProperty, propertyCardData, propertyType, propertyToOpen }) => {

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
  let relatedUnits = groupedProperties[groupKey];
  let unitCount = 0;
  let minMax = {min:{value:Infinity,original:null},max:{value:-Infinity,original:null}};
  let groupedByBedroomsArray = [];

  if (propertyToOpen) {
    const originalMinMaxFormatted = propertyToOpen.formattedAmount
      .split("-")
      .map((value) => value.trim());
    minMax = {
      min: {
        value: propertyToOpen.minAmount,
        original: originalMinMaxFormatted[0],
      },
      max: {
        value: propertyToOpen.maxAmount,
        original: originalMinMaxFormatted[1],
      },
    };
    unitCount = propertyToOpen.found;
    relatedUnits = {
      UnitTypeDetails: propertyToOpen.relatedUnits.map((f) => {
        f.Bedrooms = f.bedrooms;
        f.PropertyBathrooms = f.propertyBathrooms;
        f.SqFt = f.sqFt + "";
        f.PropertyType = f.propertyType;
        f.PropertyMainEntranceFacing = f.propertyMainEntranceFacing;
        f.Amount = f.formattedAmount;
        f.PropertyID = f.propertyID;
        return f;
      }),
    };
  } else {
    unitCount = relatedUnits?.UnitTypeDetails?.length ?? 0;
    minMax = relatedUnits?.Amount.reduce(
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
    
  }

  // First group by Bedrooms
  const groupedByBedroomsMap =
  relatedUnits?.UnitTypeDetails.reduce((acc, property) => {
    const { Bedrooms } = property;
    const normalizedBedrooms = isNaN(parseFloat(Bedrooms))
      ? 0
      : parseFloat(Bedrooms);

    if (!acc[normalizedBedrooms]) {
      acc[normalizedBedrooms] = [];
    }
    acc[normalizedBedrooms].push(property);

    return acc;
  }, {}) ?? {};

// Convert grouped object to array
groupedByBedroomsArray = Object.entries(groupedByBedroomsMap)
  .map(([Bedrooms, properties]) => ({
    Bedrooms: parseFloat(Bedrooms, 10),
    properties,
  }))
  .sort((a, b) => a.Bedrooms - b.Bedrooms);

// ✅ Filter out Bedrooms === 0 (avoid double "All")
groupedByBedroomsArray = groupedByBedroomsArray.filter(
  (group) => group.Bedrooms !== 0
);

// ✅ Unique properties from Bedrooms === 0 group
const uniqueProperties = (groupedByBedroomsMap["0"] || []).reduce(
  (accum, current) => {
    if (!accum.some((item) => item.PropertyID === current.PropertyID)) {
      accum.push(current);
    }
    return accum;
  },
  []
);

// ✅ Add back a grouped item with Bedrooms: 0 (representing "All")
groupedByBedroomsArray.unshift({
  Bedrooms: 0,
  properties: uniqueProperties,
});

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

          <span className="property-info">
            <FaEye aria-label="Number of views" /> &nbsp;{" "}
            {unitCount === 1 ? selectedProperty.PropertyViewCount : selectedProperty.ProjectViewCount} views
          </span>
    
        </div>

        <div className="listingmodal-container">
          <div className="listingmodal-name">
            <p className="listingmodal-title">
              {selectedProperty.PropertyName}
            </p>
            <p className="property-location">
              <FaMapMarkerAlt aria-label="Location" />{" "}
              {selectedProperty.Locality}, {selectedProperty.ZipCode}
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
                setSelectedPropertyForDetailHandler={setSelectedPropertyForDetailHandler} />
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
        {/* <Nearbyplacemap
          selectedProperty={selectedProperty}
          propertyCardData={propertyCardData}
        />  */}
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
          propertyToOpen={propertyToOpen}
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
