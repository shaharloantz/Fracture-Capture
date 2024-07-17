import React from 'react';
import Sidebar from "../component/Sidebar";
import { toast } from 'react-hot-toast';


const About = () => {
  return (
    <div>
        <Sidebar />
        <h1>About Us</h1>
        <p>Our web application is designed to revolutionize fracture diagnosis in the medical field.
            Bone fractures are a frequent occurrence due to falls, accidents, and other traumatic events, affecting various demographics,
            including infants, the elderly, and young individuals.
        </p>

        <h1>Addressing Diagnostic Challenges</h1>
        <p>Diagnosing fractures traditionally relies on medical imaging techniques such as X-rays, CT scans, MRIs, and ultrasound. 
            However, interpreting these images can be intricate and time-consuming, requiring specialized knowledge from experienced radiologists. 
            The shortage of skilled radiologists further compounds this challenge, leading to delays in diagnosis and treatment that impact patient outcomes.
        </p>
    
        <h1>Introducing Advanced Technology</h1>
        <p>To combat these challenges, we propose the development of a sophisticated web application. 
            Our application will harness cutting-edge image processing and deep learning algorithms to analyze X-ray images with precision. 
            By training our algorithms on a diverse dataset of bone fractures, the system will excel in accurately detecting fractures across different anatomical regions and bone types.
        </p>

        <h1>Advantages Over Traditional Methods</h1>
        <p>Unlike conventional methods that often target specific anatomical areas or fracture types, our application will provide a comprehensive solution. 
            It aims to identify and localize fractures in both upper and lower limbs, offering versatility that current CAD systems lack.
        </p>

        <h1>Supporting Medical Professionals</h1>
        <p>Our primary audience includes doctors, medical students, and healthcare professionals dedicated to improving patient care through advanced technology. 
            The application is designed to streamline fracture diagnosis, enhance diagnostic accuracy, and expedite treatment planning.
        </p>

        <h1>Vision for the Future</h1>
        <p>Our vision is to empower medical professionals worldwide with a robust tool that enhances fracture detection capabilities. 
            By bridging the gap between imaging technology and clinical practice, we aim to improve healthcare outcomes and patient experiences.
        </p>
    </div>
  );
};

export default About;
