import { describe, it, expect } from 'vitest';
import {
  generateSubjectSpecificContentSections,
  generateSubjectSpecificClassroomActivities,
  generateSubjectSpecificEvaluation,
  generateSubjectSpecificCoreRule
} from '../src/services/templates/subjectKnowledgeBase';
import { categorizeSubject } from '../src/services/templates/subjectCategories';

describe('Curriculum Topic Matching & Disambiguation', () => {
  it('correctly avoids matching "Properties of Rectangles" to the Fractions module', () => {
    const sections = generateSubjectSpecificContentSections(
      'Mathematics',
      'Plane Shapes',
      'Properties of Rectangles'
    );

    expect(sections).toBeDefined();
    expect(sections.length).toBeGreaterThanOrEqual(4);

    // Verify it is NOT fraction content
    const allText = JSON.stringify(sections).toLowerCase();
    expect(allText).not.toContain('numerator');
    expect(allText).not.toContain('denominator');
    expect(allText).not.toContain('improper fraction');
    expect(allText).not.toContain('lowest common multiple');

    // Verify it IS rectangle/geometry content
    expect(allText).toContain('rectangle');
    expect(allText).toContain('90');
    expect(allText).toContain('perimeter');
  });

  it('correctly matches genuine fraction topics to the Fractions module', () => {
    const sections = generateSubjectSpecificContentSections(
      'Mathematics',
      'Fractions',
      'Addition of Proper Fractions'
    );

    expect(sections).toBeDefined();
    const allText = JSON.stringify(sections).toLowerCase();
    expect(allText).toContain('fraction');
    expect(allText).toContain('numerator');
    expect(allText).toContain('denominator');
    expect(allText).toContain('lcm');
  });

  it('properly categorizes Home Economics as vocational, not commercial', () => {
    expect(categorizeSubject('Home Economics')).toBe('vocational');
    expect(categorizeSubject('Basic Technology')).toBe('vocational');
    expect(categorizeSubject('Agricultural Science')).toBe('science');
    expect(categorizeSubject('Commerce')).toBe('commercial');
    expect(categorizeSubject('Business Studies')).toBe('commercial');
  });

  it('generates an honest pedagogical NERDC skeleton for uncovered offline topics', () => {
    const sections = generateSubjectSpecificContentSections(
      'Agricultural Science',
      'Crop Production',
      'Methods of Soil Preparation'
    );

    expect(sections).toBeDefined();
    expect(sections.length).toBe(5);

    const allText = JSON.stringify(sections);

    // Must contain explicit pedagogical teacher prompts
    expect(allText).toContain('[Teacher Note:');

    // Must NOT contain deceptive pseudo-mathematical filler
    expect(allText).not.toContain('Example 1: Step-by-step resolution of a standard problem');
    expect(allText).not.toContain('Step 1: Write down the given expression');
    expect(allText).not.toContain('Step 2: Group like terms or isolate variables');
  });

  it('provides honest teacher-guided activities and evaluation for uncovered topics', () => {
    const activities = generateSubjectSpecificClassroomActivities(
      'Social Studies',
      'National Values',
      'Integrity and Honest Living'
    );
    expect(activities).toBeDefined();
    expect(activities.length).toBe(3);
    expect(JSON.stringify(activities)).toContain('[Teacher Note:');

    const evalQuestions = generateSubjectSpecificEvaluation(
      'Social Studies',
      'National Values',
      'Integrity and Honest Living'
    );
    expect(evalQuestions).toBeDefined();
    expect(evalQuestions.length).toBeGreaterThanOrEqual(5);

    const rule = generateSubjectSpecificCoreRule('Social Studies', 'National Values');
    expect(rule).toBeDefined();
    expect(typeof rule).toBe('string');
  });
});
