import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FinFlowAI from '../components/FinFlowAI';
import './MainLayout.css';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="main-layout">
      <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
      <div className="main-content">
        <Navbar toggleMobileMenu={toggleMobileMenu} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      
      {!isAiOpen && (
        <button className="floating-ai-btn" onClick={() => setIsAiOpen(true)}>
          <Bot size={28} />
        </button>
      )}
      
      <FinFlowAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export default MainLayout;
