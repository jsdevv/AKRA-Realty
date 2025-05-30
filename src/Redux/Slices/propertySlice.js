import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListings, 
         fetchPropertyStatusOptions, 
         fetchCustomPropertyTypes, 
         fetchPropertyHomeType, 
         fetchPremiumListings, 
         fetchPropertyView,  
         fetchProjectView,         
         fetchProjectFavorites,
         fetchPropertyFavorites,
         fetchpropertyVideos
        } from '../../API/api';

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const data = await fetchListings(bearerToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPropertyStatusOptionsThunk = createAsyncThunk(
  'properties/fetchPropertyStatusOptions',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const options = await fetchPropertyStatusOptions(bearerToken);
      return options.map(option => ({ value: option.PropertyStatus, label: option.PropertyStatus }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCustomPropertyTypeoptions = createAsyncThunk(
  'properties/fetchCustomPropertyTypes',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const options = await fetchCustomPropertyTypes(bearerToken);
      // Map the custom property types to the desired structure
      return options.map(option => ({
        value: option.CustomPropertyTypesID,
        label: option.CustomPropertyTypes
      }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

export const fetchPremiumListingsThunk = createAsyncThunk(
  'properties/fetchPremiumListings',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const data = await fetchPremiumListings(bearerToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// views
export const sendPropertyView = createAsyncThunk(
  "property/sendPropertyView",
  async ({ PropertyID, UserID, bearerToken }, { rejectWithValue }) => {
    try {
      const response = await fetchPropertyView(bearerToken, { PropertyID, UserID });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendProjectView = createAsyncThunk(
  "property/sendProjectView",
  async ({ ProjectID, UserID, bearerToken }, { rejectWithValue }) => {
    try {
      const response = await fetchProjectView(bearerToken, { ProjectID, UserID });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const response = await fetchpropertyVideos(bearerToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



function isPointInBounds(point, bounds) {
  return (
    point.lat() >= bounds.southwest.lat &&
    point.lat() <= bounds.northeast.lat &&
    point.lng() >= bounds.southwest.lng &&
    point.lng() <= bounds.northeast.lng
  );
}

// Async thunk for fetching favorites
export const fetchGetprojectFavorites = createAsyncThunk(
  'favorites/fetchGetprojectFavorites',
  async (bearerToken, { rejectWithValue }) => {
      try {
          const data = await fetchProjectFavorites(bearerToken);
          return data; // Ensure data is returned as an array
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

export const fetchGetpropertyFavorites = createAsyncThunk(
  'favorites/fetchGetpropertyFavorites',
  async (bearerToken, { rejectWithValue }) => {
      try {
          const data = await fetchPropertyFavorites(bearerToken);
          return data; // Ensure data is returned as an array
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    videos: [],
    filteredProperties: [],
    filteredVideos:[],
    premiumListings: [], // Add a new state for premium listings
    selectedBuilder:'',
    selectedProperty: null,
    showPremiumListings: false,
    loading: false,
    error: null,
    searchTerm: '',
    selectedPropertyStatus: '',
    selectedcustomStatus:[],
    selectedHomeTypes: [],
    priceFilter: [],
    currentPage: 0,
    itemsPerPage: 12,
    propertyStatusOptions: [],
    homeTypeOptions: [],
    visibleProperties: [],
    visibleVideos: [],
    groupedProperties: {},
    mapBounds: null,
    mapCircleBounds: null,
    mapPolygonBounds: null,
    selectedAgentProperty: null,
    selectedCenterOfMap: null,
    Projectfavorites: [],
    Propertyfavorites: [],
 

  },
  reducers: {
    setSelectedBuilder: (state, action) => {
      state.selectedBuilder = action.payload; // Update the selected builder in the state
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedPropertyStatus(state, action) {
      state.selectedPropertyStatus = action.payload;
    },
    setSelectedCenterOfMap(state, action) {
      state.selectedCenterOfMap = action.payload;
    },
    setSelectedcustomStatus(state, action) {
      state.selectedcustomStatus = action.payload;
    },
    setSelectedHomeTypes(state, action) {
      state.selectedHomeTypes = action.payload;
    },
    setPriceFilter(state, action) {
      state.priceFilter = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSelectedProperty(state, action) {
      state.selectedProperty = action.payload;
    },
    clearSelectedProperty(state) {
      state.selectedProperty = null;
    },
    setMapBounds(state, action) {
      state.mapBounds = action.payload;
    },
    setMapCircleBounds(state, action) {
      state.mapCircleBounds = action.payload;
    },
    setMapPolygonBounds(state, action) {
      state.mapPolygonBounds = action.payload;
    },
    setFilteredProperties(state, action) {
      state.filteredProperties = action.payload;
    },
    setListingFilters(state, action) {
      const getProperties = () => {
        const baseProperties = state.showPremiumListings
          ? ((state.selectedBuilder && state.selectedBuilder.length > 0)
            ? state.premiumListings.filter(
                (listing) => state.selectedBuilder.some((builder) => builder.PremiumCompanies === listing.PremiumCompanies)
              )  // Filter by selected builder
            : state.premiumListings) 
          : state.properties;

        return baseProperties
          .filter((property) => {
            const matchesSearchTerm = [
              property.CompanyName,
              property.ProjectName,
              property.PropertyName,
              property.Locality,       
              property.PropertyCity,
              property.PropertyState,
              property.PropertyZipCode
            ].some((field) =>
              field && field.toLowerCase().includes(state.searchTerm.toLowerCase() || "")
            );
    
            const matchesFilters =
              (!state.selectedPropertyStatus ||
                property.PropertyStatus === state.selectedPropertyStatus) &&
              (state.selectedHomeTypes.length === 0 ||
                state.selectedHomeTypes.includes(String(property.PropertyTypeID))) &&
              (state.priceFilter.length === 0 ||
                state.priceFilter.some(
                  (price) =>
                    property.DisplayAmount >= price.minPrice &&
                    property.DisplayAmount <= price.maxPrice
                )) &&
              (state.selectedcustomStatus.length === 0 ||
                state.selectedcustomStatus.some((cs) =>
                  property.CustomStatus?.includes(cs)
                ));
    
            return matchesSearchTerm && matchesFilters;
          })
          .filter((property) => {
            const propertyLatLng = new window.google.maps.LatLng(
              parseFloat(property.PropertyLatitude),
              parseFloat(property.PropertyLongitude)
            );
            if (state.mapCircleBounds) {
              const distance =
                window.google.maps.geometry.spherical.computeDistanceBetween(
                  state.mapCircleBounds.circleCenter,
                  propertyLatLng
                );
              return distance <= state.mapCircleBounds.circleRadius;
            } else if (state.mapPolygonBounds) {
              const polygon = new window.google.maps.Polygon({
                paths: state.mapPolygonBounds,
              });
              return window.google.maps.geometry.poly.containsLocation(
                propertyLatLng,
                polygon
              );
            } else {
              return state.mapBounds ? isPointInBounds(propertyLatLng, state.mapBounds) : true;
            }
          });
      };


      const groupProperties = (properties) => {
        const groupedProperties = properties.reduce((acc, property) => {
          const key = `${property.PropertyLatitude}_${property.PropertyLongitude}`;
        
          if (!acc[key]) {
            acc[key] = {
              PropertyLatitude: property.PropertyLatitude,
              PropertyLongitude: property.PropertyLongitude,
              PropertyCount: 0,
              Amount: [],
              Bedrooms: [],
              Area: [],
              UnitTypeDetails: [],
            };
          }
        
          acc[key].PropertyCount++;
          acc[key].Amount.push(property.Amount);
          acc[key].Bedrooms.push(property.Bedrooms);
          acc[key].Area.push(property.SqFt);
          acc[key].UnitTypeDetails.push({
            ImageNames: property.ImageNames,
            Bedrooms: property.Bedrooms,
            Amount: property.Amount,
            PropertyID: property.PropertyID,
            SqFt: property.SqFt,
            PropertyBathrooms: property.PropertyBathrooms,
            ...property
          });
        
          return acc;
        }, {});
        return groupedProperties;
      };
      const visibleProperties = getProperties();
      state.visibleProperties = visibleProperties;
      state.groupedProperties = groupProperties(visibleProperties);
    },

    setFilteredVideos(state,action) {
      const filteredVideos = state.videos.filter((video) => {  
        const matchesSearchTerm = [
          video.CompanyName,
          video.ProjectName,
          video.PropertyName,
          video.Locality,
          video.PropertyCity,
          video.PropertyState,
          video.PropertyZipCode
        ].some((field) =>
          field && field.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
    
        const matchesFilters =
          (!state.selectedPropertyStatus || video.PropertyStatus === state.selectedPropertyStatus) &&
          (state.selectedHomeTypes.length === 0 || state.selectedHomeTypes.includes(String(video.PropertyTypeID))) &&
          // (state.selectedcustomStatus.length === 0 || state.selectedcustomStatus.some((cs) =>
          //   video.CustomStatus?.includes(cs)
          // )) 
          
          (state.selectedcustomStatus.length === 0 ||
            state.selectedcustomStatus.some((cs) =>
              video.CustomPropertyTypes?.includes(cs)
            ))
          &&
          (state.priceFilter.length === 0 ||  
            state.priceFilter.some(
              (price) =>
                video.DisplayAmount >= price.minPrice &&
                video.DisplayAmount <= price.maxPrice
            ));
    
        return matchesSearchTerm && matchesFilters;
      });
    
      state.visibleVideos = filteredVideos;
  
    },

    toggleShowPremiumListings(state) {
      state.showPremiumListings = !state.showPremiumListings; // Toggle premium listings view
  },
  setSelectedAgentProperty: (state, action) => {
    state.selectedAgentProperty = action.payload; // Set selected property for the agent
  },
  clearSelectedAgentProperty: (state) => {
    state.selectedAgentProperty = null; // Clear selected agent property
  },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProperties.pending, (state) => {
      if (state.loading === false && state.properties.length === 0) {
        state.loading = true;
      }
    })    
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.filteredProperties = action.payload; // Initial filtering can be applied here
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPropertyStatusOptionsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyStatusOptionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.propertyStatusOptions = action.payload;
      })
      .addCase(fetchPropertyStatusOptionsThunk.rejected, (state, action) => {
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
      })
      .addCase(fetchPremiumListingsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPremiumListingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.premiumListings = action.payload; // Store premium listings in state
      })
      .addCase(fetchPremiumListingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendPropertyView.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendPropertyView.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendPropertyView.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendProjectView.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendProjectView.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendProjectView.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchGetprojectFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchGetprojectFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.Projectfavorites = action.payload;
    })
    .addCase(fetchGetprojectFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(fetchGetpropertyFavorites.pending, (state) => {
      state.loading = true;
      state.error = null;
  })
  .addCase(fetchGetpropertyFavorites.fulfilled, (state, action) => {
      state.loading = false;
      state.Propertyfavorites = action.payload;
  })
  .addCase(fetchGetpropertyFavorites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
  })
  .addCase(fetchVideos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchVideos.fulfilled, (state, action) => {
          state.loading = false;
          state.videos = action.payload;
          state.visibleVideos = action.payload;
        })
        .addCase(fetchVideos.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  ;
  },
});

export const {
  setSelectedBuilder,
  setSearchTerm,
  setSelectedPropertyStatus,
  setSelectedcustomStatus,
  setSelectedHomeTypes,
  setPriceFilter,
  setCurrentPage,
  setMapBounds,
  setMapCircleBounds,
  setMapPolygonBounds,
  setFilteredProperties,
  setListingFilters,
  setFilteredVideos,
  setSelectedProperty,
  setSelectedCenterOfMap,
  clearSelectedProperty,
  toggleShowPremiumListings,
  setSelectedAgentProperty,
  clearSelectedAgentProperty 
} = propertySlice.actions;

export default propertySlice.reducer;
