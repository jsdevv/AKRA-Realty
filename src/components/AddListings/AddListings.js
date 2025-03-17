import React, {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import Stepper1 from '../steppers/stepper1/Stepper1.js';
import Stepper2 from "../steppers/stepper2/Stepper2.js";
import Stepper3 from "../steppers/stepper3/Stepper3.js";
import Stepper4 from "../steppers/stepper4/Stepper4.js";
import {submitAddListings } from '../../Redux/Slices/addListingsSlice.js';
import { step1ValidationSchema, step2ValidationSchema, step3ValidationSchema, step4ValidationSchema } from '../AddListings/validationSchema.js';
import './AddListings.css';
import { uploadImages } from '../../API/api.js';
import localforage from 'localforage';


const stepNames = [
  'Description',
  'Media',
  'Location',
  'Detail',
];

const AddListings = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
    const EditPropertyData = useSelector((state) => state.listings.selectedEditProperty) || [];
  const [currentStep, setCurrentStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.listings);
  const [propertyImages, setPropertyImages] = useState([]); 
  const [isFormResetting, setIsFormResetting] = useState(false);
  const [showImageCountError, setShowImageCountError] = useState(false);

  const initialValues = {
    CompanyID: EditPropertyData.CompanyID  ||  '95',
    ProjectID:  EditPropertyData.ProjectID  || '100',
    PropertyID: EditPropertyData.PropertyID || '',
    PropertyName: EditPropertyData.PropertyName || '',
    PropertyDescription: EditPropertyData.PropertyDescription || '',  // Adjusted for property notes
    PropertyType: EditPropertyData.PropertyType || 'Villas',
    PropertyTypeID: EditPropertyData.PropertyTypeID || '',
    SqFt: EditPropertyData.SqFt || '',
    MeasurementType:EditPropertyData.MeasurementType || 'SqFt',
    Amount: EditPropertyData.Amount || '',
    PriceUnit: EditPropertyData.PriceUnit || 'crores',
    LotSize: EditPropertyData.LotSize || '',
    LotSizeUnit: EditPropertyData.LotSizeUnit || 'SqYds',
    YearBuilt: EditPropertyData.YearBuilt || '',
    PropertyMainEntranceFacing: EditPropertyData.PropertyMainEntranceFacing || 'East',
    PropertyStatus: EditPropertyData.PropertyStatus || 'For Sale',
    PropertyPossessionStatus: EditPropertyData.PropertyPossessionStatus || 'Ready To Move',
    PropertyFeatures: EditPropertyData.PropertyAmenities || '',
    PropertyAddress1: EditPropertyData.PropertyAddress1 || '',
    PropertyAddress2: EditPropertyData.PropertyAddress2 || '',
    PropertyZipCode: EditPropertyData.PropertyZipCode || '',
    PropertyCity: EditPropertyData.PropertyCity || '',
    PropertyState: EditPropertyData.PropertyState || '',
    PropertyLandmark: EditPropertyData.PropertyLandmark || '',
    Locality: EditPropertyData.Locality || '',
    SubLocality: EditPropertyData.SubLocality || '',
    ShowLocation: EditPropertyData.Display || "Yes",
    PropertyLatitude: EditPropertyData.PropertyLatitude || '',
    PropertyLongitude: EditPropertyData.PropertyLongitude || '',
    district: EditPropertyData.district || '',
    plotno: EditPropertyData.plotno || '',
    PropertyFloorNumber: EditPropertyData.PropertyFloorNumber || '',
    Bedrooms: EditPropertyData.Bedrooms || '',
    PropertyBathrooms: EditPropertyData.PropertyBathrooms || '',
    PropertyParking: EditPropertyData.PropertyParking || '',
    Parkingslot: EditPropertyData.Parkingslot || '',
    PropertyFurnishing: EditPropertyData.PropertyFurnishing || 'Furnished',
    AvailableFrom: EditPropertyData.AvailableFrom || '',
    PropertyNotes: EditPropertyData.PropertyNotes || '',
    PropertyAmenities: EditPropertyData.PropertyAmenities || ''
  };

  const resetFormToDefault = () => {
    setIsFormResetting(true);
    setTimeout(() => {
      setIsFormResetting(false);
    })
  }

  useEffect(() => {
    // If you need to reset the form when the EditPropertyData changes
    if (EditPropertyData && Object.keys(EditPropertyData).length > 0) {
      // Reset form or update initial values if necessary
    }
  }, [EditPropertyData]);
  
  const getValidationSchema = () => {
    if (currentStep === 1) return step1ValidationSchema;
    if (currentStep === 2) return step2ValidationSchema;
    if (currentStep === 3) return step3ValidationSchema;
    return step4ValidationSchema;
  };
 
 

  const handleNext = async (validateForm) => {
    // Trigger validation for the current form
    const errors = await validateForm();

    if (currentStep === 2 && propertyImages.length < 2) {
      //alert("Please upload at least two images.");
      setShowImageCountError(true);
      return;
    }
  
  
    // If there are errors, do not move to the next step
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors); // Optionally log errors for debugging
      return;
    }
  
    // If no errors, move to the next step
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber, errors) => {
    if(currentStep === 1 && errors && Object.keys(errors).length > 0) {
      return;
    }
    if(currentStep === 2 && stepNumber > 2 && propertyImages.length < 2) {
      setShowImageCountError(true);
      return;
    }
    setCurrentStep(stepNumber);
  };

  const onImageSelected = (images) => {
    setPropertyImages(images);
  };

  const uploadPropertyImages = async (propertyId) => {
    if (propertyId && propertyImages.length > 0) {
      try {
        // Upload each image
        const imageUploadPromises = propertyImages.map((image) => uploadImages(propertyId, image, bearerToken));
        await Promise.all(imageUploadPromises);
        // After successful upload, clear state and local storage
        setPropertyImages([]);
        localStorage.removeItem('uploadedImages'); // Remove from localStorage
  
        // Optionally, you can show a success message here if desired
        setShowPopup(true);
  
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };
  

  const handleSubmit = async (values, { resetForm }) => {
    // console.log(values,"values");
    try {
      const response = await dispatch(submitAddListings({ bearerToken, formData: values }));
 
      // Extract PropertyID from the response message
      const propertyId = extractPropertyId(response.payload.processMessage);

      if (propertyId) {
      
        uploadPropertyImages(propertyId);
        setShowPopup(true);
        resetForm();
        setPropertyImages([]); 
        setCurrentStep(1);
        resetFormToDefault();
        await localforage.removeItem('uploadedImages');
      } else {
        throw new Error("Property ID not found in the response.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const extractPropertyId = (message) => {
    const match = message.match(/PropertyID: (\d+)/);
    return match ? match[1] : null;
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowImageCountError(false);
  };

  return (
    <div className="add-listings-container">
      
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange,  errors,touched,handleBlur,validateForm , resetForm }) => (
          <>
          <div className="header-row">
        {/* <h4>Add new property</h4> */}
        <div className="steps-header">
          {stepNames.map((name, index) => {
            const stepNumber = index + 1;
            let stepClass = 'step';
            if (currentStep === stepNumber) {
              stepClass += ' active';
            } else if (currentStep > stepNumber) {
              stepClass += ' completed';
            }

            return (
              <div
                key={stepNumber}
                className={stepClass}
                onClick={() => handleStepClick(stepNumber, errors)}
              >
                {currentStep > stepNumber ? (
                  <FaCheck className="check-icon" />
                ) : (
                  <span>{stepNumber}.</span>
                )}
                <span>{name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
          { !isFormResetting && <Form>
            {currentStep === 1 && <Stepper1 bearerToken={bearerToken} errors={errors} touched={touched} handleBlur={handleBlur} formData={values} handleChange={handleChange} />}
            {<div className={ currentStep === 2 ? '' : 'hide-media-step'}><Stepper2 bearerToken={bearerToken}  errors={errors} onImageSelected={onImageSelected} /></div> }
            {currentStep === 3 && <Stepper3 bearerToken={bearerToken} formData={values}  handleChange={handleChange} errors={errors} touched={touched} handleBlur={handleBlur} />}
            {currentStep === 4 && <Stepper4 bearerToken={bearerToken} formData={values} handleChange={handleChange} errors={errors} touched={touched} handleBlur={handleBlur} />}
     
            
          </Form>}
          <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="prev-button" onClick={handlePrev}>
                  <GoArrowLeft /> Prev Step
                </button>
              )}
              {currentStep < 4 ? (
                <button type="button" className="next-button"  onClick={() => handleNext(validateForm)}>
                  Next Step <GoArrowRight />
                </button>
              ) : (
                <button type="button" className="submit-button" disabled={status === 'loading'} 
                onClick={() => {
                  validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      handleSubmit(values, { resetForm });
                    }
                  });
                }}>
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div></>
        )}
      </Formik>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay show">
          <div className="popup-content">
            <h3>Property Added Successfully!</h3>
            <p>Your listing has been successfully added. You can now view it in your listings.</p>
            <button className="close-button" onClick={handleClosePopup}>
              <IoClose /> Close
            </button>
          </div>
        </div>
      )}

    {showImageCountError && (
        <div className="popup-overlay show">
          <div className="popup-content">
            <p>Please upload at least two images.</p>
            <button className="close-button" onClick={handleClosePopup}>
              <IoClose /> Close
            </button>
          </div>
        </div>
      )}

      {/* Handle any errors */}
      {status === 'failed' && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default AddListings;
