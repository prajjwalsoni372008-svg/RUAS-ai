import React, { useState } from 'react';
import { CourseSpecification, UserRole, ROLE_CONFIGS, ReviewComment } from '../types';
import { annexureData } from '../annexureData';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Award, 
  MessageSquare, Send, Lock, FileCheck2, Clock, ThumbsUp, XCircle, AlertCircle
} from 'lucide-react';

interface AccreditationDashboardProps {
  course: CourseSpecification;
  role: UserRole;
  onUpdateCourse: (updated: CourseSpecification) => void;
  onOpenExport: () => void;
}

export default function AccreditationDashboard({
  course,
  role,
  onUpdateCourse,
  onOpenExport
}: AccreditationDashboardProps) {
  const permissions = ROLE_CONFIGS[role];
  const [commentText, setCommentText] = useState('');
  const [targetSection, setTargetSection] = useState('General');
  const [statusBadge, setStatusBadge] = useState<'Aligned' | 'Needs Revision' | 'Approved' | 'Query'>('Aligned');
  const [newStatus, setNewStatus] = useState<CourseSpecification['status']>(course.status);

  const poList = annexureData.programOutcomes;
  const matrix = course.matrix || {};

  // Compute coverage stats
  const coveredPOCodes = new Set<string>();
  Object.keys(matrix).forEach(coKey => {
    Object.entries(matrix[coKey] || {}).forEach(([poKey, val]) => {
      if (Number(val) > 0) coveredPOCodes.add(poKey);
    });
  });

  const poCoveragePercent = Math.round((coveredPOCodes.size / poList.length) * 100);

  // Compute Bloom distribution
  const bloomsCounts: Record<string, number> = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0, L6: 0 };
  course.courseOutcomes.forEach(co => {
    if (bloomsCounts[co.bloomsLevel] !== undefined) {
      bloomsCounts[co.bloomsLevel]++;
    }
  });

  const higherOrderCount = bloomsCounts.L4 + bloomsCounts.L5 + bloomsCounts.L6;
  const higherOrderPercent = course.courseOutcomes.length
    ? Math.round((higherOrderCount / course.courseOutcomes.length) * 100)
    : 0;

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !permissions.canAddComments) return;

    const newLog: ReviewComment = {
      id: `rev-${Date.now()}`,
      author: permissions.label.split('(')[0].trim(),
      role: permissions.label,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: commentText.trim(),
      statusBadge,
      targetSection
    };

    onUpdateCourse({
      ...course,
      reviewLogs: [newLog, ...(course.reviewLogs || [])],
      lastModified: new Date().toISOString().split('T')[0]
    });

    setCommentText('');
  };

  // Status Change
  const handleStatusChange = (status: CourseSpecification['status']) => {
    if (!permissions.canChangeStatus && !permissions.canApproveReject) return;
    setNewStatus(status);
    onUpdateCourse({
      ...course,
      status,
      lastModified: new Date().toISOString().split('T')[0]
    });
  };

  // HOD Sign-off
  const handleHODApprove = () => {
    if (!permissions.canApproveReject) return;
    const sig = `SIG-CSE-${course.academicYear.substring(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = {
      ...course,
      status: 'Aligned / Approved' as const,
      approvalInfo: {
        approvedBy: 'Prof. David Chen, Ph.D.',
        approvedRole: 'Head of Department, CSE',
        approvedDate: new Date().toISOString().split('T')[0],
        digitalSignature: sig
      },
      lastModified: new Date().toISOString().split('T')[0]
    };
    onUpdateCourse(updated);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Readiness Card */}
        <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-5 academic-doc space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold">Accreditation Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{course.status}</span>
          </div>
          <p className="text-xs text-slate-400">
            Current governance workflow stage for {course.academicYear} syllabus rollout.
          </p>
          {(permissions.canChangeStatus || permissions.canApproveReject) && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {(['Aligned / Approved', 'Under Review', 'Needs Revision'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    course.status === s
                      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                      : 'bg-[#121624] border-[#222a3e] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PO Coverage Card */}
        <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-5 academic-doc space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold">PO Articulation Coverage</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400 font-mono">{poCoveragePercent}%</span>
            <span className="text-xs text-slate-400">({coveredPOCodes.size} of {poList.length} POs)</span>
          </div>
          <div className="w-full bg-[#181d2c] h-2 rounded-full overflow-hidden border border-[#273248]">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${poCoveragePercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {poCoveragePercent >= 80 ? 'Meets recommended Washington Accord breadth thresholds.' : 'Requires broader mapping to engineering attributes.'}
          </p>
        </div>

        {/* Cognitive Hierarchy Card */}
        <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-5 academic-doc space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold">Bloom's Higher-Order Depth</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-400 font-mono">{higherOrderPercent}%</span>
            <span className="text-xs text-slate-400">L4 (Analyze), L5 (Evaluate), L6 (Create)</span>
          </div>
          <div className="w-full bg-[#181d2c] h-2 rounded-full overflow-hidden border border-[#273248]">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${higherOrderPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {higherOrderPercent >= 50 ? 'Strong alignment with senior-tier engineering program standards.' : 'Consider uplifting foundational outcomes to design/evaluate levels.'}
          </p>
        </div>
      </div>

      {/* Official Sign-off & Digital Signature Section */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 academic-doc space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1c2234]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Academic Governance & Formal HOD Sign-off
              </h2>
              <p className="text-xs text-slate-400">
                Official accreditation audit stamp and revision locking for Section 2.2 of the NBA Self-Assessment Report.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="px-3 py-1.5 bg-[#141826] border border-[#26314c] hover:bg-[#1a2034] text-xs font-semibold text-slate-200 rounded transition-colors"
            >
              Export SAR Dossier
            </button>
            {permissions.canApproveReject && !course.approvalInfo && (
              <button
                onClick={handleHODApprove}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                Sign & Lock Specification
              </button>
            )}
          </div>
        </div>

        {course.approvalInfo ? (
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Formally Approved & Digitally Locked
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Signed by: <strong className="text-white">{course.approvalInfo.approvedBy}</strong> ({course.approvalInfo.approvedRole})
              </div>
              <div className="text-[11px] text-slate-400">
                Date: {course.approvalInfo.approvedDate} · Digital Hash: <code className="font-mono text-emerald-300">{course.approvalInfo.digitalSignature}</code>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-mono rounded">
              VERIFIED AUTONOMY R-2024
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#10131e] border border-[#20273a] flex items-center justify-between text-xs text-slate-400">
            <span>Pending executive review by Program Chair / Head of Department.</span>
            <span className="font-mono text-amber-400">DRAFT STATUS</span>
          </div>
        )}
      </div>

      {/* Program Assessment Committee (PAC) Comments Thread */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 academic-doc space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2234]">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Program Assessment Committee (PAC) Review Log
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {course.reviewLogs?.length || 0} Annotations Recorded
          </span>
        </div>

        {/* Add Comment Form */}
        {permissions.canAddComments && (
          <form onSubmit={handleAddComment} className="p-4 rounded-lg bg-[#10131e] border border-[#20273a] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Section</label>
                <select
                  value={targetSection}
                  onChange={e => setTargetSection(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#161c2c] border border-[#28324a] rounded text-xs text-white focus:outline-none"
                >
                  <option value="Course Outcomes">Course Outcomes (CLOs)</option>
                  <option value="CO-PO Matrix">CO-PO Articulation Matrix</option>
                  <option value="Modular Syllabus">Modular Syllabus & Contact Hours</option>
                  <option value="Assessment Tools">Assessment & Direct Evaluation Tools</option>
                  <option value="General">General Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Review Assessment Status</label>
                <select
                  value={statusBadge}
                  onChange={e => setStatusBadge(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-[#161c2c] border border-[#28324a] rounded text-xs text-white focus:outline-none"
                >
                  <option value="Aligned">Aligned / Conforms</option>
                  <option value="Approved">Approved</option>
                  <option value="Needs Revision">Needs Revision</option>
                  <option value="Query">Observation / Query</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Review Note & Feedback</label>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-[#161c2c] border border-[#28324a] rounded text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                placeholder="Submit audit recommendations or accreditation compliance feedback..."
                required
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Record PAC Review
              </button>
            </div>
          </form>
        )}

        {/* Existing Logs */}
        <div className="space-y-3">
          {(!course.reviewLogs || course.reviewLogs.length === 0) ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No review annotations submitted yet.
            </div>
          ) : (
            course.reviewLogs.map((log) => {
              const statusColors: Record<string, string> = {
                Aligned: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300',
                Approved: 'bg-blue-950/60 border-blue-800/40 text-blue-300',
                'Needs Revision': 'bg-amber-950/60 border-amber-800/40 text-amber-300',
                Query: 'bg-purple-950/60 border-purple-800/40 text-purple-300'
              };

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-[#0e121c] border border-[#1e2436] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{log.author}</span>
                      <span className="text-[11px] text-slate-400">({log.role})</span>
                      {log.targetSection && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#161c2b] text-slate-300 font-mono">
                          § {log.targetSection}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {log.statusBadge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${statusColors[log.statusBadge] || 'text-slate-400'}`}>
                          {log.statusBadge}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {log.text}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
