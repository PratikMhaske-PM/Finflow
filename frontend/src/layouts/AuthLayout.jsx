import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './AuthLayout.css';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="logo-icon large">F</div>
          <h1>FinFlow</h1>
          <p>Your journey to financial freedom starts here.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
