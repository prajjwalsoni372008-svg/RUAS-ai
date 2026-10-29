import React, { useState } from 'react';
import { annexureData } from '../annexureData';
import { BookOpen, X, Search, CheckCircle2, Award, Layers, Hash } from 'lucide-react';

interface AnnexureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'po' | 'pso' | 'blooms' | 'scales';
}

export default function AnnexureDrawer({ isOpen, onClose, initialTab = 'po' }: AnnexureDrawerProps) {
  const [activeTab, setActiveTab] = useState<'po' | 'pso' | 'blooms' | 'scales'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1800);
  };

  const filteredPOs = annexureData.programOutcomes.filter(po => {
    const q = searchQuery.toLowerCase();
    return po.code.toLowerCase().includes(q) ||
      po.title.toLowerCase().includes(q) ||
      po.focus.toLowerCase().includes(q) ||
      po.statement.toLowerCase().includes(q);
  });

  const filteredPSOs = annexureData.programSpecificOutcomes.filter(pso => {
    const q = searchQuery.toLowerCase();
    return pso.code.toLowerCase().includes(q) ||
      pso.title.toLowerCase().includes(q) ||
      pso.focus.toLowerCase().includes(q) ||
      pso.statement.toLowerCase().includes(q);
  });

  const filteredBlooms = annexureData.bloomsLevels.filter(b => {
    const q = searchQuery.toLowerCase();
    return b.level.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.descriptor.toLowerCase().includes(q) ||
      b.actionVerbs.some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-3xl bg-[#090b12] text-slate-100 h-full border-l border-[#22273a] flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#1e2436] flex items-center justify-between bg-[#0e111b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Annexure A: Reference Standards</h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#181d2e] border border-[#2a324a] text-blue-300 font-mono">
                  {annexureData.accreditationBoard.split('&')[0].trim()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{annexureData.program}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#181d2e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="px-6 pt-3 pb-3 border-b border-[#1c2234] bg-[#0c0f18] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#121624] rounded border border-[#232a3e]">
            <button
              onClick={() => setActiveTab('po')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'po'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              POs (PO1–PO12)
            </button>
            <button
              onClick={() => setActiveTab('pso')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'pso'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PSOs (PSO1–PSO3)
            </button>
            <button
              onClick={() => setActiveTab('blooms')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'blooms'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bloom's Taxonomy (L1–L6)
            </button>
            <button
              onClick={() => setActiveTab('scales')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'scales'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matrix Scales
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search statements or action verbs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#121624] border border-[#232a3e] rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {copiedVerb && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-950 border border-emerald-700/60 text-emerald-200 text-xs px-3 py-1.5 rounded flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Copied verb "{copiedVerb}" to clipboard
            </div>
          )}

          {/* TAB 1: Program Outcomes (PO1 to PO12) */}
          {activeTab === 'po' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 pb-1">
                Engineering Graduate Attributes mandated by NBA (Washington Accord Tier-1). Loaded directly from <code className="text-blue-300 font-mono">config/po_pso.json</code>.
              </div>
              {filteredPOs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">No matching Program Outcomes found.</div>
              ) : (
                filteredPOs.map((po) => (
                  <div
                    key={po.code}
                    className="p-4 rounded-lg bg-[#0e111c] border border-[#20263b] hover:border-[#2f3956] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-blue-950/70 border border-blue-800/40 text-blue-300">
                          {po.code}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-100">{po.title}</h3>
                      </div>
                      <span className="text-[11px] text-slate-400 italic">
                        {po.focus}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 font-normal">
                      {po.statement}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Program Specific Outcomes (PSO1 to PSO3) */}
          {activeTab === 'pso' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 pb-1">
                Departmental specialization outcomes for Computer Science and Engineering curriculum.
              </div>
              {filteredPSOs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">No matching PSOs found.</div>
              ) : (
                filteredPSOs.map((pso) => (
                  <div
                    key={pso.code}
                    className="p-4 rounded-lg bg-[#0e111c] border border-[#20263b] hover:border-[#2f3956] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-teal-950/70 border border-teal-800/40 text-teal-300">
                          {pso.code}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-100">{pso.title}</h3>
                      </div>
                      <span className="text-[11px] text-slate-400 italic">
                        {pso.focus}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 font-normal">
                      {pso.statement}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Bloom's Revised Taxonomy (L1 to L6) */}
          {activeTab === 'blooms' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 pb-1">
                Cognitive Process Dimensions (Anderson & Krathwohl). Click any action verb to copy into your course outcome statement.
              </div>
              {filteredBlooms.map((bloom) => {
                const colors: Record<string, { badge: string; border: string }> = {
                  L1: { badge: 'bg-slate-900 border-slate-700 text-slate-300', border: 'border-slate-800' },
                  L2: { badge: 'bg-sky-950/60 border-sky-800/50 text-sky-300', border: 'border-sky-900/30' },
                  L3: { badge: 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300', border: 'border-emerald-900/30' },
                  L4: { badge: 'bg-amber-950/60 border-amber-800/50 text-amber-300', border: 'border-amber-900/30' },
                  L5: { badge: 'bg-orange-950/60 border-orange-800/50 text-orange-300', border: 'border-orange-900/30' },
                  L6: { badge: 'bg-purple-950/60 border-purple-800/50 text-purple-300', border: 'border-purple-900/30' }
                };
                const scheme = colors[bloom.level] || colors.L3;

                return (
                  <div
                    key={bloom.level}
                    className={`p-4 rounded-lg bg-[#0e111c] border ${scheme.border} space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-xs font-semibold border ${scheme.badge}`}>
                          {bloom.level}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100">{bloom.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400">Level {bloom.level.replace('L', '')} of 6</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {bloom.descriptor}
                    </p>

                    <div>
                      <div className="text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                        Approved Action Verbs (Click to copy):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {bloom.actionVerbs.map((verb) => (
                          <button
                            key={verb}
                            type="button"
                            onClick={() => handleCopyVerb(verb)}
                            className="text-xs px-2 py-1 rounded bg-[#131726] border border-[#232b40] text-slate-200 hover:text-white hover:border-blue-500 hover:bg-[#1a2034] transition-colors font-mono cursor-pointer"
                            title={`Click to copy "${verb}"`}
                          >
                            {verb}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: Correlation Scales */}
          {activeTab === 'scales' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 pb-1">
                Standard NBA 4-tier articulation weights for CO-PO & CO-PSO correlation matrices.
              </div>
              <div className="grid grid-cols-1 gap-3">
                {annexureData.correlationScales.map((scale) => (
                  <div
                    key={scale.value}
                    className="p-4 rounded-lg bg-[#0e111c] border border-[#20263b] flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-md bg-[#161a29] border border-[#28324a] flex items-center justify-center text-lg font-bold font-mono text-blue-400 shrink-0">
                      {scale.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{scale.label}</h4>
                        <span className="text-[11px] font-mono text-slate-400">Weight: {scale.value}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {scale.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-[#1e2436] bg-[#0c0f18] flex items-center justify-between text-xs text-slate-400">
          <span>Source: National Board of Accreditation & Washington Accord Reference Manual</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#161a29] hover:bg-[#1f253a] text-slate-200 rounded border border-[#262f46] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
