import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, FileText } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Bills = () => {
  const { bills, fetchBills, addBill, deleteBill, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    title: '', amount: '', dueDate: '', category: 'Electricity', status: 'Pending'
  });

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBill({ ...formData, amount: Number(formData.amount) });
    setFormData({ title: '', amount: '', dueDate: '', category: 'Electricity', status: 'Pending' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Bills Tracker</h1>
        <p className="subtitle">Never miss a payment.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add Bill</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Biller Name</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Electricity">Electricity</option>
                <option value="Internet">Internet</option>
                <option value="Water">Water</option>
                <option value="Rent">Rent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Bill
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>Upcoming Bills</h3>
          <div className="items-list">
            {bills.length === 0 ? <div className="empty-state">No bills added yet.</div> : 
              bills.map(item => (
                <div key={item.id} className="finance-item">
                  <div className="item-details">
                    <div className="item-icon bg-warning-light"><FileText size={24}/></div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>Due: {new Date(item.dueDate).toLocaleDateString()} • {item.category}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-amount negative">-₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => deleteBill(item.id)} className="btn-icon danger"><Trash2 size={18} /></button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bills;
