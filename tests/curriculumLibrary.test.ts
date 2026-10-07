import { describe, it, expect } from 'vitest';
import {
  findCuratedTopic,
  CURRICULUM_DATA_REGISTRY,
  mathFractionsData,
  mathRectanglesData,
  scienceHabitatsData,
  languageAdjectivesData,
  religiousTemptationData
} from '../src/data/curriculumLibrary';
import { lessonNoteSchema, schemeOfWorkSchema } from '../src/schemas';

describe('Curriculum Data Library & Retrieval', () => {
  it('registers all core curriculum modules in the registry', () => {
    expect(CURRICULUM_DATA_REGISTRY.length).toBeGreaterThanOrEqual(5);
    const ids = CURRICULUM_DATA_REGISTRY.map(t => t.id);
    expect(ids).toContain('math-fractions');
    expect(ids).toContain('math-rectangles');
    expect(ids).toContain('science-habitats');
    expect(ids).toContain('language-adjectives');
    expect(ids).toContain('religious-temptation');
  });

  it('retrieves fraction data accurately from query strings', () => {
    const match = findCuratedTopic('Mathematics', 'Fractions', 'Addition of Proper Fractions');
    expect(match).toBeDefined();
    expect(match?.id).toBe(mathFractionsData.id);
    expect(match?.contentSections.length).toBe(5);
    expect(match?.evaluation.length).toBeGreaterThanOrEqual(5);
  });

  it('retrieves rectangle geometry data accurately', () => {
    const match = findCuratedTopic('Mathematics', 'Plane Shapes', 'Properties of Rectangles');
    expect(match).toBeDefined();
    expect(match?.id).toBe(mathRectanglesData.id);
    expect(match?.coreRule).toContain('rectangle is a quadrilateral');
  });

  it('retrieves science habitat data accurately', () => {
    const match = findCuratedTopic('Basic Science', 'Living Things', 'Habitats and Adaptation');
    expect(match).toBeDefined();
    expect(match?.id).toBe(scienceHabitatsData.id);
  });

  it('retrieves English adjectives data accurately', () => {
    const match = findCuratedTopic('English Language', 'Grammar', 'Types of Adjectives');
    expect(match).toBeDefined();
    expect(match?.id).toBe(languageAdjectivesData.id);
  });

  it('retrieves CRS temptation data accurately', () => {
    const match = findCuratedTopic('Christian Religious Studies', 'Temptations of Jesus', 'Wilderness Temptation');
    expect(match).toBeDefined();
    expect(match?.id).toBe(religiousTemptationData.id);
  });

  it('returns undefined for topics without curated data so skeleton generator takes over', () => {
    const match = findCuratedTopic('Social Studies', 'Leadership', 'Traditional Institutions');
    expect(match).toBeUndefined();
  });
});

describe('Zod Schema Validation Engine', () => {
  it('validates a minimal compliant lesson note', () => {
    const result = lessonNoteSchema.safeParse({
      id: 'note-1',
      subject: 'Mathematics',
      classLevel: 'JSS 1',
      term: '1st Term',
      week: 1,
      topic: 'Whole Numbers',
      contentSections: [],
      classroomActivities: [],
      steps: [],
      evaluation: []
    });
    expect(result.success).toBe(true);
  });

  it('rejects a note missing required properties', () => {
    const result = lessonNoteSchema.safeParse({
      id: 'note-1',
      // missing subject, classLevel, term, week, topic
    });
    expect(result.success).toBe(false);
  });

  it('validates scheme of work structure', () => {
    const result = schemeOfWorkSchema.safeParse({
      id: 'scheme-1',
      subject: 'Basic Technology',
      classLevel: 'JSS 2',
      term: '2nd Term',
      weeks: [
        {
          week: 1,
          topic: 'Woodwork Machines',
          subTopic: 'Circular Saw',
          objectivesSummary: 'State functions of circular saw',
          suggestedMaterials: 'Safety goggles, workshop chart'
        }
      ]
    });
    expect(result.success).toBe(true);
  });
});
