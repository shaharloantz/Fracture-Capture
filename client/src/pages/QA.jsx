import React, { useState } from 'react';
import Sidebar from "../component/Sidebar";
import { toast } from 'react-hot-toast';
import '../styles/QA.css';

const QA = () => {
  const questionsAndAnswers = [
    { q: 'Q - How does the web application analyze X-ray images to detect fractures?', a: 'A - Our web application employs advanced image processing techniques coupled with deep learning algorithms. It analyzes X-ray images pixel by pixel, identifying patterns indicative of fractures across various bone types and anatomical regions.' },
    { q: 'Q - Can the application distinguish between different types of fractures, such as hairline fractures versus compound fractures?', a: 'A - Yes, our system is trained on a diverse dataset that includes various fracture types. It uses deep learning models to differentiate between different fracture patterns, aiding in accurate diagnosis and treatment planning.' },
    { q: 'Q - What features does the web application offer to assist healthcare professionals in fracture diagnosis?', a: 'A - The application provides intuitive tools for uploading and analyzing X-ray images. It offers interactive visualizations of detected fractures, annotations, and comparative analysis tools to aid in clinical decision-making.' },
    { q: 'Q - As a doctor, can I access previous patient results and diagnostics within the application?', a: 'A -  Yes, each patient profile created within the application is associated with a separate folder. This folder organizes all previous diagnostic results chronologically, enabling doctors to review patient histories conveniently.' },
    { q: 'Q - Can the application integrate with existing hospital or clinic information systems (HIS/CIS)?', a: 'A - Yes, our application is designed to be compatible with standard healthcare IT infrastructure. It can seamlessly integrate with HIS/CIS systems to streamline workflow and enhance data accessibility for healthcare providers.' },
    { q: 'Q - Is the application accessible from mobile devices or is it limited to desktop use?', a: 'A - Our web application is responsive and accessible from both desktop and mobile devices. Healthcare professionals can conveniently access and use the application across different platforms, ensuring flexibility in clinical settings.' },
    { q: 'Q - How accurate is the application in detecting fractures compared to traditional methods?', a: 'A - Our system demonstrates high accuracy in fracture detection, validated through extensive testing and comparison with expert radiologists` assessments. It minimizes false positives and negatives, enhancing diagnostic reliability.' },
    { q: 'Q - What is the average processing time for analyzing an X-ray image using the application?', a: 'A - The processing time varies depending on image resolution and complexity. On average, the application processes and analyzes X-ray images within seconds, providing rapid feedback to healthcare professionals.' },
    { q: 'Q - Can I access previous diagnostic results and patient histories within the application?', a: 'A - Absolutely. Each patient profile includes a dedicated folder that stores all previous diagnostic results. Results are organized chronologically by date, allowing doctors to track patient progress and review past assessments efficiently.' },
    { q: 'Q - How are patient folders managed within the application?', a: 'A - Patient folders are securely stored within the application`s database. Each folder is accessible only to authorized healthcare professionals, ensuring patient confidentiality and compliance with privacy regulations.' },
    { q: 'Q - What are the future plans for enhancing the application`s capabilities?', a: 'A - We are committed to continuous improvement and innovation. Future updates will focus on expanding the application`s dataset to include more fracture types and anatomical regions. Additionally, we plan to integrate AI-driven features for automated reporting and real-time collaboration among healthcare teams.' },
    { q: 'Q - How will user feedback be incorporated into the development of the application?', a: 'A - User feedback is invaluable to us. We regularly gather input from medical professionals to refine our algorithms, enhance usability, and prioritize feature development based on clinical needs and usability studies.' },
  ];

  const subtitles = ['Image Analysis and Diagnosis', 'User Interface and Functionality', 'Integration and Accessibility', 'Accuracy and Performance', 'Data Management and Patient History', 'Development Roadmap'];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="qa-container">
      <Sidebar />
      <header className="qa-header">
        <div className="title-container">
          <h1>Fracture Capture</h1>
          <div className="logo"></div>
        </div>
      </header>
      <div className="qa-content">
        <h2>Q&A</h2>
        {questionsAndAnswers.map((item, index) => (
          <React.Fragment key={index}>
            {index % 2 === 0 && <h3 className="subtitle">{subtitles[Math.floor(index / 2)]}</h3>}
            <div className="qa-item">
              <div className="question" onClick={() => handleToggle(index)}>
                <span className="toggle-icon">{expandedIndex === index ? '-' : '+'}</span>
                {item.q}
              </div>
              {expandedIndex === index && <div className="answer">{item.a}</div>}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QA;
