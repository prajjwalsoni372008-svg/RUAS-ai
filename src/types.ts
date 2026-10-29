export type UserRole = 'author' | 'reviewer' | 'hod' | 'auditor';

export interface RolePermissions {
  label: string;
  badgeColor: string;
  description: string;
  canEditCourse: boolean;
  canEditCOs: boolean;
  canEditMatrix: boolean;
  canAddComments: boolean;
  canChangeStatus: boolean;
  canApproveReject: boolean;
  canFreezeVersion: boolean;
  canExportSAR: boolean;
  canUseAI: boolean;
}

export const ROLE_CONFIGS: Record<UserRole, RolePermissions> = {
  author: {
    label: 'Course Author (Faculty)',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
    description: 'Create & edit course learning outcomes, syllabus topics, and propose articulation matrix weights.',
    canEditCourse: true,
    canEditCOs: true,
    canEditMatrix: true,
    canAddComments: true,
    canChangeStatus: false,
    canApproveReject: false,
    canFreezeVersion: false,
    canExportSAR: true,
    canUseAI: true
  },
  reviewer: {
    label: 'Curriculum Reviewer (PAC)',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    description: 'Audit Bloom\'s level taxonomy, verify PO alignment criteria, and submit peer review annotations.',
    canEditCourse: false,
    canEditCOs: false,
    canEditMatrix: false,
    canAddComments: true,
    canChangeStatus: true,
    canApproveReject: false,
    canFreezeVersion: false,
    canExportSAR: true,
    canUseAI: true
  },
  hod: {
    label: 'Head of Department (HOD)',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
    description: 'Executive governance: sign off, approve/reject specifications, lock syllabus revisions, and release SAR.',
    canEditCourse: true,
    canEditCOs: true,
    canEditMatrix: true,
    canAddComments: true,
    canChangeStatus: true,
    canApproveReject: true,
    canFreezeVersion: true,
    canExportSAR: true,
    canUseAI: true
  },
  auditor: {
    label: 'Accreditation Auditor (NBA / ABET)',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/30',
    description: 'Read-only compliance verification, discrepancy log review, and SAR document inspection.',
    canEditCourse: false,
    canEditCOs: false,
    canEditMatrix: false,
    canAddComments: false,
    canChangeStatus: false,
    canApproveReject: false,
    canFreezeVersion: false,
    canExportSAR: true,
    canUseAI: false
  }
};

export interface CourseOutcome {
  code: string; // e.g. "CO1"
  statement: string;
  bloomsLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  targetAttainment: number; // e.g. 75 (%)
  deliveryMethods: string[];
  assessmentMethods: string[];
}

export interface SyllabusModule {
  moduleNo: number;
  title: string;
  hours: number;
  topics: string[];
  outcomesAddressed: string[];
  bloomFocus: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  text: string;
  statusBadge?: 'Aligned' | 'Needs Revision' | 'Approved' | 'Query';
  targetSection?: string;
}

export interface CourseSpecification {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: string;
  academicYear: string;
  regulation: string;
  courseType: string;
  credits: {
    L: number; // Lecture hours
    T: number; // Tutorial hours
    P: number; // Practical/Lab hours
    C: number; // Total credits
  };
  totalContactHours: number;
  prerequisites: string[];
  description: string;
  status: 'Under Review' | 'Aligned / Approved' | 'Needs Revision' | 'Draft';
  version: string;
  lastModified: string;
  lastModifiedBy: string;
  courseOutcomes: CourseOutcome[];
  modules: SyllabusModule[];
  matrix: Record<string, Record<string, number>>; // CO1 -> PO1: 3
  matrixJustifications: Record<string, Record<string, string>>;
  books: {
    textbooks: string[];
    referenceBooks: string[];
    webResources: string[];
  };
  reviewLogs: ReviewComment[];
  approvalInfo?: {
    approvedBy: string;
    approvedRole: string;
    approvedDate: string;
    digitalSignature: string;
  };
}

export interface AnnexureAData {
  annexure: string;
  program: string;
  accreditationBoard: string;
  programOutcomes: Array<{
    code: string;
    title: string;
    focus: string;
    statement: string;
  }>;
  programSpecificOutcomes: Array<{
    code: string;
    title: string;
    focus: string;
    statement: string;
  }>;
  bloomsLevels: Array<{
    level: string;
    name: string;
    descriptor: string;
    actionVerbs: string[];
  }>;
  correlationScales: Array<{
    value: number;
    symbol: string;
    label: string;
    description: string;
  }>;
}
