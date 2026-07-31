import React, { useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import useFinanceStore from '../store/useFinanceStore';
import useAuthStore from '../store/useAuthStore';
import './Dashboard.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const { user } = useAuthStore();
  const { 
    fetchIncomes, fetchExpenses, fetchBills, fetchSubscriptions, fetchLoans,
    getTotals, incomes, expenses 
  } = useFinanceStore();

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    fetchBills();
    fetchSubscriptions();
    fetchLoans();
  }, [fetchIncomes, fetchExpenses, fetchBills, fetchSubscriptions, fetchLoans]);

  const { totalIncome, totalExpense, balance } = getTotals();

  // Prepare data for Area Chart (Trend)
  const allTransactions = [...incomes, ...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  let runningBalance = 0;
  const trendData = allTransactions.map(t => {
      const isIncome = incomes.some(i => i.id === t.id);
      runningBalance += isIncome ? Number(t.amount) : -Number(t.amount);
      return {
          date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          Balance: runningBalance
      }
  });

  // Prepare data for Pie Chart (Expenses by Category)
  const expensesByCategory = expenses.reduce((acc, curr) => {
      if(acc[curr.category]) {
          acc[curr.category] += Number(curr.amount);
      } else {
          acc[curr.category] = Number(curr.amount);
      }
      return acc;
  }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({
      name: key,
      value: expensesByCategory[key]
  }));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name || 'User'}! Here's your financial summary.</p>
        </div>
      </header>
      
      <motion.div variants={itemVariants} className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <IndianRupee size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Balance</h3>
            <h2>₹{balance.toLocaleString()}</h2>
            <p className={`trend ${balance >= 0 ? 'positive' : 'negative'}`}>Current standing</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <ArrowUpRight size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Income</h3>
            <h2>₹{totalIncome.toLocaleString()}</h2>
            <p className="trend positive">Lifetime earnings</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-danger">
            <ArrowDownRight size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Expense</h3>
            <h2>₹{totalExpense.toLocaleString()}</h2>
            <p className="trend negative">Lifetime spending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <Wallet size={24} />
          </div>
          <div className="stat-details">
            <h3>Savings Rate</h3>
            <h2>{totalIncome ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%</h2>
            <p className="trend positive">Of total income</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="dashboard-charts">
        <div className="chart-card main-chart">
          <h3>Balance Trend</h3>
          <div className="chart-placeholder" style={{ background: 'transparent', border: 'none' }}>
            {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)"/>
                        <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`}/>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}/>
                        <Area type="monotone" dataKey="Balance" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3}/>
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Not enough data to show trends.</div>
            )}
          </div>
        </div>
        <div className="chart-card side-chart">
          <h3>Expenses by Category</h3>
          <div className="chart-placeholder" style={{ background: 'transparent', border: 'none' }}>
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--card-bg)' }} formatter={(value) => `₹${value}`}/>
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No expenses yet.</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
