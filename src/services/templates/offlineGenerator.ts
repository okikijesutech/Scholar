import type { ClassLevel, LessonNote, Term, GenerationParams } from '../../types';
import { NIGERIAN_CLASSES, getTextbooksForSubject } from '../../data/curriculumData';
import { 
  generateSubjectSpecificContentSections, 
  generateSubjectSpecificClassroomActivities, 
  generateSubjectSpecificEvaluation, 
  generateSubjectSpecificCoreRule 
} from './subjectKnowledgeBase';

export function generateLocalLessonNote(
  params: GenerationParams,
  avgAge: string,
  effectiveSubTopic: string,
  generationError?: string
): LessonNote {
  const {
    schoolName,
    teacherName,
    subject,
    classLevel,
    term,
    week,
    topic,
    duration = '40 Minutes',
    period = '1st & 2nd Period',
    customInstructions
  } = params;

  const isPrimary = classLevel.startsWith('Primary');
  const learnerTerm = isPrimary ? 'pupils' : 'students';
  const books = getTextbooksForSubject(subject);

  // Dynamic step timings based on period duration (Single 40m vs Double 80m)
  const isDouble = duration.includes('80') || period.toLowerCase().includes('double');
  const introDuration = isDouble ? 10 : 5;
  const step1Duration = isDouble ? 25 : 12;
  const step2Duration = isDouble ? 25 : 13;
  const step3Duration = isDouble ? 20 : 10;

  const behavioralObjectives = [
    `Define and clearly explain the concept of ${effectiveSubTopic}.`,
    `Identify the core principles, classifications, and components governing ${topic}.`,
    `Demonstrate practical understanding through step-by-step worked examples and activities.`,
    `State how ${effectiveSubTopic} applies to everyday Nigerian living and problem solving.`,
    `Answer evaluation questions correctly with at least 80% accuracy.`
  ];

  const previousKnowledge = `The ${learnerTerm} are familiar with introductory concepts of ${subject} from previous lessons and their day-to-day community experiences.`;

  const instructionalMaterials = [
    `Standard chalkboard, chalk / whiteboard markers and ruler`,
    `Illustrative charts and diagrams showing ${effectiveSubTopic}`,
    `Real-life objects and locally sourced Nigerian teaching aids`,
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
      durationMinutes: introDuration,
      teacherActivity: `The teacher greets the ${learnerTerm} warmly and introduces the lesson with an engaging real-world Nigerian scenario: "Think about what happens in our homes, schools, and communities when we encounter ${effectiveSubTopic}." The teacher asks stimulating questions to assess entry behaviour.`,
      studentActivity: `${capitalize(learnerTerm)} respond eagerly to the teacher's introductory questions, recall previous knowledge, and show high curiosity for the new topic.`
    },
    {
      stepNumber: 2,
      title: 'Step 1: Conceptual Explanation & Core Content',
      durationMinutes: step1Duration,
      teacherActivity: `The teacher writes the topic "${topic}: ${effectiveSubTopic}" on the chalkboard. The teacher provides a clear, structured explanation of Section 1 and Section 2, breaking down key terms and illustrating principles with clear examples.`,
      studentActivity: `${capitalize(learnerTerm)} listen attentively, copy the definition and key headings into their notebooks, and ask clarifying questions on points they find challenging.`
    },
    {
      stepNumber: 3,
      title: 'Step 2: In-Depth Breakdown & Guided Demonstration',
      durationMinutes: step2Duration,
      teacherActivity: `The teacher leads the class through Section 3, 4, and 5. The teacher invites two ${learnerTerm} to read aloud or solve an example on the chalkboard with teacher guidance.${customInstructions ? ` (${customInstructions})` : ''}`,
      studentActivity: `Selected ${learnerTerm} participate actively at the chalkboard, while others work out the analysis in their exercise books and verify the correct answers.`
    },
    {
      stepNumber: 4,
      title: 'Step 3: Classroom Activities & Application to Life',
      durationMinutes: step3Duration,
      teacherActivity: `The teacher organizes ${learnerTerm} into groups for Activity 1 and guides Activity 3 on relating the lesson to challenges young Nigerians face. The teacher moves around monitoring progress.`,
      studentActivity: `${capitalize(learnerTerm)} collaborate effectively in their groups, compare solutions, brainstorm real-life scenarios, and record the moral and practical takeaways.`
    }
  ];

  const summary = `The teacher recaps the core points of ${effectiveSubTopic}: clarifies difficult areas, highlights the moral and practical takeaways, and reinforces the core rule.`;

  const assignment = `Read the chapter on ${topic} in your recommended textbook (${books[0] || subject + ' for Nigerian Schools'}) and answer the following in your homework books:\n1. Write a 5-sentence summary of ${effectiveSubTopic}.\n2. Mention three practical ways this lesson impacts a Nigerian student's daily life.\n3. Complete practice exercises 1 to 5 at the end of the chapter.`;

  return {
    id: `note-${Date.now()}`,
    schoolName: schoolName || '',
    teacherName: teacherName || '',
    subject,
    classLevel,
    term,
    week,
    date: new Date().toISOString().split('T')[0],
    duration,
    period,
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
    // Do NOT pre-fill inspection approvals! Left blank for real vetting.
    teacherRemarks: '',
    hodRemarks: '',
    isOfflineDraft: true,
    generationError,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
