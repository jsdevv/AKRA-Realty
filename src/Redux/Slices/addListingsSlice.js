import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAddListings,fetchAddListingsAmenities,fetchcompanyname,fetchprojectname, fetchEditproperty } from '../../API/api'; // Import your API service function


  // Async action to handle the API request for fetching amenities
  export const fetchcompanynameData = createAsyncThunk(
    'listings/fetchcompanynameData',
    async (bearerToken, { rejectWithValue }) => {
      try {
        const data = await fetchcompanyname(bearerToken);
        return data; 
        
      } catch (error) {
        return rejectWithValue('Failed to fetch company details');
      }
    }
  );

  export const fetchprojectnameData = createAsyncThunk(
    'listings/fetchprojectnameData',
    async (bearerToken, { rejectWithValue }) => {
      try {
        const data = await fetchprojectname(bearerToken);
        return data; 
        
      } catch (error) {
        return rejectWithValue('Failed to fetch company details');
      }
    }
  );


  // Async action to handle the API request for fetching amenities
export const fetchAmenitiesData = createAsyncThunk(
  'listings/fetchAmenitiesData',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const data = await fetchAddListingsAmenities(bearerToken);
      return data; // Assuming this returns an array of amenities
    } catch (error) {
      return rejectWithValue('Failed to fetch amenities');
    }
  }
);
  
// Async action to handle the API request
export const EditListings = createAsyncThunk(
  'listings/EditListings',
  async ({ bearerToken, formData }, { rejectWithValue }) => {
    try {
      const response = await fetchEditproperty(bearerToken, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const submitAddListings = createAsyncThunk(
  'listings/submitAddListings',
  async ({ bearerToken, formData }, { rejectWithValue }) => {
    try {
      const response = await fetchAddListings(bearerToken, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addListingsSlice = createSlice({
  name: 'listings',
  initialState: {
    formData: {
    CompanyID:'',
    ProjectID:'',
    PropertyName: '',
    PropertyDescription: '',
    PropertyType: '',
    PropertyTypeID:'',
    SqFt: '',
    MeasurementType: '',
    Amount: '',
    PriceUnit:'',
    LotSize:'',
    LotSizeUnit:'',
    YearBuilt:'',
    PropertyMainEntranceFacing: '',
    PropertyStatus: '',
    PropertyPossessionStatus: '',
    PropertyFeatures:'',
    PropertyAddress1: '',
    PropertyAddress2: '',
    PropertyZipCode: '',
    PropertyCity: '',
    PropertyState: '',
    PropertyLandmark:'',
    Locality:'',
    ShowLocation:'',
    SubLocality:'',
    PropertyLatitude: '',
    PropertyLongitude: '', 
    district:'',
    plotno:'', 
    PropertyFloorNumber:'',
    Bedrooms: '',
    PropertyBathrooms: '',
    PropertyParking: '',
    Parkingslot:'',
    PropertyFurnishing: '',
    AvailableFrom: '',
    PropertyNotes: '',
    PropertyAmenities: ''
      // Add other fields as required
    },
    companyData: null,
    projectData: null,
    PropertyAmenities:[],
    countryData: [],
    imagepropertyid: null,
    selectedEditProperty: null,
    status: 'idle', 
    error: null,
  },
  reducers: {
    AddlistingFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setSelectedEditProperty: (state, action) => {
      state.selectedEditProperty = action.payload; // Action to set property for editing
  },
  clearSelectedProperty: (state) => {
      state.selectedProperty = null;
      state.selectedEditProperty = null; // Clear selected edit property when done
  },

  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAddListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitAddListings.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitAddListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit the listing';
      })
    .addCase(fetchAmenitiesData.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAmenitiesData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.PropertyAmenities = action.payload; // Store fetched amenities
    })
    .addCase(fetchAmenitiesData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Failed to fetch amenities';
    })
    .addCase(fetchcompanynameData.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchcompanynameData.fulfilled, (state,action) => {
      state.status = 'succeeded';
      state.companyData = action.payload; 
    })
    .addCase(fetchcompanynameData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Failed to fetch company names';
    })
    .addCase(fetchprojectnameData.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchprojectnameData.fulfilled, (state,action) => {
      state.status = 'succeeded';
      state.projectData = action.payload; 
    })
    .addCase(fetchprojectnameData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Failed to fetch company names';
    });
  },
});

export const { AddlistingFormData,setSelectedEditProperty, clearSelectedProperty} = addListingsSlice.actions;
export default addListingsSlice.reducer;
