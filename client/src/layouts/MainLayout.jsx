import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";

const MainLayout = ({ isAuthenticated, handleLogout }) => {
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Sidebar />
      <Outlet />
    </>
  );
}

export default MainLayout;
