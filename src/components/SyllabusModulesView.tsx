import React, { useState } from 'react';
import { CourseSpecification, SyllabusModule, UserRole, ROLE_CONFIGS } from '../types';
import { annexureData } from '../annexureData';
import { 
  Layers, Clock, BookOpen, Plus, Trash2, Edit3, 
  ExternalLink, CheckCircle, ChevronRight, Bookmark
} from 'lucide-react';

interface SyllabusModulesViewProps {
  course: CourseSpecification;
  role: UserRole;
  onUpdateCourse: (updated: CourseSpecification) => void;
  onOpenAnnexure: () => void;
}

export default function SyllabusModulesView({
  course,
  role,
  onUpdateCourse,
  onOpenAnnexure
}: SyllabusModulesViewProps) {
  const permissions = ROLE_CONFIGS[role];
  const [editingModule, setEditingModule] = useState<SyllabusModule | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [newBookType, setNewBookType] = useState<'textbooks' | 'referenceBooks' | 'webResources'>('textbooks');
  const [newBookText, setNewBookText] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);

  const totalCalculatedHours = course.modules.reduce((acc, m) => acc + (m.hours || 0), 0);

  const handleUpdateModule = (updated: SyllabusModule) => {
    const updatedList = course.modules.map(m => m.moduleNo === updated.moduleNo ? updated : m);
    onUpdateCourse({
      ...course,
      modules: updatedList,
      lastModified: new Date().toISOString().split('T')[0]
    });
    setEditingModule(null);
  };

  const handleAddTopic = (moduleNo: number) => {
    if (!topicInput.trim() || !permissions.canEditCourse) return;
    const targetModule = course.modules.find(m => m.moduleNo === moduleNo);
    if (!targetModule) return;

    const updated = {
      ...targetModule,
      topics: [...targetModule.topics, topicInput.trim()]
    };
    handleUpdateModule(updated);
    setTopicInput('');
  };

  const handleRemoveTopic = (moduleNo: number, topicIdx: number) => {
    if (!permissions.canEditCourse) return;
    const targetModule = course.modules.find(m => m.moduleNo === moduleNo);
    if (!targetModule) return;

    const updated = {
      ...targetModule,
      topics: targetModule.topics.filter((_, idx) => idx !== topicIdx)
    };
    handleUpdateModule(updated);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookText.trim() || !permissions.canEditCourse) return;

    const updatedBooks = {
      ...course.books,
      [newBookType]: [...(course.books[newBookType] || []), newBookText.trim()]
    };

    onUpdateCourse({
      ...course,
      books: updatedBooks,
      lastModified: new Date().toISOString().split('T')[0]
    });

    setNewBookText('');
    setShowAddBook(false);
  };

  const handleRemoveBook = (type: 'textbooks' | 'referenceBooks' | 'webResources', index: number) => {
    if (!permissions.canEditCourse) return;
    const updatedBooks = {
      ...course.books,
      [type]: course.books[type].filter((_, i) => i !== index)
    };
    onUpdateCourse({
      ...course,
      books: updatedBooks
    });
  };

  return (
    <div className="space-y-6">
      {/* Syllabus Overview & Hour Allocation Header */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 academic-doc">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-blue-300 font-bold">{course.code}</span>
              <span>·</span>
              <span>Curriculum Syllabus & Pedagogical Units</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Modular Syllabus & Contact Hour Distribution
            </h1>
            <p className="text-xs text-slate-300">
              5 Instructional Units mapped to Course Outcomes with verified cognitive progression.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#111522] rounded-lg border border-[#222a3e] min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Allocated Hours:</span>
                <span className="font-bold text-white font-mono">{totalCalculatedHours} / {course.totalContactHours} hrs</span>
              </div>
              <div className="w-full bg-[#181d2c] h-2 rounded-full overflow-hidden border border-[#273248]">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalCalculatedHours / (course.totalContactHours || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {course.modules.map((module) => {
          return (
            <div
              key={module.moduleNo}
              className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-5 academic-doc space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2234]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#131726] border border-[#242c42] flex items-center justify-center font-mono font-bold text-sm text-blue-300 shrink-0">
                    U{module.moduleNo}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      Unit {module.moduleNo}: {module.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3 h-3 text-blue-400" />
                        {module.hours} Lecture Hours
                      </span>
                      <span>·</span>
                      <span className="text-slate-300">
                        Cognitive Focus: <strong className="text-amber-400 font-mono">{module.bloomFocus}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Outcomes Addressed:{' '}
                        {module.outcomesAddressed.map(co => (
                          <span key={co} className="mx-0.5 px-1.5 py-0.2 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300 font-mono text-[11px]">
                            {co}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>

                {permissions.canEditCourse && (
                  <button
                    onClick={() => setEditingModule(module)}
                    className="px-2.5 py-1 text-xs text-slate-300 hover:text-white rounded border border-[#232a3e] hover:bg-[#161a29] transition-colors flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    Configure Unit
                  </button>
                )}
              </div>

              {/* Topics Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Instructional Topics & Laboratory Components:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {module.topics.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-2.5 rounded bg-[#10131e] border border-[#1d2334] flex items-start justify-between gap-2 text-xs text-slate-200"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-mono text-[10px] mt-0.5">§{module.moduleNo}.{tIdx + 1}</span>
                        <span>{topic}</span>
                      </div>
                      {permissions.canEditCourse && (
                        <button
                          onClick={() => handleRemoveTopic(module.moduleNo, tIdx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                          title="Remove topic"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Add Topic Input */}
                {permissions.canEditCourse && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Add new topic to Unit ${module.moduleNo}...`}
                      value={editingModule?.moduleNo === module.moduleNo ? topicInput : ''}
                      onChange={e => {
                        setEditingModule(module);
                        setTopicInput(e.target.value);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic(module.moduleNo);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#121624] border border-[#232a3e] rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTopic(module.moduleNo)}
                      className="px-3 py-1.5 bg-[#181d2e] hover:bg-[#20273d] text-xs font-semibold text-blue-300 rounded border border-[#2b354e] transition-colors"
                    >
                      Add Topic
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bibliography & Prescribed Textbooks Section */}
      <div className="bg-[#0b0e17] border border-[#1e2436] rounded-lg p-6 academic-doc space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2234]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Course Bibliography & Learning Resources
              </h2>
              <p className="text-xs text-slate-400">
                Prescribed textbooks, reference literature, and accredited digital resources.
              </p>
            </div>
          </div>

          {permissions.canEditCourse && (
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className="px-3 py-1.5 bg-[#131726] border border-[#242c42] hover:bg-[#1a2034] text-xs font-semibold text-slate-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              Add Resource
            </button>
          )}
        </div>

        {/* Add Book Inline Form */}
        {showAddBook && (
          <form onSubmit={handleAddBook} className="p-4 rounded-lg bg-[#111522] border border-[#222a3d] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource Category</label>
                <select
                  value={newBookType}
                  onChange={e => setNewBookType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-[#161c2c] border border-[#28324a] rounded text-xs text-white focus:outline-none"
                >
                  <option value="textbooks">Prescribed Textbook</option>
                  <option value="referenceBooks">Reference Book</option>
                  <option value="webResources">Web Resource / MOOC</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Citation / Reference Details</label>
                <input
                  type="text"
                  placeholder="Author, 'Title', Edition, Publisher, Year"
                  value={newBookText}
                  onChange={e => setNewBookText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#161c2c] border border-[#28324a] rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddBook(false)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded"
              >
                Save Resource
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Textbooks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Bookmark className="w-3.5 h-3.5" />
              Prescribed Textbooks ({course.books.textbooks?.length || 0})
            </div>
            <div className="space-y-2">
              {course.books.textbooks?.map((tb, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[#10131e] border border-[#1e2436] text-xs text-slate-200 leading-relaxed flex items-start justify-between gap-2"
                >
                  <span>
                    <strong className="text-blue-400 font-mono">[{idx + 1}] </strong>
                    {tb}
                  </span>
                  {permissions.canEditCourse && (
                    <button
                      onClick={() => handleRemoveBook('textbooks', idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reference Books */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
              <BookOpen className="w-3.5 h-3.5" />
              Reference Literature ({course.books.referenceBooks?.length || 0})
            </div>
            <div className="space-y-2">
              {course.books.referenceBooks?.map((rb, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[#10131e] border border-[#1e2436] text-xs text-slate-200 leading-relaxed flex items-start justify-between gap-2"
                >
                  <span>
                    <strong className="text-teal-400 font-mono">[R{idx + 1}] </strong>
                    {rb}
                  </span>
                  {permissions.canEditCourse && (
                    <button
                      onClick={() => handleRemoveBook('referenceBooks', idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Web Resources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <ExternalLink className="w-3.5 h-3.5" />
              Digital Resources & MOOCs ({course.books.webResources?.length || 0})
            </div>
            <div className="space-y-2">
              {course.books.webResources?.map((wr, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[#10131e] border border-[#1e2436] text-xs text-slate-200 leading-relaxed flex items-start justify-between gap-2"
                >
                  <span>
                    <strong className="text-purple-400 font-mono">[W{idx + 1}] </strong>
                    {wr}
                  </span>
                  {permissions.canEditCourse && (
                    <button
                      onClick={() => handleRemoveBook('webResources', idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
