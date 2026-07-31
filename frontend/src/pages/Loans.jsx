import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Loans = () => {
  const { loans, fetchLoans, addLoan, deleteLoan, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    loanName: '', totalAmount: '', remainingBalance: '', emi: '', interestRate: ''
  });

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLoan({ 
        ...formData, 
        totalAmount: Number(formData.totalAmount),
        remainingBalance: Number(formData.remainingBalance),
        emi: Number(formData.emi),
        interestRate: Number(formData.interestRate)
    });
    setFormData({ loanName: '', totalAmount: '', remainingBalance: '', emi: '', interestRate: '' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Loan Tracker</h1>
        <p className="subtitle">Track your debt and EMI payments.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add Loan</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Loan Name</label>
              <input type="text" value={formData.loanName} onChange={e => setFormData({...formData, loanName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Total Amount (₹)</label>
              <input type="number" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} required min="1" />
            </div>
            <div className="form-group">
              <label>Remaining Balance (₹)</label>
              <input type="number" value={formData.remainingBalance} onChange={e => setFormData({...formData, remainingBalance: e.target.value})} required min="0" />
            </div>
            <div className="form-group">
              <label>Monthly EMI (₹)</label>
              <input type="number" value={formData.emi} onChange={e => setFormData({...formData, emi: e.target.value})} required min="0" />
            </div>
            <div className="form-group">
              <label>Interest Rate (%)</label>
              <input type="number" step="0.1" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: e.target.value})} required min="0" />
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Loan
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>Active Loans</h3>
          <div className="items-list">
            {loans.length === 0 ? <div className="empty-state">No loans added.</div> : 
              loans.map(item => {
                const paid = Number(item.totalAmount) - Number(item.remainingBalance);
                const percentage = Math.min((paid / Number(item.totalAmount)) * 100, 100);
                
                return (
                  <div key={item.id} className="budget-card">
                    <div className="budget-header">
                        <div className="budget-title">
                            <Briefcase size={20} className="budget-icon" style={{color: 'var(--danger-color)'}}/>
                            <h4>{item.loanName}</h4>
                        </div>
                        <button onClick={() => deleteLoan(item.id)} className="btn-icon danger"><Trash2 size={16} /></button>
                    </div>
                    
                    <div className="budget-stats">
                        <span>Paid: ₹{paid.toLocaleString('en-IN')}</span>
                        <span>Total: ₹{Number(item.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${percentage}%`, backgroundColor: 'var(--success-color)' }}></div>
                    </div>
                    
                    <p className="budget-dates">
                        EMI: ₹{Number(item.emi).toLocaleString('en-IN')} • Interest: {item.interestRate}%
                    </p>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;
