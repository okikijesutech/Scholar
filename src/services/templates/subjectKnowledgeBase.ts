import type { ContentSection, ClassroomActivity } from '../../types';
import { categorizeSubject } from './subjectCategories';
import { findCuratedTopic } from '../../data/curriculumLibrary';
import {
  generateSkeletonContentSections,
  generateSkeletonClassroomActivities,
  generateSkeletonEvaluation,
  generateSkeletonCoreRule
} from './topics/skeletonGenerator';

export function generateSubjectSpecificContentSections(
  subject: string,
  topic: string,
  subTopic: string
): ContentSection[] {
  const match = findCuratedTopic(subject, topic, subTopic);
  if (match) {
    return match.contentSections;
  }
  return generateSkeletonContentSections(subject, topic, subTopic);
}

export function generateSubjectSpecificClassroomActivities(
  subject: string,
  topic: string,
  subTopic: string
): ClassroomActivity[] {
  const match = findCuratedTopic(subject, topic, subTopic);
  if (match) {
    return match.classroomActivities;
  }
  return generateSkeletonClassroomActivities(subject, topic, subTopic);
}

export function generateSubjectSpecificEvaluation(
  subject: string,
  topic: string,
  subTopic: string
): string[] {
  const match = findCuratedTopic(subject, topic, subTopic);
  if (match) {
    return match.evaluation;
  }
  return generateSkeletonEvaluation(subject, topic, subTopic);
}

export function generateSubjectSpecificCoreRule(subject: string, topic: string): string {
  const match = findCuratedTopic(subject, topic, topic);
  if (match) {
    return match.coreRule;
  }
  const category = categorizeSubject(subject);
  return generateSkeletonCoreRule(category, subject, topic);
}

export function generateDefaultSteps(topic: string, subTopic: string) {
  return [
    {
      stepNumber: 1,
      title: 'Introduction (Hook & Prior Knowledge)',
      durationMinutes: 5,
      teacherActivity: `The teacher stimulates interest by connecting ${subTopic} to everyday Nigerian life.`,
      studentActivity: `Learners listen attentively and answer initial inquiry questions.`
    },
    {
      stepNumber: 2,
      title: 'Step 1: Explicit Instruction',
      durationMinutes: 15,
      teacherActivity: `The teacher explains ${topic} systematically and writes key notes on the chalkboard.`,
      studentActivity: `Learners take down notes and ask questions.`
    },
    {
      stepNumber: 3,
      title: 'Step 2: Guided Practice & Analysis',
      durationMinutes: 12,
      teacherActivity: `The teacher works through examples and guides student participation.`,
      studentActivity: `Learners solve exercises on the board and in their exercise books.`
    },
    {
      stepNumber: 4,
      title: 'Step 3: Classroom Activities & Application',
      durationMinutes: 8,
      teacherActivity: `The teacher organizes group discussions and administers oral and written questions.`,
      studentActivity: `Learners participate in group activities and complete evaluation.`
    }
  ];
}
