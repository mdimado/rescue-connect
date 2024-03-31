import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from '../pages/Home';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ProtectedRoute from './ProtectedRoute';
import RegisterAgency from '../pages/RegisterAgency';


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="register" element={<RegisterAgency />}/>

      <Route path="/*" element={<ProtectedRoute />}>
        
      </Route>

      
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      

      <Route path='insta/*' element={<Navigate to="https://www.instagram.com/aandm_fashion_retailor/?hl=en" target="_blank" replace />} />


    </Routes>
  );
};

export default Routers;
