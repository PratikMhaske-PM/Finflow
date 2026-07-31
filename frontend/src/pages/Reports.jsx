import React, { useEffect } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Download, BarChart2 } from 'lucide-react';
import './FinancePages.css';

const Reports = () => {
  const { analytics, fetchAnalytics, isLoading } = useFinanceStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = () => {
    // Open export route in new tab to trigger download
    window.open('http://localhost:5000/api/reports/export', '_blank');
  };

  if (isLoading || !analytics) {
      return <div className="finance-page"><p>Loading analytics...</p></div>;
  }

  const { summary, topCategories, recentIncomes, recentExpenses } = analytics;

  return (
    <div className="finance-page">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1>Reports & Analytics</h1>
            <p className="subtitle">Detailed insights into your financial health.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }} className="no-print">
            <button onClick={handleExport} className="btn-secondary flex-center">
                <Download size={18} /> Export CSV
            </button>
            <button onClick={() => window.print()} className="btn-primary flex-center">
                <Download size={18} /> Download PDF
            </button>
        </div>
      </header>

      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Savings Rate</h3>
            <h2>{summary.savingsRate}%</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Net Balance</h3>
            <h2 style={{ color: summary.netBalance >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                ₹{summary.netBalance.toLocaleString('en-IN')}
            </h2>
          </div>
        </div>
      </div>

      <div className="finance-content">
        <div className="form-container">
          <h3>Top Spending Categories</h3>
          <div className="items-list" style={{ marginTop: '1rem' }}>
            {topCategories.length === 0 ? (
                <div className="empty-state">No data available.</div>
            ) : (
                topCategories.map((cat, index) => (
                    <div key={index} className="finance-item" style={{ borderLeft: '4px solid var(--danger-color)' }}>
                        <div className="item-details">
                            <h4>{cat.category}</h4>
                        </div>
                        <div className="item-actions">
                            <span className="item-amount negative">-₹{cat.amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        <div className="list-container">
          <h3>Last 30 Days Summary</h3>
          <div className="items-list" style={{ marginTop: '1rem' }}>
             <div className="finance-item">
                 <div className="item-details"><h4>Total Income (30 Days)</h4></div>
                 <div className="item-actions"><span className="item-amount positive">+₹{recentIncomes.reduce((a,c)=>a+c.amount,0).toLocaleString('en-IN')}</span></div>
             </div>
             <div className="finance-item">
                 <div className="item-details"><h4>Total Expenses (30 Days)</h4></div>
                 <div className="item-actions"><span className="item-amount negative">-₹{recentExpenses.reduce((a,c)=>a+c.amount,0).toLocaleString('en-IN')}</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
