import React, { useState, useEffect } from 'react';
import { FaHeart, FaShareAlt, FaTimes } from 'react-icons/fa';
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from 'react-icons/bs';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ListingModal.css';
// import propertyImages from '../propertyImages/propertyImages';
import { useFavorites } from '../../context/FavoritesContext';
import { fetchPropertiesDetails } from '../../API/api';
import { AiOutlineClose } from 'react-icons/ai';
import ListingModalDetails from '../ListingModalDetails/ListingModalDetails';
import demoimg from "../../images/Villa106.jpeg"
import { useSelector } from 'react-redux';


const ListingModal = ({ selectedProperty, onClose , propertyType}) => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { favorites, toggleFavorite } = useFavorites();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (selectedProperty && bearerToken) {
      fetchPropertyDetails();
    }
  }, [selectedProperty, bearerToken]);

  const fetchPropertyDetails = async () => {
    try {
      const data = await fetchPropertiesDetails(bearerToken, selectedProperty.PropertyID);
      if (data.length > 0) {
        setPropertyDetails(data[0]);
        
      }

    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  if (!selectedProperty || !propertyDetails) {
    return null;
  }

  const isInFavorites = favorites.some(fav => fav.PropertyID === selectedProperty.PropertyID);


  // const imageNames = propertyDetails.ImageNames?.split(',') || [];

  const imageNames = propertyDetails.PropertyImageUrls
  ? propertyDetails.PropertyImageUrls.split(',').map(url => url.trim())
  : propertyDetails.ProjectImageUrls
    ? propertyDetails.ProjectImageUrls.split(',').map(url => url.trim())
    : [];
    const propertyImages = imageNames.map((imageName) => `${imageName}`);
   const handleToggleFavorite = () => {
    toggleFavorite(selectedProperty);
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
  };

  const handleCloseCarousel = () => {
    setShowCarousel(false);
  };

  const handleCloseSharePopup = (event) => {
    event.stopPropagation();
    setShowSharePopup(false);
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalActions">
            {propertyType==='Property' && <button className="actionButton" onClick={handleToggleFavorite}>
            {isInFavorites ? <FaHeart fill="red" /> : <FaHeart />}
            </button>
            }
            <button className="actionButton" onClick={handleShareClick}>
              <FaShareAlt />
            </button>
            <button className="actionButton" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="propertyDetails">
          <div className="imagesContainer">
            {showCarousel ? (
              <div className="carouselContainer">
                <Carousel
                  showArrows={false}
                  selectedItem={carouselIndex}
                  onChange={(index) => setCarouselIndex(index)}
                  showThumbs={false}
                >
                  {propertyImages.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Property ${index + 1}`} />
                    </div>
                  ))}
                </Carousel>
                <button className="closeCarouselButton" onClick={handleCloseCarousel}>
                  <IoCloseCircleSharp />
                </button>
                <div className="customArrows">
                  <button
                    className="customArrow customArrowLeft"
                    onClick={() => setCarouselIndex(carouselIndex - 1)}
                    disabled={carouselIndex === 0}
                  >
                    <BsArrowLeftCircleFill />
                  </button>
                  <button
                    className="customArrow customArrowRight"
                    onClick={() => setCarouselIndex(carouselIndex + 1)}
                    disabled={carouselIndex === propertyImages.length - 1}
                  >
                    <BsArrowRightCircleFill />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mainImageContainer">
                  <img
                    src={propertyImages[0]}
                    alt="Main Property"
                    className="mainPropertyImage"
                    onClick={() => {
                      setCarouselIndex(0);
                      setShowCarousel(true);
                    }}
                  />
                </div>
                <div className="additionalImages">
                  <div className="imageRow">
                    {propertyImages.slice(1, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Additional Property ${index + 1}`}
                        className="additionalPropertyImage"
                        onClick={() => {
                          setCarouselIndex(index + 1);
                          setShowCarousel(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <ListingModalDetails propertyType={propertyType} selectedProperty={propertyDetails} propertyCardData={selectedProperty} />
        </div>
      </div>

      {showSharePopup && (
        <div className="share-popup" onClick={handleCloseSharePopup}>
          <div className="share-popup-content" onClick={e => e.stopPropagation()}>
            <button className="close-icon-button" onClick={handleCloseSharePopup}>
              <AiOutlineClose />
            </button>
            <h3>Share this {propertyType}</h3>
            <div className="share-content">
              <h4>Share on Email</h4>
              <form>
                <div className="input-wrapper">
                  <input type="email" id="email" placeholder="Enter email address" />
                </div>
                <textarea id="message" placeholder="Enter your message"></textarea>
                <button type="submit">Share Mail</button>
              </form>
              <p>Or</p>
              <div className="whatsapp-share">
                <h4>Share on WhatsApp</h4>
                <form>
                  <div className="input-wrapper">
                    <input type="text" id="name" placeholder="Enter name" />
                  </div>
                  <input type="number" id="phone" placeholder="Enter phone number" />
                  <button type="submit">Share WhatsApp</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingModal;
