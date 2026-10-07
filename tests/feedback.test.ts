import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveFeedback,
  getFeedbackForNote,
  getFeedbackForSection,
  removeFeedback,
  getAllFeedback,
  exportFeedbackJson,
  clearFeedback,
  FEEDBACK_REASON_LABELS
} from '../src/services/feedbackService';
import { sectionFeedbackSchema } from '../src/schemas';

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

describe('Section Micro-Feedback & Nigerian Context Tags', () => {
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

  it('provides all 6 recognized Nigerian context and pedagogy feedback reasons', () => {
    const reasons = Object.keys(FEEDBACK_REASON_LABELS);
    expect(reasons).toContain('not_nigerian_context');
    expect(reasons).toContain('too_advanced');
    expect(reasons).toContain('too_simple');
    expect(reasons).toContain('wrong_curriculum_week');
    expect(reasons).toContain('inaccurate_content');
    expect(reasons).toContain('unclear_explanation');
    expect(FEEDBACK_REASON_LABELS.not_nigerian_context.label).toContain('foreign examples');
  });

  it('records positive thumbs-up feedback for a section', () => {
    const saved = saveFeedback({
      noteId: 'note-101',
      sectionKey: 'objectives',
      sectionTitle: 'Learning Objectives',
      rating: 'thumbs_up',
      reasons: [],
      comment: ''
    });

    expect(saved.id).toBeDefined();
    expect(saved.rating).toBe('thumbs_up');

    const retrieved = getFeedbackForSection('note-101', 'objectives');
    expect(retrieved).toBeDefined();
    expect(retrieved?.rating).toBe('thumbs_up');
  });

  it('records negative feedback with Nigerian context reasons and custom comment', () => {
    const saved = saveFeedback({
      noteId: 'note-101',
      sectionKey: 'content-section-1',
      sectionTitle: 'Section 1: Definition of Fractions',
      rating: 'thumbs_down',
      reasons: ['not_nigerian_context', 'too_advanced'],
      comment: 'Please use Naira instead of US Dollars in the word problem'
    });

    expect(saved.rating).toBe('thumbs_down');
    expect(saved.reasons).toContain('not_nigerian_context');
    expect(saved.reasons).toContain('too_advanced');
    expect(saved.comment).toContain('Naira');

    const noteFeedback = getFeedbackForNote('note-101');
    expect(noteFeedback.length).toBe(1);
    expect(noteFeedback[0].sectionKey).toBe('content-section-1');
  });

  it('updates existing feedback for the same section without duplicating records', () => {
    saveFeedback({
      noteId: 'note-101',
      sectionKey: 'activities',
      sectionTitle: 'Classroom Activities',
      rating: 'thumbs_down',
      reasons: ['too_simple']
    });

    expect(getAllFeedback().length).toBe(1);

    // User changes mind to thumbs up
    saveFeedback({
      noteId: 'note-101',
      sectionKey: 'activities',
      sectionTitle: 'Classroom Activities',
      rating: 'thumbs_up',
      reasons: []
    });

    const all = getAllFeedback();
    expect(all.length).toBe(1);
    expect(all[0].rating).toBe('thumbs_up');
  });

  it('removes feedback cleanly', () => {
    saveFeedback({
      noteId: 'note-101',
      sectionKey: 'evaluation',
      sectionTitle: 'Evaluation Questions',
      rating: 'thumbs_up',
      reasons: []
    });

    expect(getFeedbackForSection('note-101', 'evaluation')).toBeDefined();

    removeFeedback('note-101', 'evaluation');
    expect(getFeedbackForSection('note-101', 'evaluation')).toBeUndefined();
  });

  it('exports feedback as valid JSON string', () => {
    saveFeedback({
      noteId: 'note-101',
      sectionKey: 'objectives',
      sectionTitle: 'Learning Objectives',
      rating: 'thumbs_up',
      reasons: []
    });

    const json = exportFeedbackJson();
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
    expect(parsed[0].noteId).toBe('note-101');
  });

  it('clears all feedback records when requested', () => {
    saveFeedback({
      noteId: 'note-101',
      sectionKey: 'objectives',
      sectionTitle: 'Learning Objectives',
      rating: 'thumbs_up',
      reasons: []
    });
    expect(getAllFeedback().length).toBe(1);
    clearFeedback();
    expect(getAllFeedback().length).toBe(0);
  });

  it('validates feedback objects against the Zod schema', () => {
    const valid = {
      id: 'fb-1',
      noteId: 'note-1',
      sectionKey: 'objectives',
      sectionTitle: 'Objectives',
      rating: 'thumbs_down',
      reasons: ['not_nigerian_context'],
      comment: 'Fix context',
      createdAt: '2026-10-07T00:00:00.000Z'
    };
    expect(sectionFeedbackSchema.safeParse(valid).success).toBe(true);

    const invalidRating = { ...valid, rating: 'invalid-rating' };
    expect(sectionFeedbackSchema.safeParse(invalidRating).success).toBe(false);

    const invalidReason = { ...valid, reasons: ['non-existent-reason'] };
    expect(sectionFeedbackSchema.safeParse(invalidReason).success).toBe(false);
  });
});
