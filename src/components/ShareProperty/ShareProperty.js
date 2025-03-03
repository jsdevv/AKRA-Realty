import React, { useState } from 'react';
import './ShareProperty.css';

const ShareProperty = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleEmailShare = () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    alert('Email shared successfully!');
  };

  const handleWhatsAppShare = () => {
    if (!phone.match(/^\d{10}$/)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    alert('WhatsApp message shared successfully!');
  };

  return (
    <div className="popup-share-form">
      <div className="popup-share-options">
        {/* Email Share */}
        <div className="popup-share-option">
          {/* <label htmlFor="email">Share on Email</label> */}
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Enter your message"
            aria-label="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button className="popup-share-btn" aria-label="Share via Email" onClick={handleEmailShare}>
            Share Mail
          </button>
        </div>

        {/* WhatsApp Share */}
        <div className="popup-share-option">
          <h4>Or</h4>
          {/* <label htmlFor="name">Name</label> */}
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            id="phone"
            placeholder="Enter phone number"
            aria-label="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="popup-share-btn" aria-label="Share via WhatsApp" onClick={handleWhatsAppShare}>
            Share WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareProperty;
