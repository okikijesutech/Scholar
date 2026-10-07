import type { CuratedTopicData } from './types';
import { mathFractionsData, mathRectanglesData } from './mathData';
import { scienceHabitatsData } from './scienceData';
import { languageAdjectivesData } from './languageData';
import { religiousTemptationData } from './religiousData';

export * from './types';
export { mathFractionsData, mathRectanglesData } from './mathData';
export { scienceHabitatsData } from './scienceData';
export { languageAdjectivesData } from './languageData';
export { religiousTemptationData } from './religiousData';

export const CURRICULUM_DATA_REGISTRY: CuratedTopicData[] = [
  mathFractionsData,
  mathRectanglesData,
  scienceHabitatsData,
  languageAdjectivesData,
  religiousTemptationData
];

/**
 * Matches a subject, topic, and subTopic against the curated curriculum data registry.
 * Uses pattern matching on normalized text.
 */
export function findCuratedTopic(
  subject: string,
  topic: string,
  subTopic: string
): CuratedTopicData | undefined {
  const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
  return CURRICULUM_DATA_REGISTRY.find(item => item.matchPattern.test(combined));
}
