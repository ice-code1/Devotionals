import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Children from './pages/Children';
import Teenagers from './pages/Teenagers';
import Archive from './pages/Archive';
import DevotionalDetail from './pages/DevotionalDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="children" element={<Children />} />
            <Route path="teenagers" element={<Teenagers />} />
            <Route path="archive/:section" element={<Archive />} />
            <Route path="devotional/:slug" element={<DevotionalDetail />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;