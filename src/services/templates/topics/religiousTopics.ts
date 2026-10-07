import type { TopicKnowledgeModule } from './types';
import { religiousTemptationData } from '../../../data/curriculumLibrary';

export const temptationTopic: TopicKnowledgeModule = {
  id: religiousTemptationData.id,
  category: religiousTemptationData.category,
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return religiousTemptationData.matchPattern.test(combined);
  },
  getContentSections: () => religiousTemptationData.contentSections,
  getClassroomActivities: () => religiousTemptationData.classroomActivities,
  getEvaluation: () => religiousTemptationData.evaluation,
  getCoreRule: () => religiousTemptationData.coreRule
};
