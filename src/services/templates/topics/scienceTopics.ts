import type { TopicKnowledgeModule } from './types';
import { scienceHabitatsData } from '../../../data/curriculumLibrary';

export const habitatTopic: TopicKnowledgeModule = {
  id: scienceHabitatsData.id,
  category: scienceHabitatsData.category,
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return scienceHabitatsData.matchPattern.test(combined);
  },
  getContentSections: () => scienceHabitatsData.contentSections,
  getClassroomActivities: () => scienceHabitatsData.classroomActivities,
  getEvaluation: () => scienceHabitatsData.evaluation,
  getCoreRule: () => scienceHabitatsData.coreRule
};
