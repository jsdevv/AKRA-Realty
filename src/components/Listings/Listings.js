import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProperties,
  setCurrentPage,
  setSelectedProperty,
  clearSelectedProperty,
  fetchPremiumListingsThunk,
  setListingFilters,
} from "../../Redux/Slices/propertySlice";
import Pagination from "../Pagination/Pagination";
import { MoonLoader } from "react-spinners";
import ListingModal from "../ListingModal/ListingModal";
import Listingsmap from "../Listingsmap/Listingsmap";
import Slider from "react-slick/lib/slider";
import defaultimg1 from "../../images/Apartment102.jpeg"
import defaultimg2 from "../../images/Apartment103.jpeg"
import "./Listings.css";
import FavoriteIcon from "../FavoriteIcon/FavoriteIcon";

const Listings = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [showModal, setShowModal] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const dispatch = useDispatch();
  const {
    properties,
    premiumListings,
    selectedProperty,
    loading,
    error,
    searchTerm,
    selectedPropertyStatus,
    selectedcustomStatus,
    selectedHomeTypes,
    priceFilter,
    currentPage,
    itemsPerPage,
    showPremiumListings,
    mapBounds,
    mapCircleBounds,
    mapPolygonBounds,
    visibleProperties,
    groupedProperties
  } = useSelector((state) => state.properties);

  useEffect(() => {
    if (bearerToken && !loading && properties.length === 0) {
      dispatch(fetchProperties(bearerToken));
    }
  }, [bearerToken, loading, properties.length, dispatch]);

  useEffect(() => {
    if (bearerToken && showPremiumListings && !premiumListings.length) {
      dispatch(fetchPremiumListingsThunk(bearerToken));
    }
  }, [bearerToken, dispatch, showPremiumListings, premiumListings.length]);

  // Use useEffect to dispatch filtered properties
  useEffect(() => {
    dispatch(setListingFilters());
    setIsFiltering(false); // Update filtering status
  }, [
    searchTerm,
    selectedPropertyStatus,
    selectedcustomStatus,
    selectedHomeTypes,
    priceFilter,
    showPremiumListings,
    mapBounds,
    mapCircleBounds,
    mapPolygonBounds, dispatch]);

  const handlePropertyClick = useCallback(
    (property) => {
      dispatch(setSelectedProperty(property));
      setShowModal(true);
    },
    [dispatch]
  );

  const handlePropertymodalopen = useCallback(
    (property) => {
      dispatch(setSelectedProperty(property));
      // setShowModal(true);
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => {
    dispatch(clearSelectedProperty());
    setShowModal(false); // Close modal
  }, [dispatch]);

  const handlePageClick = useCallback(
    (data) => {
      const selectedPage = data.selected;
      dispatch(setCurrentPage(selectedPage));
    },
    [dispatch]
  );

  //Reset the current page to 0 when the filters change
  useEffect(() => {
    dispatch(setCurrentPage(0));
  }, [groupedProperties, dispatch]);

  const offset = currentPage * itemsPerPage;
  const currentItems = useMemo(
    () => Object.values(groupedProperties).slice(offset, offset + itemsPerPage),
    [groupedProperties, offset, itemsPerPage]
  );

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

  if (loading) {
    return (
      <div className="spinnerContainer">
        <MoonLoader color="#3498db" size={70} />
      </div>
    );
  }
  if (error) return <p>Error loading properties.</p>;
  return (
    <div>
      <div className="container">
        <div className="propertyListContainer">
          <div className="propertyListHeader">
            <h2>Property Listings</h2>
            <p>
              {Object.keys(groupedProperties).length} {selectedPropertyStatus} properties
              available
            </p>
          </div>
          {isFiltering ? (
            <div className="spinnerContainer">
              <MoonLoader color="#3498db" size={70} />
            </div>
          ) : (
            <div>
              <div className="propertyList">
                {currentItems.map((property) => {

                  const propertyUnit = property.UnitTypeDetails[0];

                  const propertyUrls = propertyUnit.ProjectImageUrls ?? propertyUnit.PropertyImageUrls;
                  const imageUrls = propertyUrls ? propertyUrls.split(',').map(url => url.trim()) : [];

                  const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg1, defaultimg2];
                  const propertyName = propertyUnit.PropertyName;
                  const minMax = property.Amount.reduce(
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

                  const minMaxBedrooms = property.Bedrooms.reduce(
                    (acc, value) => {
                      const num = parseFloat(value);
                      if (num < acc.min.value) acc.min = { value: num, original: value };
                      if (num > acc.max.value) acc.max = { value: num, original: value };
                      return acc;
                    },
                    {
                      min: { value: Infinity, original: null },
                      max: { value: -Infinity, original: null },
                    }
                  );

                  const minMaxSqft = property.Area.reduce(
                    (acc, value) => {
                      const num = parseFloat(value);
                      if (num < acc.min.value) acc.min = { value: num, original: value };
                      if (num > acc.max.value) acc.max = { value: num, original: value };
                      return acc;
                    },
                    {
                      min: { value: Infinity, original: null },
                      max: { value: -Infinity, original: null },
                    }
                  );

                  const propertyAmount = minMax.min.value !== minMax.max.value ? `₹ ${minMax.min.original} - ₹ ${minMax.max.original}` : `₹ ${minMax.min.original}`;
                  const propertyBathrooms = minMaxBedrooms.min.value !== minMaxBedrooms.max.value ? `${minMaxBedrooms.min.original} - ${minMaxBedrooms.max.original} BHK` : `${minMaxBedrooms.min.original} BHK`;
                  const propertySqft = minMaxSqft.min.value !== minMaxSqft.max.value ? `${minMaxSqft.min.value} - ${minMaxSqft.max.original}` : `${minMaxSqft.min.original}`;
                  const settings = {
                    // dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                  };
                  const propertyDetails = [propertyUnit.PropertyType, propertyBathrooms, propertySqft].filter(x => x).join(" | ");
                  const line3 = propertyUnit.PropertyCardLine3.split('|').map(x => x.trim()).filter(x => x).join(" | ");
                  return (
                    <div
                      key={propertyUnit.PropertyID}
                      className="propertyCard"
                      tabIndex="0"
                      aria-label={`View details of ${propertyName}`}
                    >
                      {/* Favorite Icon Added Above Image */}
                      <FavoriteIcon
                       groupproperty={property}
                       PropertyCount={property.PropertyCount} 
                        />
                      <div className="propertyImages">
                        <div className="slide-wrapper">
                          <Slider {...settings}>
                            {imagesToShow.map((url, index) => (
                              <div key={index}
                                onClick={() => handlePropertymodalopen(propertyUnit)}>
                                <img
                                  src={url}
                                  alt={`Slide ${index + 1}`}
                                  className="propertyImage"
                                  loading="lazy"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            ))}

                          </Slider>
                        </div>
                      </div>
                      <div className="propertyDetails"
                        onClick={() => handlePropertymodalopen(propertyUnit)}>
                        <div className="listing-container">
                          <h3>
                            {propertyName}
                            <br />
                            {propertyAmount} {" "} {" "}
                          </h3>
                          <span className="listcount">{property.PropertyCount} Units</span>
                        </div>

                        <p>{propertyDetails} {line3 && <><br />{line3}</>}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Pagination
                pageCount={Math.ceil(Object.keys(groupedProperties).length / itemsPerPage)}
                handlePageClick={handlePageClick}
                currentPage={currentPage}
              />
            </div>
          )}
          {showModal && selectedProperty && (
            <ListingModal
              propertyType="Project"
              selectedProperty={selectedProperty}
              onClose={handleCloseModal}
              bearerToken={bearerToken}
            />
          )}
        </div>
        <div className="mapContainer">
          <Listingsmap
            handlePropertyClick={handlePropertyClick}
            bearerToken={bearerToken}
          />
        </div>
      </div>
    </div>
  );
};

export default Listings;
