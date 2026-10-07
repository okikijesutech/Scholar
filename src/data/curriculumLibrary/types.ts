import type { ContentSection, ClassroomActivity } from '../../types';
import type { SubjectCategory } from '../../services/templates/subjectCategories';

export interface CuratedTopicData {
  id: string;
  category: SubjectCategory;
  matchPattern: RegExp;
  contentSections: ContentSection[];
  classroomActivities: ClassroomActivity[];
  evaluation: string[];
  coreRule: string;
}
