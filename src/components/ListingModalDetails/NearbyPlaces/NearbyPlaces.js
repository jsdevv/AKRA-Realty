import React, { useState } from "react";
import "./NearbyPlaces.css"; 
import Restaurent from "../../../images/Restaruent1.jpg";
import school from "../../../images/school.jpg";

const placesData = [
  {
    category: "Restaurants",
    items: [
      {
        name: "Bacchanal Buffet - Temporarily Closed",
        address: "3570 S Las Vegas Blvd, Las Vegas, NV 89109",
        image: Restaurent,
        reviews: 120,
        rating: 5,
      },
      {
        name: "Bacchanal Buffet - Temporarily Closed",
        address: "3084 S Highland Dr, Ste C",
        image: Restaurent,
        reviews: 120,
        rating: 4,
      },
      {
        name: "Bacchanal Buffet - Temporarily Closed",
        address: "3570 S Las Vegas Blvd, Las Vegas, NV 89109",
        image: Restaurent,
        reviews: 120,
        rating: 5,
      },
    ],
  },
  {
    category: "Education",
    items: [
      {
        name: "Oakridge International School",
        address: "3570 S Las Vegas Blvd, Las Vegas, NV 89109",
        image: school,
        reviews: 120,
        rating: 5,
      },
      {
        name: "Oakridge International School",
        address: "3084 S Highland Dr, Ste C",
        image: school,
        reviews: 120,
        rating: 4,
      },
      {
        name: "Oakridge International School",
        address: "3570 S Las Vegas Blvd, Las Vegas, NV 89109",
        image: school,
        reviews: 120,
        rating: 5,
      },
    ],
  },
];

const NearbyPlaces = () => {
  const [selectedCategory, setSelectedCategory] = useState(placesData[0].category);

  const handleTabClick = (category) => {
    setSelectedCategory(category);
  };

  const selectedPlaces = placesData.find((category) => category.category === selectedCategory);

  return (
    <div className="nearby-places">
      <h2>What is Nearby?</h2>
      <div className="np-tabs">
        {placesData.map((category, idx) => (
          <button
            key={idx}
            className={`np-tab ${selectedCategory === category.category ? "np-tab-active" : ""}`}
            onClick={() => handleTabClick(category.category)}
          >
            {category.category}
          </button>
        ))}
      </div>

      <div className="np-category-items">
        {selectedPlaces.items.map((place, i) => (
          <div className="np-place-item" key={i}>
            <img src={place.image} alt={place.name} className="np-place-image" />
            <div className="np-place-details">
              <h4 className="np-place-name">{place.name}</h4>
              <p className="np-place-address">{place.address}</p>
            </div>
            <div className="np-place-reviews">
              <p>{place.reviews} Reviews</p>
              <div className="np-stars">
                {Array.from({ length: 5 }, (_, starIdx) => (
                  <span key={starIdx} className={starIdx < place.rating ? "np-star np-filled" : "np-star"}>★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlaces;
