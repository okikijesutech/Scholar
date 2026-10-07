import type { ContentSection, ClassroomActivity } from '../../../types';
import type { SubjectCategory } from '../subjectCategories';

/**
 * Generates an honest, structured NERDC pedagogical skeleton for topics
 * that do not have dedicated precompiled offline templates.
 *
 * Rather than generating misleading pseudo-mathematical or pseudo-scientific filler text,
 * this provides inspection-ready lesson section headings with explicit teacher prompts.
 */
export function generateSkeletonContentSections(
  subject: string,
  topic: string,
  subTopic: string
): ContentSection[] {
  return [
    {
      sectionNumber: 1,
      heading: `Definition and Theoretical Foundations of ${subTopic}`,
      body: `[Teacher Note: Provide the formal definition of ${subTopic} under the subject domain of ${subject}. Define all key technical terms clearly on the chalkboard so students copy exact definitions into their exercise books.]`,
      subPoints: [
        `Standard Definition: [Teacher: Insert formal definition of ${subTopic} as specified in the approved NERDC curriculum]`,
        `Key Terminology: [Teacher: Introduce 2 to 3 essential keywords and their standard definitions]`,
        `Foundational Context: [Teacher: Relate this concept to the broader topic of ${topic}]`
      ],
      lessonTakeaway: `[Teacher Note: State the primary concept or rule that every student must remember regarding ${subTopic}.]`
    },
    {
      sectionNumber: 2,
      heading: `Core Principles, Formulas, and Classifications`,
      body: `[Teacher Note: Outline the governing laws, scientific principles, grammatical rules, or mathematical formulas that regulate ${subTopic}. Highlight distinctions, components, or criteria students must master.]`,
      subPoints: [
        `Principle/Rule 1: [Teacher: State the primary operational rule, law, or formula]`,
        `Principle/Rule 2: [Teacher: Detail the secondary characteristics or standard procedures]`,
        `Classifications/Categories: [Teacher: List any types, stages, or classifications of ${subTopic}]`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Step-by-Step Chalkboard Demonstration & Worked Examples`,
      body: `[Teacher Note: Write out 2 clear worked examples, experimental demonstrations, or illustrative case studies on the chalkboard step by step. Have students follow along and verify each step in their exercise books.]`,
      subPoints: [
        `Demonstration 1 (Introductory): [Teacher: Step-by-step resolution of a foundational problem or sentence analysis]`,
        `Demonstration 2 (Intermediate): [Teacher: Worked example with multiple stages demonstrating student participation at the chalkboard]`
      ],
      lessonTakeaway: `Methodical step-by-step procedure guarantees accuracy and mastery.`
    },
    {
      sectionNumber: 4,
      heading: `Common Errors, Learner Pitfalls, and How to Avoid Them`,
      body: `[Teacher Note: Discuss frequent mistakes students make during terminal exams, WAEC, NECO, or BECE regarding ${topic}. Emphasize strategies to check work and avoid these traps.]`,
      subPoints: [
        `Common Pitfall 1: [Teacher: Highlight frequent error, calculation slip, or misconception]`,
        `Common Pitfall 2: [Teacher: Note common confusion between similar concepts]`,
        `Verification Strategy: [Teacher: Guide students on how to cross-check their work independently]`
      ]
    },
    {
      sectionNumber: 5,
      heading: `Practical Applications in Nigerian Daily Life, Industry, and Community`,
      body: `[Teacher Note: Connect ${subTopic} directly to realistic Nigerian situations, local trades, home life, or environmental challenges. Show students why learning ${topic} matters beyond the examination hall.]`,
      subPoints: [
        `Local Relevance: [Teacher: Cite concrete examples from Nigerian markets, agriculture, technology, or community life]`,
        `Civic/Ethical Dimension: [Teacher: Highlight how knowledge of ${topic} fosters responsibility and problem solving]`
      ],
      lessonTakeaway: `True learning translates classroom principles into practical solutions for our community.`
    }
  ];
}

export function generateSkeletonClassroomActivities(
  _subject: string,
  topic: string,
  subTopic: string
): ClassroomActivity[] {
  return [
    {
      title: 'Activity 1 – Small Group Analysis & Chart Inspection',
      description: `[Teacher Note: Group students into teams of 4–5. Provide textbooks or flashcards. Have each group identify key features of ${subTopic} and list them on chart paper or notebooks.]`
    },
    {
      title: 'Activity 2 – Chalkboard Relay & Guided Practice',
      description: `[Teacher Note: Call student pairs to the chalkboard to solve or explain stages of ${subTopic} while the rest of the class evaluates and confirms the correct procedure.]`
    },
    {
      title: 'Activity 3 – Everyday Nigerian Application Dialogue',
      description: `[Teacher Note: Facilitate a 5-minute interactive class discussion where students brainstorm how ${topic} helps solve daily problems in their homes, schools, or communities.]`
    }
  ];
}

export function generateSkeletonEvaluation(
  _subject: string,
  topic: string,
  subTopic: string
): string[] {
  return [
    `1. Define ${subTopic} in your own words.`,
    `2. Mention three major characteristics, rules, or components of ${topic}.`,
    `3. Outline the step-by-step process or method demonstrated in today's lesson.`,
    `4. [Teacher Note: Insert specific practice question, calculation, or passage analysis on ${subTopic}].`,
    `5. State two common errors or pitfalls learners make in ${topic} and explain how to avoid them.`,
    `6. Describe one real-life way understanding ${subTopic} is useful in Nigeria today.`
  ];
}

export function generateSkeletonCoreRule(
  category: SubjectCategory,
  subject: string,
  topic: string
): string {
  if (category === 'religious') {
    const isIslamic = subject.toLowerCase().includes('islamic') || subject.toLowerCase().includes('irs');
    return isIslamic
      ? `Key Quranic Reference: “Verily, with hardship comes ease.” (Surah Ash-Sharh 94:6)`
      : `Key Scriptural Truth: “The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.” (Proverbs 9:10)`;
  }
  if (category === 'mathematics') {
    return `Core Mathematical Principle: "Check your signs, maintain clear operational steps, and verify every solution through substitution."`;
  }
  if (category === 'science') {
    return `Core Scientific Principle: "Observation without bias, hypothesis tested by experiment, and knowledge applied to preserve and enhance life."`;
  }
  if (category === 'language') {
    return `Golden Rule of Communication: "Think clearly, speak precisely, write elegantly, and observe grammatical concord."`;
  }
  if (category === 'commercial') {
    return `Core Economic Principle: "Scarcity necessitates choice; budget with discipline, allocate resources wisely, and trade with integrity."`;
  }
  if (category === 'civic_social') {
    return `National Civic Creed: "To serve Nigeria with heart and might; uphold honour, justice, integrity, and the rule of law."`;
  }
  return `Core Pedagogical Principle: "Master foundational concepts of ${topic}, follow standard procedures, and apply knowledge with diligence."`;
}
