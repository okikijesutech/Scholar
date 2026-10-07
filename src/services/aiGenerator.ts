import type { ClassLevel, LessonNote, Term, ContentSection, ClassroomActivity } from '../types';
import { getTextbooksForSubject, NIGERIAN_CLASSES } from '../data/curriculumData';

export interface GenerationParams {
  schoolName: string;
  teacherName: string;
  subject: string;
  classLevel: ClassLevel;
  term: Term;
  week: number;
  topic: string;
  subTopic?: string;
  duration?: string;
  period?: string;
  customInstructions?: string;
  apiKey?: string;
}

export type SubjectCategory = 
  | 'mathematics' 
  | 'science' 
  | 'language' 
  | 'religious' 
  | 'commercial' 
  | 'civic_social' 
  | 'vocational';

export function categorizeSubject(subject: string): SubjectCategory {
  const s = subject.toLowerCase();
  if (s.includes('math') || s.includes('arithmetic') || s.includes('further')) return 'mathematics';
  if (s.includes('science') || s.includes('biology') || s.includes('chemistry') || s.includes('physics') || s.includes('agricultural') || s.includes('phe') || s.includes('health')) return 'science';
  if (s.includes('english') || s.includes('literature') || s.includes('yoruba') || s.includes('igbo') || s.includes('hausa') || s.includes('french')) return 'language';
  if (s.includes('christian') || s.includes('crs') || s.includes('islamic') || s.includes('irs') || s.includes('religious')) return 'religious';
  if (s.includes('economics') || s.includes('commerce') || s.includes('business') || s.includes('accounting') || s.includes('bookkeeping')) return 'commercial';
  if (s.includes('civic') || s.includes('social') || s.includes('government') || s.includes('history') || s.includes('geography')) return 'civic_social';
  return 'vocational';
}

export async function generateLessonNote(params: GenerationParams): Promise<LessonNote> {
  const {
    classLevel,
    topic,
    subTopic = '',
    apiKey
  } = params;

  const classInfo = NIGERIAN_CLASSES.find(c => c.id === classLevel);
  const avgAge = classInfo ? classInfo.avgAge : '10 - 12 years';
  const effectiveSubTopic = subTopic.trim() || `Fundamentals of ${topic}`;

  // If API key is provided, attempt live Gemini API call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callGeminiAPI(params, avgAge, effectiveSubTopic);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local curriculum generator:', err);
    }
  }

  // Built-in intelligent local generator (Offline-capable)
  return generateLocalLessonNote(params, avgAge, effectiveSubTopic);
}

// Call Gemini API directly via fetch
async function callGeminiAPI(params: GenerationParams, avgAge: string, effectiveSubTopic: string): Promise<LessonNote> {
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

// Built-in offline Nigerian generator adapted for every subject family
function generateLocalLessonNote(params: GenerationParams, avgAge: string, effectiveSubTopic: string): LessonNote {
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
    // Religious / Vocational / General
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

// Subject-family specialized content sections
function generateSubjectSpecificContentSections(subject: string, topic: string, subTopic: string): ContentSection[] {
  const category = categorizeSubject(subject);

  if (category === 'mathematics') {
    return [
      {
        sectionNumber: 1,
        heading: `Meaning and Mathematical Definition of ${subTopic}`,
        body: `${subTopic} in Mathematics represents an essential operation and principle under ${topic}. It establishes how numerical values, variables, and expressions are manipulated using standard algebraic and arithmetic rules.`,
        lessonTakeaway: `Mathematical clarity begins with knowing the exact definition and operation rule.`
      },
      {
        sectionNumber: 2,
        heading: `Governing Rules, Formulas, and Properties`,
        body: `When working with ${subTopic}, we apply consistent mathematical laws:`,
        subPoints: [
          `Rule 1: Always maintain order of operations (BODMAS / PEMDAS).`,
          `Rule 2: Align like terms and place values strictly in their proper columns.`,
          `Rule 3: Ensure signs (+ and -) are treated with care when shifting across equality signs.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Step-by-Step Worked Demonstration on the Chalkboard`,
        body: `Example 1: Step-by-step resolution of a standard problem involving ${subTopic}:\nStep 1: Write down the given expression.\nStep 2: Group like terms or isolate variables.\nStep 3: Perform arithmetic calculations systematically.\nStep 4: Check the final solution by substituting back into the original problem.`,
        lessonTakeaway: `Checking your answer by substitution is the best way to guarantee 100% accuracy in mathematics.`
      },
      {
        sectionNumber: 4,
        heading: `Common Computational Errors and How to Avoid Them`,
        body: `Examiners in WAEC, NECO, and BECE report frequent pitfalls that cost students marks in ${topic}:`,
        subPoints: [
          `Pitfall 1: Forgetting the negative sign when multiplying across brackets.`,
          `Pitfall 2: Misplacing place-value zero placeholders.`,
          `Pitfall 3: Rushing calculations without double-checking final arithmetic.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Everyday Nigerian Commercial and Practical Word Problems`,
        body: `Mathematics is lived daily in Nigerian trade and engineering. For instance, calculating cost price, profit margins, transport fares along interstate routes, or measuring cement-to-sand ratios on a construction site all rely on ${subTopic}.`,
        lessonTakeaway: `A sound mathematician makes wise financial and practical decisions in everyday Nigerian life.`
      }
    ];
  }

  if (category === 'science') {
    return [
      {
        sectionNumber: 1,
        heading: `Scientific Definition and Concept of ${subTopic}`,
        body: `In the study of ${subject}, ${subTopic} deals with the observable natural processes and laws governing ${topic}. Scientists investigate how living matter, chemical compounds, or physical forces interact under specific environmental conditions.`,
        lessonTakeaway: `Science relies on empirical evidence, accurate observation, and reproducible experiments.`
      },
      {
        sectionNumber: 2,
        heading: `Underlying Scientific Principles and Laws`,
        body: `The natural mechanisms controlling ${topic} follow established scientific laws:`,
        subPoints: [
          `Core Principle 1: Cause-and-effect relationship in natural phenomena.`,
          `Core Principle 2: Conservation of matter and energy during physical or biological changes.`,
          `Core Principle 3: Structural adaptation of organisms or materials to their functions.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Laboratory Apparatus, Materials, and Experimental Procedure`,
        body: `To demonstrate ${subTopic} practically, teachers and students utilize standard science laboratory procedures:\n• Materials: Beakers, test tubes, reagents, specimens, measuring instruments.\n• Safety: Always wear lab coats, handle chemicals and flames with caution, and wash hands thoroughly after specimen contact.`,
        lessonTakeaway: `Safety in the science laboratory is paramount; never taste or inhale unidentified specimens.`
      },
      {
        sectionNumber: 4,
        heading: `Real-Life Environmental and Industrial Applications in Nigeria`,
        body: `The principles of ${topic} are directly visible across Nigeria:`,
        subPoints: [
          `Public Health: Disease prevention (malaria control, clean drinking water, sanitation).`,
          `Agriculture & Food: Soil management, food preservation, and high-yield crop cultivation.`,
          `Industry: Petroleum refining in the Niger Delta, manufacturing, and renewable solar energy.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Environmental Stewardship and Scientific Ethics`,
        body: `Scientific knowledge must be coupled with responsibility. Reckless pollution, deforestation in our rainforests, and oil spillage damage our environment. Students must act as ambassadors for environmental conservation.`,
        lessonTakeaway: `True science seeks to preserve life and build sustainable communities.`
      }
    ];
  }

  if (category === 'language') {
    return [
      {
        sectionNumber: 1,
        heading: `Grammatical Definition and Rules of ${subTopic}`,
        body: `${subTopic} is a crucial structural component of English grammar and communication. It governs how words and ideas are combined to express clear, coherent thoughts in both spoken and written discourse.`,
        lessonTakeaway: `Correct grammar ensures our thoughts are understood accurately without ambiguity.`
      },
      {
        sectionNumber: 2,
        heading: `Rules of Usage and Sentence Structures`,
        body: `Mastery of ${subTopic} requires adhering to standard rules:`,
        subPoints: [
          `Rule 1: Subject-verb agreement (concord) must be strictly maintained.`,
          `Rule 2: Proper punctuation marks (commas, periods, semicolons) dictate the rhythm and meaning.`,
          `Rule 3: Consistency in tense (past, present, continuous) throughout paragraphs.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Illustrative Worked Sentences and Examples`,
        body: `The teacher illustrates correct usage with contrasting examples:\n• Correct: Clear, concise sentences demonstrating ${subTopic}.\n• Incorrect: Common errors that distort intended meaning.`,
        lessonTakeaway: `Reading wide and practicing active writing builds effortless grammatical competence.`
      },
      {
        sectionNumber: 4,
        heading: `Common Errors in Nigerian English and How to Overcome Them`,
        body: `In everyday Nigerian speech, local mother tongue interference often leads to typical grammatical errors:`,
        subPoints: [
          `Tautology: e.g. "reverse back" instead of "reverse".`,
          `Direct literal translations from indigenous languages into English.`,
          `Misuse of prepositions: e.g. "congratulate for" instead of "congratulate on".`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Practical Application in Essay Writing and Oral Communication`,
        body: `Examiners in WAEC and NECO reward candidates who demonstrate rich vocabulary and flawless grammatical mechanics in essays, formal letters, and comprehension passages.`,
        lessonTakeaway: `Eloquent speech and polished writing open doors to academic and professional excellence.`
      }
    ];
  }

  if (category === 'commercial') {
    return [
      {
        sectionNumber: 1,
        heading: `Meaning and Economic Concept of ${subTopic}`,
        body: `In Commercial and Economic studies, ${subTopic} examines how scarce resources are allocated to satisfy human wants under conditions of choice and opportunity cost in ${topic}.`,
        lessonTakeaway: `Economics is the study of human behavior in making rational choices when resources are limited.`
      },
      {
        sectionNumber: 2,
        heading: `Underlying Laws, Schedules, and Graphical Representation`,
        body: `The relationship in ${topic} is captured through economic schedules and curves:`,
        subPoints: [
          `Economic Law: Stating the core principle (e.g., price and quantity relationship, diminishing returns).`,
          `Schedule: Tabular presentation of data demonstrating the principle.`,
          `Curve/Graph: Visual trend illustrating movement along the curve vs shifts.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Real-Life Applications in Nigerian Markets and Commerce`,
        body: `Economic forces are vividly at play across major Nigerian trading hubs (such as Alaba International, Onitsha Main Market, Bodija Market, and Kantin Kwari in Kano). Fluctuations in prices, transport costs, and consumer purchasing power all reflect ${subTopic}.`,
        lessonTakeaway: `Understanding market realities empowers individuals to budget effectively and thrive commercially.`
      },
      {
        sectionNumber: 4,
        heading: `Consumer Behavior, Budgeting, and Financial Discipline`,
        body: `A prudent economic agent must manage money with wisdom:`,
        subPoints: [
          `Prioritizing basic needs over impulsive wants.`,
          `Building savings and avoiding predatory high-interest debts.`,
          `Evaluating long-term benefits before major purchases.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Impact on National Economic Growth and Policy in Nigeria`,
        body: `Government fiscal policies, inflation control, trade tariffs, and industrial production directly depend on how citizens and businesses navigate ${topic}. Integrity in business promotes investor confidence.`,
        lessonTakeaway: `A nation thrives when its markets operate with transparency, innovation, and ethical trade.`
      }
    ];
  }

  if (category === 'civic_social') {
    return [
      {
        sectionNumber: 1,
        heading: `Meaning and Definition of ${subTopic}`,
        body: `${subTopic} is a pillar of civic responsibility and national orientation. It defines the values, rules, and mutual respect required for peaceful coexistence and democratic progress in Nigeria.`,
        lessonTakeaway: `Civic awareness transforms a resident into an active, responsible citizen.`
      },
      {
        sectionNumber: 2,
        heading: `Constitutional Rights, Duties, and Responsibilities`,
        body: `Under the 1999 Constitution of the Federal Republic of Nigeria, every citizen possesses rights and reciprocal obligations:`,
        subPoints: [
          `Fundamental Human Rights: Right to life, dignity, personal liberty, and freedom of expression.`,
          `Civic Duties: Obeying lawful authorities, paying taxes, voting, and protecting public property.`,
          `Rule of Law: Equality before the law regardless of social status or wealth.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Core Values for National Unity and Integrity`,
        body: `Nigeria's diversity is its strength when guided by shared values:\n• Honesty and discipline in public and private affairs.\n• Patriotism and community service.\n• Zero tolerance for corruption, nepotism, and ethnic discrimination.`,
        lessonTakeaway: `Integrity is doing the right thing even when no one is watching.`
      },
      {
        sectionNumber: 4,
        heading: `Challenges Facing Society and Institutions of Redress`,
        body: `Social vices hinder national development, but dedicated civic agencies work to maintain order:`,
        subPoints: [
          `EFCC and ICPC: Combating financial crimes and corruption.`,
          `INEC: Conducting credible, democratic elections.`,
          `National Orientation Agency (NOA): Promoting positive values and unity.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `The Role of Nigerian Youth in Nation Building`,
        body: `Young Nigerians must reject electoral violence, examination malpractice, and cultism. By pursuing education, technological innovation, and peaceful dialogue, the youth can build a prosperous Nigeria.`,
        lessonTakeaway: `The future of Nigeria rests in the character, wisdom, and diligence of its youth.`
      }
    ];
  }

  // Default / Religious / Vocational
  return [
    {
      sectionNumber: 1,
      heading: `Meaning and Definition of ${subTopic}`,
      body: `${subTopic} is a fundamental concept in ${subject} that describes how specific elements, behaviors, or principles operate under given conditions. It forms an essential foundation for understanding broader topics in ${topic}.`,
      lessonTakeaway: `Understanding the basic definition of ${subTopic} is the first step toward practical mastery.`
    },
    {
      sectionNumber: 2,
      heading: `Key Background & Principles of ${topic}`,
      body: `Throughout history and practical study, ${topic} has played a pivotal role in shaping societal, scientific, and moral frameworks. In Nigerian society, recognizing these foundational principles helps students distinguish between constructive and harmful actions.`,
      subPoints: [
        `Foundational principle 1: Clear identification of rules and standards.`,
        `Foundational principle 2: Disciplined execution without compromise.`,
        `Foundational principle 3: Continuous assessment of outcomes.`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Detailed Breakdown of Key Aspects in ${subTopic}`,
      body: `When examining ${subTopic}, we observe three critical dimensions that every learner must understand: (1) The initial trigger or cause, (2) The intermediate process or reaction, and (3) The ultimate consequence or outcome.`,
      lessonTakeaway: `Every action or reaction in ${topic} produces measurable consequences that impact both individuals and the community.`
    },
    {
      sectionNumber: 4,
      heading: `Practical Application and Overcoming Challenges`,
      body: `Applying the teachings of ${subTopic} requires knowledge, patience, and deliberate self-control. When faced with difficulties or negative influences, students must rely on sound knowledge and moral values rather than shortcuts.`,
      subPoints: [
        `Resisting peer pressure to take shortcuts.`,
        `Upholding integrity in academic and personal life.`,
        `Applying disciplined methodology consistently.`
      ]
    },
    {
      sectionNumber: 5,
      heading: `Moral and Life Lessons for Nigerian Students`,
      body: `The study of ${topic} imparts valuable character and academic lessons:`,
      subPoints: [
        `Knowledge is most powerful when combined with integrity.`,
        `Shortcuts and compromises lead to long-term regret.`,
        `True success requires resilience, self-discipline, and continuous practice.`,
        `We must respect societal laws and established moral principles.`
      ],
      lessonTakeaway: `A disciplined student who masters ${topic} and maintains good character will excel academically and become a leader of tomorrow.`
    }
  ];
}

// Subject-family specialized activities
function generateSubjectSpecificClassroomActivities(subject: string, topic: string, subTopic: string): ClassroomActivity[] {
  const category = categorizeSubject(subject);

  if (category === 'mathematics') {
    return [
      {
        title: 'Activity 1 – Speed Mental Math & Flashcard Drill',
        description: `Teacher flashes mental math calculation cards on ${subTopic}. Pupils solve in under 15 seconds, reinforcing quick recall of operational rules.`
      },
      {
        title: 'Activity 2 – Pair Problem-Solving Relay on the Chalkboard',
        description: `Students work in pairs at the chalkboard. Student A writes down the formula and groups terms; Student B computes the final solution and verifies it.`
      },
      {
        title: 'Activity 3 – Real-Life Nigerian Market Day Simulation',
        description: `Class simulates buying and selling goods in a local Nigerian market stall (e.g. buying yam, garri, or exercise books in Naira ₦) to solve realistic word problems.`
      }
    ];
  }

  if (category === 'science') {
    return [
      {
        title: 'Activity 1 – Specimen Observation & Diagrammatic Sketch',
        description: `Students inspect physical specimens or charts related to ${subTopic} using hand lenses, sketching and labeling key parts neatly in their science notebooks.`
      },
      {
        title: 'Activity 2 – Controlled Demonstration / Mini Lab Experiment',
        description: `Teacher guides students through a hands-on experiment demonstrating ${topic}, recording observations and deducing scientific conclusions.`
      },
      {
        title: 'Activity 3 – Environmental Action Discussion: Clean School & Community',
        description: `Students brainstorm practical steps they can take to solve environmental and health challenges (e.g. malaria control, tree planting, proper waste disposal).`
      }
    ];
  }

  if (category === 'language') {
    return [
      {
        title: 'Activity 1 – Sentence Construction & Grammar Relay',
        description: `Groups of students take turns building grammatically sound sentences on the chalkboard using ${subTopic}, correcting misplaced modifiers and concord errors.`
      },
      {
        title: 'Activity 2 – Guided Reading & Oral Pronunciation Drill',
        description: `Students read aloud selected paragraphs from their literature or English reader, practicing correct stress, intonation, and articulation.`
      },
      {
        title: 'Activity 3 – Debate / Class Discussion: Communicating with Confidence',
        description: `A short 5-minute class debate on a contemporary issue, requiring students to articulate persuasive arguments with rich vocabulary and correct grammar.`
      }
    ];
  }

  // Default / Commercial / Civic
  return [
    {
      title: 'Activity 1 – Small Group Analysis & Presentation',
      description: `Divide the class into three study groups to explore different aspects of ${subTopic}:`,
      items: [
        `Group 1: Analyze the definitions and core characteristics of ${subTopic}.`,
        `Group 2: Identify practical challenges students encounter when studying or applying ${topic}.`,
        `Group 3: Propose realistic solutions and moral takeaways for contemporary life.`
      ]
    },
    {
      title: 'Activity 2 – Guided Reading & Practical Demonstration',
      description: `Students open their textbooks to the chapter on ${topic}. Selected pupils take turns reading aloud key passages, while the teacher explains technical vocabulary.`
    },
    {
      title: 'Activity 3 – Interactive Class Discussion: Contemporary Realities in Nigeria',
      description: `Teacher engages the entire class in a reflective dialogue: "How does the lesson on ${topic} help us navigate everyday challenges in our schools and society?"`,
      items: [
        `Overcoming peer pressure and exam malpractice.`,
        `Honesty in handling money and responsibilities at home and school.`,
        `Positive use of technology and avoiding harmful internet distractions.`,
        `Practicing self-control and respect for teachers, parents, and school rules.`
      ]
    }
  ];
}

function generateSubjectSpecificEvaluation(subject: string, topic: string, subTopic: string): string[] {
  const category = categorizeSubject(subject);

  if (category === 'mathematics') {
    return [
      `Define ${subTopic} in clear mathematical terms.`,
      `State the operational rule or formula used to solve problems on ${topic}.`,
      `Why is it important to follow the correct order of operations?`,
      `Solve Example 1 written on the chalkboard in your evaluation books.`,
      `Solve Example 2 involving brackets and negative signs.`,
      `Solve a word problem: If an item costs ₦1,250, calculate the total cost for 8 items.`,
      `State two common errors pupils make when calculating ${topic}.`,
      `How can you verify that your mathematical answer is correct?`
    ];
  }

  if (category === 'science') {
    return [
      `What is the scientific definition of ${subTopic}?`,
      `Name three major characteristics or structures associated with ${topic}.`,
      `State the scientific law or principle governing this lesson.`,
      `List four laboratory apparatus or materials used in studying ${subTopic}.`,
      `Describe the step-by-step procedure of the experiment demonstrated today.`,
      `What safety precaution must be observed in the science laboratory?`,
      `Mention three ways ${topic} applies to public health or industry in Nigeria.`,
      `Why is environmental sanitation essential in preventing disease outbreaks?`
    ];
  }

  if (category === 'language') {
    return [
      `Define ${subTopic} and give two examples.`,
      `Identify the grammatical function of ${subTopic} in a sentence.`,
      `Construct three original sentences illustrating proper usage of ${subTopic}.`,
      `Correct the grammatical error in the sentence written on the chalkboard.`,
      `Differentiate between standard British English and common Nigerian speech errors.`,
      `Spell and pronounce the five vocabulary words learned in today's lesson.`,
      `Why is active reading crucial for mastering English language?`
    ];
  }

  return [
    `What is the definition of ${subTopic}?`,
    `Explain the background and significance of ${topic}.`,
    `Identify three major characteristics or components of ${subTopic}.`,
    `Describe the process or steps involved when dealing with ${topic}.`,
    `How does understanding ${subTopic} help in solving everyday problems?`,
    `Mention four challenges or negative influences associated with this topic.`,
    `How can a disciplined student overcome these challenges?`,
    `State five moral or practical lessons learned from ${topic}.`,
    `Explain why integrity and self-discipline are essential in this subject.`
  ];
}

function generateSubjectSpecificCoreRule(subject: string, topic: string): string {
  const category = categorizeSubject(subject);
  if (category === 'religious') {
    if (subject.toLowerCase().includes('islamic') || subject.toLowerCase().includes('irs')) {
      return 'Key Quranic Reference: “Verily, with hardship comes ease.” (Surah Ash-Sharh 94:6)';
    }
    return 'Key Scripture: “Worship the Lord your God, and serve him only.” (Matthew 4:10)';
  }
  if (category === 'mathematics') {
    return `Core Mathematical Rule: "Always check your signs, maintain place value alignment, and verify your answers through substitution."`;
  }
  if (category === 'science') {
    return `Core Scientific Principle: "Observation without bias, hypothesis tested by experiment, and knowledge applied for the preservation of life."`;
  }
  if (category === 'language') {
    return `Golden Rule of Grammar: "Clarity, coherence, and concord — think clearly, speak precisely, and write elegantly."`;
  }
  if (category === 'commercial') {
    return `Core Economic Principle: "Scarcity necessitates choice; choose with foresight, budget with discipline, and trade with integrity."`;
  }
  if (category === 'civic_social') {
    return `National Civic Creed: "To serve Nigeria with heart and might; uphold honour, justice, and the rule of law for all citizens."`;
  }
  return `Core Principle: "Knowledge without character leads to destruction; apply ${topic} with integrity and diligence."`;
}

function generateDefaultSteps(topic: string, subTopic: string) {
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

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
