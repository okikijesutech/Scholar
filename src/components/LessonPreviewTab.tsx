import React, { useState } from 'react';
import type { LessonNote } from '../types';
import { exportToDocx, formatAsPlainText } from '../services/exportService';
import { LessonActionBar } from './preview/LessonActionBar';
import { InspectionSheet } from './preview/InspectionSheet';
import { BookOpen, Sparkles } from 'lucide-react';

interface LessonPreviewTabProps {
  note: LessonNote | null;
  onSaveNote: (note: LessonNote) => boolean | void;
  onNewNote: () => void;
}

export const LessonPreviewTab: React.FC<LessonPreviewTabProps> = ({
  note: initialNote,
  onSaveNote,
  onNewNote
}) => {
  const [note, setNote] = useState<LessonNote | null>(initialNote);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">No Lesson Note Selected</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Generate a new lesson note from the Generator tab, or choose one from your Saved Notes library.
          </p>
        </div>
        <button
          onClick={onNewNote}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 text-sm font-bold shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Generator</span>
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(note);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Export to Word failed. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const text = formatAsPlainText(note);
      await navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSave = () => {
    const result = onSaveNote(note);
    if (result !== false) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <LessonActionBar
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onPrint={handlePrint}
        onExportDocx={handleExportDocx}
        isExportingDocx={isExportingDocx}
        onCopyText={handleCopyText}
        copiedSuccess={copiedSuccess}
        onSave={handleSave}
        savedSuccess={savedSuccess}
      />

      <InspectionSheet
        note={note}
        isEditing={isEditing}
        onUpdateNote={setNote}
      />
    </div>
  );
};
