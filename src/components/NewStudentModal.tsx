import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { StudentRecord, SubjectMark } from '../types/result';
import { calculateSubjectGrade } from '../utils/gradeCalculations';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: StudentRecord) => void;
  existingCount: number;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingCount,
}) => {
  if (!isOpen) return null;

  const nextRollSuffix = (existingCount + 10).toString().padStart(3, '0');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState(`2024-CS-${nextRollSuffix}`);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [performancePreset, setPerformancePreset] = useState<'high' | 'medium' | 'borderline'>('high');

  const createSubjects = (level: 'high' | 'medium' | 'borderline'): SubjectMark[] => {
    const list = [
      { code: 'CS601', name: 'Distributed Systems & Cloud Computing', credits: 4, maxT: 75, maxI: 25 },
      { code: 'CS602', name: 'Artificial Intelligence & Neural Nets', credits: 4, maxT: 75, maxI: 25 },
      { code: 'CS603', name: 'Compiler Design & Formal Languages', credits: 4, maxT: 75, maxI: 25 },
      { code: 'CS604', name: 'Cryptography & Cyber Security', credits: 3, maxT: 75, maxI: 25 },
      { code: 'CS605', name: 'Software Engineering & Agile DevOps', credits: 3, maxT: 75, maxI: 25 },
      { code: 'CS606P', name: 'Cloud & Neural Systems Laboratory', credits: 2, maxT: 40, maxI: 60 },
      { code: 'CS607P', name: 'Capstone Engineering Project Phase-I', credits: 4, maxT: 50, maxI: 50 },
    ];

    return list.map((item) => {
      let tScore = 65;
      let iScore = 22;

      if (level === 'high') {
        tScore = Math.floor(item.maxT * (0.85 + Math.random() * 0.12));
        iScore = Math.floor(item.maxI * (0.9 + Math.random() * 0.08));
      } else if (level === 'medium') {
        tScore = Math.floor(item.maxT * (0.65 + Math.random() * 0.1));
        iScore = Math.floor(item.maxI * (0.75 + Math.random() * 0.1));
      } else {
        // Borderline
        tScore = Math.floor(item.maxT * (0.42 + Math.random() * 0.15));
        iScore = Math.floor(item.maxI * (0.6 + Math.random() * 0.15));
      }

      const { grade, gradePoint, status } = calculateSubjectGrade(tScore, iScore, item.maxT, item.maxI);
      return {
        code: item.code,
        name: item.name,
        credits: item.credits,
        maxTheory: item.maxT,
        maxInternal: item.maxI,
        theoryScore: tScore,
        internalScore: iScore,
        grade,
        gradePoint,
        status,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    ];

    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newStudent: StudentRecord = {
      id: `stu-${Date.now()}`,
      rollNumber: rollNumber.trim() || `2024-CS-${nextRollSuffix}`,
      registrationNo: `REG-2022-${Math.floor(10000 + Math.random() * 90000)}`,
      name: name.trim(),
      fatherName: fatherName.trim() || 'Parent/Guardian',
      motherName: motherName.trim() || 'Parent/Guardian',
      avatarUrl: randomAvatar,
      gender,
      dateOfBirth: '2004-05-15',
      program: 'Bachelor of Technology (B.Tech)',
      branch: 'Computer Science & Engineering',
      semester: 'Semester VI (Spring 2026)',
      session: '2025-2026',
      examinationName: 'End-Semester Degree Examination, April 2026',
      institutionName: 'Apex Institute of Technology & Advanced Sciences',
      institutionCode: 'INST-7704',
      affiliation: 'Autonomous Institution · Approved by AICTE · NAAC Grade A++',
      attendancePercentage: Math.floor(82 + Math.random() * 15),
      conduct: 'Good',
      declarationDate: '12 April 2026',
      verificationHash: Math.random().toString(36).substring(2, 18),
      subjects: createSubjects(performancePreset),
      reEvaluationRequests: [],
    };

    onAddStudent(newStudent);
    onClose();
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
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add New Student Examination Record
            </h3>
            <p className="text-xs text-slate-500">
              Register candidate into Spring 2026 Result Database
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Sengupta"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Roll Number *</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="e.g. Subhash Sengupta"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mother's Name</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="e.g. Rina Sengupta"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Performance Preset */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Initial Marks Tier Simulation:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPerformancePreset('high')}
                className={`p-2 rounded-lg border text-xs text-left transition-all ${
                  performancePreset === 'high'
                    ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Distinction Tier</div>
                <div className="text-[10px] text-slate-400 font-normal">&ge; 85% range</div>
              </button>
              <button
                type="button"
                onClick={() => setPerformancePreset('medium')}
                className={`p-2 rounded-lg border text-xs text-left transition-all ${
                  performancePreset === 'medium'
                    ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>First Class Tier</div>
                <div className="text-[10px] text-slate-400 font-normal">65 - 75% range</div>
              </button>
              <button
                type="button"
                onClick={() => setPerformancePreset('borderline')}
                className={`p-2 rounded-lg border text-xs text-left transition-all ${
                  performancePreset === 'borderline'
                    ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>Pass / Borderline</div>
                <div className="text-[10px] text-slate-400 font-normal">45 - 55% range</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              Generate Result & Marksheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
