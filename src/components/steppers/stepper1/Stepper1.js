import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { AddlistingFormData, fetchcompanynameData, fetchprojectnameData } from "../../../Redux/Slices/addListingsSlice";
import { facingOptions, possessionStatusOptions, PropertyFeatures } from "../../AddListings/Addlistconstants";

import {
  fetchPropertyHomeTypeThunk,
  fetchPropertyStatusOptionsThunk,
} from "../../../Redux/Slices/propertySlice";
import { useFormikContext } from "formik";
import "./Stepper1.css";
import { renderLabel } from "../../AddListings/validationSchema";

const Stepper1 = () => {

  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const companyData = useSelector((state) => state.listings.companyData) || [];
  const projectData = useSelector((state) => state.listings.projectData) || [];
  const propertyTypes = useSelector((state) => state.properties.homeTypeOptions) || [];
  const propertyStatus = useSelector((state) => state.properties.propertyStatusOptions) || [];
  const EditPropertyData = useSelector((state) => state.listings.selectedEditProperty) || [];
  // CompanyID: EditPropertyData.CompanyID  ||  '95',
  // ProjectID:  EditPropertyData.ProjectID  || '100',


  const dispatch = useDispatch();


  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [propertyName, setPropertyName] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const { values, handleChange, setFieldValue, handleBlur, errors, touched } = useFormikContext();

  // console.log(errors, "errors");
  // console.log(touched, "touched");
  useEffect(() => {
    if (bearerToken) {
      if (propertyTypes.length === 0) {
        dispatch(fetchPropertyHomeTypeThunk(bearerToken));  // Fetch property types if not available
      }
      if (propertyStatus.length === 0) {
        dispatch(fetchPropertyStatusOptionsThunk(bearerToken));  // Fetch property statuses if not available
      }
    }
  }, [bearerToken, dispatch, propertyTypes, propertyStatus]);

  useEffect(() => {
    if(propertyTypes.length > 0){
      setFieldValue("PropertyType", propertyTypes[0].label, false);
      setFieldValue("PropertyTypeID", propertyTypes[0].value, false);
    }
  }, [propertyTypes, setFieldValue]);

  useEffect(() => {
    if(propertyStatus.length > 0){
      setFieldValue("PropertyStatus", propertyStatus[0].value, false);
    }
  }, [propertyStatus, setFieldValue]);

  useEffect(() => {
    if (bearerToken && companyData.length === 0) {
      dispatch(fetchcompanynameData(bearerToken)); // Fetch only when empty
    }
  }, [bearerToken, dispatch]); // Removed companyData dependency to prevent re-fetching

  useEffect(() => {
    if (bearerToken) {
      dispatch(fetchprojectnameData(bearerToken)); // Fetch projects only when a company is selected
    }
  }, [bearerToken, dispatch]);


  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    clearPropertyFields(['PropertyCity', 'PropertyAddress1', 'PropertyZipCode', 'PropertyLatitude', 'PropertyLongitude', 'Locality']);

    // Find the selected company based on CompanyName
    const selectedCompanyData = companyData.find((company) => company.CompanyName === newValue);

    // Get the CompanyID
    const selectedCompanyID = selectedCompanyData ? selectedCompanyData.CompanyID : null;

    setFieldValue("CompanyName", newValue);
    setFieldValue("CompanyID", selectedCompanyID); // Set CompanyID in Formik's state
    const filteredProjects = projectData.filter((project) => project.CompanyID === selectedCompanyID);
    setFilteredProjects(filteredProjects);
      // **Clear previous selections**
   setSelectedProject(null);
   setPropertyName("");

  // **Reset ProjectName and PropertyName fields in Formik**
  setFieldValue("ProjectName", "");
  setFieldValue("ProjectID", "");
  setFieldValue("PropertyName", "");
  };


  const handleProjectChange = (event, newValue) => {
    setSelectedProject(newValue || "");
    const selectedProject = projectData.find(project => project.ProjectName === newValue);
    const projectID = newValue ? selectedProject?.ProjectID : null;
    setFieldValue("ProjectID", projectID);
    setFieldValue("ProjectName", selectedProject.ProjectName);
    
    if(selectedProject.Amenities){
      setFieldValue("PropertyAmenities", selectedProject.Amenities) 
    }

    // Always update PropertyName to ProjectName and remove spaces
    if (newValue) {
      const propertyName = newValue.replace(/\s+/g, ""); // Clean up the property name if necessary
      setFieldValue("PropertyName", propertyName);
    }
  };

  const clearPropertyFields = (fileds) => {
    fileds.forEach((field) => {
      setFieldValue(field, '');
    });
  }


  const handleCheckboxChange = (e, setFieldValue, values) => {
    const { checked, value } = e.target;

    let updatedFeatures = values.PropertyFeatures || '';

    // If the checkbox is checked, add the feature to the string
    if (checked) {
      updatedFeatures = updatedFeatures ? `${updatedFeatures}, ${value}` : value;
    } else {
      // If the checkbox is unchecked, remove the feature from the string
      updatedFeatures = updatedFeatures.replace(new RegExp(`(?:^|, )${value}(?=,|$)`, 'g'), '');
    }

    console.log(updatedFeatures, "update");

    setFieldValue("PropertyFeatures", updatedFeatures); // Update Formik's state with the new string value
  };

  const handleFieldChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      dispatch(AddlistingFormData({ [name]: checked }));
    } else {

      setFieldValue(name, value);

      if (name === "ProjectName") {
        const projectID = projectData.find((project) => project.ProjectName === value)?.ProjectID;
        dispatch(AddlistingFormData({ ProjectID: projectID }));
      }

      if (name === "Amount" || name === "LotSize") {
        dispatch(AddlistingFormData({ [name]: value }));
      }
    }
  };

  return (
    <div className="stepper1">

      <div className="form-container">
        {/* First Row: Property Name and Project Name */}
        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup">
              <label>Company Name: </label>

              <Autocomplete
                className="autocomplete-root"
                name="CompanyName"
                value={values.CompanyName || selectedCompany}
                onChange={handleCompanyChange}
                options={companyData?.map((company) => company.CompanyName)}
                renderInput={(params) => <TextField {...params} placeholder="Select Company" />}
                getOptionLabel={(option) => option}
                key={(company) => company.CompanyID}
                required
              />
              {errors.CompanyName && (
                <span className="step1error-message">{errors.CompanyName}</span>
              )}
            </div>
          </div>

          <div className="box">
            <div className="step-formgroup">
              <label>Project Name: </label>
              <Autocomplete
                className="autocomplete-root"
                name="ProjectName"
                value={values.ProjectName || selectedProject}
                onChange={handleProjectChange}
                options={filteredProjects.map((project) => project.ProjectName)} // Use filteredProjects
                renderInput={(params) => <TextField {...params} placeholder="Select Project" />}
                required
                key={(project) => project.ProjectID}
              />
              {errors.ProjectName && (
                <span className="step1error-message">{errors.ProjectName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: Property Name and Property Description */}
        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup">
            {renderLabel("PropertyName", "Property Name", values, 1)}
              <div className="step1field">

                <TextField
                  className="custom-textfield"
                  placeholder="Property Name"
                  name="PropertyName"
                  value={values.PropertyName || ""}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={errors.PropertyName}
                />

                {touched && errors.PropertyName && (
                  <span className="step1error-message">{errors.PropertyName}</span>
                )}

              </div>

            </div>
          </div>

          <div className="box">
            <div className="step-formgroup">
              <label>Description: </label>
              <div className="step1field">
                <TextField
                  className="custom-textfield"

                  placeholder="Property Description"
                  name="PropertyDescription"
                  value={values.PropertyDescription}
                  onChange={handleFieldChange}
                  required
                  error={errors.PropertyDescription}
                />
                {errors.PropertyDescription && (
                  <span className="step1error-message">{errors.PropertyDescription}</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Third Row: Property Type and Property Status */}
        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup">
              {renderLabel("PropertyType", "Property Type", values, 1)}
              { propertyTypes.length && <Autocomplete
                className="autocomplete-root"
                name="PropertyType"
                value={propertyTypes.find(option => option.value === values.PropertyTypeID) || propertyTypes[0]}
                onChange={(event, newValue) => {
                  console.log(errors)
                  // Set the label instead of value in the field value
                  setFieldValue("PropertyType", newValue ? newValue.label : propertyTypes[0].label);
                  setFieldValue("PropertyTypeID", newValue ? newValue.value : propertyTypes[0].value);
                }}
                options={propertyTypes}
                getOptionLabel={(option) => option.label}
                error={errors.PropertyType}
                isOptionEqualToValue={(option, value) => option.label === value?.label} // Compare label instead of value
                renderInput={(params) => <TextField {...params} placeholder="Select Property Type" />}
              />
            }
              {errors.PropertyType && (
                <span className="step1error-message">{errors.PropertyType}</span>
              )}
            </div>
          </div>
          <div className="box">
            <div className="step-formgroup1">

              {renderLabel("SqFt", "Property Area", values, 1)}
              <div className="step1field1">

                <TextField
                  fullWidth
                  inputProps={{
                    style: {
                      fontSize: '11px',
                      padding: '11px',
                      marginRight: '5px',
                    },
                  }}
                  sx={{
                    width: '52%',
                    marginRight: '5px',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ccc', // Hover color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ccc', // Focused color
                      },
                    },
                  }}

                  size="small"
                  placeholder="Property Area"
                  name="SqFt"
                  value={values.SqFt} // Formik's value
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={errors.SqFt}
                // helperText={touched.SqFt && errors.SqFt}
                />
                <Select
                  className="price-unit-select"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '8px',
                      fontSize: '12px',
                    }
                  }}
                  name="MeasurementType"
                  value={values.MeasurementType || 'sqft'}
                  onChange={handleFieldChange}
                  label="Measurement Type"
                >
                  <MenuItem value="SqFt">Sqft</MenuItem>
                  <MenuItem value="SqYds">Sqyds</MenuItem>
                  <MenuItem value="Acres">Acres</MenuItem>
                </Select>

                <div>
                  {errors.SqFt && (
                    <span className="step1error-message">{errors.SqFt}</span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Fourth Row: Amount */}
        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup1">
              {renderLabel("Amount", "Price", values, 1)}
              <div className="step1field1">
                <TextField
                  type="number"
                  placeholder="Price"
                  size="small"
                  name="Amount"
                  value={values.Amount}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={errors.Amount}
                  fullWidth
                  inputProps={{
                    style: {
                      fontSize: '11px',
                      padding: '11px',
                      marginRight: '5px',
                    },
                  }}
                  sx={{
                    width: '52%',
                    marginRight: '5px',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ccc', // Hover color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ccc', // Focused color
                      },
                    },
                  }}
                />
                <Select
                  className="price-unit-select"
                  name="PriceUnit"
                  value={values.PriceUnit || 'crores'} // Formik's value for unit
                  onChange={handleFieldChange}
                  required
                  label="Price Unit"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '8px',
                      fontSize: '12px',
                    }
                  }}
                >
                  <MenuItem value="crores">Crores</MenuItem>
                  <MenuItem value="lakhs">Lakhs</MenuItem>
                  <MenuItem value="rupees">Rupees</MenuItem>
                </Select>

                <div>
                  {errors.Amount && (
                    <span className="step1error-message">{errors.Amount}</span>
                  )}
                </div>
              </div>


            </div>
          </div>

          <div className="box">
            <div className="step-formgroup1">
              {renderLabel("LotSize", "Lot Size", values, 1)}
              <div className="step1field1">
                <TextField
                  placeholder="Lot Size"
                  inputProps={{
                    style: {
                      fontSize: '11px',
                      padding: '11px',
                      marginRight: '5px',
                    },
                  }}
                  sx={{
                    width: '52%',
                    marginRight: '5px',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ccc', // Hover color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ccc', // Focused color
                      },
                    },
                  }}
                  name="LotSize"
                  value={values.LotSize} // Formik's value
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={errors.LotSize}
                />
                <Select
                  className="price-unit-select"
                  sx={{
                    '& .MuiSelect-select': {
                      padding: '8px',
                      fontSize: '12px',
                    }
                  }}
                  name="LotSizeUnit"
                  value={values.LotSizeUnit} // Formik's value for unit
                  onChange={handleFieldChange}
                >

                  <MenuItem value="SqYds">Sqyds</MenuItem>
                  <MenuItem value="Acres">Acres</MenuItem>
                </Select>
                <div>
                  {errors.LotSize && (
                    <span className="step1error-message">{errors.LotSize}</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup">
              {renderLabel("YearBuilt", "Year Of Built", values, 1)}
              <div className="step1field">
                <TextField
                  className="custom-textfield"
                  placeholder="Year Of Built"

                  name="YearBuilt"
                  value={values.YearBuilt} // Formik's value
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  error={errors.YearBuilt}
                />
                {errors.YearBuilt && (
                  <span className="step1error-message">{errors.YearBuilt}</span>
                )}
              </div>

            </div>

          </div>

          <div className="box">
            <div className="step-formgroup">
              {renderLabel("PropertyMainEntranceFacing", "Property Facing", values, 1)}

                <div className="step1field1">
              <Autocomplete
                className="autocomplete-root autocomplete-w-100"
                name="PropertyMainEntranceFacing"
                value={values.PropertyMainEntranceFacing || ""}
                onChange={(event, newValue) => {
                  setFieldValue("PropertyMainEntranceFacing", newValue); // Update Formik field with the selected value
                }}
                options={facingOptions.map(option => option.facing)} // Array of facing options
                renderInput={(params) => <TextField {...params} placeholder="Facing" />}
                error={errors.PropertyMainEntranceFacing}
              />
              {errors.PropertyMainEntranceFacing && (
                <div className="step1error-message">{errors.PropertyMainEntranceFacing}</div>
              )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="box">
            <div className="step-formgroup">
              {renderLabel("PropertyStatus", "Property Status", values, 1)}
              { propertyStatus.length > 0 && <Autocomplete
                className="autocomplete-root"
                name="PropertyStatus"
                value={
                  propertyStatus.find(option => option.value === values.PropertyStatus) ||
                  propertyStatus[0] // Default to the first option if not selected
                }
                onChange={(event, newValue) => {
                  // Set the selected value in Formik's state
                  setFieldValue("PropertyStatus", newValue ? newValue.value : propertyStatus[0].value);
                }}
                options={propertyStatus} // Use the full objects as options
                getOptionLabel={(option) => option.label} // Display the 'label' field from the options
                isOptionEqualToValue={(option, value) => option.value === value} // Ensure option equality check is based on 'value'
                renderInput={(params) => <TextField {...params} placeholder="Property Status" />}
                required
                error={errors.PropertyStatus}
              />
            }
              {errors.PropertyStatus && (
                <span className="step1error-message">{errors.PropertyStatus}</span>
              )}
            </div>
          </div>
          <div className="box">
            <div className="step-formgroup">
              {renderLabel("PropertyPossessionStatus", "Possession Status", values, 1)}

              <div className="step1field1">
              <Autocomplete
                className="autocomplete-root autocomplete-w-100"
                name="PropertyPossessionStatus"
                value={values.PropertyPossessionStatus || ""}
                onChange={(event, newValue) => {
                  console.log(newValue, "new");
                  setFieldValue("PropertyPossessionStatus", newValue || "");
                }}
                options={possessionStatusOptions.map((option) => option.possessionStatusOption)} // Use the possessionStatusOption field
                renderInput={(params) => <TextField {...params} placeholder="Possession Status" />}
                required
                error={errors.PropertyPossessionStatus}
              />
              {errors.PropertyPossessionStatus && (
                <div className="step1error-message">{errors.PropertyPossessionStatus}</div>
              )}
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className="step-content">
        <h4>Select Property Features:</h4>
        <div className="checkbox-column">
          {PropertyFeatures.map((feature, index) => (
            <div className="checkbox-item" key={index}>
              <input
                type="checkbox"
                id={`checkbox-${feature}`}
                name="PropertyFeatures"
                value={feature}
                checked={values.PropertyFeatures?.includes(feature)} // Check if the feature is selected
                onChange={(e) => handleCheckboxChange(e, setFieldValue, values)} // Use the separate handler
              />
              <label htmlFor={`checkbox-${feature}`}>{feature}</label>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Stepper1;
