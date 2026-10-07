import type { TopicKnowledgeModule } from './types';

export const adjectiveTopic: TopicKnowledgeModule = {
  id: 'language-adjectives',
  category: 'language',
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return /\b(adjective|adjectives)\b/i.test(combined);
  },
  getContentSections: () => [
    {
      sectionNumber: 1,
      heading: `Definition and Grammatical Function of Adjectives`,
      body: `An ADJECTIVE is a part of speech that describes, qualifies, modifies, or gives more information about a noun or a pronoun. It answers questions such as: Which one? What kind? How many? Or Whose? For example: "The DILIGENT student passed the RIGOROUS examination." Here, 'diligent' and 'rigorous' are adjectives telling us more about the student and the examination.`,
      lessonTakeaway: `Adjectives make our writing and speech colorful, vivid, and precise.`
    },
    {
      sectionNumber: 2,
      heading: `Major Types and Classifications of Adjectives`,
      body: `Adjectives are classified into several important functional groups:`,
      subPoints: [
        `1. Qualitative / Descriptive Adjectives: Describe the quality or nature of a noun (e.g., beautiful, honest, brave, intelligent).`,
        `2. Quantitative Adjectives: Indicate quantity without exact numbers (e.g., some, much, little, enough, all).`,
        `3. Numeral Adjectives: Specify definite numbers or order (e.g., one, five [cardinal]; first, third [ordinal]).`,
        `4. Demonstrative Adjectives: Point out specific persons or things (e.g., this, that, these, those).`,
        `5. Possessive Adjectives: Show ownership or possession (e.g., my, your, his, her, our, their).`,
        `6. Interrogative Adjectives: Used with nouns to ask questions (e.g., which, what, whose).`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Positions and the Royal Order of Adjectives in Sentences`,
      body: `Adjectives can appear in two main positions:\n• Attributive Position: Placed directly before the noun (e.g. "an intelligent girl").\n• Predicative Position: Placed after a linking verb (e.g. "The girl is intelligent").\nWhen multiple adjectives describe one noun, follow the standard order: Opinion -> Size -> Age -> Shape -> Colour -> Origin -> Material -> Purpose -> NOUN.\nExample: "She bought a [1. beautiful] [2. small] [3. new] [5. black] [6. Nigerian] leather handbag."`,
      lessonTakeaway: `Observing the standard order of adjectives gives English sentences natural grammatical rhythm.`
    },
    {
      sectionNumber: 4,
      heading: `Degrees of Comparison of Adjectives`,
      body: `Descriptive adjectives change form to show degrees of comparison:\n• Positive Degree: Describes one person or object (e.g., tall, wise, hardworking).\n• Comparative Degree: Compares two persons or objects; add '-er' or 'more' (e.g., taller, wiser, more hardworking).\n• Superlative Degree: Compares three or more; add '-est' or 'most' (e.g., tallest, wisest, most hardworking).\n• Irregular Forms: good -> better -> best; bad -> worse -> worst; little -> less -> least.`,
      subPoints: [
        `Avoid double comparatives (do NOT say "more taller" or "most fastest").`,
        `Use 'than' with comparative forms (e.g. "Chidi is taller than Musa").`
      ]
    },
    {
      sectionNumber: 5,
      heading: `Common Errors in Nigerian English and Practical Sentence Application`,
      body: `In everyday Nigerian communication, speakers sometimes confuse adjectives with adverbs or use incorrect prepositions. Practice constructing clear sentences using vivid adjectives to excel in WAEC essay writing and school debates.`,
      lessonTakeaway: `Mastering adjectives equips students to write compelling essays and speak persuasively.`
    }
  ],
  getClassroomActivities: () => [
    {
      title: 'Activity 1 – "Describe the Object" Flashcard Relay',
      description: `Teacher displays everyday classroom objects (e.g. a book, a bag, a ruler) and pupils take turns providing three vivid adjectives of quality, color, and size to describe each.`
    },
    {
      title: 'Activity 2 – Adjective Sorting Challenge',
      description: `In groups, students categorize a list of 15 words into Qualitative, Quantitative, Demonstrative, and Possessive adjective columns on the chalkboard.`
    },
    {
      title: 'Activity 3 – Sentence Transformation and Ordering Game',
      description: `Students arrange scrambled sets of adjectives into correct royal order (Opinion, Size, Age, Shape, Colour, Origin, Material) to describe a Nigerian festival or dress.`
    }
  ],
  getEvaluation: () => [
    `Define an adjective and give three examples.`,
    `Mention five types of adjectives and write one illustrative sentence for each.`,
    `Underline the adjectives in the sentence: "The courageous young girl won a prestigious national scholarship."`,
    `Differentiate between attributive and predicative positions of adjectives with examples.`,
    `Arrange these adjectives in the correct order: (leather / brown / large / Nigerian) bag.`,
    `Give the comparative and superlative degrees of: good, tall, beautiful, and bad.`,
    `Correct the error in this sentence: "Emeka is more taller than his brother."`,
    `Construct two original sentences using demonstrative adjectives.`
  ],
  getCoreRule: () =>
    `Golden Rule of Adjectives: "Use adjectives to illuminate, not to clutter. Observe the Royal Order: Opinion, Size, Age, Shape, Colour, Origin, Material + Noun."`
};
