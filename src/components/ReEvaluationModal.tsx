import React, { useState } from 'react';
import { X, FileCheck2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { StudentRecord, ReEvaluationRequest } from '../types/result';

interface ReEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  onSubmitRequest: (newReq: ReEvaluationRequest) => void;
}

export const ReEvaluationModal: React.FC<ReEvaluationModalProps> = ({
  isOpen,
  onClose,
  student,
  onSubmitRequest,
}) => {
  if (!isOpen) return null;

  const [selectedSubjectCode, setSelectedSubjectCode] = useState(
    student.subjects[0]?.code || ''
  );
  const [requestType, setRequestType] = useState<'Re-evaluation' | 'Re-totaling' | 'Photocopy'>('Re-evaluation');
  const [remarks, setRemarks] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedSubject = student.subjects.find((s) => s.code === selectedSubjectCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    const newReq: ReEvaluationRequest = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      submittedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Under Review',
      originalScore: selectedSubject.theoryScore + selectedSubject.internalScore,
      remarks: `[${requestType}] ${remarks || 'Scrutiny requested by candidate'}`,
    };

    onSubmitRequest(newReq);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Examination Scrutiny & Re-evaluation Portal
            </h3>
            <p className="text-xs text-slate-500">
              Apply for formal re-totaling or script re-evaluation for Spring 2026
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Application Submitted</h4>
            <p className="text-xs text-slate-500">
              Your scrutiny application has been queued with the Evaluation Cell. Status updated on marksheet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Student metadata preview */}
            <div className="p-3 bg-slate-50 rounded-lg text-xs flex justify-between border border-slate-200">
              <div>
                <span className="text-slate-500">Candidate:</span>{' '}
                <span className="font-semibold text-slate-800">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Roll No:</span>{' '}
                <span className="font-mono font-semibold text-slate-800">{student.rollNumber}</span>
              </div>
            </div>

            {/* Select Subject */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Select Course / Paper:</label>
              <select
                value={selectedSubjectCode}
                onChange={(e) => setSelectedSubjectCode(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {student.subjects.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} - {sub.name} (Secured: {sub.theoryScore + sub.internalScore} / Grade: {sub.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Scrutiny Service Type:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Re-evaluation', label: 'Full Re-check', fee: '$25 / ₹500' },
                  { id: 'Re-totaling', label: 'Re-totaling', fee: '$12 / ₹250' },
                  { id: 'Photocopy', label: 'Script Copy', fee: '$15 / ₹300' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setRequestType(type.id as any)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      requestType === type.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>{type.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{type.fee}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason / Statement */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Grounds for Appeal / Specific Question Numbers:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="E.g., Discrepancy suspected in Section C Question 5 (Markov Decision Processes)..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Re-evaluation results are final. Marks may increase, remain unchanged, or decrease in accordance with University Examination Bye-Law 18.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
              >
                Submit Scrutiny Appeal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
