import React, { useState } from 'react';
import { CourseSpecification, UserRole, ROLE_CONFIGS } from '../types';
import { annexureData } from '../annexureData';
import { 
  HelpCircle, MessageSquare, AlertCircle, Info, Filter, 
  RotateCcw, Sparkles, Check, ChevronDown, CheckCircle2 
} from 'lucide-react';

interface MatrixViewProps {
  course: CourseSpecification;
  role: UserRole;
  onUpdateCourse: (updated: CourseSpecification) => void;
  onOpenAnnexure: () => void;
  onOpenAIAudit: () => void;
}

export default function MatrixView({
  course,
  role,
  onUpdateCourse,
  onOpenAnnexure,
  onOpenAIAudit
}: MatrixViewProps) {
  const permissions = ROLE_CONFIGS[role];
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [highlightLevel, setHighlightLevel] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ co: string; po: string } | null>(null);
  const [justificationInput, setJustificationInput] = useState('');

  const poList = annexureData.programOutcomes;
  const psoList = annexureData.programSpecificOutcomes;
  const allOutcomeCodes = [...poList.map(p => p.code), ...psoList.map(p => p.code)];

  const matrix = course.matrix || {};
  const justifications = course.matrixJustifications || {};

  // Handle weight change
  const setCellWeight = (coCode: string, poCode: string, newWeight: number) => {
    if (!permissions.canEditMatrix) return;
    const updatedMatrix = { ...matrix };
    if (!updatedMatrix[coCode]) {
      updatedMatrix[coCode] = {};
    }
    updatedMatrix[coCode] = {
      ...updatedMatrix[coCode],
      [poCode]: newWeight
    };

    onUpdateCourse({
      ...course,
      matrix: updatedMatrix,
      lastModified: new Date().toISOString().split('T')[0]
    });
  };

  // Open Justification Editor
  const openJustification = (coCode: string, poCode: string) => {
    setSelectedCell({ co: coCode, po: poCode });
    setJustificationInput(justifications[coCode]?.[poCode] || '');
  };

  const saveJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCell) return;
    const { co, po } = selectedCell;
    const updatedJustifications = { ...justifications };
    if (!updatedJustifications[co]) {
      updatedJustifications[co] = {};
    }
    if (justificationInput.trim()) {
      updatedJustifications[co][po] = justificationInput.trim();
    } else {
      delete updatedJustifications[co][po];
    }

    onUpdateCourse({
      ...course,
      matrixJustifications: updatedJustifications
    });
    setSelectedCell(null);
  };

  // Calculate PO column average
  const calculateColumnAvg = (poCode: string): string => {
    let sum = 0;
    let count = 0;
    course.courseOutcomes.forEach(co => {
      const val = matrix[co.code]?.[poCode] || 0;
      if (val > 0) {
        sum += val;
        count += 1;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  // Calculate CO row average
  const calculateRowAvg = (coCode: string): string => {
    let sum = 0;
    let count = 0;
    allOutcomeCodes.forEach(code => {
      const val = matrix[coCode]?.[code] || 0;
      if (val > 0) {
        sum += val;
        count += 1;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  // Unmapped PO count
  const unmappedPOs = poList.filter(po => {
    return !course.courseOutcomes.some(co => (matrix[co.code]?.[po.code] || 0) > 0);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 relative overflow-hidden academic-doc">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{course.code}</span>
              <span>·</span>
              <span>NBA Washington Accord Tier-1 Articulation Matrix</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Course Outcomes to Program Outcomes (CO–PO & CO–PSO) Matrix
            </h1>
            <p className="text-xs text-slate-300">
              Correlation weights range from 1 (Slight) to 3 (Substantial). Hover headers to view official Annexure A statements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#121624] p-1 rounded border border-[#232a3e] text-xs">
              <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-500" />
                Filter:
              </span>
              <button
                onClick={() => setHighlightLevel(highlightLevel === 3 ? null : 3)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  highlightLevel === 3
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High (3)
              </button>
              <button
                onClick={() => setHighlightLevel(highlightLevel === 0 ? null : 0)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  highlightLevel === 0
                    ? 'bg-rose-950/70 border border-rose-700/60 text-rose-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Unmapped ({unmappedPOs.length})
              </button>
              {highlightLevel !== null && (
                <button
                  onClick={() => setHighlightLevel(null)}
                  className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={onOpenAnnexure}
              className="px-3 py-1.5 text-xs rounded bg-[#131726] border border-[#222a3e] text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Annexure A Ref
            </button>
            <button
              onClick={onOpenAIAudit}
              className="px-3 py-1.5 text-xs rounded bg-blue-950/40 border border-blue-700/50 text-blue-300 hover:bg-blue-900/40 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Matrix Audit
            </button>
          </div>
        </div>

        {/* Warning if any PO is completely unmapped */}
        {unmappedPOs.length > 0 && (
          <div className="mt-4 p-3 rounded bg-amber-950/30 border border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-semibold text-amber-200">NBA Accreditation Notice: </span>
              {unmappedPOs.length} Program Outcome(s) ({unmappedPOs.map(p => p.code).join(', ')}) currently have zero articulation across all Course Outcomes.
            </div>
          </div>
        )}
      </div>

      {/* Main Articulation Matrix Grid */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-4 academic-doc overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-xs select-none min-w-[960px]">
            <thead>
              {/* Top grouping row */}
              <tr className="bg-[#0e121d] border-b border-[#22293e]">
                <th
                  colSpan={2}
                  className="p-2.5 text-left font-semibold text-slate-400 border-r border-[#22293e] uppercase tracking-wider text-[10px]"
                >
                  Course Outcomes
                </th>
                <th
                  colSpan={12}
                  className="p-2.5 text-center font-semibold text-blue-300 border-r border-[#22293e] uppercase tracking-wider text-[10px] bg-blue-950/20"
                >
                  Program Outcomes (PO1 – PO12) · Graduate Attributes
                </th>
                <th
                  colSpan={3}
                  className="p-2.5 text-center font-semibold text-teal-300 border-r border-[#22293e] uppercase tracking-wider text-[10px] bg-teal-950/20"
                >
                  Program Specific Outcomes (PSO1 – PSO3)
                </th>
                <th
                  className="p-2.5 text-center font-semibold text-slate-400 uppercase tracking-wider text-[10px]"
                >
                  Avg
                </th>
              </tr>

              {/* Specific column headers */}
              <tr className="bg-[#121624] border-b border-[#22293e] text-slate-300 font-mono">
                <th className="p-2 text-left font-semibold w-16 border-r border-[#22293e]">CO Code</th>
                <th className="p-2 text-center font-semibold w-14 border-r border-[#22293e]">Level</th>

                {/* PO1 - PO12 */}
                {poList.map(po => (
                  <th
                    key={po.code}
                    className="p-2 text-center font-bold relative group cursor-pointer hover:bg-blue-950/40 transition-colors border-r border-[#1a2033]"
                    onMouseEnter={() => setActiveTooltip(po.code)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <span className="text-blue-300">{po.code}</span>
                    
                    {/* Rich Tooltip Popover from config/po_pso.json */}
                    {activeTooltip === po.code && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#0a0d17] border border-blue-500/50 rounded-lg shadow-2xl text-left font-sans pointer-events-none normal-case">
                        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#1f263c]">
                          <span className="font-mono text-xs font-bold text-blue-300">{po.code}: {po.title}</span>
                          <span className="text-[10px] text-slate-400">{po.focus}</span>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                          {po.statement}
                        </p>
                      </div>
                    )}
                  </th>
                ))}

                {/* PSO1 - PSO3 */}
                {psoList.map(pso => (
                  <th
                    key={pso.code}
                    className="p-2 text-center font-bold relative group cursor-pointer hover:bg-teal-950/40 transition-colors border-r border-[#1a2033]"
                    onMouseEnter={() => setActiveTooltip(pso.code)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <span className="text-teal-300">{pso.code}</span>

                    {/* Rich Tooltip Popover from config/po_pso.json */}
                    {activeTooltip === pso.code && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#0a0d17] border border-teal-500/50 rounded-lg shadow-2xl text-left font-sans pointer-events-none normal-case">
                        <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#1f263c]">
                          <span className="font-mono text-xs font-bold text-teal-300">{pso.code}: {pso.title}</span>
                          <span className="text-[10px] text-slate-400">{pso.focus}</span>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                          {pso.statement}
                        </p>
                      </div>
                    )}
                  </th>
                ))}

                <th className="p-2 text-center font-semibold text-slate-400">Mean</th>
              </tr>
            </thead>

            <tbody>
              {course.courseOutcomes.map((co, rIdx) => {
                const bloomsInfo = annexureData.bloomsLevels.find(b => b.level === co.bloomsLevel);
                const isEven = rIdx % 2 === 0;

                return (
                  <tr
                    key={co.code}
                    className={`border-b border-[#1a2032] ${isEven ? 'bg-[#090c15]' : 'bg-[#0e121e]'} hover:bg-[#141a2a] transition-colors`}
                  >
                    {/* CO Code */}
                    <td className="p-2 font-mono font-bold text-slate-200 border-r border-[#1e2538]">
                      {co.code}
                    </td>

                    {/* Bloom Level */}
                    <td className="p-2 text-center border-r border-[#1e2538]">
                      <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold bg-[#161c2c] border border-[#252f48] text-slate-300">
                        {co.bloomsLevel}
                      </span>
                    </td>

                    {/* PO1 - PO12 Cells */}
                    {poList.map(po => {
                      const val = matrix[co.code]?.[po.code] || 0;
                      const hasJustification = Boolean(justifications[co.code]?.[po.code]);
                      const isTargetHighlight = highlightLevel !== null && (
                        highlightLevel === 0 ? val === 0 : val === highlightLevel
                      );

                      return (
                        <td
                          key={po.code}
                          className={`p-1 text-center font-mono relative border-r border-[#171d2e] matrix-cell ${
                            isTargetHighlight ? 'ring-1 ring-amber-400/80 bg-amber-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-center relative">
                            {permissions.canEditMatrix ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextVal = (val + 1) % 4;
                                  setCellWeight(co.code, po.code, nextVal);
                                }}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  openJustification(co.code, po.code);
                                }}
                                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-transform active:scale-90 cursor-pointer ${
                                  val === 3
                                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50 shadow-sm'
                                    : val === 2
                                    ? 'bg-blue-900/20 text-blue-300 border border-blue-700/30'
                                    : val === 1
                                    ? 'bg-slate-800/40 text-slate-300 border border-slate-700/30'
                                    : 'text-slate-600 hover:text-slate-400 hover:bg-[#161c2a]'
                                }`}
                                title={`Click to cycle weight (Current: ${val}). Right click to edit justification.`}
                              >
                                {val === 0 ? '-' : val}
                              </button>
                            ) : (
                              <span
                                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${
                                  val === 3
                                    ? 'text-blue-300 bg-blue-950/40'
                                    : val === 2
                                    ? 'text-blue-400'
                                    : val === 1
                                    ? 'text-slate-400'
                                    : 'text-slate-600'
                                }`}
                              >
                                {val === 0 ? '-' : val}
                              </span>
                            )}

                            {/* Justification Indicator Dot */}
                            {hasJustification && (
                              <button
                                onClick={() => openJustification(co.code, po.code)}
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 hover:scale-125 transition-transform"
                                title={`Justification recorded: "${justifications[co.code][po.code]}"`}
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* PSO1 - PSO3 Cells */}
                    {psoList.map(pso => {
                      const val = matrix[co.code]?.[pso.code] || 0;
                      const hasJustification = Boolean(justifications[co.code]?.[pso.code]);
                      const isTargetHighlight = highlightLevel !== null && (
                        highlightLevel === 0 ? val === 0 : val === highlightLevel
                      );

                      return (
                        <td
                          key={pso.code}
                          className={`p-1 text-center font-mono relative border-r border-[#171d2e] matrix-cell ${
                            isTargetHighlight ? 'ring-1 ring-amber-400/80 bg-amber-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-center relative">
                            {permissions.canEditMatrix ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextVal = (val + 1) % 4;
                                  setCellWeight(co.code, pso.code, nextVal);
                                }}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  openJustification(co.code, pso.code);
                                }}
                                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-transform active:scale-90 cursor-pointer ${
                                  val === 3
                                    ? 'bg-teal-600/30 text-teal-200 border border-teal-500/50 shadow-sm'
                                    : val === 2
                                    ? 'bg-teal-900/20 text-teal-300 border border-teal-700/30'
                                    : val === 1
                                    ? 'bg-slate-800/40 text-slate-300 border border-slate-700/30'
                                    : 'text-slate-600 hover:text-slate-400 hover:bg-[#161c2a]'
                                }`}
                                title={`Click to cycle weight (Current: ${val}). Right click to edit justification.`}
                              >
                                {val === 0 ? '-' : val}
                              </button>
                            ) : (
                              <span
                                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${
                                  val === 3
                                    ? 'text-teal-300 bg-teal-950/40'
                                    : val === 2
                                    ? 'text-teal-400'
                                    : val === 1
                                    ? 'text-slate-400'
                                    : 'text-slate-600'
                                }`}
                              >
                                {val === 0 ? '-' : val}
                              </span>
                            )}

                            {hasJustification && (
                              <button
                                onClick={() => openJustification(co.code, pso.code)}
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 hover:scale-125 transition-transform"
                                title={`Justification recorded: "${justifications[co.code][pso.code]}"`}
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Row Average */}
                    <td className="p-2 text-center font-mono font-bold text-slate-300">
                      {calculateRowAvg(co.code)}
                    </td>
                  </tr>
                );
              })}

              {/* Bottom Calculation Row: Column Averages */}
              <tr className="bg-[#121624] border-t-2 border-[#2b354e] font-mono text-slate-200 font-bold">
                <td colSpan={2} className="p-2.5 text-left border-r border-[#22293e] text-slate-300 font-sans text-xs">
                  Target Articulation Average (Direct Attainment)
                </td>

                {poList.map(po => {
                  const avg = calculateColumnAvg(po.code);
                  return (
                    <td
                      key={po.code}
                      className={`p-2 text-center border-r border-[#1d2336] ${
                        avg === '-' ? 'text-slate-600' : 'text-blue-300'
                      }`}
                    >
                      {avg}
                    </td>
                  );
                })}

                {psoList.map(pso => {
                  const avg = calculateColumnAvg(pso.code);
                  return (
                    <td
                      key={pso.code}
                      className={`p-2 text-center border-r border-[#1d2336] ${
                        avg === '-' ? 'text-slate-600' : 'text-teal-300'
                      }`}
                    >
                      {avg}
                    </td>
                  );
                })}

                <td className="p-2 text-center text-emerald-400 font-mono">
                  {/* Overall matrix mean */}
                  {(
                    course.courseOutcomes.reduce((acc, co) => {
                      const rAvg = parseFloat(calculateRowAvg(co.code));
                      return isNaN(rAvg) ? acc : acc + rAvg;
                    }, 0) / (course.courseOutcomes.length || 1)
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Matrix Legend & Controls Guide */}
        <div className="mt-4 pt-3 border-t border-[#1c2234] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-300">Correlation Scale:</span>
            {annexureData.correlationScales.map(scale => (
              <div key={scale.value} className="flex items-center gap-1.5 font-mono">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold ${
                  scale.value === 3
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50'
                    : scale.value === 2
                    ? 'bg-blue-900/20 text-blue-300 border border-blue-700/30'
                    : scale.value === 1
                    ? 'bg-slate-800/40 text-slate-300 border border-slate-700/30'
                    : 'text-slate-600 bg-[#121624]'
                }`}>
                  {scale.symbol}
                </span>
                <span className="font-sans text-slate-400">{scale.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Green dot indicates justified correlation rationale</span>
          </div>
        </div>
      </div>

      {/* Justification Editor Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0e17] text-slate-100 rounded-lg border border-[#22283b] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2234]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">
                  Articulation Justification: {selectedCell.co} ➔ {selectedCell.po}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Annexure A definition preview for this target PO */}
            {(() => {
              const targetPo = poList.find(p => p.code === selectedCell.po) ||
                psoList.find(p => p.code === selectedCell.po);
              return targetPo ? (
                <div className="p-3 bg-[#111522] border border-[#21283c] rounded text-xs text-slate-300">
                  <span className="font-semibold text-blue-300 font-mono">{targetPo.code} ({targetPo.title}): </span>
                  <span className="text-slate-400">{targetPo.statement}</span>
                </div>
              ) : null;
            })()}

            <form onSubmit={saveJustification} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Accreditation Rationale & Evidence
                </label>
                <textarea
                  value={justificationInput}
                  onChange={e => setJustificationInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#121624] border border-[#232b40] rounded text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  placeholder="Explain how course assessments, assignments, or lab experiments measure this outcome..."
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  NBA evaluators review these justifications to substantiate correlation weights &gt; 1.
                </p>
              </div>

              <div className="pt-3 border-t border-[#1c2234] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setJustificationInput('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Clear Justification
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCell(null)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded shadow-sm"
                  >
                    Save Justification
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
