import React, { useEffect, useState } from 'react';

function getBalanceColor(remaining: number) {
  return remaining >= 0 ? 'text-green-600' : 'text-red-600';
}

export default function FinanceSummaryReport() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/v1/finance/report');
        if (!res.ok) throw new Error('Failed to fetch report');
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError('Error loading finance report.');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  if (loading) return <div className="text-center py-8">Loading summary...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!report) return null;

  const { monthly_budget, total_income, total_expenses, remaining_balance } = report;
  const percentUsed = monthly_budget > 0 ? Math.min(100, Math.round((total_expenses / monthly_budget) * 100)) : 0;

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-6 flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div>
            <div className="text-sm text-gray-500">Monthly Income Target</div>
            <div className="text-xl font-bold text-blue-700">LKR {monthly_budget}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Income</div>
            <div className="text-xl font-bold text-green-700">LKR {total_income}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-xl font-bold text-red-700">LKR {total_expenses}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Remaining Balance</div>
            <div className={`text-xl font-bold ${getBalanceColor(remaining_balance)}`}>LKR {remaining_balance}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-1">Monthly Expense Limit Used</div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${percentUsed < 100 ? 'bg-blue-500' : 'bg-red-500'}`}
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{percentUsed}% used</div>
        </div>
      </div>
    </div>
  );
}