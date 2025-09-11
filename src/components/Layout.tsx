import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Home, Archive, Settings, Star } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              <Heart className="h-6 w-6 text-purple-600" />
              <span>Daily Devotionals</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/favorites"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Star className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/archive/children"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Children's Archive
                    </Link>
                    <Link
                      to="/archive/teenagers"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Teenagers' Archive
                    </Link>
                  </div>
                </div>
              </div>
              
              <Link
                to="/admin/login"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}