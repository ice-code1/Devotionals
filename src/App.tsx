import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Children from './pages/Children';
import PrayerRequestForm from './components/PrayerRequestForm';
import CounselRequestForm from './components/CounselRequestForm';
import Teenagers from './pages/Teenagers';
import Archive from './pages/Archive';
import Favorites from './pages/Favorites';
import DevotionalDetail from './pages/DevotionalDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';
import WriterDashboard from './pages/writer/Dashboard';   // 

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnalyticsProvider>
          <Routes>
            {/* Public routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="children" element={<Children />} />
              <Route path="teenagers" element={<Teenagers />} />
              <Route path="archive/:section" element={<Archive />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="devotional/:slug" element={<DevotionalDetail />} />
              <Route path="/prayer" element={<PrayerRequestForm />} />
              <Route path="/counselling" element={<CounselRequestForm />} />
            </Route>

            {/* Admin routes (no Layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />

            {/* Writer routes (no Layout) */}
            <Route path="/writer/dashboard" element={<WriterDashboard />} />
          </Routes>
        </AnalyticsProvider>
      </Router>
    </HelmetProvider>
  );
}


export default App;
