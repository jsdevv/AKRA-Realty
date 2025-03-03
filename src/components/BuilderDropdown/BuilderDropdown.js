import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPremiumListingsThunk, toggleShowPremiumListings, setSelectedBuilder } from "../../Redux/Slices/propertySlice";
import { fetchPremiumbuilders } from "../../API/api";  
import "./BuilderDropdown.css";

const BuilderDropdown = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const dispatch = useDispatch();
  
  const selectedBuilder = useSelector((state) => state.properties.selectedBuilder);
  const { premiumListings, showPremiumListings, loading } = useSelector((state) => state.properties);

  const [builders, setBuilders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const builderName = e.target.value;
    dispatch(setSelectedBuilder(builderName)); // Update Redux state with selected builder
  };

  useEffect(() => {
    const getBuilders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPremiumbuilders(bearerToken);
        setBuilders(data); // Set builders in local state
        setError(null); // Clear any previous errors
      } catch (error) {
        setError("Error fetching builders. Please try again later.");
        console.error("Error fetching builders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBuilders();
  }, [showPremiumListings,bearerToken]);

  useEffect(() => {
    if (selectedBuilder) {
      dispatch(fetchPremiumListingsThunk(bearerToken));
    }
  }, [selectedBuilder, bearerToken, dispatch]);

  return (
    <div id="builder-dropdown-container">
          {showPremiumListings && (
        <>
          <select
            id="builder-dropdown"
            value={selectedBuilder}
            onChange={handleChange}
            disabled={loading || isLoading}
          >
            <option value="">Select Premium Builder</option>
            {builders.map((builder, index) => (
              <option key={index} value={builder.PremiumCompanies}>
                {builder.PremiumCompanies}
              </option>
            ))}
          </select>

          {error && <div className="error-message">{error}</div>} {/* Display error message if any */}
        </>
      )}
      <span>Premium</span>
      <label className="premium-toggle-switch">
        <input
          type="checkbox"
          checked={showPremiumListings}
          onChange={() => dispatch(toggleShowPremiumListings())}
        />
        <span className="premium-slider" />
      </label>

      {/* Only show the dropdown if the toggle is checked */}
  
    </div>
  );
};

export default BuilderDropdown;
