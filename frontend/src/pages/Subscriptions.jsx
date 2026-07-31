import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, Repeat } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Subscriptions = () => {
  const { subscriptions, fetchSubscriptions, addSubscription, deleteSubscription, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    serviceName: '', cost: '', billingCycle: 'Monthly', nextBillingDate: ''
  });

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addSubscription({ ...formData, cost: Number(formData.cost) });
    setFormData({ serviceName: '', cost: '', billingCycle: 'Monthly', nextBillingDate: '' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Subscriptions</h1>
        <p className="subtitle">Manage all your recurring services.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add Subscription</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Service Name (e.g. Netflix)</label>
              <input type="text" value={formData.serviceName} onChange={e => setFormData({...formData, serviceName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Cost (₹)</label>
              <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} required min="1" />
            </div>
            <div className="form-group">
              <label>Next Billing Date</label>
              <input type="date" value={formData.nextBillingDate} onChange={e => setFormData({...formData, nextBillingDate: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Subscription
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>Active Subscriptions</h3>
          <div className="items-list">
            {subscriptions.length === 0 ? <div className="empty-state">No subscriptions added.</div> : 
              subscriptions.map(item => (
                <div key={item.id} className="finance-item">
                  <div className="item-details">
                    <div className="item-icon" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}><Repeat size={24}/></div>
                    <div>
                      <h4>{item.serviceName}</h4>
                      <p>Billed {item.billingCycle} • Next: {new Date(item.nextBillingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-amount negative">-₹{Number(item.cost).toLocaleString('en-IN')}</span>
                    <button onClick={() => deleteSubscription(item.id)} className="btn-icon danger"><Trash2 size={18} /></button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
