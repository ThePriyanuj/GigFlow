import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { LogOut, Zap, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface-900/80 backdrop-blur-xl border-b border-surface-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-600/20">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Gig<span className="text-primary-400">Flow</span>
              </h1>
              <p className="text-[10px] text-surface-500 uppercase tracking-widest">Smart Leads</p>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-surface-800/50 rounded-xl border border-surface-700">
              <div className="p-1.5 bg-primary-600/20 rounded-lg">
                <User size={14} className="text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
