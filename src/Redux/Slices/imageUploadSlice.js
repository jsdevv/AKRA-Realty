import { createSlice } from '@reduxjs/toolkit';
import { uploadImages } from '../../API/api'; // Import the API call

const initialState = {
  images: [], // Store objects { file, previewUrl }

  error: '',
};

const imageUploadSlice = createSlice({
  name: 'imageUpload',
  initialState,
  reducers: {
    addImages: (state, action) => {
      const { file, previewUrl } = action.payload;
      if (state.images.length < 12) {
        const fileMetadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        state.images.push({ file: fileMetadata, previewUrl });
        state.error = ''; // Clear any previous error
      } else {
        state.error = 'You can upload a maximum of 12 images.';
      }
    },
    
    removeImage: (state, action) => {
      const index = action.payload;
      URL.revokeObjectURL(state.images[index].previewUrl); // Cleanup preview URL
      state.images.splice(index, 1); // Remove image from the array
    },
    clearError: (state) => {
      state.error = '';
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});


export const { addImages, removeImage,  setError, clearError } = imageUploadSlice.actions;

// Async action for image upload
export const uploadImageAsync = (imageData) => async (dispatch, getState) => {
  const { imagePropertyId, imageFile, bearerToken } = imageData; // Renamed "file" to "imageFile"
  
  if (!imagePropertyId) {
    dispatch(setError('Property ID is not set.'));
    return;
  }

  dispatch(clearError()); // Clear any previous errors

  try {
    const result = await uploadImages(imagePropertyId, imageFile, bearerToken);
    console.log('Upload Result:', result);

    const previewUrl = URL.createObjectURL(imageFile); // Generate preview
    const fileMetadata = {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      lastModified: imageFile.lastModified,
    };
    
    dispatch(addImages({ file: fileMetadata, previewUrl })); // Store metadata and preview URL
  } catch (error) {
    dispatch(setError('Image upload failed. Please try again.'));
    console.error('Image upload failed:', error);
  }
};

export default imageUploadSlice.reducer;
