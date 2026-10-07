import React, { useState } from 'react';
import type { LessonNote } from '../types';
import { exportToDocx } from '../services/exportService';
import { 
  Search, 
  Trash2, 
  Copy, 
  FileDown, 
  Eye, 
  PlusCircle, 
  Calendar,
  School
} from 'lucide-react';

interface SavedNotesTabProps {
  notes: LessonNote[];
  onOpenNote: (note: LessonNote) => void;
  onDuplicateNote: (note: LessonNote) => void;
  onDeleteNote: (id: string) => void;
  onNewNote: () => void;
}

export const SavedNotesTab: React.FC<SavedNotesTabProps> = ({
  notes,
  onOpenNote,
  onDuplicateNote,
  onDeleteNote,
  onNewNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterTerm, setFilterTerm] = useState<string>('all');

  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = filterClass === 'all' || n.classLevel === filterClass;
    const matchesTerm = filterTerm === 'all' || n.term === filterTerm;

    return matchesSearch && matchesClass && matchesTerm;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            My Lesson Notes Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            You have {notes.length} lesson {notes.length === 1 ? 'note' : 'notes'} saved. All notes persist in your browser for offline access.
          </p>
        </div>

        <button
          onClick={onNewNote}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write New Lesson Note</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search notes by topic, subject, or teacher..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Classes</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="JSS 3">JSS 3</option>
            <option value="SSS 1">SSS 1</option>
            <option value="SSS 2">SSS 2</option>
            <option value="SSS 3">SSS 3</option>
          </select>

          <select
            value={filterTerm}
            onChange={e => setFilterTerm(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Terms</option>
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map(n => (
            <div
              key={n.id}
              className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-md transition space-y-4"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    {n.classLevel}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {n.term} • Wk {n.week}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {n.subject}
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {n.topic}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {n.subTopic}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{n.schoolName}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  onClick={() => onOpenNote(n)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open & Print</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportToDocx(n)}
                    title="Download Word (.docx)"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDuplicateNote(n)}
                    title="Duplicate note for next week"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete lesson note for "${n.topic}"?`)) {
                        onDeleteNote(n.id);
                      }
                    }}
                    title="Delete note"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No lesson notes matched your search query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterClass('all');
              setFilterTerm('all');
            }}
            className="mt-3 text-xs text-emerald-700 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
