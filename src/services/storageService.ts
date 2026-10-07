import type { LessonNote, TeacherProfile, SchemeOfWork } from '../types';
import { SAMPLE_LESSON_NOTES } from '../data/sampleNotes';
import { lessonNoteSchema, schemeOfWorkSchema } from '../schemas';

const STORAGE_KEY_NOTES = 'naija_lesson_notes_v1';
const STORAGE_KEY_SEEDED = 'naija_notes_seeded_v1';
const STORAGE_KEY_PROFILE = 'naija_teacher_profile_v1';
const STORAGE_KEY_CUSTOM_SCHEMES = 'naija_custom_schemes_v1';

export interface StorageResult {
  success: boolean;
  error?: string;
}

export function isValidLessonNote(item: unknown): item is LessonNote {
  if (!item || typeof item !== 'object') return false;
  return lessonNoteSchema.safeParse(item).success;
}

export function isValidSchemeOfWork(item: unknown): item is SchemeOfWork {
  if (!item || typeof item !== 'object') return false;
  return schemeOfWorkSchema.safeParse(item).success;
}

export function getStoredNotes(): LessonNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    const hasSeeded = localStorage.getItem(STORAGE_KEY_SEEDED);

    if (!raw && !hasSeeded) {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(SAMPLE_LESSON_NOTES));
      localStorage.setItem(STORAGE_KEY_SEEDED, 'true');
      return SAMPLE_LESSON_NOTES;
    }

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is LessonNote => {
      const valid = isValidLessonNote(item);
      if (!valid) {
        console.warn('Skipping corrupted or incompatible lesson note from storage:', item);
      }
      return valid;
    });
  } catch (e) {
    console.error('Failed to parse notes from storage:', e);
    return [];
  }
}

export function saveNote(note: LessonNote): StorageResult {
  try {
    const notes = getStoredNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      notes.unshift({ ...note, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    return { success: true };
  } catch (e) {
    console.error('Failed to save note:', e);
    const message = e instanceof Error ? e.message : 'Storage quota exceeded or storage unavailable';
    return { success: false, error: message };
  }
}

export function deleteNote(id: string): LessonNote[] {
  try {
    const notes = getStoredNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    return notes;
  } catch (e) {
    console.error('Failed to delete note:', e);
    return getStoredNotes();
  }
}

export function duplicateNote(note: LessonNote): LessonNote | null {
  const newNote: LessonNote = {
    ...note,
    id: `note-${Date.now()}`,
    topic: `${note.topic} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const res = saveNote(newNote);
  if (!res.success) {
    return null;
  }
  return newNote;
}

export function getCustomSchemes(): SchemeOfWork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SCHEMES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load custom schemes:', e);
  }
  return [];
}

export function saveCustomScheme(scheme: SchemeOfWork): void {
  try {
    const existing = getCustomSchemes();
    const idx = existing.findIndex(s => s.id === scheme.id || (s.subject === scheme.subject && s.classLevel === scheme.classLevel && s.term === scheme.term));
    if (idx >= 0) {
      existing[idx] = scheme;
    } else {
      existing.unshift(scheme);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCHEMES, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save custom scheme:', e);
  }
}

export function deleteCustomScheme(id: string): SchemeOfWork[] {
  try {
    const updated = getCustomSchemes().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCHEMES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom scheme:', e);
    return getCustomSchemes();
  }
}

export function getTeacherProfile(): TeacherProfile {
  const defaults: TeacherProfile = {
    schoolName: '',
    teacherName: '',
    defaultDuration: '40 Minutes',
    activeProvider: 'gemini',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
    claudeApiKey: '',
    claudeModel: 'claude-3-5-sonnet-20241022',
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    openaiBaseUrl: 'https://api.openai.com/v1'
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }

  return defaults;
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}
