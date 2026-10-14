export interface SubjectMark {
  code: string;
  name: string;
  credits: number;
  maxTheory: number;
  maxInternal: number;
  theoryScore: number;
  internalScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number;
  status: 'PASS' | 'FAIL';
}

export interface ReEvaluationRequest {
  id: string;
  subjectCode: string;
  subjectName: string;
  submittedAt: string;
  status: 'Under Review' | 'Marks Revised' | 'No Change Detected' | 'Submitted';
  originalScore: number;
  revisedScore?: number;
  remarks: string;
}

export interface StudentRecord {
  id: string;
  rollNumber: string;
  registrationNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  avatarUrl: string;
  gender: 'Female' | 'Male' | 'Other';
  dateOfBirth: string;
  program: string;
  branch: string;
  semester: string;
  session: string;
  examinationName: string;
  institutionName: string;
  institutionCode: string;
  affiliation: string;
  attendancePercentage: number;
  conduct: string;
  declarationDate: string;
  verificationHash: string;
  subjects: SubjectMark[];
  reEvaluationRequests: ReEvaluationRequest[];
}

export interface GradeSummary {
  totalObtained: number;
  maxTotal: number;
  percentage: number;
  totalCredits: number;
  sgpa: number;
  cgpa: number;
  overallStatus: 'PASSED WITH DISTINCTION' | 'FIRST CLASS' | 'SECOND CLASS' | 'COMPARTMENT' | 'FAILED';
  rank: number;
  totalStudentsInBatch: number;
  failedSubjectsCount: number;
}
