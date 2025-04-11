import React from 'react';
import {
  FaHome, FaFileAlt, FaKey, FaGlobeAsia, FaUsers,
  FaWallet, FaChartLine, FaBuilding, FaMoneyBillWave
} from 'react-icons/fa';
import {
  Box, Typography, Grid, Card, CardContent, Container
} from '@mui/material';

import './About.css'; // Import external CSS

const services = [
  {
    icon: <FaHome />,
    title: 'Property Listing & Transactions',
    description: 'Find the perfect property and get help throughout the buying/selling process.',
  },
  {
    icon: <FaFileAlt />,
    title: 'Legal Assistance & Documentation',
    description: 'Get expert guidance on all legal aspects of real estate deals.',
  },
  {
    icon: <FaKey />,
    title: 'Registration Support',
    description: 'Complete assistance with property registration procedures.',
  },
  {
    icon: <FaGlobeAsia />,
    title: 'NRI Services',
    description: 'Investment opportunities and services tailored for NRIs.',
  },
  {
    icon: <FaUsers />,
    title: 'Customized Consulting',
    description: 'Get personalized consulting based on your real estate needs.',
  },
  {
    icon: <FaWallet />,
    title: 'Mortgage & Escrow Services',
    description: 'Help with mortgage loans and secure escrow services.',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Fractional Investments',
    description: 'Invest in real estate with lower capital via fractional ownership.',
  },
  {
    icon: <FaChartLine />,
    title: 'Investment & Wealth Management',
    description: 'Strategic advisory for growing your real estate wealth.',
  },
  {
    icon: <FaBuilding />,
    title: 'Builder & Project Partnerships',
    description: 'Collaborate with us to launch and promote real estate projects.',
  },
];

const About = () => {
  return (
    <Box className="about-section">
      <Container maxWidth="lg">
        <Box className="about-header">
          <Typography variant="h5" className="about-title">
            About TREALX
          </Typography>
          <Typography variant="body1" className="about-subtitle">
            A platform to Buy, Sell, and Invest in Real Estate in Telangana and Andhra Pradesh — for Indian Residents and NRIs.
          </Typography>
        </Box>

        <Box className="about-mission">
          <Typography variant="h5" className="about-mission-title">
            Our Mission
          </Typography>
          <Typography variant="body2" className="about-mission-text">
            TREALX is a unique platform combining Technology, Real Estate & Investment Services for trusted transactions. We assist with listings, paperwork, registration, and investor discovery.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="about-card">
                <CardContent className="about-card-content">
                  <Box className="about-icon">{service.icon}</Box>
                  <Typography className="about-card-title">
                    {service.title}
                  </Typography>
                  <Typography className="about-card-desc">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;