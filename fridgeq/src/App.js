import React, { Component } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Fridge from './components/Fridge';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Topbar from './components/Topbar';
import Landing from './components/Landing';
import { useAuthContext } from './hooks/useAuthContext';

function App() {

  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <div className='App'>
        {user && // show only if there is a user
          <Navbar/>
        }
        <Topbar/>
        <div className="main-content">
          <Routes>
            <Route path="/fridge" element={user ? <Fridge/> : <Navigate to="/login"/>}/>
            <Route path="/login" element={!user ? <Login/> : <Navigate to="/fridge"/>}/>
            <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/fridge"/>}/>
            <Route path="/meals" element={<Landing/>}/>
            <Route path="/" element={!user ? <Landing/> : <Navigate to="/fridge"/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
  
}

export default App;