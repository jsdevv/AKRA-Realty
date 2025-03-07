import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import './Agentsproperties.css';
import { useSelector } from 'react-redux';
import { FaBell, FaMapMarkerAlt, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mapStyle } from '../Mapstyles/mapStyles';
import { LiaRupeeSignSolid } from '../../assets/icons/Icons';
import { MdFavorite } from 'react-icons/md';

const Agentsproperties = ({ agentsproperties }) => {

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const userNumbers = ['+91 8885144100'];

  const selectedStatus = useSelector((state) => state.agentFilter.selectedAgentPropertyStatus);
  const selectedHomeType = useSelector((state) => state.agentFilter.selectedHomeTypes);
  const searchAgentProperty = useSelector((state) => state.agentFilter.searchFilter);
  const selectedPriceRange = useSelector((state) => state.agentFilter.selectedAgentpriceFilter);

  const filteredProperties = useMemo(() => {
    return agentsproperties.filter((property) => {
      const matchesStatus = selectedStatus === 'Select Status' || !selectedStatus || property.PropertyStatus === selectedStatus;
      const matchesHomeType = selectedHomeType.length === 0 || selectedHomeType.includes(property.PropertyTypeID);
      const matchesPriceRange =
        selectedPriceRange.length === 0 ||
        selectedPriceRange.some(
          (price) =>
            property.DisplayAmount >= price.minPrice && property.DisplayAmount <= price.maxPrice
        );


      const searchLowerCase = searchAgentProperty ? searchAgentProperty.toLowerCase() : ''
      const matchesSearch =
        searchLowerCase === '' ||
        (property.Locality && property.Locality.toLowerCase().includes(searchLowerCase)) ||
        (property.PropertyType && property.PropertyType.toLowerCase().includes(searchLowerCase)) ||
        (property.PropertyStatus && property.PropertyStatus.toLowerCase().includes(searchLowerCase)) ||
        (property.Amount && property.Amount.toLowerCase().includes(searchLowerCase)) ||
        (property.MeasurementType && property.MeasurementType.toLowerCase().includes(searchLowerCase)) ||
        (property.PropertyMainEntranceFacing && property.PropertyMainEntranceFacing.toLowerCase().includes(searchLowerCase)) ||
        (property.PropertyZipCode && property.PropertyZipCode.toLowerCase().includes(searchLowerCase)) ||
        (property.SqFtValue && property.SqFtValue.toLowerCase().includes(searchLowerCase));

      return matchesStatus && matchesHomeType && matchesSearch && matchesPriceRange;
    });
  }, [agentsproperties, selectedStatus, selectedHomeType, searchAgentProperty, selectedPriceRange]);

  const toggleMap = (location) => {
    if (isMapVisible && selectedLocation === location) {
      setIsMapVisible(false);
      setSelectedLocation(null);
    } else {
      setSelectedLocation(location);
      setIsMapVisible(true);
    }
  };

  useEffect(() => {
    if (isMapVisible && selectedLocation) {
      const mapElement = document.getElementById('agentmap');
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          styles: mapStyle,
          center: {
            lat: parseFloat(selectedLocation.PropertyLatitude) || 12.9716,
            lng: parseFloat(selectedLocation.PropertyLongitude) || 77.5946,
          },
          zoom: 12,
        });

        new window.google.maps.Marker({
          // position: {
          //   lat: parseFloat(selectedLocation.PropertyLatitude) || 12.9716,
          //   lng: parseFloat(selectedLocation.PropertyLongitude) || 77.5946,
          // },
          map,
          title: selectedLocation.Locality || 'Property Location',
        });

        // Optional: Add a circle around the marker
        const radius = 2600; // Radius in meters
        new window.google.maps.Circle({
          map,
          center: {
            lat: parseFloat(selectedLocation.PropertyLatitude) || 12.9716,
            lng: parseFloat(selectedLocation.PropertyLongitude) || 77.5946,
          },
          radius: radius,
          strokeColor: 'maroon',
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: 'rgba(128, 0, 0, 0.1)',
          fillOpacity: 1.0,
        });
      }
    }
  }, [isMapVisible, selectedLocation]);

  const columns = useMemo(
    () => [
      {
        Header: 'Property Type',
        accessor: 'PropertyType',
        Cell: ({ value }) => value,
      },
      {
        Header: 'Property Status',
        accessor: 'PropertyStatus',
        Cell: ({ value }) => <span className="property-status">{value}</span>,
      },
      {
        Header: 'Price',
        accessor: 'Amount',
        Cell: ({ value }) => (
          <span className='price-cell'>
            <LiaRupeeSignSolid className="rupee-icon" />{value}
          </span>
        ),
      },
      {
        Header: 'Size',
        accessor: 'SqFtValue',
        Cell: ({ value }) => `${value}`,
      },
      {
        Header: 'Area',
        accessor: 'MeasurementType',
        Cell: ({ value }) => `${value}`,
      },
      {
        Header: 'Facing',
        accessor: 'PropertyMainEntranceFacing',
        Cell: ({ value }) => <span className="property-status">{value}</span>,
      },
      {
        Header: 'Location',
        accessor: 'Locality',
        Cell: ({ value }) => value,
      },
      {
        Header: 'City',
        accessor: 'PropertyCity',
        Cell: ({ value }) => value,
      },
      {
        Header: 'Zipcode',
        accessor: 'PropertyZipCode',
        Cell: ({ value }) => value,
      },
      {
        Header: 'Favorite',
        Cell: () => 
            <span>
                   <MdFavorite  className="rupee-icon" />  <FaStar  className="rupee-icon" />
            </span>,
      },
      {
        Header: 'Agent & Location',
        accessor: 'actions',
        Cell: ({ row }) => {
          const sendWhatsAppMessage = async () => {
            const companyName = "AKRA Realty";
            const propertyType = row.original.PropertyType;
            const Locality = row.original.Locality;

            const message = `${companyName} agent will contact shortly regarding this ${propertyType} located at ${Locality}.`;
            const encodedMessage = encodeURIComponent(message);

            for (const userNumber of userNumbers) {
              const whatsappUrl = `https://api.whatsapp.com/send?phone=${userNumber}&text=${encodedMessage}`;
              window.open(whatsappUrl, '_blank');
              await new Promise(resolve => setTimeout(resolve, 500));
            }

            toast.success("Agents will contact shortly!");
          };

          return (
            <div className="action-buttons">
              <button className="contact-btn" aria-label="Contact Agent" onClick={sendWhatsAppMessage}>
                <FaPhoneAlt /> Agent
              </button>
              <button className="view-number-btn" aria-label="View Location" onClick={() => toggleMap(row.original)}>
                <FaMapMarkerAlt /> Location
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
    setSortBy
  } = useTable(
    {
      columns,
      data: filteredProperties,
      initialState: { sortBy: [{ id: 'Locality', desc: false }] }, // Initial sorting set to "A to Z"
    },
    useSortBy
  );

  return (
    <div className="agents-properties-table-container">
      <ToastContainer />

      {filteredProperties.length === 0 ? (
        <p>No properties available</p>
      ) : (
        <table {...getTableProps()} className={`rwd-table agents-properties-table ${isMapVisible ? 'expanded' : ''}`}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                    {column.render('Header')}
                    {/* Sorting icon */}
                    <span>
                      {sortBy.find(s => s.id === column.id) ? (sortBy.find(s => s.id === column.id).desc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {isMapVisible && (
        <div className="agentpropertymap-container visible">
          <div id="agentmap"></div>
        </div>
      )}
    </div>
  );
};

export default Agentsproperties;
