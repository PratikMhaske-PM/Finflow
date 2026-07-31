import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import './FinancePages.css';
import './Calculators.css';

const Calculators = () => {
  // EMI State
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanInterest, setLoanInterest] = useState(10);
  const [loanTenure, setLoanTenure] = useState(5); // in years
  const [emi, setEmi] = useState(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState(0);

  // SIP State
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  const [sipDuration, setSipDuration] = useState(10); // in years
  const [sipStepUp, setSipStepUp] = useState(10); // annual step up %
  const [sipMaturity, setSipMaturity] = useState(0);
  const [sipTotalInvested, setSipTotalInvested] = useState(0);

  // Calculate EMI
  useEffect(() => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(loanInterest) / 12 / 100;
    const N = parseFloat(loanTenure) * 12;

    if (P && R && N) {
      const calculatedEmi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const totalAmount = calculatedEmi * N;
      setEmi(calculatedEmi);
      setTotalInterestPaid(totalAmount - P);
    } else {
      setEmi(0);
      setTotalInterestPaid(0);
    }
  }, [loanAmount, loanInterest, loanTenure]);

  // Calculate SIP with Annual Step-up
  useEffect(() => {
    let P = parseFloat(sipAmount);
    const R = parseFloat(sipReturnRate);
    const N = parseFloat(sipDuration);
    const stepUp = parseFloat(sipStepUp) || 0;

    if (P && R && N) {
      const monthlyRate = R / 12 / 100;
      let balance = 0;
      let totalInvested = 0;

      for (let month = 1; month <= N * 12; month++) {
        balance += P;
        totalInvested += P;
        balance += (balance * monthlyRate);

        if (month % 12 === 0) {
          P += (P * stepUp / 100);
        }
      }

      setSipMaturity(balance);
      setSipTotalInvested(totalInvested);
    } else {
      setSipMaturity(0);
      setSipTotalInvested(0);
    }
  }, [sipAmount, sipReturnRate, sipDuration, sipStepUp]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="finance-page calculators-page">
      <header className="page-header">
        <h1>Financial Calculators</h1>
        <p className="subtitle">Plan your loans and investments instantly.</p>
      </header>

      <div className="finance-content calculators-content">
        
        {/* EMI Calculator */}
        <div className="calculator-card emi-card">
          <div className="calc-header">
            <Calculator size={24} />
            <h2>EMI Loan Calculator</h2>
          </div>
          
          <div className="calc-inputs">
            <div className="input-group">
              <label>Loan Amount (₹)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
              <input type="range" min="10000" max="10000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Interest Rate (%)</label>
              <input type="number" value={loanInterest} onChange={(e) => setLoanInterest(e.target.value)} />
              <input type="range" min="1" max="30" step="0.5" value={loanInterest} onChange={(e) => setLoanInterest(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Tenure (Years)</label>
              <input type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} />
              <input type="range" min="1" max="30" step="1" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} />
            </div>
          </div>

          <div className="calc-results">
            <div className="result-main danger">
              <span>Monthly EMI</span>
              <h3>{formatCurrency(emi)}</h3>
            </div>
            <div className="result-breakdown">
              <p>Principal: <strong>{formatCurrency(loanAmount)}</strong></p>
              <p>Total Interest: <strong>{formatCurrency(totalInterestPaid)}</strong></p>
            </div>
          </div>
        </div>

        {/* SIP Calculator */}
        <div className="calculator-card sip-card">
          <div className="calc-header">
            <Calculator size={24} />
            <h2>Mutual Fund SIP Calculator</h2>
          </div>
          
          <div className="calc-inputs">
            <div className="input-group">
              <label>Monthly Investment (₹)</label>
              <input type="number" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} />
              <input type="range" min="500" max="100000" step="500" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Expected Return Rate (%)</label>
              <input type="number" value={sipReturnRate} onChange={(e) => setSipReturnRate(e.target.value)} />
              <input type="range" min="1" max="30" step="0.5" value={sipReturnRate} onChange={(e) => setSipReturnRate(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Time Period (Years)</label>
              <input type="number" value={sipDuration} onChange={(e) => setSipDuration(e.target.value)} />
              <input type="range" min="1" max="40" step="1" value={sipDuration} onChange={(e) => setSipDuration(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Annual Step-up (%)</label>
              <input type="number" value={sipStepUp} onChange={(e) => setSipStepUp(e.target.value)} />
              <input type="range" min="0" max="50" step="1" value={sipStepUp} onChange={(e) => setSipStepUp(e.target.value)} />
            </div>
          </div>

          <div className="calc-results">
            <div className="result-main success">
              <span>Total Wealth Expected</span>
              <h3>{formatCurrency(sipMaturity)}</h3>
            </div>
            <div className="result-breakdown">
              <p>Total Invested: <strong>{formatCurrency(sipTotalInvested)}</strong></p>
              <p>Estimated Returns: <strong>{formatCurrency(sipMaturity - sipTotalInvested)}</strong></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Calculators;
