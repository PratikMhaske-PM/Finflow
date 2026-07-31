import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, Award } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Goals = () => {
  const { goals, fetchGoals, addGoal, deleteGoal, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    title: '', targetAmount: '', currentAmount: '', deadline: ''
  });

  const totalSaved = goals.reduce((acc, goal) => acc + Number(goal.currentAmount || 0), 0);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addGoal({ 
        ...formData, 
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0
    });
    setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Savings Goals</h1>
        <p className="subtitle">Set targets, earn badges, and watch your savings grow.</p>
      </header>

      {/* Gamification Badges Section */}
      <div className="gamification-badges" style={{ 
        display: 'flex', gap: '1rem', padding: '1.5rem', 
        backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', 
        marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '1rem' }}>
          <h3 style={{ margin: 0 }}>My Badges</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unlock by saving more!</p>
        </div>
        
        <div className="badge-item" style={{ textAlign: 'center', opacity: totalSaved >= 1000 ? 1 : 0.3 }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #b87333, #e59866)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: 'white', boxShadow: totalSaved >= 1000 ? '0 0 10px rgba(184, 115, 51, 0.5)' : 'none' }}>
            <Award size={24} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Bronze Saver</span>
        </div>
        
        <div className="badge-item" style={{ textAlign: 'center', opacity: totalSaved >= 50000 ? 1 : 0.3 }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #c0c0c0, #e0e0e0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#333', boxShadow: totalSaved >= 50000 ? '0 0 10px rgba(192, 192, 192, 0.5)' : 'none' }}>
            <Award size={24} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Silver Saver</span>
        </div>

        <div className="badge-item" style={{ textAlign: 'center', opacity: totalSaved >= 100000 ? 1 : 0.3 }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700, #ffea00)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', color: '#85660d', boxShadow: totalSaved >= 100000 ? '0 0 15px rgba(255, 215, 0, 0.6)' : 'none' }}>
            <Award size={24} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Gold Saver</span>
        </div>
      </div>

      <div className="finance-content">
        <div className="form-container">
          <h3>Create New Goal</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Goal Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. New Car" />
            </div>
            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input type="number" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} required min="1" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Already Saved (₹)</label>
              <input type="number" value={formData.currentAmount} onChange={e => setFormData({...formData, currentAmount: e.target.value})} min="0" placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>Target Date</label>
              <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Create Goal
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>My Goals Rings</h3>
          <div className="items-list goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {goals.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No goals created yet.</div>
            ) : (
              goals.map(item => {
                const percentage = Math.min((Number(item.currentAmount) / Number(item.targetAmount)) * 100, 100);
                // Conic gradient string
                const bgGradient = `conic-gradient(var(--primary-color) ${percentage}%, var(--border-color) 0)`;
                
                return (
                  <div key={item.id} className="budget-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', textAlign: 'center' }}>
                    <div className="budget-header" style={{ width: '100%', marginBottom: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => deleteGoal(item.id)} className="btn-icon danger">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    {/* Radial Progress Ring */}
                    <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--card-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{Math.round(percentage)}%</span>
                        </div>
                    </div>
                    
                    <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
                    
                    <div className="budget-stats" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>₹{Number(item.currentAmount).toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>of ₹{Number(item.targetAmount).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <p className="budget-dates" style={{ fontSize: '0.75rem', marginTop: 'auto' }}>
                        Target: {new Date(item.deadline).toLocaleDateString()}
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

export default Goals;
