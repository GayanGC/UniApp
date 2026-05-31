import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const universities = ['UoK', 'UoC', 'UoJ'];
const faculties = ['Science', 'Engineering', 'Arts'];

interface NoteUploadForm {
  title: string;
  description: string;
  university: string;
  faculty: string;
  subject_code: string;
  academic_year: string;
  file: File | null;
}

export function NoteUploadForm() {
  const { token } = useAuth();
  const [form, setForm] = useState<NoteUploadForm>({
    title: '',
    description: '',
    university: '',
    faculty: '',
    subject_code: '',
    academic_year: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, file: e.target.files?.[0] || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'file' && value) {
          data.append('file', value as File);
        } else if (value) {
          data.append(key, value as string);
        }
      });
      const res = await fetch('/api/v1/notes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess('Note uploaded successfully!');
      setForm({
        title: '',
        description: '',
        university: '',
        faculty: '',
        subject_code: '',
        academic_year: '',
        file: null,
      });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
        <input name="title" value={form.title} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">University</label>
        <select name="university" value={form.university} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
          <option value="">Select University</option>
          {universities.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Faculty</label>
        <select name="faculty" value={form.faculty} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
          <option value="">Select Faculty</option>
          {faculties.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Subject Code</label>
        <input name="subject_code" value={form.subject_code} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Academic Year</label>
        <input name="academic_year" type="number" value={form.academic_year} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">File (PDF/DOCX)</label>
        <input name="file" type="file" accept=".pdf,.docx" onChange={handleFileChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
      </div>
      {success && <div className="text-green-600 mb-4">{success}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
        {loading ? 'Uploading...' : 'Upload Note'}
      </button>
    </form>
  );
}