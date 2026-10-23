import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Home, Settings } from 'lucide-react';
import { useState } from 'react';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-cyan-500">
            PartSight AI
          </Link>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-cyan-500">
              Login
            </Link>
            <Link to="/register" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded">
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-cyan-500">
            PartSight AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className="text-gray-300 hover:text-cyan-500 flex items-center gap-2">
              <Home size={18} /> Dashboard
            </Link>
            <Link to="/machines" className="text-gray-300 hover:text-cyan-500">
              Machines
            </Link>
            <Link to="/inspections" className="text-gray-300 hover:text-cyan-500">
              Inspections
            </Link>
            <Link to="/alerts" className="text-gray-300 hover:text-cyan-500">
              Alerts
            </Link>
            <Link to="/analytics" className="text-gray-300 hover:text-cyan-500">
              Analytics
            </Link>
            <Link to="/settings" className="text-gray-300 hover:text-cyan-500 flex items-center gap-2">
              <Settings size={18} />
            </Link>
            <div className="border-l border-gray-700 pl-8">
              <span className="text-gray-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="ml-4 text-gray-300 hover:text-red-500 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-cyan-500"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 border-t border-gray-800 pt-4">
            <Link to="/dashboard" className="block text-gray-300 hover:text-cyan-500">
              Dashboard
            </Link>
            <Link to="/machines" className="block text-gray-300 hover:text-cyan-500">
              Machines
            </Link>
            <Link to="/inspections" className="block text-gray-300 hover:text-cyan-500">
              Inspections
            </Link>
            <Link to="/alerts" className="block text-gray-300 hover:text-cyan-500">
              Alerts
            </Link>
            <Link to="/analytics" className="block text-gray-300 hover:text-cyan-500">
              Analytics
            </Link>
            <Link to="/settings" className="block text-gray-300 hover:text-cyan-500">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-gray-300 hover:text-red-500"
            >
              Logout ({user?.name})
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
