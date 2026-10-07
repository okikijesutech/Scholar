import type { TopicKnowledgeModule } from './types';
import { mathFractionsData, mathRectanglesData } from '../../../data/curriculumLibrary';

export const fractionTopic: TopicKnowledgeModule = {
  id: mathFractionsData.id,
  category: mathFractionsData.category,
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return mathFractionsData.matchPattern.test(combined);
  },
  getContentSections: () => mathFractionsData.contentSections,
  getClassroomActivities: () => mathFractionsData.classroomActivities,
  getEvaluation: () => mathFractionsData.evaluation,
  getCoreRule: () => mathFractionsData.coreRule
};

export const rectangleGeometryTopic: TopicKnowledgeModule = {
  id: mathRectanglesData.id,
  category: mathRectanglesData.category,
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return mathRectanglesData.matchPattern.test(combined);
  },
  getContentSections: () => mathRectanglesData.contentSections,
  getClassroomActivities: () => mathRectanglesData.classroomActivities,
  getEvaluation: () => mathRectanglesData.evaluation,
  getCoreRule: () => mathRectanglesData.coreRule
};
