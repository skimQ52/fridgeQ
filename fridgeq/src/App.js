import React, { Component } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Fridge from './components/Fridge/Fridge';
import Navbar from './components/Navbar';
import Login from './components/Login/Login';
import Signup from './components/Signup';
import Topbar from './components/Topbar';
import Landing from './components/Landing/Landing';
import Meals from './components/Meals';
import { useAuthContext } from './hooks/useAuthContext';
import { PageProvider } from './context/PageContext';

function App() {

  const { user } = useAuthContext();

  return (
    <PageProvider>
      <BrowserRouter>
        <div className='App'>
          {user && // show only if there is a user
            <Navbar/>
          }
          <Topbar/>
          <div className="main-content">
            <Routes>
              <Route exact path="/" element={!user ? <Landing/> : <Navigate to="/fridge"/>}/>
              <Route path="/fridge" element={user ? <Fridge/> : <Navigate to="/login"/>}/>
              <Route path="/login" element={!user ? <Login/> : <Navigate to="/fridge"/>}/>
              <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/fridge"/>}/>
              <Route path="/meals" element={user ? <Meals/> : <Navigate to="/login"/>}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </PageProvider>
  );
  
}

export default App;