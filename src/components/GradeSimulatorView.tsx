import React, { useState, useEffect } from 'react';
import {
  Sliders,
  RotateCcw,
  Save,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { StudentRecord, SubjectMark } from '../types/result';
import { calculateSubjectGrade, computeGradeSummary } from '../utils/gradeCalculations';

interface GradeSimulatorViewProps {
  student: StudentRecord;
  onUpdateStudentRecord: (updated: StudentRecord) => void;
  allStudents: StudentRecord[];
}

export const GradeSimulatorView: React.FC<GradeSimulatorViewProps> = ({
  student,
  onUpdateStudentRecord,
  allStudents,
}) => {
  // Local state copy of subjects for simulation
  const [simulatedSubjects, setSimulatedSubjects] = useState<SubjectMark[]>([]);
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  useEffect(() => {
    setSimulatedSubjects(JSON.parse(JSON.stringify(student.subjects)));
  }, [student]);

  const handleScoreChange = (
    index: number,
    field: 'theoryScore' | 'internalScore',
    valueStr: string
  ) => {
    const val = parseFloat(valueStr) || 0;
    setSimulatedSubjects((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };

      if (field === 'theoryScore') {
        target.theoryScore = Math.min(Math.max(val, 0), target.maxTheory);
      } else {
        target.internalScore = Math.min(Math.max(val, 0), target.maxInternal);
      }

      const { grade, gradePoint, status } = calculateSubjectGrade(
        target.theoryScore,
        target.internalScore,
        target.maxTheory,
        target.maxInternal
      );
      target.grade = grade;
      target.gradePoint = gradePoint;
      target.status = status;

      copy[index] = target;
      return copy;
    });
  };

  // Original summary
  const originalSummary = computeGradeSummary(student, allStudents);

  // Simulated student object & summary
  const simulatedStudent: StudentRecord = {
    ...student,
    subjects: simulatedSubjects,
  };
  const simulatedSummary = computeGradeSummary(simulatedStudent, allStudents);

  const sgpaDiff = simulatedSummary.sgpa - originalSummary.sgpa;
  const pctDiff = simulatedSummary.percentage - originalSummary.percentage;

  // Preset actions
  const applyGraceMarks = (bonus: number) => {
    // Find subject with lowest theory score
    setSimulatedSubjects((prev) => {
      const copy = [...prev];
      let lowestIdx = 0;
      let minPct = 100;
      copy.forEach((s, i) => {
        const pct = (s.theoryScore / s.maxTheory) * 100;
        if (pct < minPct) {
          minPct = pct;
          lowestIdx = i;
        }
      });

      const target = { ...copy[lowestIdx] };
      target.theoryScore = Math.min(target.theoryScore + bonus, target.maxTheory);
      const { grade, gradePoint, status } = calculateSubjectGrade(
        target.theoryScore,
        target.internalScore,
        target.maxTheory,
        target.maxInternal
      );
      target.grade = grade;
      target.gradePoint = gradePoint;
      target.status = status;
      copy[lowestIdx] = target;
      return copy;
    });
  };

  const handleReset = () => {
    setSimulatedSubjects(JSON.parse(JSON.stringify(student.subjects)));
  };

  const handleSaveToRecord = () => {
    onUpdateStudentRecord(simulatedStudent);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Simulation Header & Quick Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Interactive Grade & Score Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate re-evaluation score revisions, grace marks, or faculty grade edits for{' '}
            <strong className="text-slate-800">{student.name}</strong> ({student.rollNumber}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyGraceMarks(5)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>+5 Grace Marks on Weakest</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveToRecord}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavedMessage ? 'Saved to Marksheet!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Before / After Impact Comparison Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Semester SGPA Impact
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-white">
              {simulatedSummary.sgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (Orig: {originalSummary.sgpa.toFixed(2)})
            </span>
            {sgpaDiff !== 0 && (
              <span
                className={`text-xs font-bold font-mono ${
                  sgpaDiff > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {sgpaDiff > 0 ? `+${sgpaDiff.toFixed(2)}` : sgpaDiff.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Percentage Impact
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {simulatedSummary.percentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (Orig: {originalSummary.percentage}%)
            </span>
            {pctDiff !== 0 && (
              <span
                className={`text-xs font-bold font-mono ${
                  pctDiff > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {pctDiff > 0 ? `+${pctDiff.toFixed(2)}%` : `${pctDiff.toFixed(2)}%`}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            Result Status
          </div>
          <div className="mt-1">
            <span
              className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                simulatedSummary.overallStatus === 'PASSED WITH DISTINCTION'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : simulatedSummary.overallStatus === 'FIRST CLASS'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : simulatedSummary.overallStatus === 'COMPARTMENT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {simulatedSummary.overallStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Subject Edit Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Edit Theory & Sessional Marks
          </h3>
          <span className="text-xs text-slate-500">
            Passing criterion: Theory &ge; 35% & Total &ge; 40%
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {simulatedSubjects.map((sub, index) => {
            const subTotal = sub.theoryScore + sub.internalScore;
            const maxSub = sub.maxTheory + sub.maxInternal;
            const isFail = sub.status === 'FAIL';

            return (
              <div
                key={sub.code}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isFail ? 'bg-red-50/40' : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Subject Details */}
                <div className="sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">({sub.credits} Credits)</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        sub.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.grade === 'A'
                          ? 'bg-blue-100 text-blue-800'
                          : sub.grade === 'F'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {sub.grade} ({sub.gradePoint} GP)
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 text-xs mt-0.5">{sub.name}</div>
                </div>

                {/* Score Controls */}
                <div className="flex items-center gap-4 sm:w-1/2">
                  {/* Theory Input & Slider */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Theory (Max {sub.maxTheory})</span>
                      <span className="font-mono font-bold text-slate-800">{sub.theoryScore}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={sub.maxTheory}
                      value={sub.theoryScore}
                      onChange={(e) => handleScoreChange(index, 'theoryScore', e.target.value)}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Sessional Input & Slider */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Sessional (Max {sub.maxInternal})</span>
                      <span className="font-mono font-bold text-slate-800">{sub.internalScore}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={sub.maxInternal}
                      value={sub.internalScore}
                      onChange={(e) => handleScoreChange(index, 'internalScore', e.target.value)}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Total & Status */}
                <div className="sm:w-28 text-right font-mono">
                  <div className={`text-sm font-bold ${isFail ? 'text-red-700' : 'text-slate-900'}`}>
                    {subTotal} / {maxSub}
                  </div>
                  <div className="text-[11px] font-semibold">
                    {isFail ? (
                      <span className="text-red-600">RE-APPEAR</span>
                    ) : (
                      <span className="text-emerald-700">CLEARED</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
