import React, { useState } from 'react';
import {
  Users,
  Award,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { StudentRecord } from '../types/result';
import { computeGradeSummary } from '../utils/gradeCalculations';

interface BatchMeritViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onOpenAddStudent: () => void;
}

export const BatchMeritView: React.FC<BatchMeritViewProps> = ({
  students,
  onSelectStudent,
  onOpenAddStudent,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'percentage'>('rank');

  // Compute stats for all students
  const enrichedStudents = students.map((s) => ({
    student: s,
    summary: computeGradeSummary(s, students),
  }));

  // Batch overview metrics
  const totalStudents = students.length;
  const passedStudents = enrichedStudents.filter(
    (e) => e.summary.overallStatus !== 'COMPARTMENT' && e.summary.overallStatus !== 'FAILED'
  ).length;
  const passRate = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : '0';
  const averageSgpa =
    totalStudents > 0
      ? (enrichedStudents.reduce((acc, e) => acc + e.summary.sgpa, 0) / totalStudents).toFixed(2)
      : '0.00';

  const topper = [...enrichedStudents].sort((a, b) => b.summary.percentage - a.summary.percentage)[0];

  // Filtering
  const filtered = enrichedStudents.filter((item) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'DISTINCTION' && item.summary.overallStatus === 'PASSED WITH DISTINCTION') ||
      (filterStatus === 'FIRST_CLASS' && item.summary.overallStatus === 'FIRST CLASS') ||
      (filterStatus === 'COMPARTMENT' && item.summary.overallStatus === 'COMPARTMENT');

    const matchesSearch =
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.student.name.localeCompare(b.student.name);
    if (sortBy === 'percentage') return b.summary.percentage - a.summary.percentage;
    return a.summary.rank - b.summary.rank;
  });

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Roll Number',
      'Registration No',
      'Candidate Name',
      'Total Marks Obtained',
      'Maximum Marks',
      'Percentage',
      'SGPA',
      'CGPA',
      'Result Status',
    ];
    const rows = sorted.map((e) => [
      e.summary.rank,
      e.student.rollNumber,
      e.student.registrationNo,
      `"${e.student.name}"`,
      e.summary.totalObtained,
      e.summary.maxTotal,
      `${e.summary.percentage}%`,
      e.summary.sgpa,
      e.summary.cgpa,
      `"${e.summary.overallStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batch_Merit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Batch Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Registered Candidates</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1">Computer Science Batch VI</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Batch Overall Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">{passRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{passedStudents} of {totalStudents} candidates cleared</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Batch Mean SGPA</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1 font-mono">{averageSgpa}</div>
          <div className="text-[11px] text-slate-500 mt-1">Class average grade point</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Rank #1 Gold Medalist</div>
          <div className="text-lg font-bold text-amber-700 mt-1 truncate">
            {topper ? topper.student.name : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {topper ? `${topper.summary.sgpa.toFixed(2)} SGPA (${topper.summary.percentage}%)` : ''}
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Export */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Candidates ({students.length})
          </button>
          <button
            onClick={() => setFilterStatus('DISTINCTION')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'DISTINCTION'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Distinction (&ge;75%)
          </button>
          <button
            onClick={() => setFilterStatus('FIRST_CLASS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'FIRST_CLASS'
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
            }`}
          >
            First Class (60-74%)
          </button>
          <button
            onClick={() => setFilterStatus('COMPARTMENT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterStatus === 'COMPARTMENT'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Compartment / Arrear
          </button>
        </div>

        {/* Search, Sort, Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="rank">Sort: Rank</option>
            <option value="percentage">Sort: Percentage</option>
            <option value="name">Sort: Name</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Merit Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3 text-center w-14">Rank</th>
                <th className="py-3 px-3">Candidate & Roll Number</th>
                <th className="py-3 px-3 text-center">Marks Obtained</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-center">SGPA</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-3 text-center">Result Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No matching candidates found for this filter.
                  </td>
                </tr>
              ) : (
                sorted.map(({ student, summary }) => {
                  const isTopRank = summary.rank <= 3;
                  const isFail = summary.overallStatus === 'COMPARTMENT' || summary.overallStatus === 'FAILED';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono ${
                            summary.rank === 1
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : summary.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : summary.rank === 3
                              ? 'bg-amber-50 text-amber-800'
                              : 'text-slate-500'
                          }`}
                        >
                          {summary.rank}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{student.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {student.rollNumber} · {student.branch}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {summary.totalObtained} <span className="text-slate-400 text-[11px]">/ {summary.maxTotal}</span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {summary.percentage}%
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-black text-indigo-700 text-sm">
                        {summary.sgpa.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                        {summary.cgpa.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            summary.overallStatus === 'PASSED WITH DISTINCTION'
                              ? 'bg-emerald-100 text-emerald-800'
                              : summary.overallStatus === 'FIRST CLASS'
                              ? 'bg-blue-100 text-blue-800'
                              : isFail
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {summary.overallStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <span>Marksheet</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
