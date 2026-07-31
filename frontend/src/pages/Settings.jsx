import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="settings-container">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Manage your account preferences and application settings.</p>
      </header>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-header">
            <User className="settings-icon" />
            <h3>Profile Information</h3>
          </div>
          <div className="settings-body">
            <div className="info-group">
              <label>Full Name</label>
              <p>{user?.name}</p>
            </div>
            <div className="info-group">
              <label>Email Address</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-group">
              <label>Account Status</label>
              <p className="badge-premium">Premium Member</p>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            {theme === 'light' ? <Sun className="settings-icon" /> : <Moon className="settings-icon" />}
            <h3>Appearance</h3>
          </div>
          <div className="settings-body">
            <div className="theme-toggle-row">
              <div>
                <h4>Dark Mode</h4>
                <p className="text-sm text-secondary">Switch between light and dark themes</p>
              </div>
              <button 
                className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`} 
                onClick={toggleTheme}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="settings-card danger-zone">
            <h3>Danger Zone</h3>
            <button onClick={logout} className="btn-logout-full">
                <LogOut size={18} /> Sign Out of FinFlow
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
