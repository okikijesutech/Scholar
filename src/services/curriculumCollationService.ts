import type { SchemeOfWork, SchemeWeek, ClassLevel, Term } from '../types';
import { schemeOfWorkSchema } from '../schemas';

const STORAGE_KEY_VERIFIED_STATE_SCHEMES = 'lessonflow_verified_state_schemes_v1';

export const NIGERIAN_STATES = [
  'Lagos', 'Oyo', 'Ogun', 'Osun', 'Ondo', 'Ekiti',
  'Rivers', 'Delta', 'Edo', 'Cross River', 'Akwa Ibom', 'Bayelsa',
  'Abuja FCT', 'Kaduna', 'Kano', 'Katsina', 'Sokoto', 'Borno',
  'Enugu', 'Anambra', 'Imo', 'Abia', 'Ebonyi',
  'Kwara', 'Kogi', 'Benue', 'Plateau', 'Niger', 'Nasarawa',
  'National (NERDC)'
];

export interface SchemeComparisonResult {
  similarityScore: number;
  matchingWeeksCount: number;
  matchedWeeks: Array<{
    week: number;
    topicA: string;
    topicB: string;
    similarity: number;
  }>;
}

export interface SchemeCluster {
  clusterId: string;
  state: string;
  classLevel: ClassLevel;
  subject: string;
  term: Term;
  schemes: SchemeOfWork[];
  uploaderCount: number;
  averageSimilarity: number;
  consensusWeeks: SchemeWeek[];
  verificationStatus: 'unverified' | 'peer_confirmed' | 'admin_verified';
}

/**
 * Normalizes subject names by stripping parenthetical acronyms (e.g., 'Christian Religious Studies (CRS)' -> 'christian religious studies').
 */
export function normalizeSubjectName(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/\s*\([a-z0-9&/ ]+\)/g, '').trim();
}

/**
 * Normalizes educational topic text by removing punctuation and generic filler phrasing.
 */
export function normalizeTopicText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\b(introduction to|meaning of|definition of|concept of|types of|study of|part \d+|week \d+)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates token-based Jaccard similarity between two topic titles (0.0 to 1.0).
 */
export function calculateTopicSimilarity(topicA: string, topicB: string): number {
  const normA = normalizeTopicText(topicA);
  const normB = normalizeTopicText(topicB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  const tokensA = new Set(normA.split(' ').filter(w => w.length > 2));
  const tokensB = new Set(normB.split(' ').filter(w => w.length > 2));

  if (tokensA.size === 0 || tokensB.size === 0) {
    return normA.includes(normB) || normB.includes(normA) ? 0.7 : 0.0;
  }

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0.0;
}

/**
 * Compares two 12-week schemes of work week-by-week.
 */
export function compareSchemes(schemeA: SchemeOfWork, schemeB: SchemeOfWork): SchemeComparisonResult {
  const maxWeeks = Math.max(schemeA.weeks.length, schemeB.weeks.length, 1);
  const matchedWeeks: SchemeComparisonResult['matchedWeeks'] = [];
  let totalScore = 0;
  let matchingWeeksCount = 0;

  for (let w = 1; w <= 12; w++) {
    const weekA = schemeA.weeks.find(item => item.week === w);
    const weekB = schemeB.weeks.find(item => item.week === w);

    const topicA = weekA?.topic || '';
    const topicB = weekB?.topic || '';

    let sim = 0;
    if (topicA && topicB) {
      sim = calculateTopicSimilarity(topicA, topicB);
      if (sim >= 0.5) {
        matchingWeeksCount++;
      }
    }

    matchedWeeks.push({
      week: w,
      topicA,
      topicB,
      similarity: Number(sim.toFixed(2))
    });

    totalScore += sim;
  }

  const similarityScore = Number((totalScore / maxWeeks).toFixed(2));
  return {
    similarityScore,
    matchingWeeksCount,
    matchedWeeks
  };
}

/**
 * Groups raw scheme uploads into clusters by (State + ClassLevel + Subject + Term)
 * and detects consensus across multiple teacher submissions.
 */
export function clusterSchemes(schemes: SchemeOfWork[]): SchemeCluster[] {
  const map = new Map<string, SchemeOfWork[]>();

  for (const s of schemes) {
    const state = s.state || 'Lagos';
    const key = `${state}|${s.classLevel}|${s.subject}|${s.term}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }

  const clusters: SchemeCluster[] = [];

  for (const [key, group] of map.entries()) {
    const [state, classLevel, subject, term] = key.split('|');

    if (group.length === 1) {
      const s = group[0];
      clusters.push({
        clusterId: `cluster-${key.replace(/\s+/g, '_')}`,
        state,
        classLevel: classLevel as ClassLevel,
        subject,
        term: term as Term,
        schemes: group,
        uploaderCount: s.uploaderCount || 1,
        averageSimilarity: 1.0,
        consensusWeeks: s.weeks,
        verificationStatus: s.verificationStatus || 'unverified'
      });
      continue;
    }

    // Multiple uploads: compare first scheme against others to compute average similarity
    let totalSim = 0;
    let comparisons = 0;
    for (let i = 0; i < group.length - 1; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const res = compareSchemes(group[i], group[j]);
        totalSim += res.similarityScore;
        comparisons++;
      }
    }

    const averageSimilarity = comparisons > 0 ? Number((totalSim / comparisons).toFixed(2)) : 1.0;
    const isPeerConfirmed = averageSimilarity >= 0.7 && group.length >= 2;

    clusters.push({
      clusterId: `cluster-${key.replace(/\s+/g, '_')}`,
      state,
      classLevel: classLevel as ClassLevel,
      subject,
      term: term as Term,
      schemes: group,
      uploaderCount: group.reduce((acc, curr) => acc + (curr.uploaderCount || 1), 0),
      averageSimilarity,
      consensusWeeks: group[0].weeks,
      verificationStatus: isPeerConfirmed ? 'peer_confirmed' : 'unverified'
    });
  }

  return clusters;
}

/**
 * Loads verified state schemes from persistent storage.
 */
export function getVerifiedStateSchemes(): SchemeOfWork[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERIFIED_STATE_SCHEMES);
    if (!raw) {
      return seedInitialVerifiedStateSchemes();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedInitialVerifiedStateSchemes();
    }
    return parsed.filter((item): item is SchemeOfWork => schemeOfWorkSchema.safeParse(item).success);
  } catch (e) {
    console.error('Failed to parse verified state schemes:', e);
    return [];
  }
}

export function seedInitialVerifiedStateSchemes(): SchemeOfWork[] {
  const defaultLagosMathJSS1: SchemeOfWork = {
    id: 'verified-state-lagos-jss1-mathematics-1stterm',
    subject: 'Mathematics',
    classLevel: 'JSS 1',
    term: '1st Term',
    state: 'Lagos',
    curriculumType: 'state_unified',
    verificationStatus: 'admin_verified',
    uploaderCount: 3,
    confidenceScore: 0.95,
    verifiedBy: 'Ministry Curriculum Board / Super Admin',
    verifiedAt: new Date().toISOString(),
    weeks: [
      { week: 1, topic: 'Whole Numbers', subTopic: 'Count, Read and Write Millions & Billions', objectivesSummary: 'Express large numbers in digits and words', suggestedMaterials: 'Place value charts, number cards' },
      { week: 2, topic: 'Fractions', subTopic: 'Meaning, Types and Equivalent Fractions', objectivesSummary: 'Differentiate proper, improper and mixed fractions', suggestedMaterials: 'Paper cutouts, fraction chart' },
      { week: 3, topic: 'Fractions', subTopic: 'Addition and Subtraction of Like and Unlike Fractions', objectivesSummary: 'Calculate LCM and add fractions correctly', suggestedMaterials: 'Fraction board, flashcards' },
      { week: 4, topic: 'Fractions', subTopic: 'Multiplication and Division of Fractions', objectivesSummary: 'Multiply and divide fractions; reciprocal rule', suggestedMaterials: 'Chalkboard, worked examples' },
      { week: 5, topic: 'Decimals and Percentages', subTopic: 'Conversion between Fractions, Decimals and Percentages', objectivesSummary: 'Convert decimals to percentages and vice versa', suggestedMaterials: '100-grid charts, currency notes' },
      { week: 6, topic: 'Basic Operations on Decimals', subTopic: 'Addition, Subtraction, Multiplication & Division', objectivesSummary: 'Align decimal points for arithmetic', suggestedMaterials: 'Place value grid, supermarket bills' },
      { week: 7, topic: 'Mid-Term Assessment & Continuous Evaluation', subTopic: 'Revision and Diagnostic Testing', objectivesSummary: 'Evaluate mastery of Weeks 1 to 6', suggestedMaterials: 'Question papers, answer sheets' },
      { week: 8, topic: 'Factors and Multiples', subTopic: 'Prime Factors, HCF and LCM', objectivesSummary: 'Express numbers as products of prime factors', suggestedMaterials: 'Factor tree charts, factor cards' },
      { week: 9, topic: 'Estimation and Approximation', subTopic: 'Rounding to Nearest Tens, Hundreds and Significant Figures', objectivesSummary: 'Round numbers and estimate real-life costs', suggestedMaterials: 'Market price lists, meter ruler' },
      { week: 10, topic: 'Plane Shapes (Geometry)', subTopic: 'Properties of Rectangles, Squares and Triangles', objectivesSummary: 'Identify 90-degree right angles and lines of symmetry', suggestedMaterials: 'Cardboard shapes, wooden models' },
      { week: 11, topic: 'Perimeter and Area of Plane Shapes', subTopic: 'Formulas and Calculations for Rectangles & Squares', objectivesSummary: 'Calculate perimeter = 2(L+B) and area = L*B', suggestedMaterials: 'Measuring tapes, classroom desks' },
      { week: 12, topic: 'Revision and Term-End Unified Examination', subTopic: 'Comprehensive Review of 1st Term Topics', objectivesSummary: 'Prepare students for unified state exams', suggestedMaterials: 'Past question booklets' }
    ]
  };

  const defaultLagosCRSJSS2: SchemeOfWork = {
    id: 'verified-state-lagos-jss2-crs-1stterm',
    subject: 'Christian Religious Studies',
    classLevel: 'JSS 2',
    term: '1st Term',
    state: 'Lagos',
    curriculumType: 'state_unified',
    verificationStatus: 'admin_verified',
    uploaderCount: 2,
    confidenceScore: 0.92,
    verifiedBy: 'Super Admin',
    verifiedAt: new Date().toISOString(),
    weeks: [
      { week: 1, topic: 'The Early Life of Jesus', subTopic: 'Birth and Dedication in the Temple', objectivesSummary: 'Narrate the birth of Jesus and role of Simeon and Anna', suggestedMaterials: 'Holy Bible, picture charts' },
      { week: 2, topic: 'The Baptism of Jesus', subTopic: 'John the Baptist in River Jordan', objectivesSummary: 'Explain significance of baptism and descent of Holy Spirit', suggestedMaterials: 'Map of Palestine, Bible passages' },
      { week: 3, topic: 'The Temptation of Jesus Christ', subTopic: 'Meaning of Temptation and 40 Days in the Wilderness', objectivesSummary: 'Define temptation and cite Matthew 4:1-11', suggestedMaterials: 'Bible, flashcards with scriptures' },
      { week: 4, topic: 'The Three Temptations of Jesus', subTopic: 'Overcoming Temptation and Moral Lessons for Youths', objectivesSummary: 'State Jesus\' responses and list moral lessons for Nigerian youths', suggestedMaterials: 'Chalkboard, scripture memory cards' },
      { week: 5, topic: 'The Call of the Disciples', subTopic: 'The First Four Disciples at Sea of Galilee', objectivesSummary: 'Narrate call of Peter, Andrew, James, and John', suggestedMaterials: 'Illustrative pictures of fishermen' },
      { week: 6, topic: 'Jesus Heals the Sick', subTopic: 'Healing of the Centurion\'s Servant and Paralytic', objectivesSummary: 'Demonstrate faith and compassion of Jesus', suggestedMaterials: 'Bible, drama role-play' },
      { week: 7, topic: 'Mid-Term Break & Revision', subTopic: 'Continuous Assessment', objectivesSummary: 'Review concepts from Weeks 1-6', suggestedMaterials: 'Assessment test sheets' },
      { week: 8, topic: 'Parables of the Kingdom', subTopic: 'The Sower and The Mustard Seed', objectivesSummary: 'Explain meanings of kingdom parables', suggestedMaterials: 'Real seeds, agricultural chart' },
      { week: 9, topic: 'Parables of Mercy and Forgiveness', subTopic: 'The Prodigal Son and The Lost Sheep', objectivesSummary: 'Explain unconditional love of God and repentance', suggestedMaterials: 'Picture book, scriptural text' },
      { week: 10, topic: 'The Transfiguration of Jesus', subTopic: 'Appearance with Moses and Elijah on the Mount', objectivesSummary: 'Describe significance of transfiguration and glory of Christ', suggestedMaterials: 'Bible passages (Mark 9)' },
      { week: 11, topic: 'Triumphal Entry into Jerusalem', subTopic: 'Palm Sunday and Cleansing of the Temple', objectivesSummary: 'Narrate entry into Jerusalem on a colt', suggestedMaterials: 'Palm fronds, historical map' },
      { week: 12, topic: 'Revision & First Term Unified Examination', subTopic: 'Term Wrap-Up', objectivesSummary: 'Prepare for first term examination', suggestedMaterials: 'Past exam papers' }
    ]
  };

  const seeded = [defaultLagosMathJSS1, defaultLagosCRSJSS2];
  try {
    localStorage.setItem(STORAGE_KEY_VERIFIED_STATE_SCHEMES, JSON.stringify(seeded));
  } catch (e) {
    console.error('Failed to seed verified state schemes:', e);
  }
  return seeded;
}

/**
 * Finds if a verified unified state scheme already exists for a target state, class, subject & term.
 */
export function getVerifiedStateScheme(
  state: string,
  classLevel: ClassLevel,
  subject: string,
  term: Term
): SchemeOfWork | undefined {
  const verifiedList = getVerifiedStateSchemes();
  const normState = (state || '').toLowerCase().trim();
  const normSubject = normalizeSubjectName(subject);

  return verifiedList.find(
    s =>
      (s.state || '').toLowerCase().trim() === normState &&
      s.classLevel === classLevel &&
      normalizeSubjectName(s.subject) === normSubject &&
      s.term === term &&
      s.verificationStatus === 'admin_verified'
  );
}

/**
 * Super Admin 1-Click Action:
 * Promotes a clustered candidate scheme to an official, verified State Unified Scheme.
 */
export function promoteClusterToVerifiedStateScheme(
  cluster: SchemeCluster,
  adminName = 'Super Admin'
): SchemeOfWork {
  const existing = getVerifiedStateSchemes();

  const promotedScheme: SchemeOfWork = {
    id: `verified-state-${cluster.state.toLowerCase()}-${cluster.classLevel.replace(/\s+/g, '')}-${cluster.subject.replace(/\s+/g, '')}-${cluster.term.replace(/\s+/g, '')}`,
    subject: cluster.subject,
    classLevel: cluster.classLevel,
    term: cluster.term,
    weeks: cluster.consensusWeeks,
    state: cluster.state,
    curriculumType: 'state_unified',
    verificationStatus: 'admin_verified',
    uploaderCount: cluster.uploaderCount,
    confidenceScore: cluster.averageSimilarity,
    verifiedBy: adminName,
    verifiedAt: new Date().toISOString(),
    provenance: {
      source: 'book_scan',
      provider: 'offline_skeleton',
      modelName: 'Admin Verified Unified Scheme',
      capturedAt: new Date().toISOString()
    }
  };

  const filtered = existing.filter(s => s.id !== promotedScheme.id);
  filtered.unshift(promotedScheme);

  try {
    localStorage.setItem(STORAGE_KEY_VERIFIED_STATE_SCHEMES, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save promoted verified scheme:', e);
  }

  return promotedScheme;
}

export function deleteVerifiedStateScheme(schemeId: string): void {
  const existing = getVerifiedStateSchemes().filter(s => s.id !== schemeId);
  try {
    localStorage.setItem(STORAGE_KEY_VERIFIED_STATE_SCHEMES, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to delete verified state scheme:', e);
  }
}
