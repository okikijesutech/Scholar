import type { LessonNote, TeacherProfile, SchemeOfWork } from '../types';
import { SAMPLE_LESSON_NOTES } from '../data/sampleNotes';

const STORAGE_KEY_NOTES = 'naija_lesson_notes_v1';
const STORAGE_KEY_PROFILE = 'naija_teacher_profile_v1';
const STORAGE_KEY_CUSTOM_SCHEMES = 'naija_custom_schemes_v1';

export function getStoredNotes(): LessonNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(SAMPLE_LESSON_NOTES));
      return SAMPLE_LESSON_NOTES;
    }
    const parsed: LessonNote[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SAMPLE_LESSON_NOTES;

    // Ensure sample-crs-jss2-week4 exists in notes
    const hasCrs = parsed.some(n => n.id === 'sample-crs-jss2-week4');
    if (!hasCrs) {
      const merged = [SAMPLE_LESSON_NOTES[0], ...parsed];
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(merged));
      return merged;
    }

    return parsed;
  } catch (e) {
    console.error('Failed to parse notes from storage:', e);
    return SAMPLE_LESSON_NOTES;
  }
}

export function saveNote(note: LessonNote): void {
  try {
    const notes = getStoredNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      notes.unshift({ ...note, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save note:', e);
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

export function duplicateNote(note: LessonNote): LessonNote {
  const newNote: LessonNote = {
    ...note,
    id: `note-${Date.now()}`,
    week: note.week < 12 ? note.week + 1 : note.week,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveNote(newNote);
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }

  return {
    schoolName: 'Federal Government College, Lagos',
    teacherName: 'Mr. Babatunde Alabi',
    geminiApiKey: '',
    defaultDuration: '40 Minutes'
  };
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}
