import React, { useState } from 'react';
import type { LessonNote, TeacherProfile } from '../../types';
import { resolveActiveProviderConfig } from '../../services/ai/providers';
import { refineLessonNote } from '../../services/aiGenerator';
import { Sparkles, X, Wand2, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';

interface RefineNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: LessonNote;
  onApplyRefinedNote: (refinedNote: LessonNote) => void;
  profile: TeacherProfile;
  onOpenSettings?: () => void;
}

const SUGGESTED_PROMPTS = [
  'Simplify evaluation questions for struggling learners',
  'Add practical Nigerian market & real-life examples',
  'Expand lecture notes with detailed step-by-step explanations',
  'Include 3 interactive group & pair activities',
  'Add WAEC / NECO style past examination questions to assignment'
];

export const RefineNoteModal: React.FC<RefineNoteModalProps> = ({
  isOpen,
  onClose,
  note,
  onApplyRefinedNote,
  profile,
  onOpenSettings
}) => {
  const [instruction, setInstruction] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const providerConfig = resolveActiveProviderConfig(profile);
  const hasValidKey = !!(providerConfig.apiKey && providerConfig.apiKey.trim().length > 5);

  const handleRefine = async () => {
    if (!instruction.trim()) {
      setErrorMessage('Please enter an instruction for the AI or select one of the suggested prompts.');
      return;
    }

    if (!hasValidKey) {
      setErrorMessage('An active AI provider API key is required to refine this note.');
      return;
    }

    setIsRefining(true);
    setErrorMessage(null);

    try {
      const refined = await refineLessonNote(note, instruction.trim(), providerConfig);
      onApplyRefinedNote(refined);
      onClose();
    } catch (err: unknown) {
      console.error('Refinement error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Refinement failed: ${msg}`);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Refine Note with AI</h3>
              <p className="text-xs text-slate-500">
                {note.subject} • Week {note.week} ({note.classLevel})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRefining}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Provider Status */}
          <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Active Provider:</span>
              <span className="capitalize font-bold text-slate-800">
                {providerConfig.provider} {providerConfig.model ? `(${providerConfig.model})` : ''}
              </span>
            </div>
            {!hasValidKey ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings?.();
                }}
                className="inline-flex items-center gap-1 font-bold text-amber-700 hover:underline cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure API Key</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready
              </span>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(promptText)}
                  disabled={isRefining}
                  className="text-left text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Refinement Instruction
            </label>
            <textarea
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              disabled={isRefining}
              rows={4}
              placeholder="Tell the AI what to change, e.g. 'Make the evaluation questions multiple-choice', or 'Add a classroom experiment using locally sourced materials'..."
              className="w-full text-xs rounded-xl border border-slate-300 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder:text-slate-400"
            />
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isRefining}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRefine}
            disabled={isRefining || !instruction.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isRefining ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Refining Note...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Apply Refinement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
