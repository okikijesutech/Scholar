import type { LessonNote, GenerationParams, AIProviderConfig } from '../types';
import { NIGERIAN_CLASSES, getTextbooksForSubject } from '../data/curriculumData';
import { generateLocalLessonNote } from './templates/offlineGenerator';
import { categorizeSubject, type SubjectCategory } from './templates/subjectCategories';
import { getProvider, type LLMProvider } from './ai/providers';
import {
  generateSubjectSpecificContentSections,
  generateSubjectSpecificClassroomActivities,
  generateSubjectSpecificEvaluation,
  generateSubjectSpecificCoreRule,
  generateDefaultSteps
} from './templates/subjectKnowledgeBase';

export type { GenerationParams, SubjectCategory };
export { categorizeSubject };

export async function generateLessonNote(params: GenerationParams): Promise<LessonNote> {
  const {
    classLevel,
    topic,
    subTopic = '',
    providerConfig,
    apiKey
  } = params;

  const classInfo = NIGERIAN_CLASSES.find(c => c.id === classLevel);
  const avgAge = classInfo ? classInfo.avgAge : '10 - 12 years';
  const effectiveSubTopic = subTopic.trim() || `Fundamentals of ${topic}`;

  // Resolve config: either explicit providerConfig or fallback to apiKey (Gemini)
  const config: AIProviderConfig | undefined = providerConfig || (
    apiKey && apiKey.trim().length > 5
      ? { provider: 'gemini', apiKey }
      : undefined
  );

  let generationError: string | undefined;

  if (config && config.apiKey && config.apiKey.trim().length > 5) {
    try {
      const provider = getProvider(config.provider);
      const note = await generateWithProvider(provider, params, config, avgAge, effectiveSubTopic);
      note.hodRemarks = '';
      note.provenance = {
        provider: config.provider,
        modelName: config.model || provider.defaultModel,
        source: 'ai',
        capturedAt: new Date().toISOString()
      };
      return note;
    } catch (err: unknown) {
      console.warn(`${config.provider} generation failed, falling back to local curriculum generator:`, err);
      const msg = err instanceof Error ? err.message : String(err);
      generationError = `${config.provider.toUpperCase()} AI unavailable (${msg}). Generated using offline NERDC curriculum skeleton.`;
    }
  }

  // Built-in intelligent local generator (Offline-capable)
  const localNote = generateLocalLessonNote(params, avgAge, effectiveSubTopic, generationError);
  localNote.provenance = {
    provider: 'offline_skeleton',
    source: 'offline_skeleton',
    capturedAt: new Date().toISOString()
  };
  return localNote;
}

async function generateWithProvider(
  provider: LLMProvider,
  params: GenerationParams,
  config: AIProviderConfig,
  avgAge: string,
  effectiveSubTopic: string
): Promise<LessonNote> {
  const { schoolName, teacherName, subject, classLevel, term, week, topic, duration, period, customInstructions } = params;
  const category = categorizeSubject(subject);

  const systemPrompt = `You are a senior Nigerian curriculum expert and educational supervisor for SUBEB and the Federal Ministry of Education.
Write a comprehensive, in-depth, inspection-ready Nigerian Lesson Note for a school teacher.
Respond strictly with valid JSON conforming to the requested schema. No conversational prose or markdown wrappers.`;

  const prompt = `Context:
- School: "${schoolName || 'Community Model School'}"
- Teacher: "${teacherName || 'Subject Teacher'}"
- Subject: "${subject}" (Subject Domain: ${category})
- Class Level: "${classLevel}"
- Average Age of Learners: "${avgAge}"
- Term: "${term}"
- Week: Week ${week}
- Duration: "${duration || '40 Minutes'}"
- Period: "${period || '2nd Period'}"
- Topic: "${topic}"
- Sub-Topic: "${effectiveSubTopic}"
${customInstructions ? `- Special Instructions: "${customInstructions}"` : ''}

Strict Requirements:
1. Provide appropriate references in "references" (Bible passages for CRS; Quranic surahs for IRS; NERDC Curriculum theme/WASSCE/NECO topic for Sciences/Math/Commercial; Constitutional sections for Civic/Gov).
2. Learning Objectives: 5-6 measurable outcomes using Bloom's action verbs ("Define...", "Explain...", "Identify...", "Calculate/Demonstrate...", "State...", "Mention...").
3. FULL LESSON CONTENT: Provide 5 to 7 rich, exhaustive, numbered sections that contain the actual comprehensive lecture notes that students copy into their exercise notebooks.
   - For Mathematics: Include formulas, worked step-by-step examples, calculation procedures, and practical market word problems in Naira.
   - For Sciences: Include scientific definitions, principles, lab/experimental steps, and Nigerian environmental applications (e.g. malaria, crude oil, Kainji dam, soil types).
   - For Languages: Include grammar rules, sentence structures, oral/spelling drills, common errors in Nigerian English, and reading passages.
   - For CRS/IRS: Include scriptural narratives, meaning of key passages, and resisting youth temptations.
   - For Commercial/Economics: Include economic laws, consumer behaviors, and Nigerian trade contexts.
   - For Civic/Social: Include civic duties, rule of law, anti-corruption, and patriotism.
   Each section MUST have:
   - "sectionNumber": number
   - "heading": string
   - "body": string (in-depth paragraph explanations)
   - "subPoints": string[] (3 to 5 detailed bullet points)
   - "lessonTakeaway": string (1-2 sentence core lesson or moral takeaway)
4. Classroom Activities: 3 distinct hands-on activities:
   - Activity 1: Group discussion / problem-solving.
   - Activity 2: Textbook reading or chalkboard relay.
   - Activity 3: Application to everyday Nigerian challenges.
5. Instructional Steps: 4 steps with teacherActivity and studentActivity.
6. Formative Evaluation: 6 to 10 questions testing recall, understanding, and application.
7. Homework Assignment: 3 to 4 detailed questions.
8. Core Scripture or Principle: Exact verse or core rule.

Respond strictly with valid JSON conforming to this schema:
{
  "references": "...",
  "behavioralObjectives": ["...", "..."],
  "previousKnowledge": "...",
  "instructionalMaterials": ["...", "..."],
  "contentSections": [
    {
      "sectionNumber": 1,
      "heading": "...",
      "body": "...",
      "subPoints": ["...", "..."],
      "lessonTakeaway": "..."
    }
  ],
  "classroomActivities": [
    {
      "title": "...",
      "description": "...",
      "items": ["...", "..."]
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "...",
      "durationMinutes": 5,
      "teacherActivity": "...",
      "studentActivity": "..."
    }
  ],
  "evaluation": ["...", "..."],
  "summary": "...",
  "assignment": "...",
  "keyScriptureOrCoreRule": "...",
  "teacherRemarks": ""
}`;

  const parsed = await provider.generateStructured<any>({ prompt, systemPrompt }, config);

  return {
    id: `note-${Date.now()}`,
    schoolName: schoolName || '',
    teacherName: teacherName || '',
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
    references: parsed.references || `Approved NERDC ${subject} Curriculum`,
    behavioralObjectives: Array.isArray(parsed.behavioralObjectives) ? parsed.behavioralObjectives : [
      `Define ${effectiveSubTopic} in clear terms.`,
      `Explain the core principles and processes involved in ${topic}.`,
      `Identify key components and characteristics of ${effectiveSubTopic}.`,
      `Demonstrate practical problem solving and application of ${topic}.`,
      `State the moral, social, or practical lessons derived from ${topic}.`
    ],
    previousKnowledge: parsed.previousKnowledge || `Learners have prior foundational understanding of introductory concepts in ${subject}.`,
    instructionalMaterials: Array.isArray(parsed.instructionalMaterials) ? parsed.instructionalMaterials : [
      'Chalkboard and colored chalk / Whiteboard markers',
      'Illustrative wall chart',
      'Real objects and locally available materials'
    ],
    referenceBooks: Array.isArray(parsed.referenceBooks) ? parsed.referenceBooks : getTextbooksForSubject(subject),
    contentSections: Array.isArray(parsed.contentSections) ? parsed.contentSections : generateSubjectSpecificContentSections(subject, topic, effectiveSubTopic),
    classroomActivities: Array.isArray(parsed.classroomActivities) ? parsed.classroomActivities : generateSubjectSpecificClassroomActivities(subject, topic, effectiveSubTopic),
    steps: Array.isArray(parsed.steps) ? parsed.steps : generateDefaultSteps(topic, effectiveSubTopic),
    evaluation: Array.isArray(parsed.evaluation) ? parsed.evaluation : generateSubjectSpecificEvaluation(subject, topic, effectiveSubTopic),
    summary: parsed.summary || `The teacher reviews the main principles of ${effectiveSubTopic} and emphasizes key takeaways.`,
    assignment: parsed.assignment || `Complete the exercise questions from the recommended ${subject} textbook in your homework exercise books.`,
    keyScriptureOrCoreRule: parsed.keyScriptureOrCoreRule || generateSubjectSpecificCoreRule(subject, topic),
    teacherRemarks: parsed.teacherRemarks || '',
    hodRemarks: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function refineLessonNote(
  currentNote: LessonNote,
  refinementPrompt: string,
  providerConfig?: AIProviderConfig
): Promise<LessonNote> {
  if (!providerConfig || !providerConfig.apiKey || providerConfig.apiKey.trim().length <= 5) {
    throw new Error('An active AI provider with a valid API key is required to refine lesson notes.');
  }

  const provider = getProvider(providerConfig.provider);

  const systemPrompt = `You are a senior Nigerian curriculum specialist and master teacher editor.
You are given an existing Nigerian Lesson Note and an instruction from the classroom teacher to modify or refine specific sections.
Keep the existing structure, tone, and Nigerian context intact, but precisely apply the teacher's requested changes.
Respond strictly with valid JSON conforming to the complete Lesson Note schema.`;

  const prompt = `Current Lesson Note JSON:
${JSON.stringify({
  topic: currentNote.topic,
  subTopic: currentNote.subTopic,
  classLevel: currentNote.classLevel,
  subject: currentNote.subject,
  behavioralObjectives: currentNote.behavioralObjectives,
  instructionalMaterials: currentNote.instructionalMaterials,
  contentSections: currentNote.contentSections,
  classroomActivities: currentNote.classroomActivities,
  steps: currentNote.steps,
  evaluation: currentNote.evaluation,
  summary: currentNote.summary,
  assignment: currentNote.assignment,
  keyScriptureOrCoreRule: currentNote.keyScriptureOrCoreRule,
  references: currentNote.references
}, null, 2)}

Teacher's Refinement Request:
"${refinementPrompt}"

Instructions:
1. Revise only the relevant sections needed to fulfill the teacher's request.
2. Ensure updated content continues to align with Nigerian educational standards (NERDC).
3. Return the COMPLETE updated lesson note conforming to this JSON schema:
{
  "references": "...",
  "behavioralObjectives": ["...", "..."],
  "previousKnowledge": "...",
  "instructionalMaterials": ["...", "..."],
  "contentSections": [
    {
      "sectionNumber": 1,
      "heading": "...",
      "body": "...",
      "subPoints": ["...", "..."],
      "lessonTakeaway": "..."
    }
  ],
  "classroomActivities": [
    {
      "title": "...",
      "description": "...",
      "items": ["...", "..."]
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "...",
      "durationMinutes": 5,
      "teacherActivity": "...",
      "studentActivity": "..."
    }
  ],
  "evaluation": ["...", "..."],
  "summary": "...",
  "assignment": "...",
  "keyScriptureOrCoreRule": "...",
  "teacherRemarks": ""
}`;

  const parsed = await provider.generateStructured<any>({ prompt, systemPrompt }, providerConfig);

  return {
    ...currentNote,
    references: parsed.references || currentNote.references,
    behavioralObjectives: Array.isArray(parsed.behavioralObjectives) && parsed.behavioralObjectives.length > 0 ? parsed.behavioralObjectives : currentNote.behavioralObjectives,
    previousKnowledge: parsed.previousKnowledge || currentNote.previousKnowledge,
    instructionalMaterials: Array.isArray(parsed.instructionalMaterials) && parsed.instructionalMaterials.length > 0 ? parsed.instructionalMaterials : currentNote.instructionalMaterials,
    contentSections: Array.isArray(parsed.contentSections) && parsed.contentSections.length > 0 ? parsed.contentSections : currentNote.contentSections,
    classroomActivities: Array.isArray(parsed.classroomActivities) && parsed.classroomActivities.length > 0 ? parsed.classroomActivities : currentNote.classroomActivities,
    steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : currentNote.steps,
    evaluation: Array.isArray(parsed.evaluation) && parsed.evaluation.length > 0 ? parsed.evaluation : currentNote.evaluation,
    summary: parsed.summary || currentNote.summary,
    assignment: parsed.assignment || currentNote.assignment,
    keyScriptureOrCoreRule: parsed.keyScriptureOrCoreRule || currentNote.keyScriptureOrCoreRule,
    teacherRemarks: parsed.teacherRemarks || currentNote.teacherRemarks,
    updatedAt: new Date().toISOString(),
    provenance: {
      provider: providerConfig.provider,
      modelName: providerConfig.model || provider.defaultModel,
      source: 'ai',
      capturedAt: new Date().toISOString()
    }
  };
}
