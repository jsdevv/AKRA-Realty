import React from 'react';
import { Formik, Field, Form } from 'formik';
import {
  TextField,
  Button,
  Grid,
  InputAdornment,
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FaRupeeSign } from '../../assets/icons/Icons';
import './FiltersComponent.css';

const FiltersComponent = () => {
  const initialValues = {
    squareFeetMin: '',
    squareFeetMax: '',
    lotSizeMin: '',
    lotSizeMax: '',
    priceMin: '',
    priceMax: '',
    yearBuiltMin: '',
    yearBuiltMax: '',
  };

  const handleSubmit = (values) => {
    console.log('Form Submitted:', values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <Grid container spacing={2} className="filters-container">

          <Grid item xs={12}>
                <Grid container spacing={0}>
                  <Grid item>
                    <Field
                      as={FormControlLabel}
                      control={<Checkbox name="unitSqFt" sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                      sx={{ padding: '0px'}}
                      label="SqFt"
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      as={FormControlLabel}
                      control={<Checkbox name="unitSqYds" sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }} />}
                      sx={{ padding: '0px'}}
                      label="SqYds"
                    />
                  </Grid>
                </Grid>
            </Grid>
            
            <Grid item xs={12}  className="area-grid-item">
              <Typography variant="subtitle2">Area</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="squareFeetMin"
                    placeholder="Min"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: '0px',  // Reduce the padding
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="squareFeetMax"
                    placeholder="Max"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    
                
                  />
                </Grid>
              </Grid>
            </Grid>



            {/* Lot Size */}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Lot Size</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="lotSizeMin"
                    placeholder="Min"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
              
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="lotSizeMax"
                    placeholder="Max"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    // InputProps={{
                    //   endAdornment: <InputAdornment position="end">SqFt</InputAdornment>,
                    // }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Price Range */}
            <Grid item xs={12}>
              <Typography variant="subtitle2">Price Range</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="priceMin"
                    placeholder="Min"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"> <FaRupeeSign size={11} /> </InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    name="priceMax"
                    placeholder="Max"
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"> <FaRupeeSign size={11} /> </InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Button type="submit"   size="medium" variant="outlined"  fullWidth className="apply-filters-button1">
                Reset 
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button type="submit"   size="medium" fullWidth className="apply-filters-button">
                Apply 
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default FiltersComponent;
