// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register'; 
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import CreateCategory from './components/CreateCategory';
import CreateThemes from './components/CreateThemes';
import CreateContents from './components/CreateContents';
import ThemeSearcher from './components/ThemeSearcher';
import ContentSearcher from './components/ContentSearch';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    setIsLoggedIn(true);
    setRole(data.user.role);
    setToken(data.token);
    setUsername(data.user.username)
  };

  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Login onSuccess={handleLoginSuccess} />
        } />

        <Route path="/register" element={<Register />} /> 

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard isLoggedIn={isLoggedIn} role={role} token={token} username={username}  /> : <Navigate to="/login" />
        }>
            <Route index element={<DashboardHome 
              isLoggedIn={isLoggedIn}
              role={role} 
              token={token}
              username={username} 
            />} />
        <Route path="create-category" element={<CreateCategory />} />
        <Route path="create-themes" element={<CreateThemes />} />
        <Route path="create-contents" element={<CreateContents />} />
        <Route path="search-theme" element={<ThemeSearcher />} />
        <Route path="search-content" element={<ContentSearcher />} />
         
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;