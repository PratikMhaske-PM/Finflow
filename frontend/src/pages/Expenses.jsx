import React, { useEffect, useState } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Plus, Trash2 } from 'lucide-react';
import './FinancePages.css';

const Expenses = () => {
  const { expenses, fetchExpenses, addExpense, deleteExpense, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Food', description: '', date: ''
  });
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addExpense({ ...formData, amount: Number(formData.amount) });
    setFormData({ title: '', amount: '', category: 'Food', description: '', date: '' });
  };

  const startScan = () => {
    setIsScanning(true);
    // Simulate OCR processing time
    setTimeout(() => {
      setIsScanning(false);
      setFormData({
        title: 'Dinner at Dominos',
        amount: '850',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: 'Auto-extracted from receipt scan'
      });
    }, 2500);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const text = event.target.result;
        const lines = text.split('\n');
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const [date, title, amount, category] = lines[i].split(',');
          
          if (title && amount) {
            await addExpense({
              title: title.trim(),
              amount: Math.abs(Number(amount)),
              category: category ? category.trim() : 'Other',
              date: date ? new Date(date) : new Date(),
              description: 'Imported via CSV'
            });
          }
        }
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    }
  };

  return (
    <div className="finance-page">
      
      {/* Scanner Modal Overlay */}
      {isScanning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
          <h2 style={{ marginBottom: '2rem' }}>Scanning Receipt...</h2>
          <div style={{
            position: 'relative', width: '300px', height: '400px', 
            border: '2px solid rgba(255,255,255,0.3)', borderRadius: '10px', overflow: 'hidden',
            background: 'linear-gradient(to bottom, #1a1a1a, #2a2a2a)'
          }}>
            {/* Simulated Receipt Content */}
            <div style={{ padding: '20px', opacity: 0.5, fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <p>DOMINOS PIZZA</p>
              <p>----------------</p>
              <p>1x Farmhouse   450</p>
              <p>1x Choco Lava  100</p>
              <p>Taxes          300</p>
              <p>----------------</p>
              <p>TOTAL          850</p>
            </div>
            {/* Laser Line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
              backgroundColor: '#10b981', boxShadow: '0 0 10px 2px #10b981',
              animation: 'scan 1.5s infinite alternate ease-in-out'
            }} />
          </div>
          <style>{`
            @keyframes scan {
              0% { top: 0; }
              100% { top: 100%; }
            }
          `}</style>
        </div>
      )}

      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Expenses</h1>
          <p className="subtitle">Track and categorize your spending.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={startScan} className="btn-primary" style={{ backgroundColor: 'var(--success-color)' }}>
            📸 Scan Receipt
          </button>
          <button onClick={() => setIsImporting(!isImporting)} className="btn-secondary">
            {isImporting ? 'Manual Entry' : 'Bulk Import CSV'}
          </button>
        </div>
      </header>

      <div className="finance-content">
        <div className="form-container">
          {isImporting ? (
            <div 
              className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '4rem 2rem',
                textAlign: 'center',
                backgroundColor: dragActive ? 'rgba(79, 70, 229, 0.05)' : 'var(--bg-color)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Drop your Bank CSV here</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Format: Date, Title, Amount, Category</p>
            </div>
          ) : (
            <>
              <h3>Add New Expense</h3>
              <form onSubmit={handleSubmit} className="finance-form">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Groceries" />
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required min="1" placeholder="0.00" />
                </div>
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
                  <label>Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Optional description..." rows="3"></textarea>
                </div>
                <button type="submit" className="btn-primary flex-center" disabled={isLoading}>
                  <Plus size={18} /> Add Expense
                </button>
              </form>
            </>
          )}
        </div>

        <div className="list-container">
          <h3>Expense History</h3>
          <div className="items-list">
            {expenses.length === 0 ? (
              <div className="empty-state">No expenses recorded yet.</div>
            ) : (
              expenses.map(item => (
                <div key={item.id} className="finance-item">
                  <div className="item-details">
                    <div className="item-icon bg-danger-light">
                       {/* Icon based on category can go here */}
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-amount negative">-₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => deleteExpense(item.id)} className="btn-icon danger">
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

export default Expenses;
