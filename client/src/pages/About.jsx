import React from 'react';
import Sidebar from "../component/Sidebar";
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-container">
            <Sidebar />
            <h1>About Us</h1>
            <ul>
                <li>Our web application is designed to revolutionize fracture diagnosis in the medical field.</li>
                <li>Bone fractures are a frequent occurrence due to falls, accidents, and other traumatic events, affecting various demographics, including infants, the elderly, and young individuals.</li>
            </ul>

            <h1>Addressing Diagnostic Challenges</h1>
            <ul>
                <li>Diagnosing fractures traditionally relies on medical imaging techniques such as X-rays, CT scans, MRIs, and ultrasound.</li>
                <li>However, interpreting these images can be intricate and time-consuming, requiring specialized knowledge from experienced radiologists.</li>
                <li>The shortage of skilled radiologists further compounds this challenge, leading to delays in diagnosis and treatment that impact patient outcomes.</li>
            </ul>

            <h1>Introducing Advanced Technology</h1>
            <ul>
                <li>To combat these challenges, we propose the development of a sophisticated web application.</li>
                <li>Our application will harness cutting-edge image processing and deep learning algorithms to analyze X-ray images with precision.</li>
                <li>By training our algorithms on a diverse dataset of bone fractures, the system will excel in accurately detecting fractures across different anatomical regions and bone types.</li>
            </ul>

            <h1>Advantages Over Traditional Methods</h1>
            <ul>
                <li>Unlike conventional methods that often target specific anatomical areas or fracture types, our application will provide a comprehensive solution.</li>
                <li>It aims to identify and localize fractures in both upper and lower limbs, offering versatility that current CAD systems lack.</li>
            </ul>

            <h1>Supporting Medical Professionals</h1>
            <ul>
                <li>Our primary audience includes doctors, medical students, and healthcare professionals dedicated to improving patient care through advanced technology.</li>
                <li>The application is designed to streamline fracture diagnosis, enhance diagnostic accuracy, and expedite treatment planning.</li>
            </ul>

            <h1>Vision for the Future</h1>
            <ul>
                <li>Our vision is to empower medical professionals worldwide with a robust tool that enhances fracture detection capabilities.</li>
                <li>By bridging the gap between imaging technology and clinical practice, we aim to improve healthcare outcomes and patient experiences.</li>
            </ul>
        </div>
    );
};

export default About;
