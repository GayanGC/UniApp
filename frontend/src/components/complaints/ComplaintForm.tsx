import React, { useState } from 'react';

const categories = [
  'Ragging',
  'Facility Issue',
  'Harassment',
  'Other',
];

export function ComplaintForm({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [university, setUniversity] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/v1/complaints/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, description, category, university, is_anonymous: isAnonymous }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSuccess(true);
      setSubject('');
      setDescription('');
      setCategory(categories[0]);
      setUniversity('');
      setIsAnonymous(false);
      onSuccess();
    } catch (err) {
      setError('Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-xl mx-auto bg-white shadow rounded p-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Submit a Complaint</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Subject</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={subject} onChange={e => setSubject(e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Category</label>
        <select className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} required>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">University</label>
        <input type="text" className="w-full border rounded px-3 py-2" value={university} onChange={e => setUniversity(e.target.value)} required />
      </div>
      <div className="mb-4 flex items-center">
        <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="mr-2" />
        <label htmlFor="anonymous" className="font-semibold">Submit as Anonymous</label>
      </div>
      <div className="mb-4 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
        <strong>Note:</strong> If you select "Anonymous", your identity will not be stored or visible to administrators. However, this may limit follow-up or resolution communication.
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">Complaint submitted successfully!</div>}
      <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}