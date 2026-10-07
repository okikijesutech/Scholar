import type { TopicKnowledgeModule } from './types';
import { languageAdjectivesData } from '../../../data/curriculumLibrary';

export const adjectiveTopic: TopicKnowledgeModule = {
  id: languageAdjectivesData.id,
  category: languageAdjectivesData.category,
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return languageAdjectivesData.matchPattern.test(combined);
  },
  getContentSections: () => languageAdjectivesData.contentSections,
  getClassroomActivities: () => languageAdjectivesData.classroomActivities,
  getEvaluation: () => languageAdjectivesData.evaluation,
  getCoreRule: () => languageAdjectivesData.coreRule
};
