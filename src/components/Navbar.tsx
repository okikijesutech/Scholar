import React from 'react';
import { BookOpen, Sparkles, FileText, FolderArchive, Settings, GraduationCap, PlusCircle } from 'lucide-react';

export type TabType = 'generator' | 'scheme' | 'preview' | 'library';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  savedNotesCount: number;
  onOpenSettings: () => void;
  onNewNote: () => void;
  hasActiveNote: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedNotesCount,
  onOpenSettings,
  onNewNote,
  hasActiveNote
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
                  <span className="hidden xs:inline">NaijaLesson</span><span className="text-emerald-700">Plan</span>
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  NERDC Standard
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">Primary & Secondary School Lesson Note Generator</p>
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
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onNewNote}
              title="Create new blank note"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>New Note</span>
            </button>

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
