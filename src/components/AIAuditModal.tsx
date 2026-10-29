import React, { useState, useEffect } from 'react';
import { CourseSpecification, CourseOutcome } from '../types';
import { annexureData } from '../annexureData';
import { 
  auditCourseOutcomes, generateImprovedCOStatement, 
  AIReviewResult, loadSettings, getLlmHeaders 
} from '../api';
import { 
  Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, 
  RefreshCw, Settings as SettingsIcon, X, ArrowRight, Wand2, Plus 
} from 'lucide-react';

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  onOpenSettings: () => void;
}

export default function AIAuditModal({
  isOpen,
  onClose,
  course,
  onUpdateCourse,
  onOpenSettings
}: AIAuditModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIReviewResult | null>(null);

  // Generator state
  const [genTargetLevel, setGenTargetLevel] = useState('L4');
  const [genTopic, setGenTopic] = useState('Graph Traversal and Shortest Path Optimization');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const settings = loadSettings();
  const headers = getLlmHeaders(settings);

  useEffect(() => {
    if (isOpen) {
      handleRunAudit();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await auditCourseOutcomes(course, annexureData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVerb = (coCode: string, newVerb: string) => {
    const updatedCOs = course.courseOutcomes.map(co => {
      if (co.code === coCode) {
        const words = co.statement.trim().split(/\s+/);
        words[0] = newVerb;
        return { ...co, statement: words.join(' ') };
      }
      return co;
    });

    onUpdateCourse({
      ...course,
      courseOutcomes: updatedCOs,
      lastModified: new Date().toISOString().split('T')[0]
    });

    // Re-run audit to reflect fix
    setTimeout(handleRunAudit, 200);
  };

  const handleGenerateCOStatement = async () => {
    setIsGeneratingDraft(true);
    const bloomsObj = annexureData.bloomsLevels.find(b => b.level === genTargetLevel);
    const verb = bloomsObj?.actionVerbs[0] || 'Apply';
    const draft = await generateImprovedCOStatement(verb, genTopic, genTargetLevel, annexureData.bloomsLevels);
    setGeneratedDraft(draft);
    setIsGeneratingDraft(false);
  };

  const handleAppendGeneratedCO = () => {
    if (!generatedDraft) return;
    const nextIdx = course.courseOutcomes.length + 1;
    const newCO: CourseOutcome = {
      code: `CO${nextIdx}`,
      statement: generatedDraft,
      bloomsLevel: genTargetLevel as any,
      targetAttainment: 75,
      deliveryMethods: ['Classroom Lecture', 'Problem Solving Tutorial'],
      assessmentMethods: ['Continuous Internal Assessment', 'Semester End Exam']
    };

    onUpdateCourse({
      ...course,
      courseOutcomes: [...course.courseOutcomes, newCO],
      lastModified: new Date().toISOString().split('T')[0]
    });

    setGeneratedDraft('');
    setTimeout(handleRunAudit, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#090c14] text-slate-100 rounded-lg border border-[#22283b] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1c2234] flex items-center justify-between bg-[#0e121d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-950/70 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                  AI Accreditation & Curriculum Auditor
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-950/80 border border-blue-800/40 text-blue-300">
                  {headers['x-llm-provider']} · {headers['x-llm-model']}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated Bloom's taxonomy verification & Washington Accord alignment check
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#161a29] transition-colors"
              title="Configure LLM Provider & Key"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#161a29] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Dispatched Details */}
          <div className="p-3 rounded bg-[#10131e] border border-[#1e2436] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span>x-llm-provider: <strong className="text-blue-300">{headers['x-llm-provider']}</strong></span>
              <span>·</span>
              <span>x-llm-model: <strong className="text-blue-300">{headers['x-llm-model']}</strong></span>
              <span>·</span>
              <span>x-llm-key: <strong className="text-emerald-400">{settings.apiKey ? '••••••••' : 'None (Using Rule Engine)'}</strong></span>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="px-2.5 py-1 rounded bg-[#161c2c] hover:bg-[#20273d] text-slate-200 border border-[#2a344d] flex items-center gap-1 font-sans transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Re-audit
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-7 h-7 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">
                Auditing course outcomes and articulation matrix against NBA criteria...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Score & Summary Banner */}
              <div className="p-5 rounded-lg bg-[#0e121e] border border-[#21283d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded font-semibold font-mono border ${
                      result.overallScore >= 85
                        ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                    }`}>
                      {result.readinessRating}
                    </span>
                    <span className="text-xs text-slate-400">NBA Criteria 2.2</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">
                    {result.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Compliance Index
                  </div>
                  <div className="text-3xl font-extrabold text-blue-400 font-mono">
                    {result.overallScore}<span className="text-sm text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Identified Issues & Verb Adjustments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    Detected Compliance Observations ({result.issues.length})
                  </h3>
                  <span className="text-[11px] text-slate-500">Click any verb to resolve</span>
                </div>

                {result.issues.length === 0 ? (
                  <div className="p-4 rounded bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Zero compliance blockers detected! Course outcomes conform to Bloom's Revised taxonomy.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                          issue.severity === 'error'
                            ? 'bg-rose-950/20 border-rose-900/40 text-slate-200'
                            : 'bg-amber-950/20 border-amber-900/40 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-100 bg-[#161a28] px-2 py-0.5 rounded border border-[#252d42]">
                              {issue.coCode}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                              issue.severity === 'error'
                                ? 'bg-rose-900/50 text-rose-300'
                                : 'bg-amber-900/50 text-amber-300'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {issue.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                          <span className="text-slate-400">{issue.suggestedAction}</span>
                          {issue.recommendedVerbs && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {issue.recommendedVerbs.map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => handleApplyVerb(issue.coCode, v)}
                                  className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-700/50 text-blue-300 hover:text-white hover:bg-blue-800/50 font-mono transition-colors cursor-pointer"
                                  title={`Replace leading verb with "${v}"`}
                                >
                                  + Use "{v}"
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Strengths & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#0e121c] border border-[#1e2436] space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Curriculum Strengths
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="leading-relaxed">{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#0e121c] border border-[#1e2436] space-y-2">
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Accreditation Suggestions
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Course Outcome Statement Generator */}
              <div className="p-5 rounded-lg bg-[#0e121c] border border-[#21283d] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Draft New Course Outcome with Bloom's Taxonomy
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">Assisted Drafting</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Bloom's Level</label>
                    <select
                      value={genTargetLevel}
                      onChange={e => setGenTargetLevel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#141826] border border-[#252f48] rounded text-xs text-white focus:outline-none"
                    >
                      {annexureData.bloomsLevels.map(b => (
                        <option key={b.level} value={b.level}>
                          {b.level} - {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Topic / Technical Focus</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={genTopic}
                        onChange={e => setGenTopic(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-[#141826] border border-[#252f48] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Distributed Consensus protocols (Raft/Paxos)"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateCOStatement}
                        disabled={isGeneratingDraft}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white rounded shrink-0 transition-colors"
                      >
                        {isGeneratingDraft ? 'Drafting...' : 'Generate Statement'}
                      </button>
                    </div>
                  </div>
                </div>

                {generatedDraft && (
                  <div className="mt-3 p-3.5 rounded bg-[#131726] border border-purple-800/40 space-y-2">
                    <div className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider">
                      Proposed Outcome Statement ({genTargetLevel}):
                    </div>
                    <p className="text-xs text-slate-100 font-medium leading-relaxed">
                      "{generatedDraft}"
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setGeneratedDraft('')}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleAppendGeneratedCO}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Append as CO{course.courseOutcomes.length + 1}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1c2234] bg-[#0c0f18] flex items-center justify-between text-xs text-slate-400">
          <span>All requests authenticated with <code className="text-blue-300">x-llm-*</code> protocol headers</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#141826] hover:bg-[#1b2134] text-slate-200 rounded border border-[#262f48] transition-colors"
          >
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
}
