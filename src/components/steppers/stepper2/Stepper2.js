import React, {useState } from 'react';
import { MdOutlineCloudUpload, MdDelete } from "react-icons/md";
import "./Stepper2.css";
//import localforage from 'localforage';

const Stepper2 = ({ onImageSelected }) => {
  const [images, setImages] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]); 
  const [fileError, setFileError] = useState(false);
  const MAX_IMAGES = 12;

  const handleImageUpload = async (event) => {
    setFileError(false);
    const files = Array.from(event.target.files);


     // Prevent adding more than 12 images
  if (filesToUpload.length + files.length > MAX_IMAGES) {
    setFileError(`You can upload a maximum of ${MAX_IMAGES} images.`);
    return;
  }
    
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    const validFiles = files.filter(file => validExtensions.includes(file.type));



    if (validFiles.length !== files.length) {
      setFileError(`Only PNG and JPEG files are allowed.`);
      return;
    }

    const newFiles = validFiles.filter(file => !filesToUpload.some(existingFile => existingFile.name === file.name));

    if (filesToUpload.length + newFiles.length > MAX_IMAGES) {
      setFileError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
  

    // Update the state for images and filesToUpload
    setFilesToUpload((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      onImageSelected(updatedFiles); 
      return updatedFiles;
    });

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = { file, previewUrl: reader.result };
        setImages((prevImages) => {
          const updatedImages = [...prevImages, newImage];
          return updatedImages;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
 const handleImageRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newFilesToUpload = [...filesToUpload];
    newFilesToUpload.splice(index, 1);
    setFilesToUpload(newFilesToUpload);

    // Call onImageSelected after images are deleted and the state has been updated
    onImageSelected(newFilesToUpload);
  };



  return (
    <div className="stepper2-content">
      <div className="stepper2-form-container">
        {/* Upload Photo */}
        <div className="stepper2-box stepper2-column">
          <h3>Upload photos of your property (Max 12 images)</h3>
          <div className="stepper2-upload-container">
            <MdOutlineCloudUpload className="stepper2-upload-icon" />
            <p>Drag and drop images </p>
            
          {fileError && <p className="stepper2-error-message">{fileError}</p>}
            <label htmlFor="fileInput" className="stepper2-browse-file-label">
              Browse Files
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              multiple
              hidden
            />
          </div>
        </div>

        {/* Image Previews */}
        <div className="stepper2-image-preview">
          {images.map(({ previewUrl }, index) => (
            <div key={index} className="stepper2-preview-item">
              <img src={previewUrl} alt={`Preview ${index + 1}`} className="stepper2-thumbnail" />
              <button className="stepper2-delete-btn" onClick={() => handleImageRemove(index)}>
                <MdDelete className="stepper2-delete-icon" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper2;
