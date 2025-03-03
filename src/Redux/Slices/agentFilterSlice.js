import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPropertyStatusOptions, fetchPropertyHomeType } from "../../API/api";

const initialState = {
    selectedAgentPropertyType: [],
    selectedAgentpriceFilter: [],
    selectedAgentPropertyStatus: 'Select Status',
    selectAllAgentProperties: false,
    statusOptions: [],
    selectedHomeTypes: [],
    searchFilter: '',
    loading: false,
    error: null,
};

// Create async thunk for fetching property status options
export const fetchStatusOptions = createAsyncThunk(
    'agentFilter/fetchStatusOptions',
    async (bearerToken) => {
        const response = await fetchPropertyStatusOptions(bearerToken);
        return response; // Assuming response is an array of options
    }
);

// Create async thunk for fetching home type options
export const fetchPropertyHomeTypeThunk = createAsyncThunk(
    'properties/fetchPropertyHomeType',
    async (bearerToken, { rejectWithValue }) => {
      try {
        const options = await fetchPropertyHomeType(bearerToken);
        return options.map(option => ({ value: option.PropertyTypeID, label: option.PropertyType }));
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const agentFilterSlice = createSlice({
    name: 'agentFilter',
    initialState,
    reducers: {
        setSearchFilter: (state, action) => { // New action for search input
            state.searchFilter = action.payload;
        },
        setSelectedAgentPropertyStatus: (state, action) => {
            state.selectedAgentPropertyStatus = action.payload;
        },
        setSelectedAgentPropertyType(state, action) {
            state.selectedHomeTypes = action.payload; 
        },  
        setSelectedAgentPriceFilter: (state, action) => {
            state.selectedAgentpriceFilter = action.payload; // Set price range here
        },
        setSelectAllAgentProperties(state, action) {
            state.selectAllAgentProperties = action.payload;
        },
        clearAgentFilters: (state) => {
            return {
                ...initialState,
                statusOptions: state.statusOptions, // Preserve fetched options
                homeTypeOptions: state.homeTypeOptions, // Preserve fetched options
            };
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatusOptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatusOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.statusOptions = action.payload.map(option => ({ value: option.PropertyStatus, label: option.PropertyStatus }));
            })
            .addCase(fetchStatusOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
             .addCase(fetchPropertyHomeTypeThunk.pending, (state) => {
                state.loading = true;
              })
              .addCase(fetchPropertyHomeTypeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.homeTypeOptions = action.payload;
              })
              .addCase(fetchPropertyHomeTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              });
    },
});

export const {
    setSearchFilter,
    setSelectedAgentPropertyStatus,
    setSelectedAgentPropertyType,
    setSelectAllAgentProperties,
    clearAgentFilters,
    setSelectedAgentPriceFilter,
} = agentFilterSlice.actions;

export default agentFilterSlice.reducer;
