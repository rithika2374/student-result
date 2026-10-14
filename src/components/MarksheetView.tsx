import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  Info,
} from 'lucide-react';
import { StudentRecord, GradeSummary } from '../types/result';
import { computeGradeSummary, formatScore } from '../utils/gradeCalculations';

interface MarksheetViewProps {
  student: StudentRecord;
  allStudents: StudentRecord[];
  onOpenReEvaluation: () => void;
  onSelectStudent: (student: StudentRecord) => void;
}

export const MarksheetView: React.FC<MarksheetViewProps> = ({
  student,
  allStudents,
  onOpenReEvaluation,
  onSelectStudent,
}) => {
  const summary: GradeSummary = computeGradeSummary(student, allStudents);
  const [copied, setCopied] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?roll=${student.rollNumber}&verify=${student.verificationHash}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Status visual attributes
  const isDistinction = summary.overallStatus === 'PASSED WITH DISTINCTION';
  const isCompartment = summary.overallStatus === 'COMPARTMENT' || summary.overallStatus === 'FAILED';

  return (
    <div className="space-y-6">
      {/* Quick Demo Switcher Bar */}
      <div className="no-print bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Switch Candidate:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allStudents.map((s) => {
              const sSummary = computeGradeSummary(s, allStudents);
              const isActive = s.id === student.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="opacity-70 text-[11px] ml-1.5 font-mono">
                    ({sSummary.sgpa.toFixed(2)} SGPA)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verify Seal</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onOpenReEvaluation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Apply Scrutiny</span>
          </button>
        </div>
      </div>

      {/* Re-evaluation banner if pending */}
      {student.reEvaluationRequests && student.reEvaluationRequests.length > 0 && (
        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Active Scrutiny / Re-evaluation in Progress: </span>
            {student.reEvaluationRequests.map((req) => (
              <span key={req.id} className="inline-block mr-3">
                Subject <strong>{req.subjectCode}</strong> ({req.status}) - Submitted on {req.submittedAt}
              </span>
            ))}
          </div>
          <button
            onClick={onOpenReEvaluation}
            className="underline font-semibold hover:text-amber-950"
          >
            View Status
          </button>
        </div>
      )}

      {/* Official Marksheet Paper Canvas */}
      <div className="marksheet-print-sheet bg-white rounded-2xl border-2 border-slate-800 p-6 sm:p-10 shadow-lg relative overflow-hidden max-w-5xl mx-auto">
        {/* Subtle Decorative Guilloche / Border */}
        <div className="border border-slate-300 p-4 sm:p-6 rounded-lg relative">
          {/* Institutional Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <Award className="w-96 h-96 text-slate-900" />
          </div>

          {/* Marksheet Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-indigo-900 bg-indigo-950 text-amber-400 flex items-center justify-center font-serif text-2xl font-black shadow-inner">
                A
              </div>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold uppercase tracking-wide text-slate-950">
                {student.institutionName}
              </h1>
              <p className="text-xs text-slate-600 font-medium tracking-wide">
                {student.affiliation} · Institution Code: {student.institutionCode}
              </p>
              <div className="inline-block mt-2 bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-serif font-semibold uppercase tracking-widest px-4 py-1 rounded">
                Statement of Marks & Grades
              </div>
              <p className="text-xs font-semibold text-slate-800 pt-1">
                {student.examinationName}
              </p>
            </div>
          </div>

          {/* Student Bio Grid & Identity Photo */}
          <div className="py-5 border-b border-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Bio Details */}
              <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Candidate Name:</span>
                  <span className="font-bold text-slate-900 text-sm uppercase">{student.name}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Roll Number:</span>
                  <span className="font-mono font-bold text-slate-900">{student.rollNumber}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Registration No:</span>
                  <span className="font-mono text-slate-800">{student.registrationNo}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Session / Year:</span>
                  <span className="text-slate-800 font-medium">{student.session}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Program of Study:</span>
                  <span className="text-slate-900 font-semibold">{student.program}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Branch:</span>
                  <span className="text-slate-800">{student.branch}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Father's Name:</span>
                  <span className="text-slate-800">{student.fatherName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Mother's Name:</span>
                  <span className="text-slate-800">{student.motherName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Semester:</span>
                  <span className="text-slate-800">{student.semester}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-semibold text-slate-600 shrink-0">Attendance:</span>
                  <span className="text-slate-800 font-semibold text-emerald-700">{student.attendancePercentage}% (Eligible)</span>
                </div>
              </div>

              {/* Passport Photo Frame */}
              <div className="md:col-span-2 flex flex-col items-center justify-center">
                <div className="w-24 h-28 border-2 border-slate-700 rounded p-1 bg-slate-50 relative shadow-xs">
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-full h-full object-cover rounded-xs"
                  />
                  <div className="absolute -bottom-2 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-xs uppercase tracking-tighter">
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="py-5 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-y-2 border-slate-800 font-serif text-[11px] uppercase tracking-wider text-slate-900">
                  <th className="py-2.5 px-2 text-center w-10">#</th>
                  <th className="py-2.5 px-2 w-20">Code</th>
                  <th className="py-2.5 px-3">Subject / Course Title</th>
                  <th className="py-2.5 px-2 text-center w-12">Credits</th>
                  <th className="py-2.5 px-2 text-center w-16">Max Theory</th>
                  <th className="py-2.5 px-2 text-center w-16">Max Sessional</th>
                  <th className="py-2.5 px-2 text-center w-16">Theory Score</th>
                  <th className="py-2.5 px-2 text-center w-16">Sessional Score</th>
                  <th className="py-2.5 px-2 text-center w-16">Total Marks</th>
                  <th className="py-2.5 px-2 text-center w-14">Grade</th>
                  <th className="py-2.5 px-2 text-center w-12">GP</th>
                  <th className="py-2.5 px-2 text-center w-14">Credit Pts</th>
                  <th className="py-2.5 px-2 text-center w-16">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {student.subjects.map((sub, idx) => {
                  const subTotal = sub.theoryScore + sub.internalScore;
                  const creditPoints = sub.credits * sub.gradePoint;
                  const isFail = sub.status === 'FAIL';

                  return (
                    <tr
                      key={sub.code}
                      className={`hover:bg-slate-50 transition-colors ${
                        isFail ? 'bg-red-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-2 px-2 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2 px-2 font-mono font-bold text-slate-800">{sub.code}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{sub.name}</td>
                      <td className="py-2 px-2 text-center font-semibold text-slate-700">{sub.credits}</td>
                      <td className="py-2 px-2 text-center text-slate-500">{sub.maxTheory}</td>
                      <td className="py-2 px-2 text-center text-slate-500">{sub.maxInternal}</td>
                      <td className={`py-2 px-2 text-center font-mono ${isFail ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                        {sub.theoryScore}
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-slate-800">
                        {sub.internalScore}
                      </td>
                      <td className={`py-2 px-2 text-center font-mono font-bold ${isFail ? 'text-red-700' : 'text-slate-950'}`}>
                        {subTotal}
                      </td>
                      <td className="py-2 px-2 text-center font-bold">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono ${
                            sub.grade === 'A+'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.grade === 'A'
                              ? 'bg-blue-100 text-blue-800'
                              : sub.grade === 'B+' || sub.grade === 'B'
                              ? 'bg-indigo-50 text-indigo-800'
                              : sub.grade === 'F'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-slate-700">{sub.gradePoint}</td>
                      <td className="py-2 px-2 text-center font-mono font-semibold text-slate-900">
                        {creditPoints}
                      </td>
                      <td className="py-2 px-2 text-center font-semibold">
                        {isFail ? (
                          <span className="text-red-700 text-[11px]">FAIL</span>
                        ) : (
                          <span className="text-emerald-700 text-[11px]">PASS</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Grand Total Row */}
              <tfoot>
                <tr className="border-t-2 border-slate-800 bg-slate-100/90 font-bold text-slate-950 text-xs">
                  <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider">
                    Cumulative Totals:
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">{summary.totalCredits}</td>
                  <td className="py-2.5 px-2 text-center text-slate-500">
                    {student.subjects.reduce((acc, s) => acc + s.maxTheory, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-500">
                    {student.subjects.reduce((acc, s) => acc + s.maxInternal, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                    {student.subjects.reduce((acc, s) => acc + s.theoryScore, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                    {student.subjects.reduce((acc, s) => acc + s.internalScore, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-sm text-indigo-950">
                    {summary.totalObtained} / {summary.maxTotal}
                  </td>
                  <td colSpan={2} className="py-2.5 px-2 text-center font-mono text-xs">
                    {summary.percentage}%
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-indigo-950">
                    {student.subjects.reduce((acc, s) => acc + s.credits * s.gradePoint, 0)}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {isCompartment ? (
                      <span className="text-amber-800 font-bold text-[11px]">RE-APPEAR</span>
                    ) : (
                      <span className="text-emerald-800 font-bold text-[11px]">COMPLETED</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Academic Standing & Performance Cards */}
          <div className="py-4 border-y border-slate-300 grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50/70 p-3 rounded-lg text-center">
            <div className="p-2 border-r border-slate-200 last:border-r-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Total Obtained
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                {summary.totalObtained} <span className="text-xs text-slate-400 font-normal">/ {summary.maxTotal}</span>
              </div>
            </div>

            <div className="p-2 border-r border-slate-200 last:border-r-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Percentage
              </div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                {summary.percentage}%
              </div>
            </div>

            <div className="p-2 border-r border-slate-200 last:border-r-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Semester SGPA
              </div>
              <div className="text-xl font-black text-indigo-700 mt-0.5 font-mono">
                {summary.sgpa.toFixed(2)}
              </div>
            </div>

            <div className="p-2 border-r border-slate-200 last:border-r-0">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Cumulative CGPA
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
                {summary.cgpa.toFixed(2)}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Batch Rank
              </div>
              <div className="text-lg font-bold text-amber-700 mt-0.5">
                #{summary.rank}{' '}
                <span className="text-xs text-slate-500 font-normal">of {summary.totalStudentsInBatch}</span>
              </div>
            </div>
          </div>

          {/* Final Result Declaration Ribbon */}
          <div className="my-4 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 uppercase tracking-wide">
                Final Result Status:
              </span>
              <span
                className={`font-serif text-sm font-extrabold uppercase tracking-wide px-3 py-1 rounded ${
                  isDistinction
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : isCompartment
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                }`}
              >
                {summary.overallStatus}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-600 text-xs">
              <div>
                <span className="font-medium text-slate-500">Result Published: </span>
                <span className="font-semibold text-slate-800">{student.declarationDate}</span>
              </div>
              <div>
                <span className="font-medium text-slate-500">Conduct: </span>
                <span className="font-semibold text-slate-800">{student.conduct}</span>
              </div>
            </div>
          </div>

          {/* Grading System Key & Legend */}
          <div className="pt-3 pb-4 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
            <div className="font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Grading Scheme & Points Legend (UGC 10-Point Scale):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[11px]">
              <div>
                <span className="font-bold text-slate-900">A+</span> (10 GP)
                <div className="text-[10px] text-slate-500">90–100%</div>
              </div>
              <div>
                <span className="font-bold text-slate-900">A</span> (9 GP)
                <div className="text-[10px] text-slate-500">80–89%</div>
              </div>
              <div>
                <span className="font-bold text-slate-900">B+</span> (8 GP)
                <div className="text-[10px] text-slate-500">70–79%</div>
              </div>
              <div>
                <span className="font-bold text-slate-900">B</span> (7 GP)
                <div className="text-[10px] text-slate-500">60–69%</div>
              </div>
              <div>
                <span className="font-bold text-slate-900">C</span> (6 GP)
                <div className="text-[10px] text-slate-500">50–59%</div>
              </div>
              <div>
                <span className="font-bold text-slate-900">D</span> (5 GP)
                <div className="text-[10px] text-slate-500">40–49% (Pass)</div>
              </div>
              <div>
                <span className="font-bold text-red-600">F</span> (0 GP)
                <div className="text-[10px] text-red-600">&lt; 40% (Fail)</div>
              </div>
            </div>
          </div>

          {/* Signatures & Security Validation */}
          <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center text-xs">
            {/* Prepared By */}
            <div className="space-y-1">
              <div className="font-serif italic text-slate-600 text-sm h-8 flex items-center justify-center">
                M. K. Narayanan
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-semibold text-slate-800">Tabulator / Section Officer</p>
                <p className="text-[10px] text-slate-500">Evaluation & Scrutiny Wing</p>
              </div>
            </div>

            {/* Cryptographic Seal & QR Verification */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 border border-slate-300 p-1 bg-white rounded shadow-2xs flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                Verification Hash: {student.verificationHash.slice(0, 12)}...
              </p>
            </div>

            {/* Controller of Examinations */}
            <div className="space-y-1">
              <div className="font-serif italic text-slate-800 text-sm h-8 flex items-center justify-center font-bold">
                Dr. Alok Nath, Ph.D.
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-semibold text-slate-900">Controller of Examinations</p>
                <p className="text-[10px] text-slate-500">Apex Institute of Technology</p>
              </div>
            </div>
          </div>

          {/* Disclaimer footer */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-[9px] text-slate-400 text-center">
            * This digital marksheet is verified by the Examination Cell. Any alteration or forgery is a punishable offense under University Regulation § 42(a).
          </div>
        </div>
      </div>

      {/* Verification Details Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Official Authenticity Verified</h3>
                <p className="text-xs text-slate-500">Cryptographically signed academic record</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number:</span>
                <span className="font-bold text-slate-800">{student.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Hash:</span>
                <span className="text-indigo-600 truncate max-w-[200px]">{student.verificationHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued On:</span>
                <span className="text-slate-700">{student.declarationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate Status:</span>
                <span className="text-emerald-700 font-bold">VALID & SEALED</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This statement matches the repository of Apex Institute Examination Board. All credits and grades recorded are final as per the Academic Senate.
            </p>

            <button
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
