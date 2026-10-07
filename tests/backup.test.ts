import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateBackupBundle,
  parseAndValidateBackup,
  restoreBackupBundle,
  clearAllLocalData,
  type BackupBundle
} from '../src/services/backupService';
import type { LessonNote, SchemeOfWork } from '../src/types';

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

const sampleNote1: LessonNote = {
  id: 'note-backup-1',
  schoolName: 'King\'s College Lagos',
  teacherName: 'Mrs. Adebayo',
  subject: 'Mathematics',
  classLevel: 'Primary 5',
  term: '1st Term',
  week: 2,
  date: '2026-10-08',
  duration: '40 Minutes',
  period: '1st Period',
  averageAge: '9 - 10 years',
  topic: 'Fractions',
  subTopic: 'Equivalent Fractions',
  references: 'NERDC Primary 5 Syllabus',
  behavioralObjectives: ['Identify equivalent fractions', 'Simplify fractions'],
  previousKnowledge: 'Learners understand proper fractions',
  instructionalMaterials: ['Fraction chart', 'Cuisenaire rods'],
  referenceBooks: ['MAN Mathematics Book 5'],
  contentSections: [
    {
      sectionNumber: 1,
      heading: 'Concept of Equivalence',
      body: 'Fractions that represent the same value.',
      lessonTakeaway: 'Multiply or divide numerator and denominator by same number.'
    }
  ],
  classroomActivities: [
    {
      title: 'Fraction Paper Folding',
      description: 'Fold paper strips in halves and quarters.'
    }
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Introduction',
      durationMinutes: 5,
      teacherActivity: 'Demonstrates paper folding',
      studentActivity: 'Observe and fold paper'
    }
  ],
  evaluation: ['Simplify 4/8 to lowest term'],
  summary: 'Reviewed equivalent fractions concept.',
  assignment: 'Page 45 Exercise 2.',
  createdAt: '2026-10-08T09:00:00.000Z',
  updatedAt: '2026-10-08T09:00:00.000Z'
};

const sampleCustomScheme: SchemeOfWork = {
  id: 'scheme-backup-1',
  subject: 'Basic Science',
  classLevel: 'JSS 1',
  term: '1st Term',
  state: 'Lagos',
  weeks: [
    {
      week: 1,
      topic: 'Living and Non-Living Things',
      subTopic: 'Classification',
      objectivesSummary: 'Classify matter into living and non-living',
      suggestedMaterials: 'Plants, rocks'
    }
  ]
};

describe('LessonFlow Backup & Restore Service', () => {
  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
  });

  describe('generateBackupBundle', () => {
    it('creates a complete, typed LessonFlow backup bundle', () => {
      // Seed storage with a note
      store['naija_lesson_notes_v1'] = JSON.stringify([sampleNote1]);
      store['naija_custom_schemes_v1'] = JSON.stringify([sampleCustomScheme]);
      store['naija_teacher_profile_v1'] = JSON.stringify({
        teacherName: 'Mrs. Adebayo',
        schoolName: 'King\'s College Lagos',
        state: 'Lagos',
        defaultDuration: '40 Minutes'
      });

      const bundle = generateBackupBundle('Periodic Test Export');

      expect(bundle.version).toBe(1);
      expect(bundle.appName).toBe('LessonFlow');
      expect(bundle.notes.length).toBe(1);
      expect(bundle.notes[0].id).toBe('note-backup-1');
      expect(bundle.customSchemes.length).toBe(1);
      expect(bundle.customSchemes[0].subject).toBe('Basic Science');
      expect(bundle.teacherProfile?.teacherName).toBe('Mrs. Adebayo');
      expect(bundle.metadata?.notesCount).toBe(1);
      expect(bundle.metadata?.exportReason).toBe('Periodic Test Export');
    });
  });

  describe('parseAndValidateBackup', () => {
    it('validates and parses a compliant LessonFlow JSON string', () => {
      const validBundle: BackupBundle = {
        version: 1,
        appName: 'LessonFlow',
        exportedAt: new Date().toISOString(),
        notes: [sampleNote1],
        customSchemes: [sampleCustomScheme],
        verifiedStateSchemes: []
      };

      const jsonStr = JSON.stringify(validBundle);
      const res = parseAndValidateBackup(jsonStr);

      expect(res.success).toBe(true);
      expect(res.bundle).toBeDefined();
      expect(res.bundle?.notes.length).toBe(1);
    });

    it('rejects corrupt or malformed JSON', () => {
      const malformed = '{ invalid: json syntax ';
      const res = parseAndValidateBackup(malformed);

      expect(res.success).toBe(false);
      expect(res.error).toContain('Corrupt JSON');
    });

    it('rejects JSON missing required structure or invalid schema', () => {
      const invalid = JSON.stringify({
        appName: 'UnknownApp',
        notes: 'this should be an array not a string'
      });
      const res = parseAndValidateBackup(invalid);

      expect(res.success).toBe(false);
      expect(res.error).toContain('Invalid backup file structure');
    });
  });

  describe('restoreBackupBundle', () => {
    it('replaces all local notes and schemes when mode is "replace"', () => {
      // Existing note in local storage
      store['naija_lesson_notes_v1'] = JSON.stringify([{ ...sampleNote1, id: 'old-note-99' }]);

      const bundleToRestore: BackupBundle = {
        version: 1,
        appName: 'LessonFlow',
        exportedAt: new Date().toISOString(),
        notes: [sampleNote1],
        customSchemes: [sampleCustomScheme],
        teacherProfile: {
          teacherName: 'New Teacher Name',
          schoolName: 'New School',
          state: 'Ogun',
          defaultDuration: '45 Minutes'
        }
      };

      const res = restoreBackupBundle(bundleToRestore, 'replace');

      expect(res.success).toBe(true);
      expect(res.notesCount).toBe(1);
      expect(res.schemesCount).toBe(1);

      const restoredNotes: LessonNote[] = JSON.parse(store['naija_lesson_notes_v1'] || '[]');
      expect(restoredNotes.length).toBe(1);
      expect(restoredNotes[0].id).toBe('note-backup-1');

      const restoredProfile = JSON.parse(store['naija_teacher_profile_v1'] || '{}');
      expect(restoredProfile.teacherName).toBe('New Teacher Name');
    });

    it('merges notes and deduplicates by ID with timestamp precedence in "merge" mode', () => {
      const existingNoteOlder: LessonNote = {
        ...sampleNote1,
        id: 'note-backup-1',
        topic: 'Old Fractions Topic',
        updatedAt: '2026-10-07T00:00:00.000Z'
      };

      const existingIndependentNote: LessonNote = {
        ...sampleNote1,
        id: 'independent-note-2',
        topic: 'Algebra'
      };

      store['naija_lesson_notes_v1'] = JSON.stringify([existingNoteOlder, existingIndependentNote]);

      const incomingNewerNote: LessonNote = {
        ...sampleNote1,
        id: 'note-backup-1',
        topic: 'Updated Equivalent Fractions',
        updatedAt: '2026-10-08T12:00:00.000Z'
      };

      const incomingBrandNewNote: LessonNote = {
        ...sampleNote1,
        id: 'brand-new-note-3',
        topic: 'Geometry'
      };

      const bundle: BackupBundle = {
        version: 1,
        appName: 'LessonFlow',
        exportedAt: new Date().toISOString(),
        notes: [incomingNewerNote, incomingBrandNewNote],
        customSchemes: []
      };

      const res = restoreBackupBundle(bundle, 'merge');

      expect(res.success).toBe(true);
      expect(res.notesCount).toBe(1); // 1 brand new note added

      const savedNotes: LessonNote[] = JSON.parse(store['naija_lesson_notes_v1'] || '[]');
      expect(savedNotes.length).toBe(3); // independent-2, note-backup-1, brand-new-3

      const updatedTarget = savedNotes.find(n => n.id === 'note-backup-1');
      expect(updatedTarget?.topic).toBe('Updated Equivalent Fractions');
    });
  });

  describe('clearAllLocalData', () => {
    it('removes notes and custom schemes from storage', () => {
      store['naija_lesson_notes_v1'] = 'notes';
      store['naija_custom_schemes_v1'] = 'schemes';
      store['naija_notes_seeded_v1'] = 'true';

      clearAllLocalData();

      expect(store['naija_lesson_notes_v1']).toBeUndefined();
      expect(store['naija_custom_schemes_v1']).toBeUndefined();
      expect(store['naija_notes_seeded_v1']).toBeUndefined();
    });
  });
});
