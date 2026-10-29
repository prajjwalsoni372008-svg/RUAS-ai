import React, { useState, useEffect } from 'react';
import { CourseSpecification, UserRole, ROLE_CONFIGS } from './types';
import { INITIAL_COURSES } from './initialData';
import Header from './components/Header';
import CourseSpecView from './components/CourseSpecView';
import MatrixView from './components/MatrixView';
import SyllabusModulesView from './components/SyllabusModulesView';
import AccreditationDashboard from './components/AccreditationDashboard';
import AnnexureDrawer from './components/AnnexureDrawer';
import AIAuditModal from './components/AIAuditModal';
import ExportDossierModal from './components/ExportDossierModal';
import UploadModal from './components/UploadModal';
import Settings from './Settings';
import { 
  FileText, Grid3X3, BookOpen, ShieldCheck, 
  BookMarked, Sparkles, Printer, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, Lock, CheckCircle2, AlertCircle, Upload
} from 'lucide-react';

const COURSES_STORAGE_KEY = 'academic_studio_courses_data';

export default function App() {
  const [courses, setCourses] = useState<CourseSpecification[]>(() => {
    try {
      const saved = localStorage.getItem(COURSES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cached courses', e);
    }
    return INITIAL_COURSES;
  });

  const [activeCourseId, setActiveCourseId] = useState<string>(() => courses[0]?.id || 'cs302-daa');
  const [currentRole, setCurrentRole] = useState<UserRole>('author');
  const [activeScreen, setActiveScreen] = useState<'spec' | 'matrix' | 'syllabus' | 'accreditation'>('spec');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals / Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAnnexureOpen, setIsAnnexureOpen] = useState(false);
  const [isAIAuditOpen, setIsAIAuditOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save courses to localStorage on modification
  useEffect(() => {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses to localStorage', e);
    }
  }, [courses]);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const roleConfig = ROLE_CONFIGS[currentRole];

  const handleUpdateCourse = (updated: CourseSpecification) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Global Fixed Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        courses={courses}
        activeCourseId={activeCourse.id}
        onSelectCourse={setActiveCourseId}
        activeScreen={activeScreen}
        onNavigateScreen={setActiveScreen}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAnnexure={() => setIsAnnexureOpen(true)}
        onOpenAIAudit={() => setIsAIAuditOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace with Persistent Left Rail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Rail (Collapsible to 64px) */}
        <aside
          className={`shrink-0 border-r border-[#1a2032] bg-[#07090e] transition-all duration-200 flex flex-col justify-between ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          <div className="p-3 space-y-4">
            {/* Screen Navigation */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Workspace Views
                </div>
              )}

              <button
                onClick={() => setActiveScreen('spec')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                  activeScreen === 'spec'
                    ? 'bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101422]'
                }`}
                title="Course Specification & CLOs"
              >
                <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span>Course Outcomes</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#131726] text-slate-400">
                      {activeCourse.courseOutcomes.length}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveScreen('matrix')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                  activeScreen === 'matrix'
                    ? 'bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101422]'
                }`}
                title="CO-PO & CO-PSO Articulation Matrix"
              >
                <Grid3X3 className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span>CO–PO Matrix</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#131726] text-slate-400">
                      12×3
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveScreen('syllabus')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                  activeScreen === 'syllabus'
                    ? 'bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101422]'
                }`}
                title="Modular Units & Bibliography"
              >
                <BookOpen className="w-4 h-4 shrink-0 text-teal-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span>Modular Units</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#131726] text-slate-400">
                      {activeCourse.modules.length}U
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveScreen('accreditation')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                  activeScreen === 'accreditation'
                    ? 'bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#101422]'
                }`}
                title="Accreditation Audit & PAC Logs"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span>Accreditation Audit</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#131726] text-emerald-400">
                      {activeCourse.status === 'Aligned / Approved' ? 'Approved' : 'Review'}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Reference & Tools Navigation */}
            <div className="pt-2 border-t border-[#181d2e] space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Accreditation Tools
                </div>
              )}

              <button
                onClick={() => setIsUploadOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-[#101422] transition-colors"
                title="Upload Existing Course Specification & Blueprint"
              >
                <Upload className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Upload Files</span>}
              </button>

              <button
                onClick={() => setIsAnnexureOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-[#101422] transition-colors"
                title="Annexure A: Graduate Attributes Reference"
              >
                <BookMarked className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>Annexure A Ref</span>}
              </button>

              <button
                onClick={() => setIsAIAuditOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-blue-300 hover:bg-[#101422] transition-colors"
                title="AI Curriculum Auditor & Bloom's Validator"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && <span>AI Auditor</span>}
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-[#101422] transition-colors"
                title="Export SAR Specification Document"
              >
                <Printer className="w-4 h-4 shrink-0 text-slate-400" />
                {!sidebarCollapsed && <span>SAR Export</span>}
              </button>
            </div>
          </div>

          {/* Sidebar Bottom Controls */}
          <div className="p-3 border-t border-[#181d2e] space-y-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-[#101422] transition-colors"
              title="LLM Settings & x-llm-* headers"
            >
              <SettingsIcon className="w-4 h-4 shrink-0 text-slate-400" />
              {!sidebarCollapsed && <span>AI Settings</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center py-1.5 text-slate-500 hover:text-slate-300 rounded hover:bg-[#101422] transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Primary Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-black">
          {/* Permission notice banner if restricted role */}
          {(!roleConfig.canEditCOs && (activeScreen === 'spec' || activeScreen === 'matrix')) && (
            <div className="mb-4 p-3 rounded-lg bg-[#0e121d] border border-[#20273a] flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Viewing in <strong className="text-white">{roleConfig.label}</strong> mode (read-only for course specification edits). Switch role in top header to edit.
                </span>
              </div>
              <button
                onClick={() => setCurrentRole('author')}
                className="text-xs px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Switch to Author
              </button>
            </div>
          )}

          {/* Active Screen Rendering */}
          {activeScreen === 'spec' && (
            <CourseSpecView
              course={activeCourse}
              role={currentRole}
              onUpdateCourse={handleUpdateCourse}
              onOpenAnnexure={() => setIsAnnexureOpen(true)}
              onOpenAIAudit={() => setIsAIAuditOpen(true)}
            />
          )}

          {activeScreen === 'matrix' && (
            <MatrixView
              course={activeCourse}
              role={currentRole}
              onUpdateCourse={handleUpdateCourse}
              onOpenAnnexure={() => setIsAnnexureOpen(true)}
              onOpenAIAudit={() => setIsAIAuditOpen(true)}
            />
          )}

          {activeScreen === 'syllabus' && (
            <SyllabusModulesView
              course={activeCourse}
              role={currentRole}
              onUpdateCourse={handleUpdateCourse}
              onOpenAnnexure={() => setIsAnnexureOpen(true)}
            />
          )}

          {activeScreen === 'accreditation' && (
            <AccreditationDashboard
              course={activeCourse}
              role={currentRole}
              onUpdateCourse={handleUpdateCourse}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Upload Existing Specification Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onCourseImported={(importedCourse) => {
          setCourses(prev => [importedCourse, ...prev]);
          setActiveCourseId(importedCourse.id);
        }}
      />

      {/* Annexure A Drawer (Screen 5) */}
      <AnnexureDrawer
        isOpen={isAnnexureOpen}
        onClose={() => setIsAnnexureOpen(false)}
      />

      {/* AI Curriculum Auditor Modal (Screen 6) */}
      <AIAuditModal
        isOpen={isAIAuditOpen}
        onClose={() => setIsAIAuditOpen(false)}
        course={activeCourse}
        onUpdateCourse={handleUpdateCourse}
        onOpenSettings={() => {
          setIsAIAuditOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* SAR Export Preview Modal (Screen 7) */}
      <ExportDossierModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        course={activeCourse}
      />

      {/* AI Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <Settings
            onClose={() => setIsSettingsOpen(false)}
            onSaved={() => {
              // Settings saved
            }}
          />
        </div>
      )}
    </div>
  );
}
