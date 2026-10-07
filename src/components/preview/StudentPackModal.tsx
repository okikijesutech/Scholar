import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  BookOpen,
  Printer,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';
import type { LessonNote } from '../../types';
import {
  generateStudentPack,
  formatStudentPackForWhatsApp,
  getStudentPackForNote
} from '../../services/studentPackService';
import type { StudentPack } from '../../schemas';

interface StudentPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: LessonNote;
}

export const StudentPackModal: React.FC<StudentPackModalProps> = ({
  isOpen,
  onClose,
  note
}) => {
  const [pack] = useState<StudentPack>(() => {
    return getStudentPackForNote(note.id) || generateStudentPack(note);
  });
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'interactive'>('whatsapp');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  if (!isOpen) return null;

  const handleCopyWhatsApp = async () => {
    const text = formatStudentPackForWhatsApp(pack);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
    }
  };

  const handleSelectOption = (questionNumber: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionNumber]: option }));
  };

  const calculateScore = () => {
    let correct = 0;
    pack.quizQuestions.forEach(q => {
      if (selectedAnswers[q.questionNumber] === q.correctOption) {
        correct++;
      }
    });
    return correct;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Student Study Pack &amp; Quiz</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  WhatsApp-Ready
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {pack.subject} • {pack.classLevel} • {pack.topic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Format</span>
            </button>

            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Quiz &amp; Handout</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSuccess ? 'Copied for WhatsApp!' : 'Copy for WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Handout</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left">
          {activeTab === 'whatsapp' ? (
            /* WhatsApp Message Preview View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Preview how this message appears in your students' WhatsApp group:</span>
                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Click 'Copy for WhatsApp' above to share
                </span>
              </div>

              {/* WhatsApp Chat Bubble */}
              <div className="bg-[#e5ddd5] p-3 sm:p-5 rounded-2xl shadow-inner border border-slate-300">
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm text-slate-900 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed border-l-4 border-emerald-600">
                  {formatStudentPackForWhatsApp(pack)}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Quiz & Revision View */
            <div className="space-y-6">
              {/* Revision Handout Card */}
              <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-sm sm:text-base text-emerald-950">Quick Revision Handout</h3>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-800 list-disc list-inside">
                  {pack.summaryPoints.map((pt, i) => (
                    <li key={i} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>

                {pack.coreRuleOrMemoryVerse && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs sm:text-sm text-emerald-900 font-medium">
                    <span className="font-bold">Golden Memory Principle: </span>
                    "{pack.coreRuleOrMemoryVerse}"
                  </div>
                )}
              </div>

              {/* 5-Question Quiz Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-700" />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">5-Question Quick Revision Quiz</h3>
                  </div>

                  {Object.keys(selectedAnswers).length > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Score: {calculateScore()} / {pack.quizQuestions.length}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {pack.quizQuestions.map(q => {
                    const chosen = selectedAnswers[q.questionNumber];
                    const isCorrect = chosen === q.correctOption;

                    return (
                      <div
                        key={q.questionNumber}
                        className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Question {q.questionNumber}: {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(['A', 'B', 'C', 'D'] as const).map(opt => {
                            const isOptSelected = chosen === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelectOption(q.questionNumber, opt)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                                  isOptSelected
                                    ? isCorrect
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                      : 'bg-rose-50 border-rose-400 text-rose-950'
                                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {opt}
                                </span>
                                <span>{q.options[opt]}</span>
                              </button>
                            );
                          })}
                        </div>

                        {showAnswers && (
                          <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 space-y-1">
                            <span className="font-bold text-emerald-800">Correct Answer: Option {q.correctOption}</span>
                            <p className="text-slate-600">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                  >
                    {showAnswers ? 'Hide Answer Explanations' : 'Show Answer Explanations'}
                  </button>

                  {Object.keys(selectedAnswers).length === pack.quizQuestions.length && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Quiz Complete! You scored {calculateScore()}/{pack.quizQuestions.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Pre-formatted for WhatsApp staff &amp; class study groups.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
