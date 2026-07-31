import React, { useState, useEffect } from 'react';
import { FastForward, CheckCircle, TrendingDown } from 'lucide-react';
import './FinancePages.css';

const LoanPayoff = () => {
  const [balance, setBalance] = useState(5000000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [remainingYears, setRemainingYears] = useState(20);
  const [extraPayment, setExtraPayment] = useState(10000);

  const [baseEmi, setBaseEmi] = useState(0);
  const [baseTotalInterest, setBaseTotalInterest] = useState(0);
  
  const [newTenureMonths, setNewTenureMonths] = useState(0);
  const [newTotalInterest, setNewTotalInterest] = useState(0);

  useEffect(() => {
    const P = parseFloat(balance);
    const R = parseFloat(interestRate);
    const Y = parseFloat(remainingYears);
    const Extra = parseFloat(extraPayment) || 0;

    if (P > 0 && R > 0 && Y > 0) {
      const r = R / 12 / 100;
      const N = Y * 12;

      // 1. Calculate Base Plan
      const calcEmi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      const totalInterestBase = (calcEmi * N) - P;
      setBaseEmi(calcEmi);
      setBaseTotalInterest(totalInterestBase);

      // 2. Simulate Fast Cover Up (Amortization Schedule)
      const totalMonthlyPayment = calcEmi + Extra;
      let currentBalance = P;
      let totalInterestFast = 0;
      let monthsPassed = 0;

      while (currentBalance > 0 && monthsPassed < 1200) { // max 100 years safety
        const interestForMonth = currentBalance * r;
        totalInterestFast += interestForMonth;

        let principalPaid = totalMonthlyPayment - interestForMonth;
        
        // If payment covers the rest of the balance
        if (principalPaid >= currentBalance) {
          principalPaid = currentBalance;
          currentBalance = 0;
        } else {
          currentBalance -= principalPaid;
        }
        
        monthsPassed++;
      }

      setNewTenureMonths(monthsPassed);
      setNewTotalInterest(totalInterestFast);

    } else {
      setBaseEmi(0);
      setBaseTotalInterest(0);
      setNewTenureMonths(0);
      setNewTotalInterest(0);
    }
  }, [balance, interestRate, remainingYears, extraPayment]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatTime = (months) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} Months`;
    if (m === 0) return `${y} Years`;
    return `${y} Yrs, ${m} Mos`;
  };

  const timeSavedMonths = (remainingYears * 12) - newTenureMonths;
  const interestSaved = baseTotalInterest - newTotalInterest;

  return (
    <div className="finance-page loan-payoff-page">
      <header className="page-header">
        <h1>Loan Fast Cover Up</h1>
        <p className="subtitle">Discover the massive impact of making extra monthly prepayments on your loan.</p>
      </header>

      <div className="finance-content">
        
        {/* Loan Inputs */}
        <div className="form-container">
          <div className="calc-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <FastForward size={24} style={{ color: 'var(--primary-color)' }} />
            <h2 style={{ margin: 0 }}>Current Loan Details</h2>
          </div>

          <div className="finance-form">
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Outstanding Balance (₹)</label>
              <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Remaining Tenure (Years)</label>
              <input type="number" value={remainingYears} onChange={(e) => setRemainingYears(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <label style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '1.1rem' }}>Extra Monthly Prepayment (₹)</label>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#3b82f6', marginBottom: '0.5rem' }}>How much extra can you pay every month?</p>
              <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #93c5fd' }} />
              <input type="range" min="0" max="100000" step="1000" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Base EMI</p>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>{formatCurrency(baseEmi)}</h3>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Total Monthly Outflow</p>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>{formatCurrency(baseEmi + parseFloat(extraPayment || 0))}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--success-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={24} color="var(--success-color)" />
              <h2 style={{ color: 'var(--success-color)', margin: 0 }}>Fast Cover Up Results</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--success-color)', fontWeight: 600, margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Total Interest Saved</p>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--success-color)' }}>{formatCurrency(interestSaved > 0 ? interestSaved : 0)}</h2>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', borderTop: '1px solid #a7f3d0', paddingTop: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: 600, margin: '0 0 0.25rem 0' }}>TIME SAVED</p>
                  <h3 style={{ margin: 0, color: 'var(--success-color)' }}>{timeSavedMonths > 0 ? formatTime(timeSavedMonths) : '0 Months'}</h3>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: 600, margin: '0 0 0.25rem 0' }}>NEW TENURE</p>
                  <h3 style={{ margin: 0, color: 'var(--success-color)' }}>{formatTime(newTenureMonths)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <TrendingDown size={24} style={{ color: '#16a34a', flexShrink: 0 }} />
            <p style={{ fontSize: '0.9rem', color: '#15803d', margin: 0 }}>
              <strong>The Power of Prepayment:</strong> Because loans compute interest on the outstanding principal, paying even a small amount extra every month dramatically accelerates principal reduction, shaving years off your loan and saving you a massive amount in interest.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoanPayoff;
