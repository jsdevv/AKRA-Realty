import React, { useState } from 'react';
import "./ContactForm.css"

const ContactForm = ({  onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    citizenship: '',
    annualIncome: '',
    totalAssets: '',
    occupation: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose(); // Close the popup after submission
  };

  return (
    <div className="contact-form-popup">
      <button onClick={onClose} className="close-button">X</button>
      <h2>Contact Us About </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </label>
        <label>
          Phone Number:
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>
        <label>
          Citizenship:
          <input type="text" name="citizenship" value={formData.citizenship} onChange={handleChange} required />
        </label>
        <label>
          Annual Income:
          <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} required />
        </label>
        <label>
          Total Assets:
          <input type="number" name="totalAssets" value={formData.totalAssets} onChange={handleChange} required />
        </label>
        <label>
          Occupation:
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
