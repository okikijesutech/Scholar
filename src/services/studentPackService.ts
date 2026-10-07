import type { LessonNote } from '../types';
import {
  studentPackSchema,
  type StudentPack,
  type QuizQuestion
} from '../schemas';

const STORAGE_KEY_STUDENT_PACKS = 'lessonflow_student_packs_v1';

export function getStoredStudentPacks(): StudentPack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENT_PACKS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is StudentPack => studentPackSchema.safeParse(p).success);
  } catch (e) {
    console.error('Failed to load student packs:', e);
    return [];
  }
}

export function getStudentPackForNote(noteId: string): StudentPack | undefined {
  return getStoredStudentPacks().find(p => p.noteId === noteId);
}

export function saveStudentPack(pack: StudentPack): void {
  try {
    const packs = getStoredStudentPacks();
    const idx = packs.findIndex(p => p.noteId === pack.noteId);
    if (idx >= 0) {
      packs[idx] = pack;
    } else {
      packs.unshift(pack);
    }
    localStorage.setItem(STORAGE_KEY_STUDENT_PACKS, JSON.stringify(packs));
  } catch (e) {
    console.error('Failed to save student pack:', e);
  }
}

/**
 * Builds standard 5 multiple choice questions grounded in the lesson note.
 */
function buildQuizQuestions(note: LessonNote): QuizQuestion[] {
  const subjectLower = note.subject.toLowerCase();
  const topicLower = `${note.topic} ${note.subTopic || ''}`.toLowerCase();

  // Curated high-yield questions for core pilot topics
  if (subjectLower.includes('math') && topicLower.includes('fraction')) {
    return [
      {
        questionNumber: 1,
        question: 'In any fraction a/b, what is the bottom number (b) called?',
        options: { A: 'Numerator', B: 'Denominator', C: 'Quotient', D: 'Divisor' },
        correctOption: 'B',
        explanation: 'The denominator indicates the total number of equal parts into which the whole is divided.'
      },
      {
        questionNumber: 2,
        question: 'What is a fraction where the numerator is greater than or equal to the denominator called?',
        options: { A: 'Proper Fraction', B: 'Mixed Number', C: 'Improper Fraction', D: 'Equivalent Fraction' },
        correctOption: 'C',
        explanation: 'An improper fraction has a numerator that is larger than or equal to the denominator (e.g. 7/4).'
      },
      {
        questionNumber: 3,
        question: 'Solve the addition: 2/9 + 4/9.',
        options: { A: '6/18', B: '6/9 (or 2/3)', C: '8/9', D: '2/9' },
        correctOption: 'B',
        explanation: 'For like denominators, add numerators directly: (2+4)/9 = 6/9, which simplifies to 2/3.'
      },
      {
        questionNumber: 4,
        question: 'What is the first step when adding two unlike fractions such as 1/3 and 2/5?',
        options: { A: 'Add numerators together', B: 'Add denominators together', C: 'Find the LCM of 3 and 5', D: 'Multiply by 10' },
        correctOption: 'C',
        explanation: 'You must always find the Lowest Common Multiple (LCM) of unlike denominators before adding.'
      },
      {
        questionNumber: 5,
        question: 'Amina ate 1/4 of a loaf of Agege bread in the morning and 2/4 in the evening. What fraction did she eat altogether?',
        options: { A: '3/8', B: '2/4', C: '3/4', D: '1/2' },
        correctOption: 'C',
        explanation: '1/4 + 2/4 = (1 + 2)/4 = 3/4 of the loaf.'
      }
    ];
  }

  if (subjectLower.includes('math') && (topicLower.includes('rectangle') || topicLower.includes('shape'))) {
    return [
      {
        questionNumber: 1,
        question: 'How many right angles does a rectangle possess?',
        options: { A: '2', B: '3', C: '4', D: '8' },
        correctOption: 'C',
        explanation: 'A rectangle has four 90-degree right angles totaling 360 degrees.'
      },
      {
        questionNumber: 2,
        question: 'Which of the following properties is TRUE for a rectangle?',
        options: { A: 'All four sides are equal', B: 'Opposite sides are parallel and equal', C: 'Interior angles equal 45°', D: 'It has 3 sides' },
        correctOption: 'B',
        explanation: 'In a rectangle, opposite pairs of sides are equal in length and parallel.'
      },
      {
        questionNumber: 3,
        question: 'What is the formula for the Perimeter of a rectangle?',
        options: { A: 'Length × Breadth', B: '2 × (Length + Breadth)', C: 'Length + Breadth', D: '4 × Length' },
        correctOption: 'B',
        explanation: 'Perimeter is the boundary distance: P = 2(L + B).'
      },
      {
        questionNumber: 4,
        question: 'A classroom table has a length of 5m and a breadth of 3m. What is its Area?',
        options: { A: '16 m²', B: '8 m²', C: '15 m²', D: '30 m²' },
        correctOption: 'C',
        explanation: 'Area = Length × Breadth = 5m × 3m = 15 square meters.'
      },
      {
        questionNumber: 5,
        question: 'How many lines of reflective symmetry does a regular rectangle have?',
        options: { A: '1', B: '2', C: '4', D: 'Infinite' },
        correctOption: 'B',
        explanation: 'A rectangle has two lines of symmetry passing through opposite midpoints.'
      }
    ];
  }

  if (subjectLower.includes('science') && (topicLower.includes('habitat') || topicLower.includes('living'))) {
    return [
      {
        questionNumber: 1,
        question: 'What is the natural dwelling environment of a living organism called?',
        options: { A: 'Ecosystem', B: 'Habitat', C: 'Community', D: 'Biosphere' },
        correctOption: 'B',
        explanation: 'A habitat is the physical place where an organism lives, feeds, and reproduces.'
      },
      {
        questionNumber: 2,
        question: 'Which of the following is a key adaptation of a fish for swimming in water?',
        options: { A: 'Lungs', B: 'Streamlined body shape', C: 'Feathers', D: 'Webbed claws' },
        correctOption: 'B',
        explanation: 'A streamlined body reduces water resistance during locomotion.'
      },
      {
        questionNumber: 3,
        question: 'Why are leaves of desert cactus plants reduced to sharp spines?',
        options: { A: 'To absorb sunlight', B: 'To prevent water loss by transpiration', C: 'To float in water', D: 'To attract insects' },
        correctOption: 'B',
        explanation: 'Spines minimize surface area to prevent water loss in arid environments.'
      },
      {
        questionNumber: 4,
        question: 'Which feature enables camels to walk easily across loose desert sand?',
        options: { A: 'Sharp claws', B: 'Broad padded feet', C: 'Webbed feet', D: 'Hooves' },
        correctOption: 'B',
        explanation: 'Broad padded feet distribute body weight and prevent sinking into sand.'
      },
      {
        questionNumber: 5,
        question: 'Water lilies float on pond surfaces because they possess:',
        options: { A: 'Heavy roots', B: 'Air cavities in their stems', C: 'Dry thorns', D: 'Needle leaves' },
        correctOption: 'B',
        explanation: 'Spongy aerenchyma tissues with air cavities provide buoyancy to float.'
      }
    ];
  }

  // Dynamic pedagogical generator derived from lesson note
  const evaluationQuestions = note.evaluation.length >= 3 ? note.evaluation : [
    `State the primary definition of ${note.topic}.`,
    `Identify the essential characteristics of ${note.subTopic || note.topic}.`,
    `How does ${note.topic} apply in practical Nigerian life?`
  ];

  return [
    {
      questionNumber: 1,
      question: `Which statement best defines ${note.topic}?`,
      options: {
        A: `A core concept explaining ${note.subTopic || note.topic}`,
        B: 'An unrelated historical topic',
        C: 'A process that never occurs in nature',
        D: 'None of the above'
      },
      correctOption: 'A',
      explanation: `${note.topic} is foundational to ${note.subject} for ${note.classLevel}.`
    },
    {
      questionNumber: 2,
      question: `Regarding ${note.topic}, which of the following is a primary learning objective?`,
      options: {
        A: note.behavioralObjectives[0] || 'Understand the core principles',
        B: 'Ignore all safety and class rules',
        C: 'Memorize unrelated foreign terms',
        D: 'Avoid asking questions in class'
      },
      correctOption: 'A',
      explanation: 'Our primary objective is mastering the stated curriculum competency.'
    },
    {
      questionNumber: 3,
      question: evaluationQuestions[0] || `What is the key takeaway in ${note.topic}?`,
      options: {
        A: 'It applies directly to solving real-life challenges in Nigeria',
        B: 'It has no real-world importance',
        C: 'It was abolished from the curriculum',
        D: 'It cannot be tested in examinations'
      },
      correctOption: 'A',
      explanation: 'Every concept in the NERDC curriculum develops practical competencies.'
    },
    {
      questionNumber: 4,
      question: `When answering exam questions on ${note.topic}, students should:`,
      options: {
        A: 'State clear definitions, steps, and worked examples',
        B: 'Write one-word answers without explanation',
        C: 'Skip the section completely',
        D: 'Copy from neighbors'
      },
      correctOption: 'A',
      explanation: 'Examiners award marks for step-by-step clarity and definitions.'
    },
    {
      questionNumber: 5,
      question: `Why is the study of ${note.topic} important in Nigerian schools?`,
      options: {
        A: 'To build foundational knowledge for WAEC, NECO, and career growth',
        B: 'Only to pass time in school',
        C: 'Because it is optional',
        D: 'It is not important'
      },
      correctOption: 'A',
      explanation: 'Strong mastery provides a competitive edge in national examinations.'
    }
  ];
}

/**
 * Generates a complete Student Study Pack from a Lesson Note.
 */
export function generateStudentPack(note: LessonNote): StudentPack {
  // Extract key summary points from content sections or objectives
  const summaryPoints: string[] = [];

  if (note.contentSections && note.contentSections.length > 0) {
    for (const sec of note.contentSections.slice(0, 4)) {
      if (sec.lessonTakeaway) {
        summaryPoints.push(sec.lessonTakeaway);
      } else {
        summaryPoints.push(`${sec.heading}: ${sec.body.slice(0, 120)}...`);
      }
    }
  }

  if (summaryPoints.length === 0 && note.behavioralObjectives.length > 0) {
    note.behavioralObjectives.slice(0, 4).forEach(obj => {
      summaryPoints.push(`Key Objective: ${obj}`);
    });
  }

  const quizQuestions = buildQuizQuestions(note);

  const pack: StudentPack = {
    id: `pack-${note.id}-${Date.now()}`,
    noteId: note.id,
    subject: note.subject,
    classLevel: note.classLevel,
    topic: note.topic,
    subTopic: note.subTopic || '',
    summaryPoints,
    coreRuleOrMemoryVerse: note.keyScriptureOrCoreRule,
    quizQuestions,
    teacherName: note.teacherName || 'Subject Teacher',
    schoolName: note.schoolName || '',
    createdAt: new Date().toISOString()
  };

  saveStudentPack(pack);
  return pack;
}

/**
 * Formats a student pack with emojis and clean markdown for instant WhatsApp sharing.
 */
export function formatStudentPackForWhatsApp(pack: StudentPack): string {
  const lines: string[] = [];

  lines.push('📚 *LESSONFLOW STUDENT STUDY PACK* 🇳🇬');
  lines.push(`📖 *Subject:* ${pack.subject} | *Class:* ${pack.classLevel}`);
  lines.push(`🎯 *Topic:* ${pack.topic}${pack.subTopic ? ` - ${pack.subTopic}` : ''}`);
  if (pack.schoolName) lines.push(`🏫 *School:* ${pack.schoolName}`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('💡 *KEY LESSON TAKEAWAYS (REVISION SUMMARY):*');

  pack.summaryPoints.forEach((point, i) => {
    lines.push(`• *Point ${i + 1}:* ${point}`);
  });

  if (pack.coreRuleOrMemoryVerse) {
    lines.push('');
    lines.push(`⭐ *Golden Principle / Memory Rule:*`);
    lines.push(`"${pack.coreRuleOrMemoryVerse}"`);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📝 *5-QUESTION QUICK REVISION QUIZ:*');
  lines.push('_Test your understanding before the next class!_');
  lines.push('');

  pack.quizQuestions.forEach(q => {
    lines.push(`*Q${q.questionNumber}.* ${q.question}`);
    lines.push(`   A) ${q.options.A}`);
    lines.push(`   B) ${q.options.B}`);
    lines.push(`   C) ${q.options.C}`);
    lines.push(`   D) ${q.options.D}`);
    lines.push('');
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('🔑 *ANSWERS & EXPLANATIONS:*');
  lines.push('_Check your answers after attempting the quiz above:_');
  lines.push('');

  pack.quizQuestions.forEach(q => {
    lines.push(`*Q${q.questionNumber}:* Option *${q.correctOption}* — ${q.explanation}`);
  });

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`_Shared by ${pack.teacherName} via LessonFlow_`);
  lines.push('_Inspection-ready notes & study packs for Nigerian schools_');

  return lines.join('\n');
}
