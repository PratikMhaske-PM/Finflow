import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, Target } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Budgets = () => {
  const { budgets, fetchBudgets, addBudget, deleteBudget, expenses, fetchExpenses, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    category: 'Food', amount: '', period: 'monthly', startDate: '', endDate: ''
  });

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, [fetchBudgets, fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBudget({ ...formData, amount: Number(formData.amount) });
    setFormData({ category: 'Food', amount: '', period: 'monthly', startDate: '', endDate: '' });
  };

  const calculateProgress = (budget) => {
    // Get all expenses for this budget category within the date range
    const categoryExpenses = expenses.filter(exp => 
        exp.category === budget.category &&
        new Date(exp.date) >= new Date(budget.startDate) &&
        new Date(exp.date) <= new Date(budget.endDate)
    );
    const spent = categoryExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const percentage = Math.min((spent / Number(budget.amount)) * 100, 100);
    return { spent, percentage };
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Budgets</h1>
        <p className="subtitle">Set spending limits and track your progress.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Create Budget</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Food">Food & Dining</option>
                <option value="Housing">Housing</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Limit Amount (₹)</label>
              <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Period</label>
              <select value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Budget
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>Active Budgets</h3>
          <div className="items-list">
            {budgets.length === 0 ? (
              <div className="empty-state">No budgets set yet.</div>
            ) : (
              budgets.map(item => {
                const { spent, percentage } = calculateProgress(item);
                const isOverBudget = percentage >= 100;
                const isNearLimit = percentage >= 80 && !isOverBudget;
                
                let progressColor = 'var(--primary-color)';
                if (isOverBudget) progressColor = 'var(--danger-color)';
                else if (isNearLimit) progressColor = 'var(--warning-color)';

                return (
                  <div key={item.id} className="budget-card">
                    <div className="budget-header">
                        <div className="budget-title">
                            <Target size={20} className="budget-icon" />
                            <h4>{item.category} Budget</h4>
                        </div>
                        <button onClick={() => deleteBudget(item.id)} className="btn-icon danger">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="budget-stats">
                        <span>₹{Number(spent).toLocaleString('en-IN')} spent</span>
                        <span>₹{Number(item.amount).toLocaleString('en-IN')} limit</span>
                    </div>
                    
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${percentage}%`, backgroundColor: progressColor }}
                        ></div>
                    </div>
                    
                    <p className="budget-dates">
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
