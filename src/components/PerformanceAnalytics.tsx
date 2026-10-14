import React from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { StudentRecord, GradeSummary } from '../types/result';
import { computeGradeSummary } from '../utils/gradeCalculations';

interface AnalyticsProps {
  student: StudentRecord;
  allStudents: StudentRecord[];
}

export const PerformanceAnalytics: React.FC<AnalyticsProps> = ({
  student,
  allStudents,
}) => {
  const summary: GradeSummary = computeGradeSummary(student, allStudents);

  // Compute batch averages for each subject
  const subjectAverages = student.subjects.map((sub) => {
    let totalScore = 0;
    let count = 0;
    allStudents.forEach((st) => {
      const match = st.subjects.find((s) => s.code === sub.code);
      if (match) {
        totalScore += match.theoryScore + match.internalScore;
        count++;
      }
    });
    const avg = count > 0 ? totalScore / count : 0;
    return {
      code: sub.code,
      name: sub.name,
      studentTotal: sub.theoryScore + sub.internalScore,
      batchAverage: Number(avg.toFixed(1)),
      maxScore: sub.maxTheory + sub.maxInternal,
      theoryScore: sub.theoryScore,
      internalScore: sub.internalScore,
      maxTheory: sub.maxTheory,
      maxInternal: sub.maxInternal,
      grade: sub.grade,
      status: sub.status,
    };
  });

  // Identify highest and lowest subjects
  const sortedSubjects = [...student.subjects].sort((a, b) => {
    const totalA = (a.theoryScore + a.internalScore) / (a.maxTheory + a.maxInternal);
    const totalB = (b.theoryScore + b.internalScore) / (b.maxTheory + b.maxInternal);
    return totalB - totalA;
  });

  const bestSubject = sortedSubjects[0];
  const lowestSubject = sortedSubjects[sortedSubjects.length - 1];

  const totalCreditsEarned = student.subjects
    .filter((s) => s.status === 'PASS')
    .reduce((acc, s) => acc + s.credits, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* SGPA & Honor Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Semester Performance</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {summary.sgpa.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              SGPA on 10.0 scale (CGPA: {summary.cgpa.toFixed(2)})
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Standing:</span>
            <span className="font-semibold text-indigo-700">{summary.overallStatus}</span>
          </div>
        </div>

        {/* Aggregate Percentage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Aggregate Marks</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-emerald-700 font-mono">
              {summary.percentage}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {summary.totalObtained} out of {summary.maxTotal} marks
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Cutoff target:</span>
            <span className="font-semibold text-slate-700">75% Distinction Cutoff</span>
          </div>
        </div>

        {/* Credit Completion */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Credits Earned</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalCreditsEarned} <span className="text-sm font-normal text-slate-400">/ {summary.totalCredits}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {totalCreditsEarned === summary.totalCredits ? '100% of Semester Load Cleared' : 'Deficit Credits Pending'}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Course Load:</span>
            <span className="font-semibold text-slate-700">{student.subjects.length} Courses Total</span>
          </div>
        </div>

        {/* Class Rank & Percentile */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Class Standing</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-amber-600 font-mono">
              #{summary.rank}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Out of {summary.totalStudentsInBatch} registered candidates
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Percentile:</span>
            <span className="font-semibold text-slate-800">
              {(((summary.totalStudentsInBatch - summary.rank + 1) / summary.totalStudentsInBatch) * 100).toFixed(0)}th Percentile
            </span>
          </div>
        </div>
      </div>

      {/* Comparative Score vs Batch Average Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Subject Performance vs. Batch Average</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing {student.name}'s total marks against the class average in each course
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-indigo-600"></div>
              <span className="text-slate-600">Candidate Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-xs bg-slate-300"></div>
              <span className="text-slate-600">Batch Average</span>
            </div>
          </div>
        </div>

        {/* Visual Comparison Bars */}
        <div className="space-y-4">
          {subjectAverages.map((sub) => {
            const studentPct = (sub.studentTotal / sub.maxScore) * 100;
            const batchPct = (sub.batchAverage / sub.maxScore) * 100;
            const diff = sub.studentTotal - sub.batchAverage;

            return (
              <div key={sub.code} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{sub.code}:</span>
                    <span className="font-medium text-slate-800 truncate max-w-xs">{sub.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        sub.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.grade === 'A'
                          ? 'bg-blue-100 text-blue-800'
                          : sub.grade === 'F'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      Grade {sub.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="font-bold text-indigo-900">
                      {sub.studentTotal}/{sub.maxScore}
                    </span>
                    <span className="text-slate-400">
                      (Avg: {sub.batchAverage})
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        diff >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Progress bars container */}
                <div className="h-4 bg-slate-100 rounded-sm overflow-hidden flex flex-col justify-center relative p-0.5">
                  {/* Candidate Bar */}
                  <div
                    className={`h-2 rounded-xs transition-all duration-500 ${
                      sub.status === 'FAIL' ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(studentPct, 100)}%` }}
                  />
                  {/* Batch average marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                    style={{ left: `${Math.min(batchPct, 100)}%` }}
                    title={`Batch Avg: ${sub.batchAverage}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theory vs Sessional Split & Academic Diagnosis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Theory vs Sessional Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Theory (External) vs Sessional (Internal) Breakdown
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {student.subjects.map((s) => {
              const theoryPct = ((s.theoryScore / s.maxTheory) * 100).toFixed(0);
              const internalPct = ((s.internalScore / s.maxInternal) * 100).toFixed(0);
              return (
                <div key={s.code} className="py-2.5 flex items-center justify-between">
                  <div className="truncate max-w-[180px]">
                    <span className="font-mono font-semibold text-slate-800">{s.code}</span>
                    <span className="text-slate-500 block text-[11px] truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[10px] text-slate-400">Theory</div>
                      <div className="font-mono font-semibold text-slate-800">
                        {s.theoryScore}/{s.maxTheory} <span className="text-[10px] text-slate-500">({theoryPct}%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Internal</div>
                      <div className="font-mono font-semibold text-slate-800">
                        {s.internalScore}/{s.maxInternal} <span className="text-[10px] text-slate-500">({internalPct}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Diagnostics & Faculty Remarks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-3">
              Academic Diagnosis & Key Findings
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-950">
                    Highest Proficiency: {bestSubject.name} ({bestSubject.code})
                  </div>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Secured {bestSubject.theoryScore + bestSubject.internalScore} marks (Grade {bestSubject.grade}). Exemplary command over subject domain.
                  </p>
                </div>
              </div>

              {lowestSubject.status === 'FAIL' ? (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-950">
                      Re-examination Required: {lowestSubject.name} ({lowestSubject.code})
                    </div>
                    <p className="text-red-800 text-[11px] mt-0.5">
                      Theory score ({lowestSubject.theoryScore}/{lowestSubject.maxTheory}) is below the mandatory minimum 35% threshold. Candidate eligible for Supplementary / Scrutiny.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-950">
                      Area for Further Elevation: {lowestSubject.name} ({lowestSubject.code})
                    </div>
                    <p className="text-blue-800 text-[11px] mt-0.5">
                      Achieved Grade {lowestSubject.grade}. Enhancing theoretical depth could raise overall cumulative CGPA to honors benchmark.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Attendance & Academic Diligence</div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Maintained <strong>{student.attendancePercentage}%</strong> overall classroom and lab attendance. Character & conduct certified as <em>{student.conduct}</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            * Analytics are derived from university central examination moderation tables.
          </div>
        </div>
      </div>
    </div>
  );
};
