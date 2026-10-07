import type { ContentSection, ClassroomActivity } from '../../types';
import { categorizeSubject } from './subjectCategories';
import type { TopicKnowledgeModule } from './topics/types';
import { fractionTopic, rectangleGeometryTopic } from './topics/mathTopics';
import { habitatTopic } from './topics/scienceTopics';
import { adjectiveTopic } from './topics/languageTopics';
import { temptationTopic } from './topics/religiousTopics';
import {
  generateSkeletonContentSections,
  generateSkeletonClassroomActivities,
  generateSkeletonEvaluation,
  generateSkeletonCoreRule
} from './topics/skeletonGenerator';

const TOPIC_REGISTRY: TopicKnowledgeModule[] = [
  fractionTopic,
  rectangleGeometryTopic,
  habitatTopic,
  adjectiveTopic,
  temptationTopic
];

function findMatchingTopic(subject: string, topic: string, subTopic: string): TopicKnowledgeModule | undefined {
  return TOPIC_REGISTRY.find(mod => mod.matches(subject, topic, subTopic));
}

export function generateSubjectSpecificContentSections(
  subject: string,
  topic: string,
  subTopic: string
): ContentSection[] {
  const match = findMatchingTopic(subject, topic, subTopic);
  if (match) {
    return match.getContentSections(subject, topic, subTopic);
  }
  return generateSkeletonContentSections(subject, topic, subTopic);
}

export function generateSubjectSpecificClassroomActivities(
  subject: string,
  topic: string,
  subTopic: string
): ClassroomActivity[] {
  const match = findMatchingTopic(subject, topic, subTopic);
  if (match) {
    return match.getClassroomActivities(subject, topic, subTopic);
  }
  return generateSkeletonClassroomActivities(subject, topic, subTopic);
}

export function generateSubjectSpecificEvaluation(
  subject: string,
  topic: string,
  subTopic: string
): string[] {
  const match = findMatchingTopic(subject, topic, subTopic);
  if (match) {
    return match.getEvaluation(subject, topic, subTopic);
  }
  return generateSkeletonEvaluation(subject, topic, subTopic);
}

export function generateSubjectSpecificCoreRule(subject: string, topic: string): string {
  const match = findMatchingTopic(subject, topic, topic);
  if (match) {
    return match.getCoreRule();
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
