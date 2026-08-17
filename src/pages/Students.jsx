import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GraduationCap,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Award
} from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (classFilter) queryParams.set('classInterested', classFilter); // Backend maps parameter to .class field query

      const res = await axios.get(`/api/students?${queryParams.toString()}`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-sans">Student Enrolments</h2>
          <p className="text-xs text-slate-400">Roster of registered active students onboarded from admission pipelines.</p>
        </div>
        <button
          onClick={fetchStudents}
          className="p-2 border border-gray-200 bg-white rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer self-start"
        >
          <RefreshCw className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Roster filter box */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student ID, name, parent or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 glass-input text-xs"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full glass-input text-xs"
          >
            <option value="">All Classes</option>
            {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 text-xs text-slate-500">No student records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-gray-50/80">
                  <th className="py-3 px-5">Student ID</th>
                  <th className="py-3 px-3">Admission ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Class Enrolled</th>
                  <th className="py-3 px-3">Primary Contact</th>
                  <th className="py-3 px-3">Academic Session</th>
                  <th className="py-3 px-3">Date Registered</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-all">
                    {/* Student ID badge */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-700">
                      {student.studentId}
                    </td>

                    {/* Admission ID */}
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {student.admissionNumber}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-700">{student.studentName}</span>
                        <p className="text-[10px] text-slate-500">Parent: {student.parentName}</p>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {student.class}
                    </td>

                    {/* Contact info */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5 font-mono text-[10px]">
                        <p className="text-slate-600">{student.phone}</p>
                        {student.email && <p className="text-slate-500">{student.email}</p>}
                      </div>
                    </td>

                    {/* Session */}
                    <td className="py-3.5 px-3 text-slate-400">
                      {student.academicYear}
                    </td>

                    {/* Admission date */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono">
                      {new Date(student.admissionDate).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-550/20">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
