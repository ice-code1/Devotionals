import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Children from './pages/Children';
import Teenagers from './pages/Teenagers';
import Archive from './pages/Archive';
import Favorites from './pages/Favorites';
import DevotionalDetail from './pages/DevotionalDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import WriterDashboard from './pages/writer/Dashboard';   // 👈 make sure you have this

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="children" element={<Children />} />
            <Route path="teenagers" element={<Teenagers />} />
            <Route path="archive/:section" element={<Archive />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="devotional/:slug" element={<DevotionalDetail />} />
          </Route>

          {/* Admin routes (no Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Writer routes (no Layout) */}
          <Route path="/writer/dashboard" element={<WriterDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
