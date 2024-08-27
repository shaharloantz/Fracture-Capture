import React from 'react';
import '../styles/TermsAndService.css';

const TermsOfService = () => (
  <div className="page-container">
    <h1>Terms of Service</h1>


    <div className="section">
        <h2>Welcome to Fracture-Capture!</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
          <p>These Terms of Service ("Terms") govern your use of our website and services (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>1. Use of Service</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>1.1 Eligibility</h3>
            <p>You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this eligibility requirement.</p>
          </div>
          <div className="content-item">
            <h3>1.2 Account Registration</h3>
            <p>To access certain features of the Service, you may need to register for an account. You agree to provide accurate and complete information when registering for an account and to keep this information up-to-date.</p>
          </div>
          <div className="content-item">
            <h3>1.3 User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>2. Services Provided</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>2.1 Medical Image Analysis</h3>
            <p>Our Service allows you to upload medical images for the purpose of detecting fractures using machine learning models. The results provided by the Service are for informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment.</p>
          </div>
          <div className="content-item">
            <h3>2.2 Data Storage</h3>
            <p>We store the images you upload and the results of the analysis on our servers. We take measures to protect your data, but we cannot guarantee its absolute security.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>3. User Content</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>3.1 Ownership</h3>
            <p>You retain ownership of any images and data you upload to the Service ("User Content"). By uploading User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and process the User Content to provide the Service.</p>
          </div>
          <div className="content-item">
            <h3>3.2 Prohibited Content</h3>
            <p>You agree not to upload any content that is illegal, harmful, or violates the rights of others. We reserve the right to remove any User Content that we deem to be in violation of these Terms.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>4. Intellectual Property</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>4.1 Ownership</h3>
            <p>All content and materials available on the Service, including but not limited to software, text, graphics, and logos, are the property of FractureCapture or its licensors and are protected by intellectual property laws.</p>
          </div>
          <div className="content-item">
            <h3>4.2 License</h3>
            <p>Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal and non-commercial use.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>5. Termination</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>We may terminate or suspend your account and access to the Service at any time, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>6. Limitation of Liability</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>To the maximum extent permitted by law, FractureCapture shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the Service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>7. Changes to Terms</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page. You are advised to review these Terms periodically for any changes. Your continued use of the Service after the posting of changes constitutes your acceptance of such changes.</p>
          </div>
        </div>
    </div>

    <div className="section">
        <h2>8. Contact Us</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>If you have any questions about these Terms, please contact us at <a href="/contact-us" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</a>.</p>
          </div>
        </div>
    </div>

  </div>
);

export default TermsOfService;
