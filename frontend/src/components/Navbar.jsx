import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, Moon, Sun } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import './Navbar.css';

const Navbar = ({ toggleMobileMenu }) => {
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="navbar">
      <button className="mobile-menu-btn icon-btn" onClick={toggleMobileMenu}>
        <Menu size={24} />
      </button>
      <div className="navbar-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search transactions, budgets..." />
      </div>
      
      <div className="navbar-actions">
        <button className="icon-btn" onClick={() => setIsDark(!isDark)} title="Toggle Theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="profile-menu">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">Premium User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
