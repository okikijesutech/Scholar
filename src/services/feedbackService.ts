import { sectionFeedbackSchema, type SectionFeedback, type FeedbackReason } from '../schemas';

const STORAGE_KEY_FEEDBACK = 'lessonflow_section_feedback_v1';

export const FEEDBACK_REASON_LABELS: Record<FeedbackReason, { label: string; iconEmoji: string }> = {
  not_nigerian_context: { label: 'Not Nigerian Context (used foreign examples/dollars)', iconEmoji: '🇳🇬' },
  too_advanced: { label: 'Too Advanced for Class/Age Level', iconEmoji: '📈' },
  too_simple: { label: 'Too Simple / Lacks Required Depth', iconEmoji: '📉' },
  wrong_curriculum_week: { label: 'Topic Mismatch / Wrong Curriculum Week', iconEmoji: '📅' },
  inaccurate_content: { label: 'Factual, Doctrinal or Formula Inaccuracy', iconEmoji: '❌' },
  unclear_explanation: { label: 'Unclear or Confusing Phrasing', iconEmoji: '❓' }
};

export function getAllFeedback(): SectionFeedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FEEDBACK);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SectionFeedback => {
      return sectionFeedbackSchema.safeParse(item).success;
    });
  } catch (e) {
    console.error('Failed to parse feedback from storage:', e);
    return [];
  }
}

export function getFeedbackForNote(noteId: string): SectionFeedback[] {
  return getAllFeedback().filter(f => f.noteId === noteId);
}

export function getFeedbackForSection(noteId: string, sectionKey: string): SectionFeedback | undefined {
  return getAllFeedback().find(f => f.noteId === noteId && f.sectionKey === sectionKey);
}

export function saveFeedback(
  data: Omit<SectionFeedback, 'id' | 'createdAt'>
): SectionFeedback {
  const all = getAllFeedback();
  const existingIndex = all.findIndex(f => f.noteId === data.noteId && f.sectionKey === data.sectionKey);

  const entry: SectionFeedback = {
    ...data,
    id: existingIndex >= 0 ? all[existingIndex].id : `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    all[existingIndex] = entry;
  } else {
    all.push(entry);
  }

  try {
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save feedback:', e);
  }

  return entry;
}

export function removeFeedback(noteId: string, sectionKey: string): void {
  const all = getAllFeedback().filter(f => !(f.noteId === noteId && f.sectionKey === sectionKey));
  try {
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to remove feedback:', e);
  }
}

export function exportFeedbackJson(): string {
  const all = getAllFeedback();
  return JSON.stringify(all, null, 2);
}

export function clearFeedback(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_FEEDBACK);
  } catch (e) {
    console.error('Failed to clear feedback:', e);
  }
}
