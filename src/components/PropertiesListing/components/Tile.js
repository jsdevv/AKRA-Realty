import FavoriteIcon from "../../FavoriteIcon/FavoriteIcon";
import Slider from "react-slick/lib/slider";
import defaultimg1 from "../../../images/Apartment102.jpeg";
import defaultimg2 from "../../../images/Apartment103.jpeg";
import { useTypesense } from "../context/TypesenseContext";
import "./Tile.css"

const blobBaseUrl = 'https://akrarealtyblob.blob.core.windows.net/';
export default function Tile({ property, small }) {
  const { openPropertyModal, updateItemForMarker, setHitLocation } = useTypesense();
  
  const { projectImageUrls, propertyImageUrls } = property;
  let imagesToShow = [
    ...(projectImageUrls || []),
    ...(propertyImageUrls || []),
  ];
  imagesToShow = imagesToShow.map((url) => blobBaseUrl + url);
  if (imagesToShow.length === 0) {
    imagesToShow = [defaultimg1, defaultimg2];
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: true,
    afterChange: async (current) => {
      if(!small) {
        const lastIndex = imagesToShow.length - 1;
        if (current === lastIndex) {
          await openPropertyModal(property)
        }
      }
    }  
  };

  const line3 = property.propertyCardLine3
    .split("|")
    .map((x) => x.trim())
    .filter((x) => x)
    .join(" | ");

  return (
    <div
      className={`propertyCard ${small ? "mappopup-content" : ""}`}
      onClick={async () => {
        if (small) {
          await openPropertyModal(property);
        }else {
            setHitLocation(property);
            updateItemForMarker(property.projectName);
        }
      }}
      tabIndex="0"
    >
      {!small && <FavoriteIcon property={property} />}

      <div className="propertyImages">
        <div className="slide-wrapper">
          <Slider {...settings}>
            {imagesToShow?.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className="propertyImage"
                  loading="lazy"
                  style={{
                    maxWidth: "100%",
                    maxHeight: small ? "140px" : "200px",
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className={small ? "mappopup-details" : "propertyDetails"}>
        <div className="listing-container">
          <h3 className={small ? "mappopup-amount" : ""}>
            {property.propertyName}
            <br />
            {property.formattedAmount}
          </h3>
          {!small && (
            <span
              className="listcount"
              onClick={async () => await openPropertyModal(property)}
            >
              {property.found} Units
            </span>
          )}
        </div>
        <p className={small ? "mappopup-address" : ""}>
          {property.propertyDetails}{" "}
          {line3 && (
            <>
              <br />
              {property.propertyType} | {line3}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
