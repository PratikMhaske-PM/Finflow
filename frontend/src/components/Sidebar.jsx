import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowDownCircle, ArrowUpCircle, PieChart, Settings, LogOut, FileText, Repeat, Briefcase, Lightbulb, PlayCircle, Calculator, Rocket, FastForward } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeMenu }) => {
  const { logout } = useAuthStore();
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Incomes', icon: <ArrowUpCircle size={20} />, path: '/incomes' },
    { name: 'Expenses', icon: <ArrowDownCircle size={20} />, path: '/expenses' },
    { name: 'Budgets', icon: <PieChart size={20} />, path: '/budgets' },
    { name: 'Bills', icon: <FileText size={20} />, path: '/bills' },
    { name: 'Subscriptions', icon: <Repeat size={20} />, path: '/subscriptions' },
    { name: 'Loans', icon: <Briefcase size={20} />, path: '/loans' },
    { name: 'Calculators', icon: <Calculator size={20} />, path: '/calculators' },
    { name: 'Smart Investment', icon: <Rocket size={20} />, path: '/smart-investment' },
    { name: 'Fast Loan Cover', icon: <FastForward size={20} />, path: '/loan-payoff' },
    { name: 'Suggestions', icon: <Lightbulb size={20} />, path: '/suggestions' },
    { name: 'Reports', icon: <PieChart size={20} />, path: '/reports' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">F</div>
          <h2>FinFlow</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                  onClick={closeMenu} // Close on navigation in mobile
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => logout()}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
