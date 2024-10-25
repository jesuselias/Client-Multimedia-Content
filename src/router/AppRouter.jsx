import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import Register from '../components/Register';
import ReloadWallet from '../components/ReloadWallet';
import Pay from '../components/Pay';
import CheckBalance from '../components/CheckBalance';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reload-wallet" element={<ReloadWallet />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/check-balance" element={<CheckBalance />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
