import type { LessonNote } from '../../types';
import type { GenerationParams } from '../aiGenerator';
import { getTextbooksForSubject } from '../../data/curriculumData';
import { categorizeSubject } from './subjectCategories';
import {
  generateSubjectSpecificContentSections,
  generateSubjectSpecificClassroomActivities,
  generateSubjectSpecificEvaluation,
  generateSubjectSpecificCoreRule,
  generateDefaultSteps
} from './subjectKnowledgeBase';

export function generateLocalLessonNote(params: GenerationParams, avgAge: string, effectiveSubTopic: string): LessonNote {
  const { schoolName, teacherName, subject, classLevel, term, week, topic, duration, period, customInstructions } = params;

  const isPrimary = classLevel.startsWith('Primary');
  const learnerTerm = isPrimary ? 'pupils' : 'students';
  const books = getTextbooksForSubject(subject);
  const category = categorizeSubject(subject);

  // Behavioral objectives tailored by category
  let behavioralObjectives: string[];
  if (category === 'mathematics') {
    behavioralObjectives = [
      `State the mathematical definition and formula for ${effectiveSubTopic}.`,
      `Identify the relevant mathematical properties and variables involved in ${topic}.`,
      `Solve columnar and algebraic worked examples on ${effectiveSubTopic} accurately.`,
      `Apply the mathematical concepts to everyday Nigerian commercial word problems (involving Naira ₦ or measurement).`,
      `Check and verify calculations to eliminate computational errors.`
    ];
  } else if (category === 'language') {
    behavioralObjectives = [
      `Define and explain the grammatical meaning of ${effectiveSubTopic}.`,
      `Identify examples of ${effectiveSubTopic} in written sentences and reading passages.`,
      `Construct 5 grammatically correct sentences demonstrating proper usage of ${effectiveSubTopic}.`,
      `Differentiate between standard English usage and common local errors.`,
      `Pronounce and spell key vocabulary words correctly.`
    ];
  } else if (category === 'science') {
    behavioralObjectives = [
      `Define ${effectiveSubTopic} scientifically.`,
      `State the underlying natural laws, chemical equations, or biological structures of ${topic}.`,
      `Identify the apparatus, specimens, or steps used in observing or experimenting with ${effectiveSubTopic}.`,
      `Explain how ${topic} impacts the Nigerian environment, health, or technological industry.`,
      `Formulate precautions and safety measures relevant to ${effectiveSubTopic}.`
    ];
  } else if (category === 'commercial') {
    behavioralObjectives = [
      `Define ${effectiveSubTopic} in the context of economics and commerce.`,
      `Explain the economic laws and market principles governing ${topic}.`,
      `Construct and interpret economic tables, schedules, or commercial account ledgers.`,
      `Relate the topic to real-life transactions in Nigerian markets and financial institutions.`,
      `State the consequences of consumer and producer choices on the Nigerian economy.`
    ];
  } else if (category === 'civic_social') {
    behavioralObjectives = [
      `Define ${effectiveSubTopic} in relation to citizenship and national development.`,
      `Explain the historical, social, and constitutional background of ${topic}.`,
      `Identify the rights, duties, and responsibilities of citizens concerning ${effectiveSubTopic}.`,
      `Discuss the social challenges facing Nigeria regarding ${topic} and evaluate solutions.`,
      `Demonstrate positive civic values including integrity, patriotism, and respect for law.`
    ];
  } else {
    behavioralObjectives = [
      `Define ${effectiveSubTopic} accurately.`,
      `Explain the background narrative and fundamental principles of ${topic}.`,
      `Identify and explain the key components and features of ${effectiveSubTopic}.`,
      `State how ${topic} applies to everyday challenges and circumstances.`,
      `Mention the moral, social, or practical lessons learned from ${topic}.`,
      `Explain how to make responsible decisions using the knowledge gained from ${effectiveSubTopic}.`
    ];
  }

  const previousKnowledge = `${capitalize(learnerTerm)} have prior foundational familiarity with introductory aspects of ${topic} from earlier terms and their everyday observations.`;

  const instructionalMaterials = [
    `Wall chart clearly displaying illustrations, diagrams, and definitions of ${effectiveSubTopic}`,
    `Chalkboard/Whiteboard, chalk, ruler, and colored markers for summarizing key points`,
    `Locally sourced realia (real objects, models, specimens, or flashcards) relating to ${topic}`,
    `Flashcards with key vocabulary words, memory verses, or core formulas`
  ];

  const contentSections = generateSubjectSpecificContentSections(subject, topic, effectiveSubTopic);
  const classroomActivities = generateSubjectSpecificClassroomActivities(subject, topic, effectiveSubTopic);
  const evaluation = generateSubjectSpecificEvaluation(subject, topic, effectiveSubTopic);
  const keyScriptureOrCoreRule = generateSubjectSpecificCoreRule(subject, topic);

  const steps = [
    {
      stepNumber: 1,
      title: 'Introduction & Warm-Up (Hook / Entry Behaviour)',
      durationMinutes: 5,
      teacherActivity: `The teacher greets the ${learnerTerm} warmly and introduces the lesson with an engaging real-world Nigerian scenario: "Think about what happens in our homes, schools, and communities when we encounter ${effectiveSubTopic}." The teacher asks stimulating questions to assess entry behaviour.`,
      studentActivity: `${capitalize(learnerTerm)} respond eagerly to the teacher's introductory questions, recall previous knowledge, and show high curiosity for the new topic.`
    },
    {
      stepNumber: 2,
      title: 'Step 1: Conceptual Explanation & Core Content',
      durationMinutes: 12,
      teacherActivity: `The teacher writes the topic "${topic}: ${effectiveSubTopic}" on the chalkboard. The teacher provides a clear, structured explanation of Section 1 and Section 2, breaking down key terms and illustrating principles with simple diagrams.`,
      studentActivity: `${capitalize(learnerTerm)} listen attentively, copy the definition and key headings into their notebooks, and ask clarifying questions on points they find challenging.`
    },
    {
      stepNumber: 3,
      title: 'Step 2: In-Depth Breakdown & Analysis',
      durationMinutes: 13,
      teacherActivity: `The teacher leads the class through Section 3, 4, and 5. The teacher invites two ${learnerTerm} (e.g., Emeka and Amina) to read aloud or solve an example on the chalkboard with teacher guidance.${customInstructions ? ` (${customInstructions})` : ''}`,
      studentActivity: `Selected ${learnerTerm} participate actively at the chalkboard, while others work out the analysis in their exercise books and verify the correct answers.`
    },
    {
      stepNumber: 4,
      title: 'Step 3: Classroom Activities & Application to Life',
      durationMinutes: 10,
      teacherActivity: `The teacher organizes ${learnerTerm} into groups for Activity 1 and guides Activity 3 on relating the lesson to challenges young Nigerians face. The teacher moves around monitoring progress.`,
      studentActivity: `${capitalize(learnerTerm)} collaborate effectively in their groups, compare solutions, brainstorm real-life scenarios, and record the moral and practical takeaways.`
    }
  ];

  const summary = `The teacher summarizes the key points of the lesson: recaps the fundamental definitions, highlights the moral and practical responsibilities, and reinforces the core rule.`;

  const assignment = `Read the chapter on ${topic} in your recommended textbook (${books[0] || subject + ' for Nigerian Schools'}) and answer the following in your homework books:\n1. Provide a detailed summary of ${effectiveSubTopic}.\n2. Explain three practical ways this lesson impacts a Nigerian student's daily life.\n3. Complete questions 1 to 5 at the end of the chapter.`;

  return {
    id: `note-${Date.now()}`,
    schoolName: schoolName || 'Community Secondary School',
    teacherName: teacherName || 'Subject Teacher',
    subject,
    classLevel,
    term,
    week,
    date: new Date().toISOString().split('T')[0],
    duration: duration || '40 Minutes',
    period: period || '1st & 2nd Period',
    averageAge: avgAge,
    topic,
    subTopic: effectiveSubTopic,
    references: `NERDC National Curriculum for ${classLevel} ${subject}`,
    behavioralObjectives,
    previousKnowledge,
    instructionalMaterials,
    referenceBooks: books,
    contentSections,
    classroomActivities,
    steps,
    evaluation,
    summary,
    assignment,
    keyScriptureOrCoreRule,
    teacherRemarks: `The lesson was successfully delivered. Majority of the ${learnerTerm} achieved the behavioural objectives as demonstrated in the formative evaluation and classroom discussions.`,
    hodRemarks: 'Checked and approved. Meets NERDC curriculum and SUBEB inspection guidelines.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
