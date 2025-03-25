import * as Yup from 'yup';

// Step 1 Validation Schema
export const step1ValidationSchema = Yup.object({
  PropertyType: Yup.string().required("Property Type is required"),

  PropertyName: Yup.string()
    .required("Property Name is required")
    .max(100, "Property Name can't exceed 100 characters"),

  SqFt: Yup.number()
    .typeError("Property Area must be a valid number")
    .required("Property Area is required")
    .positive("Area must be a positive number")
    .integer("Area must be an integer")
    .min(1, "Area must be greater than 0"),

  Amount: Yup.number()
    .typeError("Price must be a valid number")
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be greater than 0"),

  YearBuilt: Yup.number()
    .typeError("Year Built must be a valid number")
    .when("PropertyTypeID", {
      is: (val) => { 
        return ["1", "3", "4", "5", "9"].includes(String(val))
      },
      then: (schema) =>
        schema
          .required("Year Built is required")
          .positive("Year Built must be a positive number")
          .min(1000, "Year Built must be a valid 4-digit number")
          .max(9999, "Year Built must be a valid 4-digit number"),
      otherwise: (schema) => schema.notRequired(),
    }),

  LotSize: Yup.number()
    .typeError("Lot Size must be a valid number")
    .when("PropertyTypeID", {
      is: (val) => {
        return String(val) !== "4"
      },
      then: (schema) =>
        schema
          .required("Lot Size is required")
          .positive("Lot Size must be a positive number")
          .min(1, "Lot Size must be greater than 0"),
      otherwise: (schema) => schema.notRequired(),
    }),

  PropertyMainEntranceFacing: Yup.string().required("Entrance Facing is required"),

  PropertyStatus: Yup.string().required("Property Status is required"),

  PropertyPossessionStatus: Yup.string().when("PropertyTypeID", {
    is: (val) => !["6", "11"].includes(String(val)),
    then: (schema) => schema.required("Possession Status is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Step 2 Validation Schema
export const step2ValidationSchema = Yup.object().shape({
  // images: Yup.array()
  //   .of(
  //     Yup.mixed()
  //       .required('File is required')
  //       .test(
  //         'fileFormat',
  //         'Only JPEG or PNG formats are allowed',
  //         (value) => value && (value.type === 'image/jpeg' || value.type === 'image/png')
  //       )
  //   )
  //   .max(12, 'You can upload a maximum of 12 images')
  //   .required('Please upload at least one image'),
});

// Continue defining schemas for other steps...

export const step3ValidationSchema = Yup.object().shape({
  PropertyAddress1: Yup.string().required('Address is required'),
  PropertyZipCode: Yup.string().required('Zip Code is required'),
  PropertyCity: Yup.string().required('City is required'),
  PropertyState: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  Locality: Yup.string().required('Locality is required'),
  SubLocality: Yup.string().required('Sub Locality is required'),
  Geolocation: Yup.string().required('Geolocation is required'),
});


export const step4ValidationSchema = Yup.object().shape({
  plotno: Yup.string().when("PropertyTypeID", {
    is: (val) => !["6", "11"].includes(String(val)),
    then: (schema) => schema.required("Plot/Flat No is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  PropertyFloorNumber: Yup.number().when("PropertyTypeID", {
    is: (val) => ["1", "5", "9"].includes(String(val)),
    then: (schema) => schema.required("Floor Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  Bedrooms: Yup.number().when("PropertyTypeID", {
    is: (val) => ["1", "3", "4"].includes(String(val)),
    then: (schema) => schema.required("Bedrooms is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  PropertyBathrooms: Yup.number().when("PropertyTypeID", {
    is: (val) => ["1", "3", "4"].includes(String(val)),
    then: (schema) => schema.required("Bathrooms is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  PropertyParking: Yup.string().when("PropertyTypeID", {
    is: (val) => ["1", "3", "4", "5", "9"].includes(String(val)),
    then: (schema) => schema.required("Parking is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  Parkingslot: Yup.number().when(["PropertyTypeID", "PropertyParking"], {
    is: (val, hasParking) => hasParking === "Yes" && ["1", "3", "4", "5", "9"].includes(String(val)),
    then: (schema) => schema.required("Parking Slots is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  AvailableFrom: Yup.date().when("PropertyTypeID", {
    is: (val) => !["6", "11"].includes(String(val)),
    then: (schema) => schema.required("Available From is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

  
export function renderLabel(field, label, values, step) {
  let isRequired = false;
  switch (step) {
    case 1:
      isRequired = isStep1FieldRequired(field, values);
      break;
    case 3:
      isRequired = isStep3FieldRequired(field, values);
      break;
    case 4:
      isRequired = isStep4FieldRequired(field, values);
      break;
    default:
      break;
  }
 return <label>
    {label} {isRequired ? <span className="required">*</span> : ""}
  </label>
}

export function isStep1FieldRequired(fieldName, values) {
    const propertyTypeID = String(values.PropertyTypeID || "");
  
    switch (fieldName) {
      case "PropertyType":
        return true;
  
      case "PropertyName":
        return true;
  
      case "SqFt":
        return true;
  
      case "Amount":
        return true;
  
      case "YearBuilt":
        return ["1", "3", "4", "5", "9"].includes(propertyTypeID);
  
      case "LotSize":
        return propertyTypeID !== "4";
  
      case "PropertyMainEntranceFacing":
        return true;
  
      case "PropertyStatus":
        return true;
  
      case "PropertyPossessionStatus":
        return !["6", "11"].includes(propertyTypeID);
  
      default:
        return false;
    }
  }

  export function isStep3FieldRequired(fieldName, values) {
    const propertyTypeID = String(values.PropertyTypeID || "");
  
    switch (fieldName) {
      case "PropertyAddress1":
        return true;
  
      case "PropertyZipCode":
        return true;
  
      case "PropertyCity":
        return true;
  
      case "PropertyState":
        return true;
  
      case "district":
        return true;
  
      case "Locality":
        return true;
  
      case "SubLocality":
        return true;
  
      default:
        return false;
    }
  }

  export function isStep4FieldRequired(fieldName, values) {
    const propertyTypeID = String(values.PropertyTypeID || "");
    const propertyParking = String(values.PropertyParking || "");
  
    switch (fieldName) {
      case "plotno":
        return !["6", "11"].includes(propertyTypeID);
  
      case "PropertyFloorNumber":
        return ["1", "5", "9"].includes(propertyTypeID);
  
      case "Bedrooms":
        return ["1", "3", "4"].includes(propertyTypeID);
  
      case "PropertyBathrooms":
        return ["1", "3", "4"].includes(propertyTypeID);
  
      case "PropertyParking":
        return ["1", "3", "4", "5", "9"].includes(propertyTypeID);
  
      case "Parkingslot":
        return propertyParking === "Yes" && ["1", "3", "4", "5", "9"].includes(propertyTypeID);
  
      case "AvailableFrom":
        return !["6", "11"].includes(propertyTypeID);
  
      default:
        return false;
    }
  }