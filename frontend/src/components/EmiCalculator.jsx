'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

export default function EmiCalculator({ carPrice = 1000000 }) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const downPaymentAmount = (carPrice * downPaymentPercent) / 100;
  const loanPrincipal = carPrice - downPaymentAmount;

  useEffect(() => {
    calculateEMI();
  }, [downPaymentPercent, interestRate, tenureYears, carPrice]);

  const calculateEMI = () => {
    const P = loanPrincipal;
    const r = interestRate / 12 / 100; // monthly interest rate
    const n = tenureYears * 12; // total months

    if (P <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(downPaymentAmount);
      return;
    }

    if (r === 0) {
      const emiAmt = P / n;
      setEmi(Math.round(emiAmt));
      setTotalInterest(0);
      setTotalPayment(carPrice);
      return;
    }

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiAmt = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiAmt * n;
    const totalInt = totalPay - P;

    setEmi(Math.round(emiAmt));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPay + downPaymentAmount));
  };

  return (
    <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-lg mt-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Calculate your EMI
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Estimated monthly EMI based on typical loan rates.
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm font-medium">
            <span className="text-gray-600 dark:text-gray-300">
              Total payable: <span className="font-bold text-gray-900 dark:text-white">{formatPrice(totalPayment)}</span>
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Interest: <span className="font-bold text-gray-900 dark:text-white">{formatPrice(totalInterest)}</span>
            </span>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 px-6 py-4 rounded-xl border border-purple-100 dark:border-purple-500/20 text-right shrink-0">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Estimated EMI</p>
          <p className="text-3xl font-bold text-purple-500">
            {formatPrice(emi)}<span className="text-sm font-medium text-purple-600/70 dark:text-purple-400/70">/mo</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Down payment</label>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{downPaymentPercent}%</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">({formatPrice(downPaymentAmount)})</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Interest rate</label>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{interestRate.toFixed(1)}% p.a.</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tenure</label>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{tenureYears} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 font-medium">
        Principal {formatPrice(loanPrincipal)} · Rate {interestRate}% p.a. · {tenureYears * 12} months
      </div>
    </div>
  );
}
