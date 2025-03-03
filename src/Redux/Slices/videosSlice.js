import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchpropertyVideos } from '../../API/api';

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

const videosSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    loading: false,
    error: null,
    fetched: false, // Track if data is already fetched
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
        state.fetched = true;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default videosSlice.reducer;
