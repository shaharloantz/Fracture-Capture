import React from 'react';
import Sidebar from "../component/Sidebar";
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-container">
            <Sidebar />
            <div className="about-header"> 
                <h1>Empowering Fracture Diagnosis with Cutting-Edge Technology</h1>
                <p>We want to revolutionize how fractures are diagnosed, to bring precision and speed to improve patient care.</p>
            </div>
            <section className="mission-vision">
                <h2>Our Mission</h2>
                <p>We are dedicated to transforming the medical field by streamlining fracture diagnosis through a highly trained model and image processing technology. Our mission is to improve diagnostic accuracy and speed to ensure better patient outcomes worldwide.</p>
                <h2>Our Vision</h2>
                <p>Our vision is a world where healthcare professionals are empowered with tools that make accurate fracture detection swift and accessible, leading to better healthcare for all.</p>
            </section>

            <section className="technology">
                <h2>Advanced Technology</h2>
                <p>We utilize state-of-the-art deep learning algorithms trained on diverse datasets to accurately identify fractures across different bone types and anatomical regions.</p>
                <div className="technology-highlights">
                </div>
            </section>

            <section className="supporting-professionals">
                <h2>Supporting Medical Professionals</h2>
                <p>Our application is a vital tool for doctors, radiologists, and medical students, helping them to quickly and accurately diagnose fractures, thus enhancing patient care and treatment planning.</p>
                <div className="professionals-highlights">
                    <div className="highlight-item">
                        <h3>For Doctors</h3>
                        <p>Streamline diagnosis and improve patient outcomes with our precise imaging analysis.</p>
                    </div>
                    <div className="highlight-item">
                        <h3>For Students</h3>
                        <p>Learn from detailed analysis and real-world cases to enhance your medical education.</p>
                    </div>
                </div>
            </section>

            <section className='meet-the-team'>
                <h2> Meet The Team </h2>
                    <div className='the-team'>
                        <div className='dana'>
                        <a href="https://www.linkedin.com/in/dana-hafif-ab3b70153/" target="_blank" rel="noopener noreferrer">
                             <img src="/src\assets\images\dana.jpg"/>
                        </a>
                            <h3>Dana Hafif</h3>
                            <p></p>
                        </div>

                        <div className='zigel'>
                        <a href="https://www.linkedin.com/in/tal-lovton-499268257/" target="_blank" rel="noopener noreferrer">
                            <img src="/src\assets\images\zigel.jpg"/>  
                        </a>  
                            <h3>Tal Zigel</h3>
                            <p></p>
                        </div>

                        <div className='shachar'>
                        <a href="https://www.linkedin.com/in/shahar-loantz/" target="_blank" rel="noopener noreferrer">
                            <img src="/src\assets\images\shahar.jpg"/>    
                        </a>
                            <h3>Shachar Loacker</h3>
                            <p></p>
                        </div>

                        <div className='jonathan'>
                        <a href="https://www.linkedin.com/in/jonathan-cwengel-77953626b/" target="_blank" rel="noopener noreferrer">
                        <img src="/src\assets\images\handsome.jpg"/>
                        </a>
                        <h3>Jonathan Cwengel</h3>
                        <p></p>
                        </div>

                        <div className='tal'>
                        <a href="https://www.linkedin.com/in/tal-zigelnik/" target="_blank" rel="noopener noreferrer">
                        <img src="/src\assets\images\tal.jpg"/>
                        </a>
                        <h3>Tal Loveton</h3>
                        <p></p>
                        </div>

                        <div className='or'>
                        <a href="https://www.linkedin.com/in/or-shimon-51811826a/" target="_blank" rel="noopener noreferrer">
                        <img src="/src\assets\images\myN.jpg"/>
                        </a>
                        <h3>Or Shimon</h3>
                        <p></p>
                        </div>
                    </div>
            </section>

            <section className="call-to-action">
                <h2>Join Us in Revolutionizing Healthcare</h2>
                <p>Contact us to learn more about how our technology can assist your medical practice, or to inquire about partnerships and collaborations.</p>
                <a href="/Contact-Us" className="cta-button">Get in Touch</a>
            </section>
        </div>
    );
};

export default About;
