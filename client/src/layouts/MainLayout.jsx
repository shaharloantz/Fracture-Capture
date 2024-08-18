import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import Footer from '../component/Footer';
import Header from '../component/Header'; 
import '../styles/MainLayout.css';

const MainLayout = ({ isAuthenticated, handleLogout }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="main-layout-container">
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      {!isHomePage && <Header />} 
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
