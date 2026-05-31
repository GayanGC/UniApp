import React from 'react';

const universities = ['UoK', 'UoC', 'UoJ'];
const faculties = ['Science', 'Engineering', 'Arts'];

export function NotesFilter({ filters, setFilters }: {
  filters: any;
  setFilters: (f: any) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="flex flex-wrap gap-4 mb-6 justify-center">
      <select name="university" value={filters.university} onChange={handleChange} className="border rounded px-3 py-2">
        <option value="">University</option>
        {universities.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <select name="faculty" value={filters.faculty} onChange={handleChange} className="border rounded px-3 py-2">
        <option value="">Faculty</option>
        {faculties.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <input name="subject_code" value={filters.subject_code} onChange={handleChange} placeholder="Subject Code" className="border rounded px-3 py-2" />
      <input name="academic_year" type="number" value={filters.academic_year} onChange={handleChange} placeholder="Year" className="border rounded px-3 py-2 w-24" />
    </form>
  );
}