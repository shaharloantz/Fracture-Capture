import { Outlet } from "react-router-dom"
import Navbar from "../component/Navbar"
import Sidebar from "../component/Sidebar"
const MainLayout = () => {
  return (
    <>
        <Navbar />
        <Sidebar />
        <Outlet />
    </>
  )
}

export default MainLayout