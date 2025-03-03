import React from 'react';
import { useDispatch } from 'react-redux';
import { AddlistingFormData } from '../../../Redux/Slices/addListingsSlice';
import { useFormikContext } from 'formik';
import { amenitiesData } from './amniData';
import './Stepper4.css';
import { Autocomplete, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const Stepper4 = () => {

  const furnishingOptions = [
    { label: 'Fully Furnished', value: 'Fully Furnished' },
    { label: 'Semi-Furnished', value: 'Semi-Furnished' },
    { label: 'Unfurnished', value: 'Unfurnished' }
  ];

  const parkingOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },

  ];



  const dispatch = useDispatch();
  const { values, handleChange, setFieldValue } = useFormikContext();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    dispatch(AddlistingFormData({ [name]: value }));
  };

  const handleAmenitiesChange = (e, setFieldValue, values, amenity) => {
    const { checked } = e.target;

    let updatedAmenities = values.PropertyAmenities || '';

    // If the checkbox is checked, add the amenity to the string
    if (checked) {
      updatedAmenities = updatedAmenities ? `${updatedAmenities}, ${amenity}` : amenity;
    } else {
      // If the checkbox is unchecked, remove the amenity from the string
      updatedAmenities = updatedAmenities.replace(new RegExp(`(?:^|, )${amenity}(?=,|$)`, 'g'), '');
    }

    console.log(updatedAmenities, "updated");

    // Update Formik's state with the new string value
    setFieldValue("PropertyAmenities", updatedAmenities);
  };


  return (
    <div className="stepper4">
      <div className="stepper4-container">

        <div className="stepper4-group">
          <label htmlFor="plotno">Plot/Flat No: </label>
          <TextField
            className="custom-textfield4"
            placeholder='Plot No'
            id="plotno"
            type="text"
            name="plotno"
            value={values.plotno}
            onChange={handleFieldChange}

          />

          <label htmlFor="Bedrooms">Floor Number:</label>
          <TextField
            className="custom-textfield4"
            placeholder='Floor'
            id="PropertyFloorNumber"
            type="number"
            name="PropertyFloorNumber"
            value={values.PropertyFloorNumber} // Formik's value
            onChange={handleFieldChange}

          />

        </div>


        <div className="stepper4-group">

          <label htmlFor="Bedrooms">Bedrooms:</label>
          <TextField
            className="custom-textfield4"
            placeholder='Bedrooms'
            id="Bedrooms"
            type="number"
            name="Bedrooms"
            value={values.Bedrooms} // Formik's value
            onChange={handleFieldChange}

          />
          <label className="stepper4-label" htmlFor="PropertyBathrooms">Bathrooms:    </label>
          <TextField
            className="custom-textfield4"
            placeholder='Bathrooms'
            id="PropertyBathrooms"
            type="number"
            name="PropertyBathrooms"
            value={values.PropertyBathrooms} // Formik's value
            onChange={handleFieldChange}

          />

        </div>

        <div className="stepper4-group">
          <label className="stepper4-label" htmlFor=" PropertyFurnishing">Parking: </label>



          <Autocomplete
            className="custom-autocomplete4"
            options={parkingOptions}
            getOptionLabel={(option) => option.label}
            value={parkingOptions.find((opt) => opt.value === values.PropertyParking) || null}
            onChange={(_, newValue) => {
              setFieldValue('PropertyParking', newValue ? newValue.value : '');
              dispatch(AddlistingFormData({ PropertyParking: newValue ? newValue.value : '' }));
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select parking" />
            )}
          />

          <label htmlFor="Parkingslot">Parking Slot:       </label>
          <TextField
            className="custom-textfield4"
            placeholder='Parking Slot'
            id="Parkingslot"
            type="number"
            name="Parkingslot"
            disabled={values.PropertyParking === 'No'}
            value={values.Parkingslot} // Formik's value
            onChange={handleFieldChange}
            required

          />



        </div>

        <div className="stepper4-group">


          <label className="stepper4-label" htmlFor=" PropertyFurnishing">Furnishing </label>



          <Autocomplete
            className="custom-autocomplete4"
            options={furnishingOptions}
            getOptionLabel={(option) => option.label}
            value={furnishingOptions.find((opt) => opt.value === values.PropertyFurnishing) || null}
            onChange={(_, newValue) => {
              setFieldValue('PropertyFurnishing', newValue ? newValue.value : '');
              dispatch(AddlistingFormData({ PropertyFurnishing: newValue ? newValue.value : '' }));
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Furnishing" />
            )}
          />

          <label htmlFor="AvailableFrom">
            Available from:  </label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className="custom-date-picker"
              placeholder="Available From"
              value={values.AvailableFrom || null} // Ensure it's handled properly
              onChange={(newDate) => {
                setFieldValue('AvailableFrom', newDate);
                dispatch(AddlistingFormData({ AvailableFrom: newDate }));
              }}
              renderInput={(params) => <TextField {...params} className="custom-date-input" />}
            />
          </LocalizationProvider>

        </div>

        <div className="stepper4-textgroup">
          <label className="stepper4-label1" htmlFor="PropertyNotes">
            Notes:  </label>


          <TextField
            className="stepper4-textarea"
            id="PropertyNotes"
            name="PropertyNotes"
            value={values.PropertyNotes} // Formik's value
            onChange={handleFieldChange}
            multiline
            rows={4} // Set the number of visible rows for the textarea
            variant="outlined" // Optional: You can also use 'filled' or 'standard' depending on the design you prefer
            placeholder="Enter notes here..."
          />

        </div>
      </div>

      <div className='stepper4-aminites'>

        {amenitiesData.map((category) => (
          <div key={category.category} className="amenities-category">
            <h4 className="amenities-category-title">{category.category}: </h4>
            <div className="amenities-options">
              {category.subcategories.map((amenity) => (
                <label key={amenity.AmenitiesID} className="amenities-option">
                  <input
                    type="checkbox"
                    name="PropertyAmenities"
                    value={amenity.Amenities}
                    checked={values.PropertyAmenities?.includes(amenity.Amenities) || false}
                    onChange={(e) => handleAmenitiesChange(e, setFieldValue, values, amenity.Amenities)}

                  />
                  {amenity.Amenities}
                </label>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>


  );
}
export default Stepper4;
