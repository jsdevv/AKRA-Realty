import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./AddProjectImg.css"

const MAX_IMAGES = 12;

const AddProjectImg = ({ propertyImages, setPropertyImages, projectimgerror, setProjectimgerror }) => {
   console.log(projectimgerror, "imjjjjj");
  const [imageURLs, setImageURLs] = useState([]);
  const [error, setError] = useState("");

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (propertyImages.length >= MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    // Filter out duplicates and respect the max limit
    const newImages = files.filter(
      (file) => !propertyImages.some((img) => img.name === file.name)
    );

    if (propertyImages.length + newImages.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setPropertyImages((prevImages) => {
      const updatedImages = [...prevImages, ...newImages];
  
      // Reset projectimgerror if at least 2 images are present
      if (updatedImages.length >= 2) {
        setProjectimgerror("");
      }
  
      return updatedImages;
    });
    
    setError(""); // Clear any previous error
  };

  // Remove selected image
  const handleImageRemove = (index) => {

    setPropertyImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setError(""); // Clear error in case they want to add more after deleting
  };

  // Generate and clean up object URLs to prevent memory leaks
  useEffect(() => {
    const urls = propertyImages.map((image) => URL.createObjectURL(image));
    setImageURLs(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url)); // Cleanup URLs
    };
  }, [propertyImages]);

  return (
    <div className="image-upload-box">
      {(error || projectimgerror) && <p className="error-message">{error || projectimgerror}</p>}
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="image-upload-input"
        disabled={propertyImages.length >= MAX_IMAGES} // Disable input if max reached
      />
      <div className="projectimage-preview">
        {propertyImages.map((image, index) => (
          <div key={index} className="image-preview-item">
            <img src={imageURLs[index]} alt={image.name || `image-${index}`} />
            <IconButton onClick={() => handleImageRemove(index)} className="projectremove-icon">
              <RiDeleteBin6Line />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProjectImg;
