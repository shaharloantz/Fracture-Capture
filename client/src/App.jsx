import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar'; // Adjusted path to match usual folder structure
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import QA from './pages/QA';
import About from './pages/About';
import Profile from './pages/Profile';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

// Adjust baseURL to point to your backend server
axios.defaults.baseURL = 'http://localhost:8000'; // Adjust this if needed
axios.defaults.withCredentials = true;



function App() {
  return (
    <>
      <Navbar />
      <Toaster  toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/qa' element={<QA />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
