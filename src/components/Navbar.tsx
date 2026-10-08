import React from 'react';
import { BookOpen, Sparkles, FileText, FolderArchive, Settings, GraduationCap, PlusCircle, ShieldCheck, Cloud, CloudCheck } from 'lucide-react';

export type TabType = 'generator' | 'scheme' | 'preview' | 'library';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  savedNotesCount: number;
  onOpenSettings: () => void;
  onNewNote: () => void;
  hasActiveNote: boolean;
  onOpenAdminCollation?: () => void;
  onOpenEduFlowsSync?: () => void;
  isEduFlowsConnected?: boolean;
  schoolName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedNotesCount,
  onOpenSettings,
  onNewNote,
  hasActiveNote,
  onOpenAdminCollation,
  onOpenEduFlowsSync,
  isEduFlowsConnected,
  schoolName
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1">
          {/* Logo & App Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-700/20">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Lesson<span className="text-emerald-700">Flow</span>
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  NERDC Standard
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">Inspection-Ready Lesson Notes for Nigerian Schools</p>
            </div>
          </div>

          {/* Navigation Tabs - Responsive for 390px mobile screens */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                activeTab === 'generator'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Generator</span>
              <span className="sm:hidden text-[11px]">Write</span>
            </button>

            <button
              onClick={() => setActiveTab('scheme')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                activeTab === 'scheme'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Scheme of Work</span>
              <span className="md:hidden text-[11px]">Scheme</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                activeTab === 'preview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Preview & Edit</span>
              <span className="md:hidden text-[11px]">Preview</span>
              {hasActiveNote && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                activeTab === 'library'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Saved Notes</span>
              <span className="md:hidden text-[11px]">Library</span>
              <span className={`px-1 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                activeTab === 'library' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {savedNotesCount}
              </span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAdminCollation && (
              <button
                onClick={onOpenAdminCollation}
                title="Super Admin Curriculum Collation & State Verification"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">Admin Collation</span>
              </button>
            )}

            <button
              onClick={onNewNote}
              title="Create new blank note"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>New Note</span>
            </button>

            {onOpenEduFlowsSync && (
              <button
                onClick={onOpenEduFlowsSync}
                title={isEduFlowsConnected ? `Connected to ${schoolName || 'EduFlows'}` : 'Connect to EduFlows School Portal'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isEduFlowsConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isEduFlowsConnected ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden lg:inline">{schoolName ? schoolName.slice(0, 16) : 'EduFlows Sync'}</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden lg:inline">EduFlows Cloud</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onOpenSettings}
              title="School & Teacher Settings"
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
