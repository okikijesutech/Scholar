import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, X, Tag } from 'lucide-react';
import {
  type SectionFeedback,
  type FeedbackReason
} from '../../schemas';
import {
  getFeedbackForSection,
  saveFeedback,
  removeFeedback,
  FEEDBACK_REASON_LABELS
} from '../../services/feedbackService';

interface SectionFeedbackControlsProps {
  noteId: string;
  sectionKey: string;
  sectionTitle: string;
}

export const SectionFeedbackControls: React.FC<SectionFeedbackControlsProps> = ({
  noteId,
  sectionKey,
  sectionTitle
}) => {
  const [feedback, setFeedback] = useState<SectionFeedback | undefined>(() =>
    getFeedbackForSection(noteId, sectionKey)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<FeedbackReason[]>(() => feedback?.reasons || []);
  const [comment, setComment] = useState(feedback?.comment || '');
  const [justSaved, setJustSaved] = useState(false);

  const handleThumbsUp = () => {
    if (feedback?.rating === 'thumbs_up') {
      removeFeedback(noteId, sectionKey);
      setFeedback(undefined);
      return;
    }

    const saved = saveFeedback({
      noteId,
      sectionKey,
      sectionTitle,
      rating: 'thumbs_up',
      reasons: [],
      comment: ''
    });
    setFeedback(saved);
    setIsOpen(false);
    showSavedToast();
  };

  const handleOpenThumbsDown = () => {
    if (feedback?.rating === 'thumbs_down') {
      setIsOpen(!isOpen);
      return;
    }
    setIsOpen(true);
  };

  const toggleReason = (reason: FeedbackReason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSaveNegativeFeedback = () => {
    const saved = saveFeedback({
      noteId,
      sectionKey,
      sectionTitle,
      rating: 'thumbs_down',
      reasons: selectedReasons,
      comment: comment.trim()
    });
    setFeedback(saved);
    setIsOpen(false);
    showSavedToast();
  };

  const handleCancelNegative = () => {
    if (!feedback) {
      setSelectedReasons([]);
      setComment('');
    }
    setIsOpen(false);
  };

  const showSavedToast = () => {
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const availableReasons = Object.keys(FEEDBACK_REASON_LABELS) as FeedbackReason[];

  return (
    <div className="no-print relative inline-flex items-center gap-1.5 py-1">
      <div className="flex items-center gap-1 bg-slate-50/90 border border-slate-200/90 rounded-lg p-0.5 shadow-2xs">
        {/* Thumbs Up Button */}
        <button
          type="button"
          onClick={handleThumbsUp}
          title="Looks accurate & Nigerian-aligned"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
            feedback?.rating === 'thumbs_up'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          <span className="hidden sm:inline">Good</span>
        </button>

        {/* Thumbs Down Button */}
        <button
          type="button"
          onClick={handleOpenThumbsDown}
          title="Flag inaccurate or non-Nigerian context"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
            feedback?.rating === 'thumbs_down'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
          <span className="hidden sm:inline">Flag Issue</span>
          {feedback?.reasons && feedback.reasons.length > 0 && (
            <span className="ml-0.5 px-1 py-0.2 rounded-full bg-amber-800 text-[9px] text-amber-100">
              {feedback.reasons.length}
            </span>
          )}
        </button>
      </div>

      {justSaved && (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold animate-fade-in">
          <Check className="w-3 h-3" /> Recorded!
        </span>
      )}

      {/* Popover Card for Issue Tagging */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-300 rounded-xl shadow-xl p-3.5 z-50 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">What needs improvement?</span>
            </div>
            <button
              type="button"
              onClick={handleCancelNegative}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-2">
            Select issues to help improve our Nigerian curriculum accuracy:
          </p>

          <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
            {availableReasons.map(reason => {
              const info = FEEDBACK_REASON_LABELS[reason];
              const isSelected = selectedReasons.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-medium border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span>{info.iconEmoji}</span>
                    <span>{info.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Optional comment (e.g. use Naira instead of dollars)..."
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelNegative}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveNegativeFeedback}
              className="px-3 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs transition cursor-pointer"
            >
              Save Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
