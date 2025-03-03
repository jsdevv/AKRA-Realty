import React, { useState } from 'react';
import { TextField, Button, Grid, InputLabel, MenuItem, Select, FormControl, Box, IconButton, Autocomplete } from '@mui/material';
import { FaUpload } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import './Addcompany.css';

const companyOptions = [
    { label: 'Company 1' },
    { label: 'Company 2' },
    { label: 'Company 3' }
];

const Addcompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        companyName: '',
        propertyType: '',
        geolocation: '',
        city: '',
        zipcode: '',
        state: '',
        locality: '',
        subLocality: '',
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCompanyChange = (event, newValue) => {
        setFormData({ ...formData, companyName: newValue ? newValue.label : '' });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files) {
            setFormData({ ...formData, images: [...formData.images, ...Array.from(files)] });
        }
    };

    const handleImageRemove = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Reset form after submission
        setFormData({
            companyName: '',
            description: '',
            companyName: '',
            propertyType: '',
            geolocation: '',
            city: '',
            zipcode: '',
            state: '',
            locality: '',
            subLocality: '',
            images: []
        });
    };

    return (
        <div className="add-company-container__main">
            <h2 className="add-company-title">Add company</h2>
            <form onSubmit={handleSubmit} className="add-company-grid">

                {/* Align Company Name and company Name in the same row */}
                <Grid item xs={12} sm={6} className="company-left-container">
                    <Grid container spacing={2}>


                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Num Of Projects"
                                name="numofprojects"
                                value={formData.numofprojects}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                    </Grid>



                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Age Of company"
                                name="ageofcompany"
                                value={formData.ageofcompany}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>

                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobilenumber"
                                value={formData.mobilenumber}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Secondary Mobile"
                                name="secondarymobilenumber"
                                value={formData.secondarymobilenumber}
                                onChange={handleChange}
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Address1"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Address2"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                    </Grid>



                </Grid>

                {/* Right Container */}
                <Grid item xs={12} sm={6} className="company-right-container">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Zipcode"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Geolocation"
                                name="geolocation"
                                value={formData.geolocation}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>

                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Locality"
                                name="locality"
                                value={formData.locality}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Sub Locality"
                                name="subLocality"
                                value={formData.subLocality}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                            />
                        </Grid>
                    </Grid>


                    <TextField sx={{ mt: 2 }}
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}

                    />

                </Grid>
                <Grid item xs={12} sm={6} className="company-right1-container">
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
                                        <IconButton onClick={() => handleImageRemove(index)} className="companyremove-icon">
                                            <RiDeleteBin5Line />
                                        </IconButton>
                                    </div>
                                ))}
                        </div>
                    </Box>




                </Grid>

            </form>

            <Grid className='addcompany-container'>
                <div className="submit-btn-container">
                    <Button variant="contained" type="submit" className="addcompany-btn">
                        Submit
                    </Button>
                </div>
            </Grid>

        </div>
    );
};

export default Addcompany;
