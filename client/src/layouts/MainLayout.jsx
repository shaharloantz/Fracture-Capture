import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import '../styles/MainLayout.css';

const MainLayout = ({ isAuthenticated, handleLogout }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <div className="main-layout-container">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-grow p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
