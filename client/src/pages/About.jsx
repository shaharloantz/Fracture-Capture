import React, { useState } from 'react';
import Sidebar from "../component/Sidebar";
import { toast } from 'react-hot-toast';
import '../cssFiles/About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const About = () => {
    const [isOpen, setIsOpen] = useState({}); // State to manage open/close sections

    // Function to toggle section visibility
    const toggleSection = (key) => {
        setIsOpen(prev => ({
            ...prev,
            [key]: !prev[key]  // Toggle the boolean value for the key
        }));
    };

    return (
        <div className="about-container">
            <Sidebar />
            <h1 onClick={() => toggleSection('aboutUs')}>
                About Us <FontAwesomeIcon icon={isOpen.aboutUs ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.aboutUs && (
                <p>Our web application is designed to revolutionize fracture diagnosis in the medical field.
                    Bone fractures are a frequent occurrence due to falls, accidents, and other traumatic events, affecting various demographics,
                    including infants, the elderly, and young individuals.
                </p>
            )}

            <h1 onClick={() => toggleSection('diagnosticChallenges')}>
                Addressing Diagnostic Challenges <FontAwesomeIcon icon={isOpen.diagnosticChallenges ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.diagnosticChallenges && (
                <p>Diagnosing fractures traditionally relies on medical imaging techniques such as X-rays, CT scans, MRIs, and ultrasound.
                    However, interpreting these images can be intricate and time-consuming, requiring specialized knowledge from experienced radiologists.
                    The shortage of skilled radiologists further compounds this challenge, leading to delays in diagnosis and treatment that impact patient outcomes.
                </p>
            )}

            <h1 onClick={() => toggleSection('advancedTechnology')}>
                Introducing Advanced Technology <FontAwesomeIcon icon={isOpen.advancedTechnology ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.advancedTechnology && (
                <p>To combat these challenges, we propose the development of a sophisticated web application.
                    Our application will harness cutting-edge image processing and deep learning algorithms to analyze X-ray images with precision.
                    By training our algorithms on a diverse dataset of bone fractures, the system will excel in accurately detecting fractures across different anatomical regions and bone types.
                </p>
            )}

            <h1 onClick={() => toggleSection('traditionalMethods')}>
                Advantages Over Traditional Methods <FontAwesomeIcon icon={isOpen.traditionalMethods ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.traditionalMethods && (
                <p>Unlike conventional methods that often target specific anatomical areas or fracture types, our application will provide a comprehensive solution.
                    It aims to identify and localize fractures in both upper and lower limbs, offering versatility that current CAD systems lack.
                </p>
            )}

            <h1 onClick={() => toggleSection('supportingMedical')}>
                Supporting Medical Professionals <FontAwesomeIcon icon={isOpen.supportingMedical ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.supportingMedical && (
                <p>Our primary audience includes doctors, medical students, and healthcare professionals dedicated to improving patient care through advanced technology.
                    The application is designed to streamline fracture diagnosis, enhance diagnostic accuracy, and expedite treatment planning.
                </p>
            )}

            <h1 onClick={() => toggleSection('visionFuture')}>
                Vision for the Future <FontAwesomeIcon icon={isOpen.visionFuture ? faAngleUp : faAngleDown} className="icon" />
            </h1>
            {isOpen.visionFuture && (
                <p>Our vision is to empower medical professionals worldwide with a robust tool that enhances fracture detection capabilities.
                    By bridging the gap between imaging technology and clinical practice, we aim to improve healthcare outcomes and patient experiences.
                </p>
            )}
        </div>
    );
};

export default About;
