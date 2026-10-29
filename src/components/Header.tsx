import React, { useState } from 'react';
import { CourseSpecification, UserRole, ROLE_CONFIGS } from '../types';
import { 
  GraduationCap, ChevronDown, UserCheck, Shield, Sparkles, 
  Settings as SettingsIcon, BookMarked, FileText, CheckCircle2, Upload 
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  courses: CourseSpecification[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  activeScreen: 'spec' | 'matrix' | 'syllabus' | 'accreditation';
  onNavigateScreen: (screen: 'spec' | 'matrix' | 'syllabus' | 'accreditation') => void;
  onOpenUpload: () => void;
  onOpenAnnexure: () => void;
  onOpenAIAudit: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
}

export default function Header({
  currentRole,
  onRoleChange,
  courses,
  activeCourseId,
  onSelectCourse,
  activeScreen,
  onNavigateScreen,
  onOpenUpload,
  onOpenAnnexure,
  onOpenAIAudit,
  onOpenExport,
  onOpenSettings
}: HeaderProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const roleConfig = ROLE_CONFIGS[currentRole];

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#07090e]/95 backdrop-blur-md border-b border-[#1c2234] flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Course Picker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-blue-400 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>SpecForge - Course Specification Builder</span>
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-[#151928] border border-[#232a3e] text-blue-300 hidden md:inline">
                NBA Washington Accord
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">Curriculum Specification & Outcome Alignment</div>
          </div>
        </div>

        <div className="h-5 w-px bg-[#20273c] hidden sm:block" />

        {/* Upload files button */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="px-2.5 py-1 rounded bg-[#121624] border border-[#26314c] hover:border-blue-500 text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
          title="Upload existing course specification and blueprint"
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          <span>Upload files</span>
        </button>

        <div className="h-5 w-px bg-[#20273c] hidden md:block" />

        {/* Course Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setCourseMenuOpen(!courseMenuOpen);
              setRoleMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10131e] border border-[#222a3e] hover:border-slate-500 text-xs transition-colors"
          >
            <span className="font-mono font-bold text-blue-300">{activeCourse.code}</span>
            <span className="text-slate-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {activeCourse.title}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {courseMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-[#0c0f18] border border-[#22293d] rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-[#1a2032]">
                Select Department Course
              </div>
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCourse(c.id);
                    setCourseMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#151926] transition-colors flex items-start gap-2 ${
                    c.id === activeCourseId ? 'bg-blue-950/30 text-blue-200' : 'text-slate-300'
                  }`}
                >
                  <span className="font-mono font-bold text-blue-400 shrink-0">{c.code}</span>
                  <div>
                    <div className="font-medium text-white">{c.title}</div>
                    <div className="text-[10px] text-slate-400">{c.semester} · {c.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Nav Tabs */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#0f121d] p-1 rounded-lg border border-[#1e2436]">
        <button
          onClick={() => onNavigateScreen('spec')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeScreen === 'spec'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Outcomes & Spec
        </button>
        <button
          onClick={() => onNavigateScreen('matrix')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeScreen === 'matrix'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CO–PO Matrix
        </button>
        <button
          onClick={() => onNavigateScreen('syllabus')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeScreen === 'syllabus'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Modular Units
        </button>
        <button
          onClick={() => onNavigateScreen('accreditation')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeScreen === 'accreditation'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Accreditation Audit
        </button>
      </nav>

      {/* Right Controls: Role Switcher & Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setCourseMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs border transition-colors ${roleConfig.badgeColor}`}
            title="Switch User Role & Permissions"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="font-semibold hidden sm:inline">{roleConfig.label.split('(')[0].trim()}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-[#0c0f18] border border-[#22293d] rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-[#1a2032]">
                Switch Governance Role
              </div>
              {(['author', 'reviewer', 'hod', 'auditor'] as UserRole[]).map(r => {
                const cfg = ROLE_CONFIGS[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#151926] transition-colors border-b border-[#161a29] last:border-0 ${
                      currentRole === r ? 'bg-blue-950/40 text-blue-200' : 'text-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{cfg.label}</span>
                      {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {cfg.description}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action icons */}
        <button
          onClick={onOpenAnnexure}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#141826] border border-transparent hover:border-[#22293d] transition-colors"
          title="Annexure A: Graduate Attributes & Bloom's Taxonomy"
        >
          <BookMarked className="w-4 h-4 text-blue-400" />
        </button>

        <button
          onClick={onOpenAIAudit}
          className="p-1.5 rounded text-slate-400 hover:text-blue-300 hover:bg-[#141826] border border-transparent hover:border-[#22293d] transition-colors"
          title="Run AI Accreditation Audit"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
        </button>

        <button
          onClick={onOpenExport}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#141826] border border-transparent hover:border-[#22293d] transition-colors"
          title="Export Official SAR Dossier"
        >
          <FileText className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#141826] border border-transparent hover:border-[#22293d] transition-colors"
          title="AI LLM Provider & Key Settings"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
