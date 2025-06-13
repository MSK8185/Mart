import React from 'react';
import './About.css'; 
import { FaLightbulb, FaHistory, FaUsers } from 'react-icons/fa';

const About = () => {
    return (
        <div className="about-container font-poppins  ">
            <header className="about-header">
                <h1 className="text-4xl font-bold text-blue-700 pt-24">About Us</h1>
                <p className="text-lg text-gray-700 mt-10">Discover our journey, values, and mission.</p>
            </header>
            <section className="about-content grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
                <div className="about-card">
                    <FaLightbulb className="about-icon text-yellow-500" />
                    <h2 className="text-xl font-semibold mt-4">Our Vision</h2>
                    <p className="text-gray-600 mt-2">
                        "At Quickstore, our vision is to make everyday essentials affordable and accessible to everyone, delivering a seamless and reliable shopping experience. We aim to be your trusted choice for daily groceries, household items, and essential products by offering them at prices lower than the typical market MRP. With our focus on instant delivery, Quickstore brings convenience right to your doorstep, saving you time and money. We are committed to redefining the way you shop for daily needs, ensuring affordability, speed, and quality are at the core of our service."
                    </p>
                </div>
                <div className="about-card">
                    <FaHistory className="about-icon text-red-500" />
                    <h2 className="text-xl font-semibold mt-4">Our History</h2>
                    <p className="text-gray-600 mt-2">
                        "Quickstore was founded with a mission to simplify shopping for daily essentials by bringing quality products directly to your doorstep at unbeatable prices. From our early days as a small startup, we have grown rapidly, expanding our product range to meet the diverse needs of our community. Our journey began with a commitment to affordability and convenience, which continues to be the backbone of our service today. Over the years, Quickstore has built a loyal customer base, driven by our passion for innovation, efficiency, and reliability in providing essential items with instant delivery."
                    </p>
                </div>
                <div className="about-card">
                    <FaUsers className="about-icon text-green-500" />
                    <h2 className="text-xl font-semibold mt-4">Our Team</h2>
                    <p className="text-gray-600 mt-2">
                        "At Quickstore, our team is a dynamic group of passionate individuals who are dedicated to transforming the shopping experience for our customers. From product sourcing to customer support, each team member brings expertise, innovation, and a commitment to quality in delivering essential items quickly and affordably. Our diverse skills, shared values, and collective vision drive us to provide unmatched service, keeping our customers at the heart of everything we do. Together, we work tirelessly to ensure Quickstore meets your daily needs with convenience, reliability, and a personal touch."
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
