import React, { useEffect, useState } from 'react';
import './AddOrderImages.css';
import { fetchImagesForDisplayOrder,fetchGetImgbasedProject, fetchAddImagesForDisplayOrder } from '../../API/api';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AddOrderImages = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [uniqueProjects, setUniqueProjects] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  console.log(images,"images");
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayOrders, setDisplayOrders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchImagesForDisplayOrder(bearerToken);
  
        // Only extract unique project info
        const uniqueProjects = Array.from(
          new Map(
            data.map(item => [item.ProjectID, {
              ProjectID: item.ProjectID,
              ProjectName: item.ProjectName,
              Locality: item.Locality,
              City: item.City,
              Zipcode: item.Zipcode,
            }])
          ).values()
        );
  
        setUniqueProjects(uniqueProjects); // Create a new state to hold just project info
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bearerToken]);
  

  const handleProjectClick = async (projectID) => {
    setLoadingImages(true);
    try {
      const projectImages = await fetchGetImgbasedProject(bearerToken, Number(projectID));
      const sortedImages = projectImages.sort((a, b) => {
        if (a.DisplayOrderID == null) return 1;
        if (b.DisplayOrderID == null) return -1;
        return a.DisplayOrderID - b.DisplayOrderID;
      });
      
      
      setImages(sortedImages);
  
      const initialDisplayOrders = projectImages.reduce((acc, img) => {
        acc[img.ProjectImageID] = img.DisplayOrderID;
        return acc;
      }, {});
      
      setDisplayOrders(initialDisplayOrders);
      setSelectedProjectID(projectID);
    } catch (err) {
      console.error('Error fetching project images:', err);
      toast.error('Failed to load project images.');
    } finally {
      setLoadingImages(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedProjectID) return;
  
    const projectImages = images.filter(img => img.ProjectID === selectedProjectID);
  
    if (projectImages.length === 0) {
      toast.error('No images found for the selected project.');
      return;
    }
  
    const payload = projectImages.map(img => ({
      ProjectID: Number(img.ProjectID),
      ProjectImageID: Number(img.ProjectimageID),
      DisplayOrderID: displayOrders[img.ProjectimageID] || img.DisplayOrderID,
    }));
  
    const hasEmptyDisplayOrder = payload.some(item => item.DisplayOrderID === 0);
    if (hasEmptyDisplayOrder) {
      toast.error('Please enter a valid Display Order for all images.');
      return;
    }
  
    try {
      const response = await fetchAddImagesForDisplayOrder(bearerToken, payload);
      console.log('API Response:', response);
  
      const code = String(response.ProcessCode); // Ensure type safety
  
      if (code === '151') {
        toast.error(response.processMessage.replace('ERROR: ', ''));
      } else if (response.ProcessCode === 0) {
        toast.success('Display order updated successfully!');
        setSelectedProjectID(null);
        setDisplayOrders({});
      } else {
        toast.error('Display order not updated properly.');
      }
    } catch (err) {
      toast.error(err?.processMessage || 'Something went wrong while updating display order.');
    }
  };
  

  const projectImages = images.filter(img => img.ProjectID === selectedProjectID);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="add-order-images">
      <p className="add-order-images-title">Project Images Display Order</p>

      {!selectedProjectID ? (
        <div className="orderprojecttable-container">
          <input
            type="text"
            className="orderprojectsearch-bar"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="excel-style-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Locality</th>
                <th>City</th>
                <th>Zipcode</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uniqueProjects
                .filter((project) => {
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    project.ProjectName?.toLowerCase().includes(searchLower) ||
                    project.Locality?.toLowerCase().includes(searchLower) ||
                    project.City?.toLowerCase().includes(searchLower) ||
                    project.Zipcode?.toString().includes(searchLower)
                  );
                })
                .map((project) => (
                  <tr
                    key={project.ProjectID}
                    className="clickable"
                    // onClick={() => handleProjectClick(project.ProjectID)}
                  >
                    <td>{project.ProjectID}</td>
                    <td>{project.ProjectName}</td>
                    <td>{project.Locality}</td>
                    <td>{project.City}</td>
                    <td>{project.Zipcode}</td>
                    <td> <p className='addorder-editbtn'  onClick={() => handleProjectClick(project.ProjectID)} > Edit </p> </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="add-order-images-main-content">
          <div className="add-order-images-left">
            <div className="add-order-images-heading">
              <h3>
                {uniqueProjects.find((p) => p.ProjectID === selectedProjectID)?.ProjectName}
              </h3>
              <button
                className="add-order-images-back-button"
                onClick={() => setSelectedProjectID(null)}
              >
                Back to Projects
              </button>
            </div>

            <div className="add-order-images-image-list">
              {projectImages.map((img) => (
                <div key={img.ProjectimageID} className="add-order-images-card">
                  {img.ImageURL && (
                    <img
                      src={img.ImageURL}
                      alt={`Project ${img.ProjectID}`}
                      className="add-order-images-preview"
                      loading="lazy"
                    />
                  )}
                  <div className="add-order-images-card-info">
        
                    <div className="add-order-images-card-order-input-wrapper">
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <p>Order ID:</p>
                        <input
                          type="text"
                          inputMode="numeric"
                          className="add-order-images-order-input"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');  // Ensure only numeric input

                            if (value === '') {
                              // If the value is cleared by the user, we remove the corresponding entry
                              setDisplayOrders((prev) => {
                                const newOrders = { ...prev };
                                delete newOrders[img.ProjectimageID];  // Remove the entry from the state
                                return newOrders;
                              });
                            } else {
                              // If a value is entered, we update the state with the new numeric value
                              setDisplayOrders((prev) => ({
                                ...prev,
                                [img.ProjectimageID]: value,  // Save the new value for this image
                              }));
                            }
                          }}
                          value={displayOrders[img.ProjectimageID] ?? img.DisplayOrderID ?? ''}
                        
                        />

                      </div>

                      <div>
                        <BsThreeDotsVertical />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-order-images-submit-button-wrapper">
              <button
                className="add-order-images-submit-button"
                onClick={handleSubmit}
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOrderImages;
