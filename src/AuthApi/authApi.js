const BASE_URL = 'https://imsdev.akrais.com:8444/AKRARealityAPI';

export const forgotPasswordAPI = async (email) => {
  const raw = JSON.stringify({ email });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/forgotpassword`, requestOptions);

    // Check if the response is empty or not OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'User with Email/Name not found');
    }

    // Check if the response body is empty before parsing as JSON
    const responseText = await response.text();
    if (!responseText) {
      // If the response is empty, assume the email was sent successfully
      return { message: 'Password reset email sent successfully' };
    }

    // If the response body is not empty, parse it as JSON
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error in ForgotPassword API:', error);
    throw new Error(error.message || 'Something went wrong while resetting password');
  }
};

  

export const formRegistrationAPI = async (firstName, lastName, email, phoneNumber, role, countryCode, Password, ConfirmPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, phoneNumber, role, countryCode, Password, ConfirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      const firstError = data.Errors?.[0]?.Message;
      throw new Error(firstError || data.message || 'Failed to register user');
    }

    return { status: response.status, data };
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};


export const formRegistrationAgentAPI = async (firstName, lastName, email, phoneNumber, role, countryCode, Password, ConfirmPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, phoneNumber, role, countryCode, Password, ConfirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      const firstError = data.Errors?.[0]?.Message;
      throw new Error(firstError || data.message || 'Failed to register user');
    }

    return { status: response.status, data };
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};
  

  export const formchangepassword = async ( currentPassword, password, confirmPassword) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({currentPassword, password, confirmPassword }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Something went wrong');
    }
};



export const formresetpassword = async (password, confirmPassword, email, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/resetpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword, email, token }),
    });

    console.log(response,"response");
  
    if (response.status === 204) {
      return { success: true, message: 'Password reset successfully! Redirecting to login...' };
    }

    if (response.status === 400) {
      const errorData = await response.json();
      console.log(errorData,"errr")
      throw new Error(errorData.message || 'Link Already Expired');
    }

    return await response.json();

  } catch (error) {
    console.log(error,"catcherror");
    throw new Error(error.message || 'Something went wrong');
  }
};



