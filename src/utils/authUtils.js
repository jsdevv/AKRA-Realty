// src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';
import { clearBearerToken, setBearerToken } from '../Redux/Slices/authSlice';

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    console.error("Error decoding token", err);
    return true;
  }
};

// This handles login session from localStorage (used in App.js or global init)
export const validateAndSetToken = (dispatch, setIsLoggedIn) => {
  const token = localStorage.getItem('bearerToken');
  if (token) {
    try {
      const expired = isTokenExpired(token);
      if (expired) {
        dispatch(clearBearerToken());
        localStorage.removeItem('bearerToken');
        setIsLoggedIn(false);
        return false;
      } else {
        dispatch(setBearerToken(token));
        setIsLoggedIn(true);
        return true;
      }
    } catch (error) {
      console.error("Invalid token format", error);
      dispatch(clearBearerToken());
      setIsLoggedIn(false);
      return false;
    }
  } else {
    setIsLoggedIn(false);
    return false;
  }
};

// In authUtils.js
export const checkAuthAndPopup = ({ token,setShowAuthPopup, dispatch }) => {
  if (!token || isTokenExpired(token)) {
    dispatch(setShowAuthPopup(true));
    return false;
  }
  return true;
};


// Handles redirect and popup logic
export const handleProtectedRoute = ({ token, location, navigate, setShowAuthPopup, dispatch }) => {
  if (!token || isTokenExpired(token)) {
    if (location.pathname !== "/") {
      dispatch(setShowAuthPopup(true));
    }
    navigate("/", {
      replace: true,
      state: { from: location },
    });
    return false;
  }
  return true;
};


