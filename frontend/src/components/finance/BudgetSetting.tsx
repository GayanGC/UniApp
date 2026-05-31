import React, { useState } from 'react';

export default function BudgetSetting() {
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/v1/finance/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_budget: Number(budget) }),
      });
      if (!res.ok) throw new Error('Failed to set budget');
      setSuccess(true);
      setBudget('');
    } catch (err) {
      setError('Error setting budget.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="number"
        min="0"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        placeholder="Set monthly budget (LKR)"
        className="border rounded px-3 py-2 w-48"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Set Budget'}
      </button>
      {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
      {success && <span className="text-green-600 text-sm ml-2">Budget updated!</span>}
    </form>
  );
}