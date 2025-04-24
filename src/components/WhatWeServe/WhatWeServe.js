import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaStore,
  FaGlobe,
  FaPiggyBank,
  FaUserCheck,
  FaBuilding,
  FaBalanceScale,
  FaFileAlt,
} from "react-icons/fa";
import "./WhatWeServe.css";



const ServiceCard = ({
  icon,
  title,
  description,
  delay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`service-card ${isHovered ? "hovered" : ""}`}
      style={{
        animationDelay: delay,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="service-card-inner">
        <div className="service-card-header">
          <div className="service-icon-wrapper">{icon}</div>
          <h3 className="service-title">{title}</h3>
        </div>
        <div className="service-description">{description}</div>
        <div className={`service-indicator ${isHovered ? "expanded" : ""}`} />
      </div>
    </div>
  );
};

const WhatWeServe = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("what-we-serve");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const renderBulletPoints = (points) => (
    <ul className="bullet-points">
      {points.map((point, idx) => (
        <li key={idx}>
          <span className="bullet">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );

  const ICON_SIZE = 20;

  const services = [
    {
      icon: <FaUsers size={ICON_SIZE} />,
      title: "Buyers",
      description: renderBulletPoints([
        "Instantly search properties with accurate prices & locations.",
        "Explore diverse property types suited to your preferences.",
        "Get expert help for a smooth, hassle-free buying process.",
        "From search to registration, we handle everything.",
      ]),
      delay: "0.15s",
    },
    {
      icon: <FaStore size={ICON_SIZE} />,
      title: "Sellers",
      description: renderBulletPoints([
        "List your property for free, pay only when it's sold.",
        "Ensure accurate pricing & valuation before listing.",
        "Maximize visibility, connect with genuine buyers fast.",
        "Full assistance with legal, taxation, and paperwork.",
      ]),
      delay: "0.3s",
    },
    {
      icon: <FaGlobe size={ICON_SIZE} />,
      title: "NRIs",
      description: renderBulletPoints([
        "Buy & sell property remotely in Telangana & Andhra Pradesh.",
        "Get complete legal, taxation, and registration support.",
        "Securely transfer funds from India to your residing country.",
        "Explore real estate investment with RERA-certified experts.",
      ]),
      delay: "0.45s",
    },
    {
      icon: <FaPiggyBank size={ICON_SIZE} />,
      title: "Investors",
      description: renderBulletPoints([
        "Exclusive listings with diverse investment opportunities.",
        "Expert support from legal, valuation, & compliance professionals.",
        "Explore co-investment and fractional ownership options.",
        "Smart alerts match investors with similar interests.",
      ]),
      delay: "0.6s",
    },
    {
      icon: <FaUserCheck size={ICON_SIZE} />,
      title: "Agents",
      description: renderBulletPoints([
        "Post unlimited verified properties with no listing fees.",
        "Get access to verified leads from serious buyers.",
        "Track all leads & deals conveniently on your dashboard.",
        "Connect with legal, mortgage, and tax professionals.",
      ]),
      delay: "0.75s",
    },
    {
      icon: <FaBuilding size={ICON_SIZE} />,
      title: "Builders/Developers",
      description: renderBulletPoints([
        "Boost project visibility and sell faster to qualified buyers.",
        "Identify land banks for future real estate development.",
        "Gain buyer insights to tailor offerings effectively.",
        "Unlock investment growth with exclusive network access.",
      ]),
      delay: "0.9s",
    },
    {
      icon: <FaBalanceScale size={ICON_SIZE} />,
      title: "Legal Services",
      description: renderBulletPoints([
        "Expert legal guidance for smooth property transactions.",
        "Assistance in property disputes, compliance, and regulations.",
        "Verified legal professionals for document verification and taxation.",
        "Secure handling of all legal formalities with transparency.",
      ]),
      delay: "1.05s",
    },
    {
      icon: <FaFileAlt size={ICON_SIZE} />,
      title: "Documentation Services",
      description: renderBulletPoints([
        "Seamless documentation support for agreements and registration.",
        "Accurate property verification and record-keeping assistance.",
        "End-to-end paperwork management for hassle-free transactions.",
        "Secure and efficient processing of legal documents.",
      ]),
      delay: "1.2s",
    },
  ];
  

  return (
    <section id="what-we-serve" className="what-we-serve-section">
      <div className="background-img" style={{ opacity: isVisible ? 0.15 : 0 }} />
      <div className="content-container">
        <div className="section-heading">
          <h2 className={`fade-in-heading ${isVisible ? "visible" : ""}`}>
            Whom We Serve
          </h2>
        </div>

        <div className="whatservices-grid">
          <div className="service-group">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeServe;
