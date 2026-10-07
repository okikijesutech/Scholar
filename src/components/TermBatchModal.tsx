import React, { useState, useRef } from 'react';
import type { SchemeOfWork, TeacherProfile, LessonNote, SchemeWeek } from '../types';
import { resolveActiveProviderConfig } from '../services/ai/providers';
import { generateLessonNote } from '../services/aiGenerator';
import { saveNote } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Layers,
  X,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  StopCircle,
  BookOpen
} from 'lucide-react';

interface TermBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: SchemeOfWork;
  profile: TeacherProfile;
  onBatchComplete: (notes: LessonNote[]) => void;
  onOpenSettings?: () => void;
}

interface WeekProgress {
  week: number;
  topic: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

export const TermBatchModal: React.FC<TermBatchModalProps> = ({
  isOpen,
  onClose,
  scheme,
  profile,
  onBatchComplete,
  onOpenSettings
}) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>(() =>
    scheme.weeks.map(w => w.week)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressList, setProgressList] = useState<WeekProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedNotes, setCompletedNotes] = useState<LessonNote[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const abortRef = useRef<boolean>(false);

  if (!isOpen) return null;

  const providerConfig = resolveActiveProviderConfig(profile);
  const hasValidKey = !!(providerConfig.apiKey && providerConfig.apiKey.trim().length > 5);

  const toggleWeekSelection = (weekNum: number) => {
    if (isRunning) return;
    setSelectedWeeks(prev =>
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    if (isRunning) return;
    setSelectedWeeks(scheme.weeks.map(w => w.week));
  };

  const deselectAll = () => {
    if (isRunning) return;
    setSelectedWeeks([]);
  };

  const handleStartBatch = async () => {
    if (selectedWeeks.length === 0) return;

    abortRef.current = false;
    setIsRunning(true);
    setIsFinished(false);

    const weeksToRun = scheme.weeks.filter(w => selectedWeeks.includes(w.week));
    const initialProgress: WeekProgress[] = weeksToRun.map(w => ({
      week: w.week,
      topic: w.topic,
      status: 'pending'
    }));

    setProgressList(initialProgress);
    setCurrentIndex(0);

    const generatedBatch: LessonNote[] = [];

    for (let i = 0; i < weeksToRun.length; i++) {
      if (abortRef.current) {
        break;
      }

      const weekItem: SchemeWeek = weeksToRun[i];
      setCurrentIndex(i);

      setProgressList(prev =>
        prev.map((p, idx) => (idx === i ? { ...p, status: 'generating' } : p))
      );

      try {
        const customInstructions = [
          weekItem.objectivesSummary ? `Specific Syllabus Objectives: ${weekItem.objectivesSummary}` : '',
          weekItem.suggestedMaterials ? `Prescribed Teaching Aids / Materials: ${weekItem.suggestedMaterials}` : '',
          'Strictly ground this lesson note in the scheme objectives and instructional materials.'
        ].filter(Boolean).join('\n');

        const note = await generateLessonNote({
          schoolName: profile.schoolName,
          teacherName: profile.teacherName,
          subject: scheme.subject,
          classLevel: scheme.classLevel,
          term: scheme.term,
          week: weekItem.week,
          topic: weekItem.topic,
          subTopic: weekItem.subTopic,
          duration: profile.defaultDuration || '40 Minutes',
          period: '1st & 2nd Period',
          customInstructions,
          apiKey: providerConfig.apiKey,
          providerConfig
        });

        saveNote(note);
        generatedBatch.push(note);

        setProgressList(prev =>
          prev.map((p, idx) => (idx === i ? { ...p, status: 'completed' } : p))
        );
      } catch (err: unknown) {
        console.error(`Batch generation failed for Week ${weekItem.week}:`, err);
        const errMsg = err instanceof Error ? err.message : 'Generation failed';
        setProgressList(prev =>
          prev.map((p, idx) => (idx === i ? { ...p, status: 'failed', error: errMsg } : p))
        );
      }

      // Delay 1.5s between calls to prevent hitting AI provider RPM limits
      if (i < weeksToRun.length - 1 && !abortRef.current && hasValidKey) {
        await new Promise(res => setTimeout(res, 1500));
      }
    }

    setIsRunning(false);
    setIsFinished(true);
    setCompletedNotes(generatedBatch);

    if (generatedBatch.length > 0) {
      onBatchComplete(generatedBatch);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsRunning(false);
  };

  const estimatedMinutes = Math.ceil((selectedWeeks.length * (hasValidKey ? 12 : 1)) / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Term Batch Generator
              </h3>
              <p className="text-xs text-slate-500">
                {scheme.subject} • {scheme.classLevel} ({scheme.term})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status & Provider Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-semibold block">Generation Engine</span>
              <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {providerConfig.provider} {providerConfig.model ? `(${providerConfig.model})` : ''}
              </span>
              {!hasValidKey && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings?.();
                  }}
                  className="text-[11px] text-amber-700 font-bold hover:underline block pt-0.5 cursor-pointer"
                >
                  Configure AI Key for high-depth notes
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-semibold block">Batch Estimation</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{selectedWeeks.length} weeks (~{estimatedMinutes} min{estimatedMinutes > 1 ? 's' : ''})</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Auto-saves each note to your library
              </span>
            </div>
          </div>

          {!isRunning && !isFinished ? (
            /* Week Selection View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Select Weeks to Generate ({selectedWeeks.length}/{scheme.weeks.length} selected)
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={selectAll}
                    className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={deselectAll}
                    className="text-slate-500 font-semibold hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {scheme.weeks.map(item => {
                  const isChecked = selectedWeeks.includes(item.week);
                  return (
                    <label
                      key={item.week}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWeekSelection(item.week)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 block">
                          Week {item.week}: {item.topic}
                        </span>
                        {item.subTopic && (
                          <span className="text-[11px] text-slate-500 truncate block">
                            {item.subTopic}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Progress & Results View */
            <div className="space-y-4">
              {isRunning && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>
                      Generating Week {currentIndex + 1} of {progressList.length}...
                    </span>
                    <span>
                      {Math.round(((currentIndex + 1) / progressList.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.round(((currentIndex + 1) / progressList.length) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {isFinished && (
                <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Term Batch Completed!
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Successfully saved {completedNotes.length} weekly lesson notes to your library.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {progressList.map(prog => (
                  <div
                    key={prog.week}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                      prog.status === 'generating'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : prog.status === 'completed'
                        ? 'border-slate-200 bg-white text-slate-800'
                        : prog.status === 'failed'
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {prog.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {prog.status === 'generating' && (
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                      {prog.status === 'failed' && (
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      {prog.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className="truncate">
                        Week {prog.week}: {prog.topic}
                      </span>
                    </div>

                    <span className="text-[11px] capitalize shrink-0 ml-2">
                      {prog.status === 'generating' ? 'Writing note...' : prog.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-50 cursor-pointer"
          >
            {isFinished ? 'Close' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <button
                type="button"
                onClick={handleStop}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop Batch</span>
              </button>
            ) : isFinished ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Library Notes</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartBatch}
                disabled={selectedWeeks.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Generate {selectedWeeks.length} Notes in Batch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
