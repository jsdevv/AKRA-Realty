import { TbBuildingCommunity } from "react-icons/tb";
import { FaHeart } from "react-icons/fa"; // Import heart icon
import "./Marker.css";

export default function PropertyMarker({
  zoom,
  formattedAmount,
  units,
  isFavorited
}) {

  return (
    <div className={`property-marker relative ${zoom > 13 ? 'show-min-price' : ''} ${zoom > 14 && units > 1 ? 'show-units-available' : ''}`}>
      
      {/* Heart Icon if Favorited */}
      {isFavorited && zoom < 14  && (
        <div className="favorite-heart">
          <FaHeart />
        </div>
      )}

      {/* Price label if zoom > 13 */}
      {zoom > 13 && (
        <div className="property-price-label">
          {formattedAmount}
          {units > 1 ? '+' : ''}
        </div>
      )}

      {/* Units available if zoom > 14 and units > 1 */}
      {zoom > 14 && units > 1 && (
        <div className="units-available">
          {units} <TbBuildingCommunity className="fa-home" size={10} />
        </div>
      )}
    </div>
  );
}
