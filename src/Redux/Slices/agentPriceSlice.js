// agentPriceSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state for price ranges
const initialPriceState = {
    selectedPriceRange: 'Price',
    priceRanges: [
        { label: 'Price', minPrice: 0, maxPrice: 999999999 },
        { label: 'Below ₹ 10L', minPrice: 0, maxPrice: 1000000 },
        { label: '₹ 10L - ₹ 50L', minPrice: 1000000, maxPrice: 5000000 },
        { label: '₹ 50L - ₹ 1Cr', minPrice: 5000000, maxPrice: 10000000 },
        { label: '₹ 1Cr - ₹ 5Cr', minPrice: 10000000, maxPrice: 50000000 },
        { label: '₹ 5Cr - ₹ 10Cr', minPrice: 50000000, maxPrice: 100000000 },
        { label: '₹ 10Cr - ₹ 20Cr', minPrice: 100000000, maxPrice: 200000000 },
        { label: 'Above ₹ 20Cr', minPrice: 200000000, maxPrice: 999999999 }
    ]
};

// Creating the slice
const agentPriceSlice = createSlice({
    name: 'agentPrice',
    initialState: initialPriceState,
    reducers: {
        setSelectedPriceRange: (state, action) => {
            console.log("Setting selected price range:", action.payload);  // Log to verify the payload
            state.selectedPriceRange = action.payload;
          },
    }
});

// Exporting the action and reducer
export const { setSelectedPriceRange } = agentPriceSlice.actions;
export default agentPriceSlice.reducer;
