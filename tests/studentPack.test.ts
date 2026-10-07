import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateStudentPack,
  formatStudentPackForWhatsApp,
  getStudentPackForNote,
  saveStudentPack,
  getStoredStudentPacks
} from '../src/services/studentPackService';
import type { LessonNote } from '../src/types';
import { studentPackSchema } from '../src/schemas';

const mockMathNote: LessonNote = {
  id: 'note-math-1',
  schoolName: 'King\'s College Lagos',
  teacherName: 'Mr. Babatunde',
  subject: 'Mathematics',
  classLevel: 'JSS 1',
  term: '1st Term',
  week: 3,
  date: '2026-10-08',
  duration: '40 Minutes',
  period: '1st Period',
  averageAge: '11 - 12 years',
  topic: 'Fractions',
  subTopic: 'Addition of Like and Unlike Fractions',
  references: 'NERDC Curriculum for JSS 1',
  behavioralObjectives: ['Add like fractions', 'Find LCM for unlike fractions'],
  previousKnowledge: 'Learners understand basic whole numbers',
  instructionalMaterials: ['Fraction strips', 'Paper cutouts'],
  referenceBooks: ['New General Mathematics 1'],
  contentSections: [
    {
      sectionNumber: 1,
      heading: 'Concept of Fractions',
      body: 'A fraction represents a part of a whole quantity.',
      lessonTakeaway: 'Never add denominators together.'
    }
  ],
  classroomActivities: [
    {
      title: 'Fraction Paper Folding',
      description: 'Fold paper in halves and quarters.'
    }
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Introduction',
      durationMinutes: 5,
      teacherActivity: 'Shows strips',
      studentActivity: 'Observes'
    }
  ],
  evaluation: ['What is a fraction?'],
  summary: 'Learned fraction addition rules.',
  assignment: 'Exercise 2B questions 1-5',
  keyScriptureOrCoreRule: 'Find LCM of unlike denominators first.',
  createdAt: '2026-10-08T00:00:00.000Z',
  updatedAt: '2026-10-08T00:00:00.000Z'
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

describe('WhatsApp Student Pack Generator & Service', () => {
  beforeEach(() => {
    store = {};
    mockStorage.setItem.mockImplementation((key: string, value: string) => {
      store[key] = value.toString();
    });
    mockStorage.getItem.mockImplementation((key: string) => store[key] || null);
    mockStorage.removeItem.mockImplementation((key: string) => {
      delete store[key];
    });
    vi.clearAllMocks();
  });

  it('generates a 5-question multiple choice quiz tailored to fractions', () => {
    const pack = generateStudentPack(mockMathNote);

    expect(pack.id).toBeDefined();
    expect(pack.noteId).toBe(mockMathNote.id);
    expect(pack.quizQuestions.length).toBe(5);

    // Verify each question has 4 options and a valid answer
    pack.quizQuestions.forEach(q => {
      expect(q.options.A).toBeDefined();
      expect(q.options.B).toBeDefined();
      expect(q.options.C).toBeDefined();
      expect(q.options.D).toBeDefined();
      expect(['A', 'B', 'C', 'D']).toContain(q.correctOption);
      expect(q.explanation.length).toBeGreaterThan(5);
    });

    // Check fractions content
    const fractionMention = pack.quizQuestions.some(q => q.question.toLowerCase().includes('fraction'));
    expect(fractionMention).toBe(true);
  });

  it('formats student study pack for WhatsApp with markdown and emojis', () => {
    const pack = generateStudentPack(mockMathNote);
    const formatted = formatStudentPackForWhatsApp(pack);

    expect(formatted).toContain('LESSONFLOW STUDENT STUDY PACK');
    expect(formatted).toContain('*Subject:* Mathematics');
    expect(formatted).toContain('*Topic:* Fractions');
    expect(formatted).toContain('*Q1.*');
    expect(formatted).toContain('*ANSWERS & EXPLANATIONS:*');
    expect(formatted).toContain('LessonFlow');
  });

  it('validates generated student pack against Zod schema', () => {
    const pack = generateStudentPack(mockMathNote);
    const parsed = studentPackSchema.safeParse(pack);
    expect(parsed.success).toBe(true);
  });

  it('persists and retrieves student pack for note', () => {
    const pack = generateStudentPack(mockMathNote);
    saveStudentPack(pack);

    const retrieved = getStudentPackForNote(mockMathNote.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(pack.id);

    const all = getStoredStudentPacks();
    expect(all.length).toBe(1);
  });

  it('generates student pack for generic subject using pedagogical fallback', () => {
    const genericNote: LessonNote = {
      ...mockMathNote,
      id: 'note-civic-1',
      subject: 'Civic Education',
      topic: 'Values and Integrity'
    };

    const pack = generateStudentPack(genericNote);
    expect(pack.quizQuestions.length).toBe(5);
    expect(pack.quizQuestions[0].question).toContain('Values and Integrity');
  });
});
