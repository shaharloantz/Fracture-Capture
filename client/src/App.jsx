/**
 * This file sets up the main application routes and layout for the React application.
 * It imports necessary components and pages, and configures the routing using react-router-dom.
 * 
 * Key functionalities:
 * - Importing React and necessary hooks (useState, useEffect).
 * - Importing routing components from react-router-dom.
 * - Importing various page components and layouts.
 * - Importing third-party libraries like react-hot-toast for notifications.
 * - Importing global styles and axios for HTTP requests.
 * 
 * The main purpose of this file is to define the structure and navigation of the application.
 */

import React, { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import QA from './pages/QA';
import About from './pages/About';
import PatientsResults from './pages/PatientsResults';
import NotFoundPage from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import ProcessingScreen from './component/ProcessingScreen';
import Results from './component/Results';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MyProfile from './pages/MyProfile';
import ContactUs from './pages/ContactUs';
import AdminPanel from './pages/AdminPanel';


import { Toaster } from 'react-hot-toast';
import './styles/App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/user/profile', { withCredentials: true })
      .then(response => {
        if (response.data) {
          setIsAuthenticated(true);
        }
      })
      .catch(error => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = () => {
    axios.post('/logout', {}, { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        window.location.href = '/';
      });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}>
        <Route index element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/forgot-password' element={<ForgotPassword />} /> 
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/qa' element={<QA />} />
        <Route path='/about' element={<About />} />
        <Route path='/patientsresults' element={<PatientsResults />} />
        <Route path='/myprofile' element={<MyProfile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path='*' element={<NotFoundPage />} />
        {/* Testing the loader animation at route -> <Route path='/processing' element={<ProcessingScreen />} />  --> */}
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <Toaster toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;
