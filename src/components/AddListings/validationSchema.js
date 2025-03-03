import * as Yup from 'yup';

// Step 1 Validation Schema
export const step1ValidationSchema = Yup.object({
  PropertyName: Yup.string()
    .required("Property Name is required")
    .max(100, "Property Name can't exceed 100 characters"),
  SqFt: Yup.number()
    .required("Property Area is required")
    .positive("Area must be a positive number")
    .integer("Area must be an integer")
    .min(1, "Area must be greater than 0"),

  Amount: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be greater than 0"),
    YearBuilt: Yup.number()
    .required("YearBuilt is required")
    .positive("YearBuilt must be a positive number")
    .min(1000, "YearBuilt must be a valid 4-digit number")
    .max(9999, "YearBuilt must be a valid 4-digit number")
    .typeError("YearBuilt must be a valid number"),
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
  // PropertyLatitude: Yup.number().required('Latitude is required').typeError('Latitude must be a number'),
  // PropertyLongitude: Yup.number().required('Longitude is required').typeError('Longitude must be a number'),
  // PropertyMainEntranceFacing: Yup.string().required('Entrance Facing is required'),
  // PropertyStatus: Yup.string().required('Property Status is required'),
  // PropertyPossessionStatus: Yup.string().required('Possession Status is required'),
});


export const step4ValidationSchema = Yup.object().shape({
  // PropertyLatitude: Yup.number().required('Latitude is required').typeError('Latitude must be a number'),
  // PropertyLongitude: Yup.number().required('Longitude is required').typeError('Longitude must be a number'),
  // PropertyMainEntranceFacing: Yup.string().required('Entrance Facing is required'),
  // PropertyStatus: Yup.string().required('Property Status is required'),
  // PropertyPossessionStatus: Yup.string().required('Possession Status is required'),
});