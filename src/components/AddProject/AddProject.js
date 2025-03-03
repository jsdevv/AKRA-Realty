import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, IconButton, Autocomplete, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { RiDeleteBin5Line } from 'react-icons/ri';
import './AddProject.css';
import AddProjectmap from './AddProjectmap';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcompanynameData } from '../../Redux/Slices/addListingsSlice';
import { fetchPropertyHomeTypeThunk, fetchPropertyStatusOptionsThunk } from '../../Redux/Slices/propertySlice';
import { fetchAddProject } from '../../API/api';
import * as Yup from 'yup';
import { amenitiesData } from '../steppers/stepper4/amniData';

const AddProject = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const companyData = useSelector((state) => state.listings.companyData) || [];
  const propertyTypes = useSelector((state) => state.properties.homeTypeOptions) || [];
  const propertyStatus = useSelector((state) => state.properties.propertyStatusOptions) || [];
  const projectStatusOptions = ['Ongoing', 'Completed'];


  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
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
    Longitude: '',
    images: []
  };

  const [formData, setFormData] = useState(initialValues);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const domainOnlyRegex = /^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDotsRegex = /\.{2,}/;
  const specialCharStartRegex = /^[._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDigitsRegex = /(.)\1{5,}/;
  const indianZipRegex = /^[1-9][0-9]{5}$/;

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    CompanyID: Yup.string().required("Company ID is required"),
    ProjectName: Yup.string().required("Project Name is required"),
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
    // geolocation: Yup.number().required("Geolocation is required"),
    // images: Yup.array().min(1, "At least one image is required"),
  });
  const dispatch = useDispatch();

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



  const handleImageChange = (e) => {
    const files = e.target.files;
    setFormData(prevData => ({ ...prevData, images: [...prevData.images, ...files] }));
  };

  const handleImageRemove = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prevData => ({ ...prevData, images: updatedImages }));
  };

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

    let updatedAmenities = values.PropertyAmenities || '';

    if (checked) {
      updatedAmenities = updatedAmenities ? `${updatedAmenities}, ${amenity}` : amenity;
    } else {
     updatedAmenities = updatedAmenities.replace(new RegExp(`(?:^|, )${amenity}(?=,|$)`, 'g'), '');
    }

    console.log(updatedAmenities, "updated");
    setFieldValue("PropertyAmenities", updatedAmenities);
  };

  const handleCompanyChange = (event, newValue, setFieldValue) => {
    const selectedCompanyData = companyData.find((company) => company.CompanyName === newValue);
    const selectedCompanyID = selectedCompanyData ? selectedCompanyData.CompanyID : '';

    console.log(selectedCompanyID, newValue, "company");

    setFieldValue("companyName", newValue || '');
    setFieldValue("CompanyID", selectedCompanyID); // Ensure CompanyID is set in Formik state
  };




  const handleSubmit = async (values, { resetForm }) => {
    console.log(values, "values");
    setLoading(true); // Set loading state to true when submission starts
    try {
      await fetchAddProject(values, bearerToken); // Call the API or submission function
      resetForm(); // Reset the form after successful submission
      setFormData(initialValues); // Ensure the form data is reset to initial values
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Set loading state to false after submission
    }
  };




  return (
    <div className="add-project-container__main">
      <h2 className="add-project-title">Add Project</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, resetForm, touched, values, errors, setFieldValue, handleChange }) => {

          console.log(errors, "error");
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
                    className="autocomplete-projectroot1"
                    options={projectStatusOptions}
                    value={values.ProjectStatus || ''}
                    onChange={(event, newValue) => handleStatusChange(event, newValue, setFieldValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Status"
                        error={touched.ProjectStatus && Boolean(errors.ProjectStatus)}
                        helperText={touched.ProjectStatus && errors.ProjectStatus}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Autocomplete
                    className='autocomplete-projectroot1'
                    name="PropertyType"
                    options={propertyTypes}
                    value={propertyTypes.find(option => option.value === values.PropertyTypeID) || null}
                    onChange={(event, newValue) => {
                      setFieldValue("PropertyType", newValue ? newValue.label : propertyTypes[0].label);
                      setFieldValue("PropertyTypeID", newValue ? newValue.value : propertyTypes[0].value);
                    }}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    renderInput={(params) => <TextField {...params} label="Property Type" />}
                  />


                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    className='autocomplete-projectroot'
                    fullWidth
                    label="Email *"
                    name="Email"
                    value={values.Email}
                    onChange={handleChange}

                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    error={touched.Email && Boolean(errors.Email)}
                    helperText={touched.Email && errors.Email}

                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    className='autocomplete-projectroot'
                    label="Age Of Project *"
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
                    label="Mobile Number *"
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
                    label="Secondary Mobile"
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
                    label="Address1 *"
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
                    label="Address2"
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



            </Grid>

            {/* Right Container */}
            <Grid item xs={12} sm={6} className="project-right-container">

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    label="City *"
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
                    label="State *"
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
                    label="Zipcode *"
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
                    error={touched.geolocation && Boolean(errors.geolocation)}
                    helperText={touched.geolocation && errors.geolocation}
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
                    label="Locality *"
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
                    label="Sub Locality"
                    name="subLocality"
                    className='autocomplete-projectroot'
                    value={values.subLocality}
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


              <TextField sx={{ mt: 2 }}
                fullWidth
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                className='autocomplete-projectroot'
                multiline
                rows={8}

              />

            </Grid>
            <Grid item xs={12} sm={6} className="project-right1-container">
              <Box className="projectmap-box">
                <AddProjectmap formData={formData} updateGeolocation={handleGeolocationChange} setFieldValue={setFieldValue} />
              </Box>

            </Grid>
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
                            name="PropertyAmenities"
                            value={amenity.Amenities}
                            checked={values.PropertyAmenities?.includes(amenity.Amenities) ?? false}
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


            <Grid item xs={12} sm={6} className="project-right2-container">
              <Box className="image-upload-box">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
                <div className="image-preview">
                  {formData.images.length > 0 &&
                    formData.images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={URL.createObjectURL(image)} alt={`image-${index}`} />
                        <IconButton onClick={() => handleImageRemove(index)} className="projectremove-icon">
                          <RiDeleteBin5Line />
                        </IconButton>
                      </div>
                    ))}
                </div>
              </Box>

            </Grid>
            <Grid className='addproject-container'>
              <Button variant="contained" type="submit" className="addproject-btn">
                {loading || isSubmitting ? <CircularProgress size={24} /> : 'Submit Project'}
              </Button>
            </Grid>

          </Form>)

        }}
      </Formik>

    </div>
  );
};

export default AddProject;
