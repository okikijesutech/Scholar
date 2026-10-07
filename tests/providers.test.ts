import { describe, it, expect } from 'vitest';
import { cleanAndExtractJson } from '../src/services/ai/providers/jsonHelper';
import { mergeSchemeWeeks } from '../src/services/schemeExtractorService';
import { resolveActiveProviderConfig, testProviderConnection } from '../src/services/ai/providers';
import { refineLessonNote } from '../src/services/aiGenerator';
import type { TeacherProfile, SchemeWeek, LessonNote } from '../src/types';

describe('AI Providers & Utilities', () => {
  describe('cleanAndExtractJson Helper', () => {
    it('parses raw clean JSON string', () => {
      const raw = '{"name": "Lesson Plan", "week": 3}';
      const parsed = cleanAndExtractJson<{ name: string; week: number }>(raw);
      expect(parsed.name).toBe('Lesson Plan');
      expect(parsed.week).toBe(3);
    });

    it('extracts JSON enclosed within markdown code fences', () => {
      const text = 'Here is the requested note:\n```json\n{"subject": "Basic Science", "weeks": [1, 2]}\n```\nHope this helps!';
      const parsed = cleanAndExtractJson<{ subject: string; weeks: number[] }>(text);
      expect(parsed.subject).toBe('Basic Science');
      expect(parsed.weeks).toEqual([1, 2]);
    });

    it('handles trailing commas and balanced JSON extraction', () => {
      const text = 'Result: {"topic": "Photosynthesis", "duration": "40 Mins", } Thank you.';
      const parsed = cleanAndExtractJson<{ topic: string; duration: string }>(text);
      expect(parsed.topic).toBe('Photosynthesis');
      expect(parsed.duration).toBe('40 Mins');
    });

    it('throws when text contains no valid JSON object or array', () => {
      expect(() => cleanAndExtractJson('Hello world, no JSON here')).toThrow();
    });
  });

  describe('mergeSchemeWeeks (Multi-Page Spread Merging)', () => {
    it('merges non-overlapping weeks and sorts them ascendingly', () => {
      const page1Weeks: SchemeWeek[] = [
        { week: 1, topic: 'Whole Numbers', subTopic: 'Count to 1000', objectivesSummary: 'Count', suggestedMaterials: 'Abacus' },
        { week: 2, topic: 'Addition', subTopic: '3-digit addition', objectivesSummary: 'Add', suggestedMaterials: 'Counters' }
      ];
      const page2Weeks: SchemeWeek[] = [
        { week: 3, topic: 'Fractions', subTopic: 'Proper fractions', objectivesSummary: 'Identify fractions', suggestedMaterials: 'Fraction chart' }
      ];

      const merged = mergeSchemeWeeks(page1Weeks, page2Weeks);
      expect(merged).toHaveLength(3);
      expect(merged.map(w => w.week)).toEqual([1, 2, 3]);
    });

    it('deduplicates and updates existing weeks when new page provides revised data', () => {
      const existing: SchemeWeek[] = [
        { week: 1, topic: 'Draft Topic', subTopic: '', objectivesSummary: '', suggestedMaterials: '' },
        { week: 2, topic: 'Week 2', subTopic: '', objectivesSummary: '', suggestedMaterials: '' }
      ];
      const incoming: SchemeWeek[] = [
        { week: 1, topic: 'Finalized Topic', subTopic: 'Expanded Subtopic', objectivesSummary: 'Clear outcomes', suggestedMaterials: 'Flashcards' }
      ];

      const merged = mergeSchemeWeeks(existing, incoming);
      expect(merged).toHaveLength(2);
      expect(merged[0].topic).toBe('Finalized Topic');
      expect(merged[0].subTopic).toBe('Expanded Subtopic');
      expect(merged[1].topic).toBe('Week 2');
    });
  });

  describe('resolveActiveProviderConfig', () => {
    it('defaults to Gemini when activeProvider is not set', () => {
      const profile: TeacherProfile = {
        schoolName: 'Test School',
        teacherName: 'Mr. Okon',
        defaultDuration: '40 Minutes',
        geminiApiKey: 'test-gemini-key'
      };
      const config = resolveActiveProviderConfig(profile);
      expect(config.provider).toBe('gemini');
      expect(config.apiKey).toBe('test-gemini-key');
    });

    it('resolves Claude config when activeProvider is claude', () => {
      const profile: TeacherProfile = {
        schoolName: 'Test School',
        teacherName: 'Mrs. Adebayo',
        defaultDuration: '40 Minutes',
        activeProvider: 'claude',
        claudeApiKey: 'sk-ant-test-key',
        claudeModel: 'claude-3-haiku-20240307'
      };
      const config = resolveActiveProviderConfig(profile);
      expect(config.provider).toBe('claude');
      expect(config.apiKey).toBe('sk-ant-test-key');
      expect(config.model).toBe('claude-3-haiku-20240307');
    });

    it('resolves OpenAI config with custom base URL', () => {
      const profile: TeacherProfile = {
        schoolName: 'Test School',
        teacherName: 'Mr. Musa',
        defaultDuration: '40 Minutes',
        activeProvider: 'openai',
        openaiApiKey: 'gsk-test-key',
        openaiModel: 'llama-3.3-70b-versatile',
        openaiBaseUrl: 'https://api.groq.com/openai/v1'
      };
      const config = resolveActiveProviderConfig(profile);
      expect(config.provider).toBe('openai');
      expect(config.apiKey).toBe('gsk-test-key');
      expect(config.baseUrl).toBe('https://api.groq.com/openai/v1');
    });
  });

  describe('testProviderConnection & refineLessonNote validation', () => {
    it('fails fast when API key is missing or blank', async () => {
      const result = await testProviderConnection({ provider: 'gemini', apiKey: '   ' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('API key is required');
    });

    it('refineLessonNote throws when no provider API key is supplied', async () => {
      const dummyNote: LessonNote = {
        id: 'test-1',
        schoolName: 'Test School',
        teacherName: 'Teacher',
        subject: 'Mathematics',
        classLevel: 'Primary 4',
        term: '1st Term',
        week: 1,
        date: '2026-10-07',
        duration: '40 Minutes',
        period: '1st Period',
        averageAge: '9 years',
        topic: 'Addition',
        subTopic: 'Simple Addition',
        behavioralObjectives: ['Add two numbers'],
        previousKnowledge: 'Can count to 50',
        instructionalMaterials: ['Counters'],
        referenceBooks: ['Macmillan Primary Math'],
        contentSections: [],
        classroomActivities: [],
        steps: [],
        evaluation: ['Add 2 + 2'],
        summary: 'Summary',
        assignment: 'Do exercise 1',
        createdAt: '2026-10-07T00:00:00.000Z',
        updatedAt: '2026-10-07T00:00:00.000Z'
      };

      await expect(
        refineLessonNote(dummyNote, 'Make evaluation easier', { provider: 'gemini', apiKey: '' })
      ).rejects.toThrow('An active AI provider with a valid API key is required');
    });
  });
});
