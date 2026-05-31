import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TransactionHistoryBreakdown() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [expenseRes, incomeRes] = await Promise.all([
          fetch('/api/v1/finance/expense'),
          fetch('/api/v1/finance/income'),
        ]);
        if (!expenseRes.ok || !incomeRes.ok) throw new Error('Failed to fetch transactions');
        const expenseData = await expenseRes.json();
        const incomeData = await incomeRes.json();
        setExpenses(expenseData);
        setIncomes(incomeData);
      } catch (err) {
        setError('Error loading transactions.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Prepare expense breakdown by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: [
          '#3b82f6', '#ef4444', '#f59e42', '#10b981', '#6366f1', '#eab308', '#a3e635'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-6">
      <h2 className="text-xl font-bold mb-6">Recent Transactions & Expense Breakdown</h2>
      {loading && <div className="text-center py-6">Loading transactions...</div>}
      {error && <div className="text-center py-6 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Expenses</h3>
          <ul className="divide-y divide-gray-200">
            {expenses.slice(0, 5).map(e => (
              <li key={e.expense_id} className="py-2 flex justify-between">
                <span>{e.category}</span>
                <span className="font-medium text-red-600">LKR {e.amount}</span>
                <span className="text-gray-500 text-xs">{e.date}</span>
              </li>
            ))}
            {expenses.length === 0 && <li className="py-2 text-gray-500">No expenses found.</li>}
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-2">Recent Income</h3>
          <ul className="divide-y divide-gray-200">
            {incomes.slice(0, 5).map(i => (
              <li key={i.income_id} className="py-2 flex justify-between">
                <span>{i.source}</span>
                <span className="font-medium text-green-600">LKR {i.amount}</span>
                <span className="text-gray-500 text-xs">{i.date}</span>
              </li>
            ))}
            {incomes.length === 0 && <li className="py-2 text-gray-500">No income found.</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Expense Breakdown by Category</h3>
          {categories.length > 0 ? (
            <Pie data={pieData} />
          ) : (
            <div className="text-gray-500">No expense data to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}