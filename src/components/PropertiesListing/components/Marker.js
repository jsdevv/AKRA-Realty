
import { TbBuildingCommunity } from "react-icons/tb";

export default function PropertyMarker({
  zoom,
  formattedAmount,
  units
}) {
  return <div className={`property-marker relative ${zoom > 13 ? 'show-min-price' : ''} ${zoom > 14 && units > 1 ? 'show-units-available' : ''}`}>
    
    {zoom > 13 && <div className='property-price-label'>{formattedAmount}{units > 1 ? '+' : ''}</div> }



    {/* {zoom > 13 && units > 1 && <div className='units-available'> {units} <BsBuilding className="fa-home" /></div>} */}
   
    {zoom > 14 && units > 1 && <div className='units-available'> {units} <TbBuildingCommunity className="fa-home" size={10} /></div>}
    
  </div>;
}
