import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Grid, Box, Autocomplete, CircularProgress } from '@mui/material';
import AddProjectmap from './AddProjectmap';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcompanynameData, fetchprojectnameData } from '../../Redux/Slices/addListingsSlice';
import { fetchPropertyHomeTypeThunk, fetchPropertyStatusOptionsThunk } from '../../Redux/Slices/propertySlice';
import { fetchAddProject, uploadprojectImages } from '../../API/api';
import * as Yup from 'yup';
import { amenitiesData } from '../steppers/stepper4/amniData';
import AddProjectImg from '../AddProjectImg/AddProjectImg';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './AddProject.css';

const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 };

const AddProject = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const companyData = useSelector((state) => state.listings.companyData) || [];
  const projectData = useSelector((state) => state.listings.projectData) || [];
  const propertyTypes = useSelector((state) => state.properties.homeTypeOptions) || [];
  const propertyStatus = useSelector((state) => state.properties.propertyStatusOptions) || [];
  const projectStatusOptions = ['Ongoing', 'Completed'];
  const dispatch = useDispatch();
  const [geolocation, setGeolocation] = useState(DEFAULT_CENTER);
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const initialValues = {
    companyName: '',
    CompanyID: '',
    ProjectName: '',
    PropertyType: 'Apartments',
    PropertyTypeID: '1',
    ProjectStatus: 'Completed',
    Email: '',
    AgeOfProject: '',
    MobileNumber: '',
    SecondaryMobileNumber: '',
    Address1: '',
    Address2: '',
    City: '',
    Zipcode: '',
    State: '',
    Locality: '',
    subLocality: '',
    description: '',
    Latitude: '',
    Longitude: ''
  };

  const [formData, setFormData] = useState(initialValues);
  const [projectimgerror, setProjectimgerror] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domainOnlyRegex = /^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDotsRegex = /\.{2,}/;
  const specialCharStartRegex = /^[._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDigitsRegex = /(.)\1{5,}/;
  const indianZipRegex = /^[1-9][0-9]{5}$/;

  
  useEffect(() => {
    if (bearerToken) {
      dispatch(fetchprojectnameData(bearerToken)); 
    }
  }, [bearerToken, dispatch]);


  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    CompanyID: Yup.string().required("Company ID is required"),
    ProjectName: Yup.string()
    .required("Project Name is required")
    .test("unique-project", "Project name already exists", (value) => {
      return !projectData.some((project) => project.ProjectName.toLowerCase() === value?.toLowerCase());
    }),
    PropertyType: Yup.string().required("Property Type is required"),
    PropertyTypeID: Yup.string().required("Property Type ID is required"),
    ProjectStatus: Yup.string().required("Project Status is required"),
    Email: Yup.string()
      .matches(emailRegex, "Invalid email format")
      .test("valid-email", "Email cannot be just a domain (e.g., @gmail.com)", (value) => {
        return value && !domainOnlyRegex.test(value);
      })
      .test("no-consecutive-dots", "Email cannot contain consecutive dots", (value) => {
        return value && !consecutiveDotsRegex.test(value);
      })
      .test("no-special-char-start", "Email cannot start with special characters", (value) => {
        return value && !specialCharStartRegex.test(value);
      })
      .required("Email is required"),
    AgeOfProject: Yup.number()
      .typeError("Age must be a number")
      .min(0, "Age must be 0 or greater") // Allows 0 and positive numbers
      .integer("Age must be a whole number")
      .required("Age is required"),

    MobileNumber: Yup.string().matches(
      /^(?:\+?[1-9]\d{0,2}[-.\s]?)?\d{10}$/,
      "Invalid phone number format"
    )
      .test("no-consecutive-digits", "Invalid phone number", (value) => {
        if (!value) return false;
        return !consecutiveDigitsRegex.test(value.replace(/\D/g, ""));
      })
      .required("Phone number is required"),
    SecondaryMobileNumber: Yup.string().matches(
      /^(?:\+?[1-9]\d{0,2}[-.\s]?)?\d{10}$/,
      "Invalid phone number format"
    )
      .test("no-consecutive-digits", "Invalid phone number", (value) => {
        if (!value) return false;
        return !consecutiveDigitsRegex.test(value.replace(/\D/g, ""));
      })
      .required("Phone number is required"),
    Address1: Yup.string().required("Address1 is required"),
    Address2: Yup.string().nullable(), // Optional
    City: Yup.string().required("City is required"),
    Zipcode: Yup.string()
      .matches(indianZipRegex, "Please Enter a valid PIN code")
      .required("Zipcode is required"),
    State: Yup.string().required("State is required"),
    Locality: Yup.string().required("Locality is required"),
    subLocality: Yup.string().required("Sub Locality is required"),
    Latitude: Yup.string().required("Geolocation is required"),
  });


  const uploadPropertyImages = async (projectid) => {
    if (!projectid || propertyImages.length === 0) {
      console.warn("No project ID or images to upload.");
      return;
    }


    try {
      const allowedExtensions = ["jpg", "jpeg", "png"]; // Allowed formats

      const imageUploadPromises = propertyImages.map((image) => {
        const extension = image.name.split('.').pop().toLowerCase(); // Extract file extension

        if (!allowedExtensions.includes(extension)) {
          console.warn(`Skipping file ${image.name}: Unsupported format (${extension}).`);
          return Promise.resolve(); // Skip invalid images
        }

        return uploadprojectImages(projectid, image, bearerToken, extension);
      });

      await Promise.all(imageUploadPromises);

      setPropertyImages([]); // Clear images after successful upload
      setProjectimgerror("");
      localStorage.removeItem("uploadedImages"); // Remove from localStorage
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

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
    if (bearerToken && companyData.length === 0) {
      dispatch(fetchcompanynameData(bearerToken)); // Fetch only when empty
    }
  }, [bearerToken, dispatch]);

  const handleStatusChange = (event, newValue, setFieldValue) => {
    setFieldValue('ProjectStatus', newValue);
  };

  const handleGeolocationChange = (e, setFieldValue) => {
    const value = e.target.value;
    const coordinates = value.split(',').map(coord => coord.trim());

    if (coordinates.length === 2) {
      const [latitude, longitude] = coordinates;
      // Ensure they are numbers
      const lat = latitude;
      const lng = longitude;
      setFieldValue('Latitude', lat);
      setFieldValue('Longitude', lng);
    } else {
      setFieldValue('Latitude', '');
      setFieldValue('Longitude', '');
      setFieldValue('geolocation', '');
    }
  };

  const handleAmenitiesChange = (e, setFieldValue, values, amenity) => {
    const { checked } = e.target;

    let updatedAmenities = values.Amenities || '';

    if (checked) {
      updatedAmenities = updatedAmenities ? `${updatedAmenities}, ${amenity}` : amenity;
    } else {
      updatedAmenities = updatedAmenities.replace(new RegExp(`(?:^|, )${amenity}(?=,|$)`, 'g'), '');
    }

    setFieldValue("Amenities", updatedAmenities);
  };

  const handleCompanyChange = (event, newValue, setFieldValue) => {
    const selectedCompanyData = companyData.find((company) => company.CompanyName === newValue);
    const selectedCompanyID = selectedCompanyData ? selectedCompanyData.CompanyID : '';


    setFieldValue("companyName", newValue || '');
    setFieldValue("CompanyID", selectedCompanyID); // Ensure CompanyID is set in Formik state
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (propertyImages.length < 2) {
      setProjectimgerror("At least 2 images are required.");
      return;
    } else {
      setProjectimgerror("");
    }

    setLoading(true);
    try {
      const response = await fetchAddProject(values, bearerToken);

      const processMessage = response?.processMessage;
      if (!processMessage) {
        console.error("processMessage not found in API response", response);
        return;
      }

      const projectid = extractProjectId(processMessage);


      if (projectid) {
        uploadPropertyImages(projectid);
        resetForm();
        setFormData(initialValues);
        dispatch(fetchprojectnameData(bearerToken));  
        // Show success popup
        toast.success("Project added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setGeolocation({ lat: 17.4119, lng: 78.4677 });

    } catch (error) {

      toast.error("Failed to add project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractProjectId = (message) => {
    const match = message.match(/ProjectID\s*=\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  return (
    <div className="add-project-container__main">
      <ToastContainer />
      <h2 className="add-project-title">Add Project</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, resetForm, touched, values, errors, setFieldValue, setTouched, handleChange }) => {

          return (<Form className="add-project-grid">
            <Grid item xs={12} sm={6} className="project-left-container">
              <Grid container>

                <Autocomplete

                  fullWidth
                  className='autocomplete-projectroot'
                  name="companyName"
                  options={companyData.map((company) => company.CompanyName)}
                  value={values.companyName || ''}
                  onChange={(event, newValue) => handleCompanyChange(event, newValue, setFieldValue)}
                  renderInput={(params) => <TextField {...params}
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                    placeholder="Select Company" />}

                />

              </Grid>
              <Grid container sx={{ mt: 2 }}>

                <TextField
                  className='autocomplete-projectroot'
                  fullWidth
                  placeholder="Project Name *"
                  name="ProjectName"
                  value={values.ProjectName}
                  onChange={handleChange}
                  error={touched.ProjectName && Boolean(errors.ProjectName)}
                  helperText={touched.ProjectName && errors.ProjectName}
                  InputProps={{
                    sx: {
                      padding: '5px', // Reduces padding inside the input
                    },
                  }}
                  inputProps={{
                    style: {
                      padding: '8px', // Customizes the inner input text padding
                    },
                  }}

                />
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    className='autocomplete-projectroot'
                    options={projectStatusOptions}
                    value={values.ProjectStatus || ''}
                    onChange={(event, newValue) => handleStatusChange(event, newValue, setFieldValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        error={touched.ProjectStatus && Boolean(errors.ProjectStatus)}
                        helperText={touched.ProjectStatus && errors.ProjectStatus}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Autocomplete
                    className='autocomplete-projectroot'
                    name="PropertyType"
                    options={propertyTypes}
                    value={propertyTypes.find(option => option.value === values.PropertyTypeID) || null}
                    onChange={(event, newValue) => {
                      setFieldValue("PropertyType", newValue ? newValue.label : propertyTypes[0].label);
                      setFieldValue("PropertyTypeID", newValue ? newValue.value : propertyTypes[0].value);
                    }}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    renderInput={(params) => <TextField {...params} label="Type" />}
                  />

                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    className='autocomplete-projectroot'
                    fullWidth
                    placeholder="Email *"
                    name="Email"
                    value={values.Email}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.Email && Boolean(errors.Email)}
                    helperText={touched.Email && errors.Email}

                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    className='autocomplete-projectroot'
                    placeholder="Age Of Project *"
                    name="AgeOfProject"
                    value={values.AgeOfProject}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.AgeOfProject && Boolean(errors.AgeOfProject)}
                    helperText={touched.AgeOfProject && errors.AgeOfProject}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Mobile Number *"
                    className='autocomplete-projectroot'
                    name="MobileNumber"
                    value={values.MobileNumber}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.MobileNumber && Boolean(errors.MobileNumber)}
                    helperText={touched.MobileNumber && errors.MobileNumber}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Secondary Mobile *"
                    className='autocomplete-projectroot'
                    name="SecondaryMobileNumber"
                    value={values.SecondaryMobileNumber}
                    onChange={handleChange}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.SecondaryMobileNumber && Boolean(errors.SecondaryMobileNumber)}
                    helperText={touched.SecondaryMobileNumber && errors.SecondaryMobileNumber}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Address1 *"
                    name="Address1"
                    className='autocomplete-projectroot'
                    value={values.Address1}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.Address1 && Boolean(errors.Address1)}
                    helperText={touched.Address1 && errors.Address1}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Address2"
                    name="Address2"
                    className='autocomplete-projectroot'
                    value={values.Address2}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="City *"
                    name="City"
                    value={values.City}
                    onChange={handleChange}
                    className='autocomplete-projectroot'
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.City && Boolean(errors.City)}
                    helperText={touched.City && errors.City}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="State *"
                    name="State"
                    value={values.State}
                    onChange={handleChange}
                    className='autocomplete-projectroot'
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.State && Boolean(errors.State)}
                    helperText={touched.State && errors.State}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    placeholder="Locality *"
                    name="Locality"
                    className='autocomplete-projectroot'
                    value={values.Locality}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.Locality && Boolean(errors.Locality)}
                    helperText={touched.Locality && errors.Locality}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Sub Locality *"
                    name="subLocality"
                    className='autocomplete-projectroot'
                    value={values.subLocality}
                    onChange={handleChange}
                    error={touched.subLocality && Boolean(errors.subLocality)}
                    helperText={touched.subLocality && errors.subLocality}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>

            </Grid>

            {/* Right Container */}
            <Grid item xs={12} sm={6} className="project-right-container">
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    placeholder="Zipcode *"
                    name="Zipcode"
                    value={values.Zipcode}
                    onChange={handleChange}
                    className='autocomplete-projectroot'
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.Zipcode && Boolean(errors.Zipcode)}
                    helperText={touched.Zipcode && errors.Zipcode}
                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Geolocation"
                    name="geolocation"
                    className='autocomplete-projectroot'
                    value={`${values.Latitude || ''}, ${values.Longitude || ''}`}
                    onChange={(e) => {
                      const value = e.target.value;
                      const coordinates = value.split(',').map(coord => coord.trim());

                      if (coordinates.length === 2) {
                        const [latitude, longitude] = coordinates;
                        setFieldValue('Latitude', latitude);
                        setFieldValue('Longitude', longitude);
                      }
                    }}
                    required
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    placeholder="Enter latitude, longitude"
                    error={(touched.Latitude && Boolean(errors.Latitude))}
                    helperText={(touched.Latitude && errors.Latitude)}

                    InputProps={{
                      sx: {
                        padding: '5px', // Reduces padding inside the input
                      },
                    }}
                    inputProps={{
                      style: {
                        padding: '8px', // Customizes the inner input text padding
                      },
                    }}
                  />
                </Grid>
              </Grid>
          
              <TextField 
                  sx={{
                    mt: 2,
                    "& .MuiInputBase-input": {
                      padding: "12px", // Ensures text inside the input is properly spaced
                    },
                    "& .MuiInputBase-input::placeholder": {
                      padding: "0px", // Keep placeholder aligned with text
                    },
                    "& .MuiOutlinedInput-root": {
                      "& textarea": {
                        padding: "12px", // Ensures padding applies to multiline input
                      }
                    }
                  }}
                fullWidth
                placeholder="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                className='autocomplete-projectroot'
                multiline
                rows={6}
              />
              <Grid item xs={12} sm={6} className="amenities-container">
                <div className="amenities-grid">
                  {amenitiesData.map((category) => (
                    <div key={category.category} className="amenities-group">
                      <h4 className="amenities-title">{category.category}: </h4>
                      <div className="amenities-options">
                        {category.subcategories.map((amenity) => (
                          <label key={amenity.AmenitiesID} className="amenities-option">
                            <input
                              type="checkbox"
                              name="Amenities"
                              value={amenity.Amenities}
                              checked={values.Amenities?.includes(amenity.Amenities) ?? false}
                              onChange={(e) => handleAmenitiesChange(e, setFieldValue, values, amenity.Amenities)}
                            />
                            {amenity.Amenities}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className="project-right1-container">
              <Box className="projectmap-box">
                <AddProjectmap
                  formData={values}
                  updateGeolocation={handleGeolocationChange}
                  setFieldValue={setFieldValue}
                  setTouched={setTouched}
                  inputRef={inputRef}
                  geolocation={geolocation}
                  setGeolocation={setGeolocation}
                />
                <AddProjectImg
                  propertyImages={propertyImages}
                  setPropertyImages={setPropertyImages}
                  projectimgerror={projectimgerror}
                  setProjectimgerror={setProjectimgerror}
                />
              </Box>
            </Grid>
            <Box className="projectsubmit-btn">
              <Button variant="contained" type="submit" className="addproject-btn">
                {loading || isSubmitting ? <CircularProgress size={24} /> : 'Submit Project'}
             </Button>
            </Box>

          </Form>)

        }}
      </Formik>

    </div>
  );
};

export default AddProject;
