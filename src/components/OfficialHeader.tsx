import React from 'react';
import {
  GraduationCap,
  Search,
  Users,
  ShieldCheck,
  FileText,
  BarChart3,
  Sliders,
  PlusCircle,
} from 'lucide-react';
import { StudentRecord } from '../types/result';

interface HeaderProps {
  students: StudentRecord[];
  activeStudent: StudentRecord;
  onSelectStudent: (student: StudentRecord) => void;
  activeTab: 'marksheet' | 'analytics' | 'batch' | 'simulator';
  onTabChange: (tab: 'marksheet' | 'analytics' | 'batch' | 'simulator') => void;
  onOpenAddStudent: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const OfficialHeader: React.FC<HeaderProps> = ({
  students,
  activeStudent,
  onSelectStudent,
  activeTab,
  onTabChange,
  onOpenAddStudent,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const filteredMatches = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      {/* Top Security & Notification Strip */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">Official Portal:</span>
            <span>Annual Examination Session 2025–2026 Results Published</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Digitally Verified Examination Records</span>
            </span>
            <span className="hidden sm:inline">Affiliation: NAAC A++ / AICTE</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Institution Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-950/40 border border-indigo-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">AcademiaResult</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Apex Institute of Technology & Advanced Sciences · Examination & Evaluation Cell
              </p>
            </div>
          </div>

          {/* Quick Search & Roll Number Picker */}
          <div className="flex items-center gap-3 flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Roll No (e.g. 2024-CS-042) or Name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800/90 hover:bg-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              {/* Instant Search Dropdown */}
              {isSearchFocused && filteredMatches.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950 border-b border-slate-800">
                    Matching Students ({filteredMatches.length})
                  </div>
                  <ul className="max-h-60 overflow-y-auto divide-y divide-slate-800">
                    {filteredMatches.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            onSelectStudent(s);
                            onSearchChange('');
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-slate-200">{s.name}</div>
                            <div className="text-slate-400 text-[11px] font-mono">{s.rollNumber} · {s.registrationNo}</div>
                          </div>
                          <span className="text-indigo-400 font-medium">View Marksheet &rarr;</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Student Switcher Dropdown */}
            <select
              aria-label="Quick Switch Student"
              value={activeStudent.id}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) onSelectStudent(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[150px] truncate"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rollNumber} - {s.name.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation & Action Bar */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('marksheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'marksheet'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Official Marksheet</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & Radar</span>
            </button>

            <button
              onClick={() => onTabChange('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Batch Merit List</span>
            </button>

            <button
              onClick={() => onTabChange('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Grade Simulator & Edit</span>
            </button>
          </nav>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Add Student Record</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};
