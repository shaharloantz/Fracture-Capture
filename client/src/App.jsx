import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import QA from './pages/QA';
import About from './pages/About';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFound';


// Adjust baseURL to point to your backend server
axios.defaults.baseURL = 'http://localhost:8000'; // Adjust this if needed
axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route  path='/' element={<MainLayout />}>
     <Route index element={<Home/>} />
     <Route path='/register' element={<Register />} />
     <Route path='/login' element={<Login />} />
     <Route path='/qa' element={<QA />} />
    <Route path='/about' element={<About />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='*' element={<NotFoundPage />} 
    />

</Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster toastOptions={{ duration: 2000 }} />
    </>
  );
};

export default App;

/*
import { Toaster } from 'react-hot-toast';
<Toaster  toastOptions={{ duration: 2000 }} />
*/
