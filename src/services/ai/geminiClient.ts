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

export async function callGeminiAPI(
  params: GenerationParams,
  avgAge: string,
  effectiveSubTopic: string
): Promise<LessonNote> {
  const { schoolName, teacherName, subject, classLevel, term, week, topic, duration, period, customInstructions, apiKey } = params;
  const category = categorizeSubject(subject);

  const prompt = `
You are a senior Nigerian curriculum expert and educational supervisor for SUBEB and the Federal Ministry of Education.
Write a comprehensive, in-depth, inspection-ready Nigerian Lesson Note for a school teacher.

Context:
- School: "${schoolName || 'Federal Government Model College'}"
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
   - For Commercial/Economics: Include economic laws, consumer behaviors, and Nigerian trade contexts (markets like Tejuosho, Bodija, Alaba).
   - For Civic/Social: Include civic duties, rule of law, anti-corruption, and patriotism.
   Each section MUST have:
   - "sectionNumber": number
   - "heading": clear title
   - "body": thorough paragraphs explaining the concept
   - "subPoints": (optional array of bullet points)
   - "lessonTakeaway": (practical takeaway or golden rule)
4. CLASSROOM ACTIVITIES: 3 detailed classroom activities:
   - Activity 1: Group Discussion / Work with clear tasks per group
   - Activity 2: Reading / Specimen Investigation / Problem-Solving Drill
   - Activity 3: Class Discussion linking the topic to real-life contemporary Nigerian pupil experiences (e.g. peer pressure, exam malpractice, honesty, daily market commerce, environmental sanitation).
5. Step-by-step presentation: 4 distinct teaching phases (Intro/Hook, Concept Explanation, Guided Practice, Group Work/Application) with Teacher and Student activities.
6. Formative Evaluation: 8 to 11 thorough evaluation questions testing recall, understanding, and application.
7. Assignment: Specific homework tasks.
8. Key Scripture or Core Rule: Key Bible verse (if CRS), ethical maxim, mathematical theorem, or scientific law.

Respond strictly with valid JSON conforming to this structure (no markdown fences, just pure JSON):
{
  "references": "...",
  "behavioralObjectives": ["...", "..."],
  "previousKnowledge": "...",
  "instructionalMaterials": ["...", "..."],
  "referenceBooks": ["...", "..."],
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
      "title": "Activity 1 – ...",
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
  "teacherRemarks": "..."
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('No content returned from Gemini');
  }

  const parsed = JSON.parse(textOutput);

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
    teacherRemarks: parsed.teacherRemarks || 'The lesson was successfully conducted with active pupil participation.',
    hodRemarks: 'Inspected and verified in accordance with the NERDC Scheme of Work. Approved.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
