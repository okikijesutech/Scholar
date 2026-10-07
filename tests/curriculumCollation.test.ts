import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  normalizeTopicText,
  calculateTopicSimilarity,
  compareSchemes,
  clusterSchemes,
  promoteClusterToVerifiedStateScheme,
  getVerifiedStateScheme,
  getVerifiedStateSchemes,
  deleteVerifiedStateScheme,
  type SchemeCluster
} from '../src/services/curriculumCollationService';
import type { SchemeOfWork } from '../src/types';

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

describe('Curriculum Collation Engine', () => {
  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
  });

  describe('normalizeTopicText', () => {
    it('strips punctuation, extra spaces, and generic filler prefixes', () => {
      const raw = '  Introduction to Whole Numbers & Place Value (Part 1)!  ';
      const normalized = normalizeTopicText(raw);
      expect(normalized).toBe('whole numbers place value');
    });

    it('removes phrases like "types of", "meaning of", "definition of"', () => {
      expect(normalizeTopicText('Meaning of Farm Animals')).toBe('farm animals');
      expect(normalizeTopicText('Types of Angles')).toBe('angles');
      expect(normalizeTopicText('Definition of Nouns')).toBe('nouns');
    });

    it('handles empty or null string gracefully', () => {
      expect(normalizeTopicText('')).toBe('');
    });
  });

  describe('calculateTopicSimilarity', () => {
    it('returns 1.0 for identical topics', () => {
      const score = calculateTopicSimilarity('Fractions and Decimals', 'Fractions and Decimals');
      expect(score).toBe(1.0);
    });

    it('returns high similarity (>0.5) for semantic variations with filler', () => {
      const sim = calculateTopicSimilarity(
        'Introduction to Whole Numbers',
        'Whole Numbers and Counting'
      );
      expect(sim).toBeGreaterThan(0.3);
    });

    it('returns 0 for completely unrelated topics', () => {
      const sim = calculateTopicSimilarity(
        'Photosynthesis in Green Plants',
        'Simultaneous Linear Equations'
      );
      expect(sim).toBe(0.0);
    });
  });

  describe('compareSchemes', () => {
    const schemeA: SchemeOfWork = {
      id: 'sch-a',
      subject: 'Mathematics',
      classLevel: 'JSS 1',
      term: '1st Term',
      state: 'Lagos',
      weeks: [
        { week: 1, topic: 'Whole Numbers', subTopic: 'Counting', objectivesSummary: 'Count up to billions', suggestedMaterials: 'Abacus' },
        { week: 2, topic: 'Fractions', subTopic: 'Proper fractions', objectivesSummary: 'Identify fractions', suggestedMaterials: 'Chart' },
        { week: 3, topic: 'Decimals', subTopic: 'Conversion', objectivesSummary: 'Convert decimals', suggestedMaterials: 'Worksheet' }
      ]
    };

    const schemeB: SchemeOfWork = {
      id: 'sch-b',
      subject: 'Mathematics',
      classLevel: 'JSS 1',
      term: '1st Term',
      state: 'Lagos',
      weeks: [
        { week: 1, topic: 'Introduction to Whole Numbers', subTopic: 'Number system', objectivesSummary: 'Read whole numbers', suggestedMaterials: 'Flashcards' },
        { week: 2, topic: 'Fractions and Percentages', subTopic: 'Fractions', objectivesSummary: 'Solve fractions', suggestedMaterials: 'Pie chart' },
        { week: 3, topic: 'Computer Hardware', subTopic: 'Peripherals', objectivesSummary: 'Identify devices', suggestedMaterials: 'Mouse' }
      ]
    };

    it('computes matching weeks and average similarity across 12 weeks', () => {
      const result = compareSchemes(schemeA, schemeB);
      expect(result.matchingWeeksCount).toBeGreaterThanOrEqual(1);
      expect(result.similarityScore).toBeGreaterThan(0);
      expect(result.matchedWeeks).toHaveLength(12);
    });
  });

  describe('clusterSchemes & consensus generation', () => {
    const uploadedSchemes: SchemeOfWork[] = [
      {
        id: 'sch-1',
        subject: 'Basic Science',
        classLevel: 'Primary 4',
        term: '1st Term',
        state: 'Ogun',
        weeks: [
          { week: 1, topic: 'Living Things', subTopic: 'Characteristics', objectivesSummary: 'Identify living things', suggestedMaterials: 'Plants' },
          { week: 2, topic: 'Non-Living Things', subTopic: 'Examples', objectivesSummary: 'Identify non-living things', suggestedMaterials: 'Stones' }
        ]
      },
      {
        id: 'sch-2',
        subject: 'Basic Science',
        classLevel: 'Primary 4',
        term: '1st Term',
        state: 'Ogun',
        weeks: [
          { week: 1, topic: 'Study of Living Things', subTopic: 'Plants and animals', objectivesSummary: 'Distinguish living things', suggestedMaterials: 'Specimens' },
          { week: 2, topic: 'Non-Living Things in Nature', subTopic: 'Properties', objectivesSummary: 'List non-living objects', suggestedMaterials: 'Samples' }
        ]
      }
    ];

    it('clusters multiple uploads from the same state, subject and class', () => {
      const clusters = clusterSchemes(uploadedSchemes);
      expect(clusters.length).toBe(1);
      expect(clusters[0].state).toBe('Ogun');
      expect(clusters[0].subject).toBe('Basic Science');
      expect(clusters[0].uploaderCount).toBe(2);
      expect(clusters[0].averageSimilarity).toBeGreaterThan(0.3);
      expect(clusters[0].consensusWeeks.length).toBe(2);
      expect(clusters[0].consensusWeeks[0].topic).toBe('Living Things');
    });
  });

  describe('promoteClusterToVerifiedStateScheme', () => {
    it('promotes a cluster into an admin verified scheme stored in localStorage', () => {
      const sampleCluster: SchemeCluster = {
        clusterId: 'cluster-oyo-math',
        state: 'Oyo',
        classLevel: 'JSS 2',
        subject: 'Mathematics',
        term: '2nd Term',
        schemes: [],
        uploaderCount: 4,
        averageSimilarity: 0.88,
        consensusWeeks: [
          { week: 1, topic: 'Linear Equations', subTopic: 'Single variable', objectivesSummary: 'Solve linear equations', suggestedMaterials: 'Algebra tiles' }
        ],
        verificationStatus: 'peer_confirmed'
      };

      const promoted = promoteClusterToVerifiedStateScheme(sampleCluster, 'Admin Okiki');

      expect(promoted.state).toBe('Oyo');
      expect(promoted.curriculumType).toBe('state_unified');
      expect(promoted.verificationStatus).toBe('admin_verified');
      expect(promoted.uploaderCount).toBe(4);
      expect(promoted.verifiedBy).toBe('Admin Okiki');

      // Test retrieval
      const found = getVerifiedStateScheme('Oyo', 'JSS 2', 'Mathematics', '2nd Term');
      expect(found).toBeDefined();
      expect(found?.id).toBe(promoted.id);
    });

    it('deletes a verified state scheme cleanly', () => {
      const verifiedList = getVerifiedStateSchemes();
      expect(verifiedList.length).toBeGreaterThan(0);
      const targetId = verifiedList[0].id;

      deleteVerifiedStateScheme(targetId);

      const updated = getVerifiedStateSchemes();
      expect(updated.find(s => s.id === targetId)).toBeUndefined();
    });
  });

  describe('Default Seeded Lagos State Schemes', () => {
    it('seeds and retrieves default Lagos State Mathematics and CRS schemes', () => {
      const lagosMath = getVerifiedStateScheme('Lagos', 'JSS 1', 'Mathematics', '1st Term');
      expect(lagosMath).toBeDefined();
      expect(lagosMath?.verificationStatus).toBe('admin_verified');
      expect(lagosMath?.weeks.length).toBe(12);

      const lagosCRS = getVerifiedStateScheme('Lagos', 'JSS 2', 'Christian Religious Studies (CRS)', '1st Term');
      expect(lagosCRS).toBeDefined();
      expect(lagosCRS?.verificationStatus).toBe('admin_verified');
      expect(lagosCRS?.weeks[0].topic).toContain('Jesus');
    });
  });
});
