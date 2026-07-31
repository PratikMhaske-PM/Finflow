import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Wallets from './pages/Wallets';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Bills from './pages/Bills';
import Subscriptions from './pages/Subscriptions';
import Loans from './pages/Loans';
import Suggestions from './pages/Suggestions';
import Education from './pages/Education';
import Calculators from './pages/Calculators';
import SmartInvestment from './pages/SmartInvestment';
import LoanPayoff from './pages/LoanPayoff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { fetchProfile, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="bills" element={<Bills />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="loans" element={<Loans />} />
            <Route path="suggestions" element={<Suggestions />} />
            <Route path="calculators" element={<Calculators />} />
            <Route path="smart-investment" element={<SmartInvestment />} />
            <Route path="loan-payoff" element={<LoanPayoff />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            {/* Other protected routes will go here */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
