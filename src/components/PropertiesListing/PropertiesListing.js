import {
  CustomMultiselectFilter,
  DropdownFilter,
  MultiselectFilter,
} from "./components/Controls";
import { Map, TileList } from "./components";
import "./PropertiesListing.css";
import Autocomplete from "./components/Autocomplete";
import {
  prices,
  TypesenseProvider,
  useTypesense,
} from "./context/TypesenseContext";
import ListingModal from "../ListingModal/ListingModal";
import { HiCurrencyRupee } from "react-icons/hi2";
import { FaHome } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  fetchCustomPropertyTypes,
  fetchPropertyHomeType,
  fetchPropertyStatusOptions,
} from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthAndPopup } from "../../utils/authUtils";
import { setShowAuthPopup } from "../../Redux/Slices/authPopupSlice";

const PropertiesListing = (bearerToken) => {
  const [propertyStatuses, setPropertyStatuses] = useState();
  const [propertyTypes, setPropertyTypes] = useState();
  const [customTypes, setCustomTypes] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyStatuses = await fetchPropertyStatusOptions(bearerToken);
        const propertyTypes = await fetchPropertyHomeType(bearerToken);
        const customTypes = await fetchCustomPropertyTypes(bearerToken);
        setPropertyStatuses(propertyStatuses.map((status) => status.PropertyStatus));
        setPropertyTypes(propertyTypes.map((type) => type.PropertyType));
        setCustomTypes(customTypes.map((type) => type.CustomPropertyTypes));
      } catch (error) {
        console.error("Error fetching property status options:", error);
      }
    };

    fetchData();
  }, [bearerToken]);
  return (
    <TypesenseProvider>
      <div className="navbar-bottom">
        <div className="search-container">
          <div className="search-input">
            <Autocomplete />
          </div>
        </div>

        <div className="dropdowns-container">
          {propertyStatuses && <DropdownFilter attribute={"propertyStatus"} options={propertyStatuses} /> }
          {propertyTypes && <MultiselectFilter
            attribute={"propertyType"}
            label="Select Type"
            options={propertyTypes}
            icon={<FaHome className="fa-home" />}
          /> }
          <CustomMultiselectFilter
            attribute={"amount"}
            label="Price Range"
            options={prices}
            icon={<HiCurrencyRupee className="fa-home" />}
            isNumericRange={true}
          />
          { customTypes && <MultiselectFilter
            attribute={"customStatus"}
            label="Custom Type"
            options={customTypes}
            icon={<MdBusiness className="fa-home" />}
          /> }
        </div>
      </div>
      <div className="properties-layout">
        <div className="propertyListContainer">
          <PropertiesHeader />
          <div className="propertyList">
            <TileList></TileList>
          </div>
          <PropertiesDetails />
        </div>
        <div className="map-container">
          <Map />
        </div>
      </div>
    </TypesenseProvider>
  );
};

const PropertiesDetails = () => {
  const { propertyToOpen, closePropertyModal } = useTypesense();
  const token = useSelector((state) => state.auth.bearerToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (propertyToOpen) {
      const isAllowed = checkAuthAndPopup({
        token,
        setShowAuthPopup: (val) => dispatch(setShowAuthPopup(val)),
        dispatch,
      });

      if (!isAllowed) {
        closePropertyModal(); // Close the modal if unauthorized
      }
    }
  }, [propertyToOpen]);
  
  if (!propertyToOpen) return null;
  return (
    <ListingModal
      propertyType="Project"
      propertyToOpen={propertyToOpen}
      selectedProperty={{
        PropertyID: propertyToOpen.id,
        ProjectID: propertyToOpen.projectID,
        PropertyLongitude: propertyToOpen.location[0],
        PropertyLatitude: propertyToOpen.location[1],
      }}
      onClose={closePropertyModal}
    />
  );
};
const PropertiesHeader = () => {
  const { totalResults } = useTypesense();
  return (
    <div className="propertyListHeader">
      <h2>Property Listings</h2>
      <p>{totalResults} properties available</p>
    </div>
  );
};

export default PropertiesListing;
