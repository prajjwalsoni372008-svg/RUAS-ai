import React, { useRef } from 'react';
import { CourseSpecification } from '../types';
import { annexureData } from '../annexureData';
import { Printer, Download, Copy, Check, X, FileText, CheckCircle2 } from 'lucide-react';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseSpecification;
}

export default function ExportDossierModal({
  isOpen,
  onClose,
  course
}: ExportDossierModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const poList = annexureData.programOutcomes;
  const psoList = annexureData.programSpecificOutcomes;
  const matrix = course.matrix || {};

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(course, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${course.code}_SAR_Specification.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    let md = `# ${course.code}: ${course.title}\n`;
    md += `**Department:** ${course.department} | **Regulation:** ${course.regulation} | **Credits:** ${course.credits.L}-${course.credits.T}-${course.credits.P}-${course.credits.C}\n\n`;
    md += `## Course Learning Outcomes (CLOs)\n`;
    course.courseOutcomes.forEach(co => {
      md += `- **${co.code}** (${co.bloomsLevel}): ${co.statement} [Target: ${co.targetAttainment}%]\n`;
    });
    md += `\n## Articulation Matrix (CO-PO / CO-PSO)\n`;
    md += `| CO | ${poList.map(p => p.code).join(' | ')} | ${psoList.map(p => p.code).join(' | ')} |\n`;
    md += `|---|${poList.map(() => '---').join('|')}|${psoList.map(() => '---').join('|')}|\n`;
    course.courseOutcomes.forEach(co => {
      const poVals = poList.map(p => matrix[co.code]?.[p.code] || '-');
      const psoVals = psoList.map(p => matrix[co.code]?.[p.code] || '-');
      md += `| ${co.code} | ${poVals.join(' | ')} | ${psoVals.join(' | ')} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#090b12] text-slate-100 rounded-lg border border-[#22283b] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Actions Bar */}
        <div className="px-6 py-4 border-b border-[#1c2234] flex items-center justify-between bg-[#0e121d] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-950/70 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                Official SAR Dossier Preview (NBA Section 2.2)
              </h2>
              <p className="text-xs text-slate-400">Autonomous syllabus specification format for accreditation audits</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs rounded bg-[#141826] border border-[#252f48] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy MD'}
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 text-xs rounded bg-[#141826] border border-[#252f48] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs rounded bg-blue-600 hover:bg-blue-500 font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-black text-slate-100 font-sans print:p-0 print:bg-white print:text-black">
          {/* Institutional Letterhead */}
          <div className="text-center pb-6 border-b border-[#22283b] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Department of Computer Science & Engineering
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Course Specification & Accreditation Dossier
            </h1>
            <div className="text-xs text-slate-400">
              Autonomous Curriculum Framework · {course.regulation} · Academic Year {course.academicYear}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-[#0d101a] border border-[#1e2436] text-xs">
            <div>
              <span className="text-slate-500 block">Course Code</span>
              <span className="font-mono font-bold text-white text-sm">{course.code}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Course Title</span>
              <span className="font-semibold text-white">{course.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Credit Structure</span>
              <span className="font-mono font-bold text-blue-300">L:{course.credits.L} T:{course.credits.T} P:{course.credits.P} (C: {course.credits.C})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Contact Hours</span>
              <span className="font-mono font-bold text-white">{course.totalContactHours} Hours</span>
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Course Rationale & Description</h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {course.description}
            </p>
          </div>

          {/* Section 1: Course Learning Outcomes */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              1. Course Learning Outcomes (CLOs)
            </h3>
            <table className="w-full text-xs border border-[#1e2436] border-collapse">
              <thead>
                <tr className="bg-[#111522] text-slate-300 text-left border-b border-[#1e2436]">
                  <th className="p-2 w-16 border-r border-[#1e2436]">Code</th>
                  <th className="p-2 border-r border-[#1e2436]">Outcome Statement</th>
                  <th className="p-2 w-20 text-center border-r border-[#1e2436]">Bloom's</th>
                  <th className="p-2 w-24 text-right">Target (%)</th>
                </tr>
              </thead>
              <tbody>
                {course.courseOutcomes.map((co) => (
                  <tr key={co.code} className="border-b border-[#1e2436]">
                    <td className="p-2 font-mono font-bold text-blue-300 border-r border-[#1e2436]">{co.code}</td>
                    <td className="p-2 text-slate-200 border-r border-[#1e2436]">{co.statement}</td>
                    <td className="p-2 text-center font-mono text-slate-300 border-r border-[#1e2436]">{co.bloomsLevel}</td>
                    <td className="p-2 text-right font-mono text-emerald-400 font-bold">{co.targetAttainment}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: CO-PO Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              2. Articulation Matrix (CO-PO & CO-PSO Mapping)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-[#1e2436] border-collapse text-center font-mono">
                <thead>
                  <tr className="bg-[#111522] text-slate-300 border-b border-[#1e2436]">
                    <th className="p-2 text-left w-14 border-r border-[#1e2436]">CO</th>
                    {poList.map(p => (
                      <th key={p.code} className="p-1 border-r border-[#1e2436] text-[11px] text-blue-300">{p.code}</th>
                    ))}
                    {psoList.map(p => (
                      <th key={p.code} className="p-1 border-r border-[#1e2436] text-[11px] text-teal-300">{p.code}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {course.courseOutcomes.map((co) => (
                    <tr key={co.code} className="border-b border-[#1e2436]">
                      <td className="p-2 text-left font-bold text-slate-200 border-r border-[#1e2436]">{co.code}</td>
                      {poList.map(p => {
                        const val = matrix[co.code]?.[p.code] || 0;
                        return (
                          <td key={p.code} className="p-1 border-r border-[#1e2436]">
                            {val === 0 ? '-' : val}
                          </td>
                        );
                      })}
                      {psoList.map(p => {
                        const val = matrix[co.code]?.[p.code] || 0;
                        return (
                          <td key={p.code} className="p-1 border-r border-[#1e2436]">
                            {val === 0 ? '-' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-slate-500 italic">
              Scale: 1 = Slight/Low, 2 = Moderate/Medium, 3 = Substantial/High, '-' = No Correlation
            </div>
          </div>

          {/* Section 3: Modular Topics Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              3. Modular Units Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              {course.modules.map(m => (
                <div key={m.moduleNo} className="p-3 rounded bg-[#0d101a] border border-[#1e2436] space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Unit {m.moduleNo}: {m.title}</span>
                    <span className="font-mono text-blue-300">{m.hours} Hours · {m.bloomFocus}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {m.topics.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Approval Stamp */}
          <div className="pt-6 border-t border-[#1e2436] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="space-y-1">
              <div>Lead Course Author: <span className="text-white font-medium">{course.lastModifiedBy}</span></div>
              <div>Revision Date: <span className="font-mono text-slate-300">{course.lastModified}</span></div>
            </div>

            {course.approvalInfo ? (
              <div className="p-3 rounded bg-emerald-950/20 border border-emerald-700/40 text-right space-y-0.5">
                <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Executive HOD Approval
                </div>
                <div className="text-white font-medium">{course.approvalInfo.approvedBy}</div>
                <div className="font-mono text-[10px] text-emerald-300">{course.approvalInfo.digitalSignature}</div>
              </div>
            ) : (
              <div className="text-amber-400 italic font-mono text-[11px]">
                Pending Formal Departmental Sign-off
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
