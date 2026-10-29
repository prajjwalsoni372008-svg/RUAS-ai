import React, { useState } from 'react';
import { CourseSpecification, CourseOutcome, UserRole, ROLE_CONFIGS } from '../types';
import { annexureData } from '../annexureData';
import { 
  BookMarked, Clock, Check, Plus, Edit2, Trash2, 
  Sparkles, CheckCircle2, ChevronRight, FileText, Target
} from 'lucide-react';

interface CourseSpecViewProps {
  course: CourseSpecification;
  role: UserRole;
  onUpdateCourse: (updated: CourseSpecification) => void;
  onOpenAnnexure: () => void;
  onOpenAIAudit: () => void;
}

export default function CourseSpecView({
  course,
  role,
  onUpdateCourse,
  onOpenAnnexure,
  onOpenAIAudit
}: CourseSpecViewProps) {
  const permissions = ROLE_CONFIGS[role];
  const [editingCO, setEditingCO] = useState<CourseOutcome | null>(null);
  const [isNewCO, setIsNewCO] = useState(false);

  // Form states for modal
  const [formCode, setFormCode] = useState('');
  const [formStatement, setFormStatement] = useState('');
  const [formBlooms, setFormBlooms] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'>('L3');
  const [formAttainment, setFormAttainment] = useState(75);
  const [formDelivery, setFormDelivery] = useState('Classroom Lecture, Laboratory Practice');
  const [formAssessment, setFormAssessment] = useState('Continuous Internal Assessment, Semester End Exam');

  const startEditCO = (co: CourseOutcome) => {
    if (!permissions.canEditCOs) return;
    setEditingCO(co);
    setIsNewCO(false);
    setFormCode(co.code);
    setFormStatement(co.statement);
    setFormBlooms(co.bloomsLevel);
    setFormAttainment(co.targetAttainment);
    setFormDelivery(co.deliveryMethods.join(', '));
    setFormAssessment(co.assessmentMethods.join(', '));
  };

  const startCreateCO = () => {
    if (!permissions.canEditCOs) return;
    const nextIndex = course.courseOutcomes.length + 1;
    const nextCode = `CO${nextIndex}`;
    setEditingCO({
      code: nextCode,
      statement: '',
      bloomsLevel: 'L3',
      targetAttainment: 75,
      deliveryMethods: ['Classroom Lecture', 'Problem Solving Tutorial'],
      assessmentMethods: ['Continuous Internal Assessment', 'Semester End Exam']
    });
    setIsNewCO(true);
    setFormCode(nextCode);
    setFormStatement('');
    setFormBlooms('L3');
    setFormAttainment(75);
    setFormDelivery('Classroom Lecture, Laboratory Practice');
    setFormAssessment('Continuous Assessment, Semester Exam');
  };

  const handleSaveCO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCO) return;

    const updatedOutcome: CourseOutcome = {
      code: formCode.trim() || editingCO.code,
      statement: formStatement.trim(),
      bloomsLevel: formBlooms,
      targetAttainment: Number(formAttainment),
      deliveryMethods: formDelivery.split(',').map(s => s.trim()).filter(Boolean),
      assessmentMethods: formAssessment.split(',').map(s => s.trim()).filter(Boolean)
    };

    let updatedList: CourseOutcome[];
    let updatedMatrix = { ...course.matrix };

    if (isNewCO) {
      updatedList = [...course.courseOutcomes, updatedOutcome];
      // Initialize default empty matrix row for this CO
      if (!updatedMatrix[updatedOutcome.code]) {
        updatedMatrix[updatedOutcome.code] = { PO1: 2, PO2: 2, PO3: 1 };
      }
    } else {
      updatedList = course.courseOutcomes.map(item =>
        item.code === editingCO.code ? updatedOutcome : item
      );
    }

    onUpdateCourse({
      ...course,
      courseOutcomes: updatedList,
      matrix: updatedMatrix,
      lastModified: new Date().toISOString().split('T')[0]
    });

    setEditingCO(null);
  };

  const handleDeleteCO = (code: string) => {
    if (!permissions.canEditCOs) return;
    if (window.confirm(`Are you sure you want to remove ${code}?`)) {
      const updatedList = course.courseOutcomes.filter(c => c.code !== code);
      const updatedMatrix = { ...course.matrix };
      delete updatedMatrix[code];

      onUpdateCourse({
        ...course,
        courseOutcomes: updatedList,
        matrix: updatedMatrix,
        lastModified: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Check Bloom's verb validation
  const currentBloomsInfo = annexureData.bloomsLevels.find(b => b.level === formBlooms);
  const firstWordInForm = formStatement.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
  const isValidVerb = currentBloomsInfo?.actionVerbs.some(v => v.toLowerCase() === firstWordInForm);

  // Cognitive distribution stats
  const higherOrderCOs = course.courseOutcomes.filter(c => ['L4', 'L5', 'L6'].includes(c.bloomsLevel)).length;
  const higherOrderPercent = course.courseOutcomes.length
    ? Math.round((higherOrderCOs / course.courseOutcomes.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Course Overview Header Card */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 relative overflow-hidden academic-doc">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded font-mono font-bold bg-blue-950/80 border border-blue-700/50 text-blue-300">
                {course.code}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-medium">{course.department}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">{course.semester}</span>
              <span className="text-slate-400">·</span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-[#141824] border border-[#232a3e] text-slate-300">
                {course.regulation}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {course.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Prerequisites:</span>
              {course.prerequisites.map((p, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded bg-[#111522] border border-[#222a3d] text-slate-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Credit & Hours Matrix Summary */}
          <div className="flex flex-row sm:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-lg bg-[#0e121e] border border-[#21273b] min-w-[190px]">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Credit Structure (L-T-P-C)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#141928] p-1.5 rounded border border-[#252f49]">
                  <div className="text-[10px] text-slate-400">L</div>
                  <div className="text-base font-bold text-white font-mono">{course.credits.L}</div>
                </div>
                <div className="bg-[#141928] p-1.5 rounded border border-[#252f49]">
                  <div className="text-[10px] text-slate-400">T</div>
                  <div className="text-base font-bold text-white font-mono">{course.credits.T}</div>
                </div>
                <div className="bg-[#141928] p-1.5 rounded border border-[#252f49]">
                  <div className="text-[10px] text-slate-400">P</div>
                  <div className="text-base font-bold text-white font-mono">{course.credits.P}</div>
                </div>
                <div className="bg-blue-950/60 p-1.5 rounded border border-blue-700/50">
                  <div className="text-[10px] text-blue-300 font-semibold">C</div>
                  <div className="text-base font-bold text-blue-300 font-mono">{course.credits.C}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e121e] border border-[#21273b] flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Total Contact Hours
              </span>
              <span className="text-sm font-bold text-white font-mono">{course.totalContactHours} hrs</span>
            </div>
          </div>
        </div>

        {/* Studio Status Bar */}
        <div className="mt-5 pt-4 border-t border-[#1c2234] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Version: <strong className="text-slate-200 font-mono">{course.version}</strong></span>
            <span>·</span>
            <span>Last Modified: <span className="text-slate-300">{course.lastModified}</span></span>
            <span>·</span>
            <span>Audited By: <span className="text-slate-300">{course.lastModifiedBy}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAnnexure}
              className="px-2.5 py-1 text-xs rounded bg-[#131726] border border-[#222a3e] text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1.5"
            >
              <BookMarked className="w-3.5 h-3.5 text-blue-400" />
              Open Annexure A
            </button>
            <button
              onClick={onOpenAIAudit}
              className="px-2.5 py-1 text-xs rounded bg-blue-950/40 border border-blue-700/60 text-blue-300 hover:bg-blue-900/40 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Run AI Compliance Audit
            </button>
          </div>
        </div>
      </div>

      {/* Course Learning Outcomes (CLOs) Section */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 space-y-5 academic-doc">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2234]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Course Learning Outcomes (CLOs)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#141928] border border-[#262f48] text-blue-300 font-mono">
                {course.courseOutcomes.length} Outcomes Defined
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Statements calibrated against Bloom's Revised Taxonomy cognitive domains and measurable assessment targets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs px-3 py-1.5 rounded bg-[#101422] border border-[#20273a] text-slate-300 hidden md:block">
              Cognitive Depth: <strong className="text-emerald-400">{higherOrderPercent}%</strong> Higher-Order (L4–L6)
            </div>
            {permissions.canEditCOs && (
              <button
                onClick={startCreateCO}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Course Outcome
              </button>
            )}
          </div>
        </div>

        {/* Outcomes List */}
        <div className="space-y-3">
          {course.courseOutcomes.map((co) => {
            const bloomsMeta = annexureData.bloomsLevels.find(b => b.level === co.bloomsLevel);
            const levelColorMap: Record<string, { bg: string; text: string; border: string }> = {
              L1: { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700' },
              L2: { bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-800/60' },
              L3: { bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-800/60' },
              L4: { bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-800/60' },
              L5: { bg: 'bg-orange-950/70', text: 'text-orange-300', border: 'border-orange-800/60' },
              L6: { bg: 'bg-purple-950/70', text: 'text-purple-300', border: 'border-purple-800/60' },
            };
            const levelStyle = levelColorMap[co.bloomsLevel] || levelColorMap.L3;

            return (
              <div
                key={co.code}
                className="p-4 rounded-lg bg-[#0e121c] border border-[#1e2538] hover:border-[#2f3956] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                    <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-[#141826] border border-[#273149] text-blue-300">
                      {co.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                      {co.bloomsLevel}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {co.statement}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1 text-slate-300">
                        <span className="text-slate-500">Taxonomy:</span>
                        <span className="font-medium text-slate-200">{bloomsMeta?.name || 'Understanding'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Delivery:</span>
                        <span className="text-slate-300">{co.deliveryMethods.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Evaluation:</span>
                        <span className="text-slate-300">{co.assessmentMethods.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right metrics & action controls */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Target Attainment</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {co.targetAttainment}%
                      </div>
                    </div>
                    <div className="w-12 bg-[#161c2a] h-2 rounded-full overflow-hidden border border-[#242e46] hidden sm:block">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${co.targetAttainment}%` }}
                      />
                    </div>
                  </div>

                  {permissions.canEditCOs && (
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        onClick={() => startEditCO(co)}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#181d2e] transition-colors"
                        title="Edit Course Outcome"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCO(co.code)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Remove Outcome"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingCO && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0e17] text-slate-100 rounded-lg border border-[#22283b] p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2234]">
              <h3 className="text-sm font-semibold text-white">
                {isNewCO ? 'Add New Course Learning Outcome' : `Edit Outcome Statement (${editingCO.code})`}
              </h3>
              <button
                onClick={() => setEditingCO(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveCO} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CO Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bloom's Taxonomy Level</label>
                  <select
                    value={formBlooms}
                    onChange={e => setFormBlooms(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {annexureData.bloomsLevels.map(b => (
                      <option key={b.level} value={b.level} className="bg-[#0b0e17] text-white">
                        {b.level} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Statement input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Outcome Statement (Must begin with measurable action verb)
                  </label>
                  {firstWordInForm && (
                    <span className={`text-[11px] font-mono flex items-center gap-1 ${
                      isValidVerb ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isValidVerb ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Valid {formBlooms} verb: "{firstWordInForm}"
                        </>
                      ) : (
                        `Note: "${firstWordInForm}" is not in official ${formBlooms} list`
                      )}
                    </span>
                  )}
                </div>
                <textarea
                  value={formStatement}
                  onChange={e => setFormStatement(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#121624] border border-[#232b40] rounded text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Design dynamic programming formulations for multi-stage decision problems..."
                  required
                />
                {/* Approved verbs preview */}
                <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
                  <span>Suggested {formBlooms} verbs:</span>
                  {currentBloomsInfo?.actionVerbs.slice(0, 6).map(v => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => {
                        const words = formStatement.trim().split(/\s+/);
                        words[0] = v;
                        setFormStatement(words.join(' '));
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#171d2e] border border-[#26314c] text-blue-300 hover:text-white text-[10px] font-mono cursor-pointer"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target attainment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Attainment Threshold ({formAttainment}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={formAttainment}
                    onChange={e => setFormAttainment(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Methods</label>
                  <input
                    type="text"
                    value={formDelivery}
                    onChange={e => setFormDelivery(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Lecture, Lab, Tutorial"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assessment Instruments</label>
                <input
                  type="text"
                  value={formAssessment}
                  onChange={e => setFormAssessment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="CIA-1, CIA-2, End Term Exam"
                />
              </div>

              <div className="pt-3 border-t border-[#1c2234] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCO(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded shadow-sm"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
