import React from 'react';
import '../styles/TermsAndService.css';

const PrivacyPolicy = () => (
    <div className="page-container">
      <h1>Privacy Policy</h1>

      <div className="section">
        <h2>Introduction</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
          <p>Fracture-Capture ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>1. Information We Collect</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>1.1 Personal Information</h3>
            <p>When you register for an account, we may collect personal information such as your name, email address, and other contact information.</p>
          </div>
          <div className="content-item">
            <h3>1.2 Medical Images and Data</h3>
            <p>We collect and store the medical images and related data that you upload to our Service for analysis.</p>
          </div>
          <div className="content-item">
            <h3>1.3 Usage Data</h3>
            <p>We may collect information about how you access and use the Service, including your IP address, browser type, operating system, and usage patterns.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>2. How We Use Your Information</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>2.1 To Provide and Improve the Service</h3>
            <p>We use the information we collect to operate, maintain, and improve the Service, including analyzing the images you upload and providing results.</p>
          </div>
          <div className="content-item">
            <h3>2.2 To Communicate with You</h3>
            <p>We may use your contact information to send you updates, security alerts, and administrative messages.</p>
          </div>
          <div className="content-item">
            <h3>2.3 For Research and Development</h3>
            <p>We may use aggregated and anonymized data for research and development purposes to improve our machine learning models and the Service.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>3. How We Share Your Information</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>3.1 Service Providers</h3>
            <p>We may share your information with third-party service providers that perform services on our behalf, such as hosting, data storage, and email delivery.</p>
          </div>
          <div className="content-item">
            <h3>3.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
          </div>
          <div className="content-item">
            <h3>3.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>4. Data Security</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
          <p>We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>5. Your Choices</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <h3>5.1 Account Information</h3>
            <p>You can update or delete your account information at any time by logging into your account settings.</p>
          </div>
          <div className="content-item">
            <h3>5.2 Communications</h3>
            <p>You can opt out of receiving promotional communications from us by following the unsubscribe instructions provided in those communications.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>6. Children's Privacy</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will delete that information as quickly as possible.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>7. Changes to This Privacy Policy</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Your continued use of the Service after the posting of changes constitutes your acceptance of such changes.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>8. Contact Us</h2>
        <div className="divider"></div>
        <div className="content-wrapper">
          <div className="content-item">
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="/contact-us" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</a>.
          </p>          
          </div>
        </div>
      </div>

  </div>
);

export default PrivacyPolicy;
