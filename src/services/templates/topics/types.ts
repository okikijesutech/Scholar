import type { ContentSection, ClassroomActivity } from '../../../types';
import type { SubjectCategory } from '../subjectCategories';

export interface TopicKnowledgeModule {
  id: string;
  category: SubjectCategory;
  matches: (subject: string, topic: string, subTopic: string) => boolean;
  getContentSections: (subject: string, topic: string, subTopic: string) => ContentSection[];
  getClassroomActivities: (subject: string, topic: string, subTopic: string) => ClassroomActivity[];
  getEvaluation: (subject: string, topic: string, subTopic: string) => string[];
  getCoreRule: () => string;
}
