import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar'; // Adjusted path to match usual folder structure
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

// Adjust baseURL to point to your backend server
axios.defaults.baseURL = 'http://localhost:5173'; // Adjust this if needed
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Navbar />
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
