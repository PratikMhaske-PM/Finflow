import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Wallets = () => {
  const { wallets, fetchWallets, addWallet, deleteWallet, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    name: '', type: 'Bank', balance: ''
  });

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addWallet({ ...formData, balance: Number(formData.balance) });
    setFormData({ name: '', type: 'Bank', balance: '' });
  };

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Wallets & Accounts</h1>
        <p className="subtitle">Manage all your financial accounts in one place.</p>
      </header>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add New Wallet</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Wallet Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Main Checking" />
            </div>
            <div className="form-group">
              <label>Initial Balance ($)</label>
              <input type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} required placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">Digital Wallet (UPI, PayPal)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Wallet
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>My Wallets</h3>
          <div className="wallet-grid">
            {wallets.length === 0 ? (
              <div className="empty-state">No wallets added yet.</div>
            ) : (
              wallets.map(item => (
                <div key={item._id} className="wallet-card">
                  <div className="wallet-header">
                    <div className="wallet-icon">
                        <CreditCard size={24} />
                    </div>
                    <button onClick={() => deleteWallet(item._id)} className="btn-icon danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="wallet-info">
                    <h4>{item.name}</h4>
                    <span className="wallet-type">{item.type}</span>
                  </div>
                  <div className="wallet-balance">
                    <h2>${item.balance.toLocaleString()}</h2>
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

export default Wallets;
