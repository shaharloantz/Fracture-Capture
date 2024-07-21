import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import '../styles/MainLayout.css';

const MainLayout = ({ isAuthenticated, handleLogout }) => {
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
