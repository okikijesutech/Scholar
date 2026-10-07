import React from 'react';
import { 
  Printer, 
  FileDown, 
  Copy, 
  Save, 
  Edit3, 
  Check, 
  Eye,
  Sparkles,
  Share2
} from 'lucide-react';

interface LessonActionBarProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onOpenRefine?: () => void;
  onOpenStudentPack?: () => void;
  onPrint: () => void;
  onExportDocx: () => void;
  isExportingDocx: boolean;
  onCopyText: () => void;
  copiedSuccess: boolean;
  onSave: () => void;
  savedSuccess: boolean;
}

export const LessonActionBar: React.FC<LessonActionBarProps> = ({
  isEditing,
  onToggleEdit,
  onOpenRefine,
  onOpenStudentPack,
  onPrint,
  onExportDocx,
  isExportingDocx,
  onCopyText,
  copiedSuccess,
  onSave,
  savedSuccess
}) => {
  return (
    <div className="no-print sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode:</span>
        <button
          onClick={onToggleEdit}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            isEditing ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          {isEditing ? 'Inspection View' : 'Edit Note Content'}
        </button>

        {onOpenRefine && (
          <button
            onClick={onOpenRefine}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Refine with AI</span>
          </button>
        )}

        {onOpenStudentPack && (
          <button
            onClick={onOpenStudentPack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Student Pack &amp; Quiz</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={onExportDocx}
          disabled={isExportingDocx}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>{isExportingDocx ? 'Generating DOCX...' : 'Download Word (.docx)'}</span>
        </button>

        <button
          onClick={onCopyText}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
        >
          {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copiedSuccess ? 'Copied Full Note!' : 'Copy Formatted Text'}</span>
        </button>

        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved!' : 'Save Note'}</span>
        </button>
      </div>
    </div>
  );
};
