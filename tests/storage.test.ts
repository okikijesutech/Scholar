import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveNote,
  getStoredNotes,
  isValidLessonNote,
  duplicateNote
} from '../src/services/storageService';
import type { LessonNote } from '../src/types';

const mockValidNote: LessonNote = {
  id: 'test-note-1',
  schoolName: 'Federal Government College Lagos',
  teacherName: 'Mr. Babatunde',
  subject: 'Mathematics',
  classLevel: 'JSS 1',
  term: '1st Term',
  week: 3,
  date: '2026-10-07',
  duration: '40 Minutes',
  period: '1st Period',
  averageAge: '11 - 12 years',
  topic: 'Plane Shapes',
  subTopic: 'Properties of Rectangles',
  references: 'NERDC Curriculum for JSS 1',
  behavioralObjectives: ['Identify 4 right angles', 'Calculate perimeter'],
  previousKnowledge: 'Learners can identify straight lines',
  instructionalMaterials: ['Cardboard rectangle', 'Meter ruler'],
  referenceBooks: ['New General Mathematics 1'],
  contentSections: [
    {
      sectionNumber: 1,
      heading: 'Definition of Rectangle',
      body: 'A quadrilateral with 4 right angles.',
      lessonTakeaway: 'Opposite sides are equal.'
    }
  ],
  classroomActivities: [
    {
      title: 'Measuring desks',
      description: 'Measure length and breadth in pairs.'
    }
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Introduction',
      durationMinutes: 5,
      teacherActivity: 'Shows rectangle cutout',
      studentActivity: 'Observes'
    }
  ],
  evaluation: ['What is a rectangle?'],
  summary: 'Reviewed properties.',
  assignment: 'Exercise 3A questions 1-5.',
  keyScriptureOrCoreRule: 'Opposite sides are parallel and equal.',
  teacherRemarks: '',
  hodRemarks: '',
  createdAt: '2026-10-07T00:00:00.000Z',
  updatedAt: '2026-10-07T00:00:00.000Z'
};

let store: Record<string, string> = {};

const mockStorage = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value.toString();
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    store = {};
  })
};

vi.stubGlobal('localStorage', mockStorage);

describe('Storage Service & Schema Validation', () => {
  beforeEach(() => {
    store = {};
    mockStorage.setItem.mockImplementation((key: string, value: string) => {
      store[key] = value.toString();
    });
    mockStorage.getItem.mockImplementation((key: string) => store[key] || null);
    vi.clearAllMocks();
  });

  it('validates authentic LessonNote schema', () => {
    expect(isValidLessonNote(mockValidNote)).toBe(true);
  });

  it('rejects corrupt or malformed note objects', () => {
    expect(isValidLessonNote(null)).toBe(false);
    expect(isValidLessonNote(undefined)).toBe(false);
    expect(isValidLessonNote({})).toBe(false);
    expect(isValidLessonNote({ id: '123' })).toBe(false);
    expect(isValidLessonNote({ ...mockValidNote, contentSections: 'not-an-array' })).toBe(false);
    expect(isValidLessonNote({ ...mockValidNote, week: 'invalid-week-number' })).toBe(false);
  });

  it('successfully saves and retrieves a note', () => {
    const saveResult = saveNote(mockValidNote);
    expect(saveResult.success).toBe(true);
    expect(saveResult.error).toBeUndefined();

    const stored = getStoredNotes();
    const found = stored.find(n => n.id === mockValidNote.id);
    expect(found).toBeDefined();
    expect(found?.topic).toBe('Plane Shapes');
  });

  it('handles and surfaces storage write failures gracefully', () => {
    // Seed storage first so initial check in getStoredNotes does not trigger seed write
    mockStorage.setItem('naija_notes_seeded_v1', 'true');
    mockStorage.setItem('naija_lesson_notes_v1', '[]');

    mockStorage.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError: LocalStorage quota exceeded');
    });

    const result = saveNote(mockValidNote);
    expect(result.success).toBe(false);
    expect(result.error).toContain('QuotaExceededError');
  });

  it('filters out corrupted items from localStorage without crashing', () => {
    localStorage.setItem(
      'naija_lesson_notes_v1',
      JSON.stringify([
        mockValidNote,
        { id: 'corrupt-1', invalidData: true },
        'random-string-in-array'
      ])
    );
    localStorage.setItem('naija_notes_seeded_v1', 'true');

    const notes = getStoredNotes();
    expect(notes.length).toBe(1);
    expect(notes[0].id).toBe(mockValidNote.id);
  });

  it('duplicates notes and attaches new ID and timestamp', () => {
    const duplicated = duplicateNote(mockValidNote);
    expect(duplicated).not.toBeNull();
    expect(duplicated?.id).not.toBe(mockValidNote.id);
    expect(duplicated?.topic).toContain('(Copy)');

    const stored = getStoredNotes();
    expect(stored.some(n => n.id === duplicated?.id)).toBe(true);
  });
});
