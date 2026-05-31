import React, { useState } from 'react';

const sources = ['Scholarship', 'Part-time Job', 'Allowance', 'Other'];

export default function AddIncomeForm({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/v1/finance/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), source, date }),
      });
      if (!res.ok) throw new Error('Failed to add income');
      setSuccess(true);
      setAmount('');
      setSource('');
      setDate('');
    } catch (err) {
      setError('Error adding income.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Add Income</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Amount (LKR)</label>
            <input type="number" min="0" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Source</label>
            <select value={source} onChange={e => setSource(e.target.value)} required className="w-full border rounded px-3 py-2">
              <option value="">Select Source</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Income added!</div>}
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Income'}
          </button>
        </form>
      </div>
    </div>
  );
}