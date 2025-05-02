const API_URL = 'https://imsdev.akrais.com:8444/AKRARealityAPI/api/data';

const AddData_API = 'https://imsdev.akrais.com:8444/AKRARealityAPI/api/adddata';

const DeleteData_API = 'https://imsdev.akrais.com:8444/AKRARealityAPI/api/deletedata';

const EditData_API = 'https://imsdev.akrais.com:8444/AKRARealityAPI/api/updatedata';



export const fetchListings = async (bearerToken) => {
    try {
      const response = await fetch(
        API_URL,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            RequestParamType: 'PropertyList1',
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  };

  
export const fetchPremiumListings = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'PremiumList1',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPremiumbuilders = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'PremiumBuilder',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Function to fetch property status options from the API
export const fetchPropertyStatusOptions = async (token) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                RequestParamType: 'Status'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data; // Assuming data is an array of objects with PropertyStatus field
    } catch (error) {
        console.error('Error fetching property status options:', error);
        throw error; // Rethrow the error to handle it in the component
    }
};
  
// Function to fetch property Home options from the API
export const fetchPropertyHomeType = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'HomeType'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

// Function to fetch property status options from the API
export const fetchCustomPropertyTypes = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'CustomPropertyTypes'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchPropertyAlertAPI  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'SetAlertTest',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add alert. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};

export const fetchAlertPropertySeen  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'MarkSeenAlertTest',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add alert. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};


export const fetchPropertiesDetails = async (token, propertyID) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: `PropertyID;${propertyID}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};

export const fetchAddpropertyFavorties  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddPropertyFavorites',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};


export const fetchAddpropertyshortlist  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddPropertyShortlist',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};


export const fetchAddprojectshortlist  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddProjectShortlist',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};

export const fetchDeletePropertyshortlist  = async (bearerToken, payload) => {
  try {
    const response = await fetch(DeleteData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'DeletePropertyShortlist',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};

export const fetchDeleteProjectshortlist  = async (bearerToken, payload) => {
  try {
    const response = await fetch(DeleteData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'DeleteProjectShortlist',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};


export const fetchDeleteProjectFavorties  = async (bearerToken, payload) => {
  try {
    const response = await fetch(DeleteData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'DeleteProjectFavorites',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};
export const fetchDeletePropertyFavorties  = async (bearerToken, payload) => {
  try {
    const response = await fetch(DeleteData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'DeletePropertyFavorites',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};

export const fetchProjectFavorites = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'GetProjectFavouritesTest'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchPropertyFavorites = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'GetPropertyFavourites'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchAddprojectFavorties  = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddProjectFavorites',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to add favorites. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in set alert:', error);
    throw new Error(error.message || 'Failed to add alert.');
  }
};


export const fetchDashboardPropertyDetails = async (bearerToken) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'DashboardPropertyDetails'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};


export const fetchInvestorproperties = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'InvestmentClub'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};


export const fetchInvitationproperties = async (token) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              RequestParamType: 'InnerCircle'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchfractionproperties = async (bearerToken) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'FractionalInvestment'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchAddListingsCountry = async (bearerToken) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'Country'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};


export const fetchAddListingsAmenities = async (bearerToken) => {
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'Amenities'
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};


export const fetchAddListings = async (bearerToken,formData) => {
  try {
      const response = await fetch(AddData_API, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'AddProperty',
              json:formData
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchAddProject = async (formData, bearerToken) => {
  try {
      const response = await fetch(AddData_API, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'AddProject',
              json:formData
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};

export const fetchagentproperties = async (bearerToken) => {
    try {
      const response = await fetch(
        API_URL,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            RequestParamType: 'PrivateListings1',
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  };


  export const fetchAddFeedback = async (bearerToken,formData) => {
    try {
        const response = await fetch(AddData_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify({
                RequestParamType: 'AddFeedback',
                json:formData
            })
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        return data; // Assuming data is an array of objects with PropertyStatus field
    } catch (error) {
        console.error('Error fetching property status options:', error);
        throw error; // Rethrow the error to handle it in the component
    }
  };

  
export const fetchFeedbackRefID = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: `GetFeedback`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
 
export const fetchgetmapalert = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: `GetSetAlertTest`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    const data = await response.json();
  
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};


export const fetchScheduleTour = async (bearerToken, payload) => {
  console.log(bearerToken,"beee");
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddTours',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to schedule tour. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in fetchScheduleTour:', error);
    throw new Error(error.message || 'Failed to schedule tour.');
  }
};


export const fetchRequestinfo = async (bearerToken, payload) => {
  console.log(bearerToken,"beee");
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'AddRequestInfo',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to schedule tour. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in fetchScheduleTour:', error);
    throw new Error(error.message || 'Failed to schedule tour.');
  }
};


// add listings

export const fetchcompanyname = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'CompanyName',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};


export const fetchprojectname = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'ProjectName',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchMyproperty = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'MyProperties',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchEditproperty = async (bearerToken,formData) => {
  try {
      const response = await fetch(EditData_API, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({
              RequestParamType: 'UpdateProperty',
              json:formData
          })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
      console.error('Error fetching property status options:', error);
      throw error; // Rethrow the error to handle it in the component
  }
};


// images
export const uploadImages = async (imagePropertyId, imageFile, bearerToken) => {
  const uploadUrl = `https://imsdev.akrais.com:8444/AKRARealityAPI/api/properties/${imagePropertyId}/images`;

  const formDataObj = new FormData();
  formDataObj.append("image", imageFile);  // Ensure you're passing the actual file object, not metadata
  formDataObj.append("extension", "png");  // Ensure the file extension is correct

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    console.log("Images uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export const uploadprojectImages = async (projectid, imageFile, bearerToken,extension) => {
  const uploadUrl = `https://imsdev.akrais.com:8444/AKRARealityAPI/api/projects/${projectid}/images`;

  const formDataObj = new FormData();
  formDataObj.append("image", imageFile);  // Ensure you're passing the actual file object, not metadata
  formDataObj.append("extension", extension); 

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    console.log("Images uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

//videos

export const fetchpropertyVideos = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'GetVideos',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

//views

export const fetchPropertyView = async (bearerToken, payload) => {
  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'PropertyAddView',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to schedule tour. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in fetchScheduleTour:', error);
    throw new Error(error.message || 'Failed to schedule tour.');
  }
};

export const fetchProjectView = async (bearerToken, payload) => {

  try {
    const response = await fetch(AddData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        RequestParamType: 'ProjectAddView',
        json: payload,
      }),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error with the response status
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to schedule tour. Please try again.');
    }

    const data = await response.json();
    return data; // Return the response data

  } catch (error) {
    console.error('Error in fetchScheduleTour:', error);
    throw new Error(error.message || 'Failed to schedule tour.');
  }
};


export const fetchImagesForDisplayOrder = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'GetProjectImagesForDisplayOrder',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchGetImgbasedProject = async (token, ProjectID) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: `ProjectID;${ProjectID}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};


export const fetchAddImagesForDisplayOrder = async (bearerToken, payload) => {
  try {
    const response = await fetch(EditData_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      },
      body: JSON.stringify({
        RequestParamType: 'UpdateProjectImageDisplayOrder',
        json: payload
      })
    });

    if (!response.ok) {
      // Log response status for debugging
      console.error('Fetch failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Assuming data is an array of objects with PropertyStatus field
  } catch (error) {
    // Additional logging to help identify the problem
    console.error('Error fetching property status options:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};


export const fetchListingsAuthority = async (bearerToken) => {
  try {
    const response = await fetch(
      API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestParamType: 'ListingsAuthority',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
