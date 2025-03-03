import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '🏢', // Replace with your icon
      title: 'Wider range of properties',
      description:
        'Explore our extensive selection of properties, offering diverse options to suit every preference and budget. From charming homes to prime investments, find your perfect match with us.',
    },
    {
      icon: '🏦', // Replace with your icon
      title: 'Financing made easy',
      description:
        'Get hassle-free financing with our expert support. We simplify mortgage processes, offering personalized guidance and competitive rates to make your home purchase smooth and stress-free.',
    },
    {
      icon: '📄', // Replace with your icon
      title: 'Transparency',
      description:
        'We pride ourselves on transparency in every transaction. Expect clear communication, detailed information, and honest practices that keep you informed and confident throughout your real estate experience.',
    },
  ];

  return (
    <section className="why-choose-us-section">
      <h2 className="why-choose-us-title">Why Choose Us?</h2>
      <div className="why-choose-us-features">
        {features.map((feature, index) => (
          <div className="why-choose-us-feature" key={index}>
            <div className="why-choose-us-icon">{feature.icon}</div>
            <h3 className="why-choose-us-feature-title">{feature.title}</h3>
            <p className="why-choose-us-feature-description">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
