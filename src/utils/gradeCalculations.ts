import { SubjectMark, StudentRecord, GradeSummary } from '../types/result';

export function calculateSubjectGrade(
  theoryScore: number,
  internalScore: number,
  maxTheory: number = 75,
  maxInternal: number = 25
): { grade: SubjectMark['grade']; gradePoint: number; status: 'PASS' | 'FAIL' } {
  const total = theoryScore + internalScore;
  const max = maxTheory + maxInternal;
  const pct = max > 0 ? (total / max) * 100 : 0;

  // Passing criteria: >= 35% in theory and >= 40% overall
  const theoryPct = maxTheory > 0 ? (theoryScore / maxTheory) * 100 : 0;
  if (theoryPct < 35 || pct < 40) {
    return { grade: 'F', gradePoint: 0, status: 'FAIL' };
  }

  if (pct >= 90) return { grade: 'A+', gradePoint: 10, status: 'PASS' };
  if (pct >= 80) return { grade: 'A', gradePoint: 9, status: 'PASS' };
  if (pct >= 70) return { grade: 'B+', gradePoint: 8, status: 'PASS' };
  if (pct >= 60) return { grade: 'B', gradePoint: 7, status: 'PASS' };
  if (pct >= 50) return { grade: 'C', gradePoint: 6, status: 'PASS' };
  return { grade: 'D', gradePoint: 5, status: 'PASS' };
}

export function computeGradeSummary(student: StudentRecord, allStudents: StudentRecord[] = []): GradeSummary {
  let totalObtained = 0;
  let maxTotal = 0;
  let totalCredits = 0;
  let weightedPoints = 0;
  let failedSubjectsCount = 0;

  for (const sub of student.subjects) {
    const subTotal = sub.theoryScore + sub.internalScore;
    const subMax = sub.maxTheory + sub.maxInternal;
    totalObtained += subTotal;
    maxTotal += subMax;
    totalCredits += sub.credits;
    weightedPoints += sub.gradePoint * sub.credits;
    if (sub.status === 'FAIL') {
      failedSubjectsCount++;
    }
  }

  const percentage = maxTotal > 0 ? Number(((totalObtained / maxTotal) * 100).toFixed(2)) : 0;
  const sgpa = totalCredits > 0 ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;

  // Derive CGPA based on SGPA with minor previous semesters variation or exact sgpa
  const cgpa = Number((sgpa * 0.98 + (percentage / 10) * 0.02).toFixed(2));

  let overallStatus: GradeSummary['overallStatus'];
  if (failedSubjectsCount > 2) {
    overallStatus = 'FAILED';
  } else if (failedSubjectsCount > 0) {
    overallStatus = 'COMPARTMENT';
  } else if (percentage >= 75) {
    overallStatus = 'PASSED WITH DISTINCTION';
  } else if (percentage >= 60) {
    overallStatus = 'FIRST CLASS';
  } else {
    overallStatus = 'SECOND CLASS';
  }

  // Calculate batch rank
  const pool = allStudents.length > 0 ? allStudents : [student];
  const sorted = [...pool].sort((a, b) => {
    const sumA = a.subjects.reduce((acc, s) => acc + s.theoryScore + s.internalScore, 0);
    const sumB = b.subjects.reduce((acc, s) => acc + s.theoryScore + s.internalScore, 0);
    return sumB - sumA;
  });

  const rankIdx = sorted.findIndex((s) => s.id === student.id);
  const rank = rankIdx !== -1 ? rankIdx + 1 : 1;

  return {
    totalObtained,
    maxTotal,
    percentage,
    totalCredits,
    sgpa,
    cgpa,
    overallStatus,
    rank,
    totalStudentsInBatch: pool.length,
    failedSubjectsCount,
  };
}

export function formatScore(num: number): string {
  return num.toFixed(1).replace(/\.0$/, '');
}
