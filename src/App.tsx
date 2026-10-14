import React, { useState, useEffect } from 'react';
import { INITIAL_STUDENTS } from './data/mockStudents';
import { StudentRecord, ReEvaluationRequest } from './types/result';
import { OfficialHeader } from './components/OfficialHeader';
import { MarksheetView } from './components/MarksheetView';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { BatchMeritView } from './components/BatchMeritView';
import { GradeSimulatorView } from './components/GradeSimulatorView';
import { ReEvaluationModal } from './components/ReEvaluationModal';
import { NewStudentModal } from './components/NewStudentModal';
import { GraduationCap, ShieldCheck, Heart, Award, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'academia_student_records_v1';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return students[0]?.id || 'stu-001';
  });

  const [activeTab, setActiveTab] = useState<'marksheet' | 'analytics' | 'batch' | 'simulator'>('marksheet');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isReEvaluationOpen, setIsReEvaluationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Handle URL query param for quick roll lookup on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roll = params.get('roll');
    if (roll) {
      const match = students.find((s) => s.rollNumber.toLowerCase() === roll.toLowerCase());
      if (match) {
        setActiveStudentId(match.id);
        setActiveTab('marksheet');
      }
    }
  }, []);

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectStudent = (s: StudentRecord) => {
    setActiveStudentId(s.id);
    setActiveTab('marksheet');
    showToast(`Loaded statement for ${s.name} (${s.rollNumber})`);
  };

  const handleUpdateStudentRecord = (updated: StudentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Updated examination record for ${updated.name}`);
  };

  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents((prev) => [newStudent, ...prev]);
    setActiveStudentId(newStudent.id);
    setActiveTab('marksheet');
    showToast(`Registered new candidate: ${newStudent.name}`);
  };

  const handleSubmitReEvaluation = (newReq: ReEvaluationRequest) => {
    const updated: StudentRecord = {
      ...activeStudent,
      reEvaluationRequests: [newReq, ...(activeStudent.reEvaluationRequests || [])],
    };
    handleUpdateStudentRecord(updated);
    showToast(`Scrutiny application filed for ${newReq.subjectCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Official Top Navigation */}
      <OfficialHeader
        students={students}
        activeStudent={activeStudent}
        onSelectStudent={handleSelectStudent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'marksheet' && (
          <MarksheetView
            student={activeStudent}
            allStudents={students}
            onOpenReEvaluation={() => setIsReEvaluationOpen(true)}
            onSelectStudent={handleSelectStudent}
          />
        )}

        {activeTab === 'analytics' && (
          <PerformanceAnalytics
            student={activeStudent}
            allStudents={students}
          />
        )}

        {activeTab === 'batch' && (
          <BatchMeritView
            students={students}
            onSelectStudent={handleSelectStudent}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
          />
        )}

        {activeTab === 'simulator' && (
          <GradeSimulatorView
            student={activeStudent}
            onUpdateStudentRecord={handleUpdateStudentRecord}
            allStudents={students}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ReEvaluationModal
        isOpen={isReEvaluationOpen}
        onClose={() => setIsReEvaluationOpen(false)}
        student={activeStudent}
        onSubmitRequest={handleSubmitReEvaluation}
      />

      <NewStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
        existingCount={students.length}
      />

      {/* Footer (Hidden on print) */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">AcademiaResult Examination System</span>
            <span>· ISO 9001:2015 Certified Examination Wing</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Server Time: Academic Session 2025-2026</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Secured
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
