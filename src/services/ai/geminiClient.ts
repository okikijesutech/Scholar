import type { LessonNote } from '../../types';
import type { GenerationParams } from '../aiGenerator';
import { getTextbooksForSubject } from '../../data/curriculumData';
import { categorizeSubject } from '../templates/subjectCategories';
import {
  generateSubjectSpecificContentSections,
  generateSubjectSpecificClassroomActivities,
  generateSubjectSpecificEvaluation,
  generateSubjectSpecificCoreRule,
  generateDefaultSteps
} from '../templates/subjectKnowledgeBase';

let cachedModelName: string | null = null;

// Dynamically discover which Gemini model is active and available for the user's API key
export async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (cachedModelName) return cachedModelName;

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listRes.ok) {
      const data = await listRes.json();
      const models = data.models || [];

      const priorityOrder = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-002',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash',
        'gemini-2.0-flash-lite',
        'gemini-1.5-pro',
        'gemini-pro'
      ];

      for (const target of priorityOrder) {
        const found = models.find((m: any) =>
          m.name === `models/${target}` &&
          (m.supportedGenerationMethods?.includes('generateContent') || !m.supportedGenerationMethods)
        );
        if (found) {
          cachedModelName = target;
          return cachedModelName;
        }
      }

      // If priority didn't match, pick any model supporting generateContent
      const candidate = models.find((m: any) =>
        (m.supportedGenerationMethods?.includes('generateContent') || !m.supportedGenerationMethods) &&
        !m.name.includes('embedding')
      );
      if (candidate) {
        const picked = candidate.name.replace(/^models\//, '');
        cachedModelName = picked;
        return picked;
      }
    }
  } catch (err) {
    console.warn('Could not query available Gemini models dynamically:', err);
  }

  return 'gemini-2.5-flash';
}

export async function callGeminiAPI(
  params: GenerationParams,
  avgAge: string,
  effectiveSubTopic: string
): Promise<LessonNote> {
  const { schoolName, teacherName, subject, classLevel, term, week, topic, duration, period, customInstructions, apiKey } = params;
  const category = categorizeSubject(subject);

  if (!apiKey) {
    throw new Error('API key is required for Gemini AI calls');
  }

  const prompt = `
You are a senior Nigerian curriculum expert and educational supervisor for SUBEB and the Federal Ministry of Education.
Write a comprehensive, in-depth, inspection-ready Nigerian Lesson Note for a school teacher.

Context:
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
9. Leave "hodRemarks" empty ("") for official weekly supervisory inspection.

Respond strictly with valid JSON conforming to this schema (no markdown formatting, no code blocks):
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
}
`;

  const primaryModel = await resolveGeminiModel(apiKey);
  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-001'
  ]));

  let textOutput: string | null = null;
  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          cachedModelName = model;
          break;
        }
      } else {
        const errorText = await response.text();
        lastError = new Error(`Gemini API (${model}) Error ${response.status}: ${errorText}`);
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  if (!textOutput) {
    throw lastError || new Error('No content returned from Gemini API');
  }

  // Clean any backticks if returned
  const cleanedJson = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(cleanedJson);

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
