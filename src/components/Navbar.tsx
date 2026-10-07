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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-700/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">NaijaLesson<span className="text-emerald-700">Plan</span></span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  NERDC Standard
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium">Primary & Secondary School Lesson Note Generator</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'generator'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('scheme')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'scheme'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Scheme of Work</span>
              <span className="sm:hidden">Scheme</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Preview & Edit</span>
              {hasActiveNote && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'library'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Notes</span>
              <span className="sm:hidden">Notes</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'library' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {savedNotesCount}
              </span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewNote}
              title="Create new blank note"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              New Note
            </button>

            <button
              onClick={onOpenSettings}
              title="School & Teacher Settings"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
