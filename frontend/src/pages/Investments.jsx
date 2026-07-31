import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import './FinancePages.css';
import './FinancePages2.css';

const Investments = () => {
  const { investments, fetchInvestments, addInvestment, deleteInvestment, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    assetName: '', assetType: 'Stocks', amountInvested: '', currentValue: '', purchaseDate: ''
  });

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addInvestment({ 
        ...formData, 
        amountInvested: Number(formData.amountInvested),
        currentValue: Number(formData.currentValue)
    });
    setFormData({ assetName: '', assetType: 'Stocks', amountInvested: '', currentValue: '', purchaseDate: '' });
  };

  const totalInvested = investments.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const totalCurrent = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;
  const totalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  return (
    <div className="finance-page">
      <header className="page-header">
        <h1>Investments Portfolio</h1>
        <p className="subtitle">Track stocks, crypto, mutual funds, and ROI.</p>
      </header>

      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Invested</h3>
            <h2>${totalInvested.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Current Value</h3>
            <h2>${totalCurrent.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Total ROI</h3>
            <h2 style={{ color: totalROI >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
            </h2>
            <p className="trend">{totalProfit >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(totalProfit).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="finance-content">
        <div className="form-container">
          <h3>Add Asset</h3>
          <form onSubmit={handleSubmit} className="finance-form">
            <div className="form-group">
              <label>Asset Name</label>
              <input type="text" value={formData.assetName} onChange={e => setFormData({...formData, assetName: e.target.value})} required placeholder="e.g. AAPL, BTC" />
            </div>
            <div className="form-group">
              <label>Asset Type</label>
              <select value={formData.assetType} onChange={e => setFormData({...formData, assetType: e.target.value})}>
                <option value="Stocks">Stocks</option>
                <option value="Crypto">Crypto</option>
                <option value="Mutual Funds">Mutual Funds</option>
                <option value="Gold">Gold</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount Invested ($)</label>
              <input type="number" value={formData.amountInvested} onChange={e => setFormData({...formData, amountInvested: e.target.value})} required min="1" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Current Value ($)</label>
              <input type="number" value={formData.currentValue} onChange={e => setFormData({...formData, currentValue: e.target.value})} required min="0" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Purchase Date</label>
              <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
              <Plus size={18} /> Add Investment
            </button>
          </form>
        </div>

        <div className="list-container">
          <h3>My Portfolio</h3>
          <div className="items-list">
            {investments.length === 0 ? (
              <div className="empty-state">No investments added yet.</div>
            ) : (
              investments.map(item => {
                const profitOrLoss = item.currentValue - item.amountInvested;
                const isProfit = profitOrLoss >= 0;
                
                return (
                  <div key={item._id} className="finance-item">
                    <div className="item-details">
                      <div className={`item-icon ${isProfit ? 'bg-success-light' : 'bg-danger-light'}`}>
                         {isProfit ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
                      </div>
                      <div>
                        <h4>{item.assetName} <span className="wallet-type">{item.assetType}</span></h4>
                        <p>Invested: ${item.amountInvested.toLocaleString()} • {new Date(item.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="item-actions">
                      <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                          <div className="item-amount">${item.currentValue.toLocaleString()}</div>
                          <div className={`${isProfit ? 'positive' : 'negative'}`} style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                              {isProfit ? '+' : '-'}${Math.abs(profitOrLoss).toLocaleString()} ({(item.roi || 0).toFixed(2)}%)
                          </div>
                      </div>
                      <button onClick={() => deleteInvestment(item._id)} className="btn-icon danger">
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default Investments;
