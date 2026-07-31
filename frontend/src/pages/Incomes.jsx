import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2 } from 'lucide-react';
import './FinancePages.css';

const Incomes = () => {
  const { incomes, fetchIncomes, addIncome, deleteIncome, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Salary', description: '', date: ''
  });

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addIncome({ ...formData, amount: Number(formData.amount) });
    setFormData({ title: '', amount: '', category: 'Salary', description: '', date: '' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Incomes</h1>
        <p className="subtitle">Manage and track all your incoming cash flow.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add New Income</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Monthly Salary" />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investments">Investments</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Optional description..." rows="3"></textarea>
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Income
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>Income History</h3>
          <div className="items-list">
            {incomes.length === 0 ? (
              <div className="empty-state">No incomes recorded yet.</div>
            ) : (
              incomes.map(item => (
                <div key={item.id} className="finance-item">
                  <div className="item-details">
                    <div className="item-icon bg-success-light">
                       {/* Icon based on category can go here */}
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-amount positive">+₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => deleteIncome(item.id)} className="btn-icon danger">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incomes;
