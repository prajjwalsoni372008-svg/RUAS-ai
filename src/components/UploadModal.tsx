import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, X, ChevronDown, 
  ChevronRight, Copy, Check, Sparkles, RefreshCw, Edit3, Layers, BookOpen 
} from 'lucide-react';
import { CourseSpecification } from '../types';
import { getLlmHeaders } from '../api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseImported: (course: CourseSpecification) => void;
}

export default function UploadModal({ isOpen, onClose, onCourseImported }: UploadModalProps) {
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Editable Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formCredits, setFormCredits] = useState('3:0:2');
  const [formCourseType, setFormCourseType] = useState('Professional Core');
  const [formDescription, setFormDescription] = useState('');

  const specInputRef = useRef<HTMLInputElement>(null);
  const blueprintInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSpecSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSpecFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleBlueprintSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBlueprintFile(e.target.files[0]);
    }
  };

  const handleParseUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specFile) {
      setErrorMessage('Please select a course specification file (.docx, .pdf, .html, or .doc).');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('spec', specFile);
    if (blueprintFile) {
      formData.append('blueprint', blueprintFile);
    }

    try {
      const headers = getLlmHeaders();
      // Remove content-type so browser sets multipart boundary
      delete (headers as any)['Content-Type'];

      const response = await fetch('/api/v1/parse', {
        method: 'POST',
        headers,
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to parse document.');
      }

      const data = result.data;
      setParsedData(data);

      // Populate editable fields
      setFormCode(data.courseCode || 'CS302');
      setFormTitle(data.title || 'Course Title');
      setFormDepartment(data.department || 'Computer Science and Engineering');
      setFormCredits(data.credits || '3:0:2');
      setFormCourseType(data.courseType || 'Professional Core');
      setFormDescription(data.description || '');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server extraction error. Please verify the document format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyJson = () => {
    if (!parsedData) return;
    navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleApplyToWorkspace = () => {
    if (!parsedData) return;

    // Parse L:T:P
    const parts = formCredits.split(':').map(n => parseInt(n.trim(), 10) || 0);
    const l = parts[0] ?? 3;
    const t = parts[1] ?? 0;
    const p = parts[2] ?? 2;
    const c = l + t + Math.round(p / 2);

    const newCourse: CourseSpecification = {
      id: `imported-${Date.now()}`,
      code: formCode.trim() || parsedData.courseCode,
      title: formTitle.trim() || parsedData.title,
      department: formDepartment.trim() || parsedData.department,
      semester: 'V Semester B.Tech',
      academicYear: '2026-2027',
      regulation: 'R-2024 Autonomy',
      courseType: formCourseType,
      credits: { L: l, T: t, P: p, C: c },
      totalContactHours: (l + t + p) * 15,
      prerequisites: ['Data Structures', 'Discrete Mathematics'],
      description: formDescription || parsedData.description || '',
      status: 'Under Review',
      version: 'v1.0-Imported',
      lastModified: new Date().toISOString().split('T')[0],
      lastModifiedBy: 'Document Ingestion Parser',
      courseOutcomes: (parsedData.courseOutcomes || []).map((co: any) => ({
        code: co.code || 'CO1',
        statement: co.statement || '',
        bloomsLevel: co.bloomsLevel || 'L3',
        targetAttainment: co.targetAttainment || 75,
        deliveryMethods: ['Classroom Lecture', 'Problem Solving'],
        assessmentMethods: ['Continuous Internal Assessment', 'Semester End Exam']
      })),
      modules: (parsedData.units || []).map((u: any) => ({
        moduleNo: u.unitNo || 1,
        title: u.title || `Unit ${u.unitNo}`,
        hours: u.hours || 12,
        topics: typeof u.content === 'string' ? u.content.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean) : [],
        outcomesAddressed: u.outcomesAddressed || [],
        bloomFocus: u.bloomFocus || 'L3 (Applying)'
      })),
      matrix: parsedData.coPoMap || {},
      matrixJustifications: {},
      books: {
        textbooks: parsedData.resources?.textbooks || [],
        referenceBooks: parsedData.resources?.referenceBooks || [],
        webResources: parsedData.resources?.webResources || []
      },
      reviewLogs: []
    };

    onCourseImported(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#090b12] text-slate-100 rounded-lg border border-[#22283b] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1c2234] flex items-center justify-between bg-[#0e121d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-950/70 border border-blue-700/50 flex items-center justify-center text-blue-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                Import Existing Course Specification & Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                Server-side extraction via Mammoth, pdf-parse, Cheerio, & WordExtractor with Zod validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#161a29] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Form */}
          <form onSubmit={handleParseUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Specification File (Required) */}
              <div
                onClick={() => specInputRef.current?.click()}
                className={`p-5 rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                  specFile
                    ? 'border-blue-500 bg-blue-950/20'
                    : 'border-[#222a3e] bg-[#0d101a] hover:border-slate-500 hover:bg-[#101422]'
                }`}
              >
                <input
                  type="file"
                  ref={specInputRef}
                  onChange={handleSpecSelect}
                  accept=".docx,.pdf,.html,.htm,.doc"
                  className="hidden"
                />
                <FileText className={`w-8 h-8 mb-2 ${specFile ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold text-white mb-0.5">
                  {specFile ? specFile.name : 'Course Specification Document *'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {specFile
                    ? `${(specFile.size / 1024).toFixed(1)} KB · Ready to parse`
                    : 'Required: .docx, .pdf, .html, or .doc'}
                </div>
              </div>

              {/* Question-Paper Blueprint (Optional) */}
              <div
                onClick={() => blueprintInputRef.current?.click()}
                className={`p-5 rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                  blueprintFile
                    ? 'border-purple-500 bg-purple-950/20'
                    : 'border-[#222a3e] bg-[#0d101a] hover:border-slate-500 hover:bg-[#101422]'
                }`}
              >
                <input
                  type="file"
                  ref={blueprintInputRef}
                  onChange={handleBlueprintSelect}
                  accept=".docx,.pdf,.html,.htm,.doc"
                  className="hidden"
                />
                <Sparkles className={`w-8 h-8 mb-2 ${blueprintFile ? 'text-purple-400' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold text-white mb-0.5">
                  {blueprintFile ? blueprintFile.name : 'Question-Paper Blueprint (Optional)'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {blueprintFile
                    ? `${(blueprintFile.size / 1024).toFixed(1)} KB · Attached`
                    : 'Optional: Exam blueprint or assessment rubrics'}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Extraction Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">
                Dispatches to POST /api/v1/parse
              </span>
              <button
                type="submit"
                disabled={isUploading || !specFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Extracting & Validating with Zod...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Extract Structured Data
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Section (Editable Form + Collapsible JSON) */}
          {parsedData && (
            <div className="space-y-6 pt-4 border-t border-[#1c2234]">
              {/* Extraction Success Banner */}
              <div className="p-3.5 rounded bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Successfully parsed <strong>{parsedData.courseCode}</strong> with {parsedData.courseOutcomes?.length || 0} outcomes & {parsedData.units?.length || 0} units!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyToWorkspace}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded text-xs transition-colors cursor-pointer"
                >
                  Load into Studio Workspace
                </button>
              </div>

              {/* Editable Form Section */}
              <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1c2234]">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Extracted Course Fields (Editable Form)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={formCode}
                      onChange={e => setFormCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Credits (L:T:P)</label>
                    <input
                      type="text"
                      value={formCredits}
                      onChange={e => setFormCredits(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500"
                      placeholder="3:0:2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Course Type</label>
                    <input
                      type="text"
                      value={formCourseType}
                      onChange={e => setFormCourseType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={formDepartment}
                      onChange={e => setFormDepartment(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121624] border border-[#232b40] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Course Outcomes List Preview */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Extracted Course Outcomes ({parsedData.courseOutcomes?.length || 0}):
                  </div>
                  <div className="space-y-2">
                    {parsedData.courseOutcomes?.map((co: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded bg-[#10131e] border border-[#1d2334] text-xs flex items-start gap-3"
                      >
                        <span className="font-mono font-bold text-blue-300 px-2 py-0.5 rounded bg-[#151a2a]">
                          {co.code}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300">
                          {co.bloomsLevel} · {co.leadingVerb}
                        </span>
                        <span className="text-slate-200 flex-1">{co.statement}</span>
                        <span className="font-mono text-emerald-400 font-bold shrink-0">{co.targetAttainment}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Units List Preview */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Extracted Units & Modules ({parsedData.units?.length || 0}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parsedData.units?.map((u: any, idx: number) => (
                      <div key={idx} className="p-3 rounded bg-[#10131e] border border-[#1d2334] text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span>Unit {u.unitNo}: {u.title}</span>
                          <span className="font-mono text-blue-300">{u.hours} hrs</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{u.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible JSON Panel */}
              <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsJsonOpen(!isJsonOpen)}
                  className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#121624] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isJsonOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span>Validated JSON Schema Output (specforge_output.schema.json)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Click to toggle</span>
                </button>

                {isJsonOpen && (
                  <div className="p-4 border-t border-[#1c2234] bg-[#07090f] relative">
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="absolute top-6 right-6 px-2.5 py-1 text-xs rounded bg-[#181d2e] border border-[#2b354e] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedJson ? 'Copied' : 'Copy JSON'}
                    </button>
                    <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 p-2 selection:bg-blue-600">
                      {JSON.stringify(parsedData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1c2234] bg-[#0c0f18] flex items-center justify-between text-xs text-slate-400">
          <span>Supported: Word (.docx, .doc), PDF (.pdf), HTML (.html)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
            {parsedData && (
              <button
                onClick={handleApplyToWorkspace}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded transition-colors shadow-sm"
              >
                Apply Extracted Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
