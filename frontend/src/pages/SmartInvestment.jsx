import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import './FinancePages.css';

const SmartInvestment = () => {
  const [targetAmount, setTargetAmount] = useState(10000000); // 1 Crore
  const [years, setYears] = useState(15);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpPercent, setStepUpPercent] = useState(10);

  const [requiredStandardSip, setRequiredStandardSip] = useState(0);
  const [requiredStepUpSip, setRequiredStepUpSip] = useState(0);

  useEffect(() => {
    const M = parseFloat(targetAmount);
    const N = parseFloat(years);
    const R = parseFloat(expectedReturn);
    const stepUp = parseFloat(stepUpPercent) || 0;

    if (M > 0 && N > 0 && R > 0) {
      const r = R / 12 / 100;
      const n = N * 12;

      // 1. Calculate Required Standard SIP (Closed form)
      const standardSip = M / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      setRequiredStandardSip(standardSip);

      // 2. Calculate Required Step-Up SIP (Using linear scaling)
      // First, find what an initial SIP of 1 produces with step-up
      let balanceForOne = 0;
      let currentP = 1;
      
      for (let month = 1; month <= n; month++) {
        balanceForOne += currentP;
        balanceForOne += (balanceForOne * r);

        if (month % 12 === 0) {
          currentP += (currentP * stepUp / 100);
        }
      }

      // Then scale the required P
      const stepUpSip = M / balanceForOne;
      setRequiredStepUpSip(stepUpSip);

    } else {
      setRequiredStandardSip(0);
      setRequiredStepUpSip(0);
    }
  }, [targetAmount, years, expectedReturn, stepUpPercent]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="finance-page smart-investment-page">
      <header className="page-header">
        <h1>Smart Investment Plan</h1>
        <p className="subtitle">Work backward from your goals to find out exactly how much you need to invest today.</p>
      </header>

      <div className="finance-content">
        
        {/* Goal Inputs */}
        <div className="form-container">
          <div className="calc-header" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Target size={24} style={{ color: 'var(--primary-color)' }} />
            <h2 style={{ margin: 0 }}>Set Your Target Goal</h2>
          </div>

          <div className="finance-form">
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Target Amount (₹)</label>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Time Horizon (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Expected Annual Return (%)</label>
              <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              <input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Planned Annual Step-up (%)</label>
              <input type="number" value={stepUpPercent} onChange={(e) => setStepUpPercent(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              <input type="range" min="0" max="50" step="1" value={stepUpPercent} onChange={(e) => setStepUpPercent(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="result-block" style={{ backgroundColor: 'var(--bg-color)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Standard SIP Required</p>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: 0 }}>{formatCurrency(requiredStandardSip)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></h2>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You must invest this exact amount every month for {years} years.</p>
          </div>

          <div className="result-block" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--success-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={20} color="var(--success-color)" />
              <p style={{ color: 'var(--success-color)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem', margin: 0 }}>Smart Step-Up Plan Required</p>
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--success-color)', margin: 0 }}>{formatCurrency(requiredStepUpSip)} <span style={{ fontSize: '1rem' }}>/mo initially</span></h2>
            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Start small! By increasing your SIP by {stepUpPercent}% every year, your first year burden is drastically reduced.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', backgroundColor: '#fffbe1', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <AlertCircle size={24} style={{ color: '#ca8a04', flexShrink: 0 }} />
            <p style={{ fontSize: '0.9rem', color: '#854d0e', margin: 0 }}>
              <strong>Why Step-up?</strong> As your income grows over the next {years} years, increasing your investments alongside it is the smartest way to reach large financial goals without crippling your current lifestyle.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartInvestment;
