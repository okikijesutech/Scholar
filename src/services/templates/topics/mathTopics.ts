import type { TopicKnowledgeModule } from './types';

export const fractionTopic: TopicKnowledgeModule = {
  id: 'math-fractions',
  category: 'mathematics',
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    // Strict word boundary check to avoid matching words like "properties"
    return /\b(fraction|fractions|denominator|numerator|proper fraction|improper fraction|mixed fraction)\b/i.test(combined);
  },
  getContentSections: () => [
    {
      sectionNumber: 1,
      heading: `Meaning and Concept of Fractions`,
      body: `A fraction represents a part of a whole quantity or collection. It consists of two main parts written as a/b: the top number is the NUMERATOR (showing how many parts we have), and the bottom number is the DENOMINATOR (showing the total equal parts into which the whole is divided). There are three main types:\n• Proper Fractions: Numerator is smaller than denominator (e.g. 1/2, 3/4).\n• Improper Fractions: Numerator is greater than or equal to denominator (e.g. 5/3, 7/4).\n• Mixed Fractions: A whole number and a proper fraction combined (e.g. 1 1/2, 2 3/4).`,
      lessonTakeaway: `A fraction is simply a fair division of a whole unit into equal parts.`
    },
    {
      sectionNumber: 2,
      heading: `Governing Rules for Adding Fractions`,
      body: `To add fractions correctly, follow these sequential steps:\n• Case 1 (Same Denominators / Like Fractions): Add the numerators directly and keep the common denominator: a/c + b/c = (a + b)/c.\n• Case 2 (Different Denominators / Unlike Fractions): Find the Lowest Common Multiple (LCM) of the denominators to create equivalent like fractions.\n• Case 3 (Mixed Numbers): Convert mixed fractions to improper fractions first, or add whole numbers separately and fractions separately. Always express the final answer in its simplest/lowest terms.`,
      subPoints: [
        `Rule 1: NEVER add denominators together (e.g., 1/3 + 1/3 is NOT 2/6, but 2/3).`,
        `Rule 2: Find the LCM of unlike denominators before adding numerators.`,
        `Rule 3: Simplify the final answer by dividing numerator and denominator by their HCF.`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Step-by-Step Worked Examples on the Chalkboard`,
      body: `Example 1 (Like Denominators):\nAdd 2/7 + 3/7 = (2 + 3)/7 = 5/7.\n\nExample 2 (Unlike Denominators):\nAdd 1/4 + 2/3.\nStep 1: Find LCM of 4 and 3 = 12.\nStep 2: Convert to equivalent fractions: 1/4 = 3/12, and 2/3 = 8/12.\nStep 3: Add numerators: 3/12 + 8/12 = 11/12.\n\nExample 3 (Mixed Fractions):\nAdd 1 1/2 + 2 1/4 = 3/2 + 9/4 = 6/4 + 9/4 = 15/4 = 3 3/4.`,
      lessonTakeaway: `Working out the LCM methodically guarantees correct addition of unlike fractions.`
    },
    {
      sectionNumber: 4,
      heading: `Common Errors Pupils Make in Fractions and How to Avoid Them`,
      body: `Primary and Junior secondary school pupils frequently make avoidable mistakes during exams:`,
      subPoints: [
        `Pitfall 1: Adding both numerators and denominators (e.g. writing 1/2 + 1/4 = 2/6 instead of 3/4).`,
        `Pitfall 2: Forgetting to find equivalent numerators after finding the common LCM.`,
        `Pitfall 3: Leaving improper fraction answers without converting them to mixed numbers.`
      ]
    },
    {
      sectionNumber: 5,
      heading: `Real-Life Everyday Applications in Nigerian Homes and Markets`,
      body: `Fractions are part of daily Nigerian life. When sharing a loaf of Agege bread among 4 siblings, each gets 1/4. When a mother cuts an orange or watermelon into 8 equal slices, taking 3 slices represents 3/8. In tailoring, measuring 2 1/2 yards of Ankara fabric depends on understanding fractions.`,
      lessonTakeaway: `Understanding fractions enables fair sharing, precise measurement, and smart budgeting.`
    }
  ],
  getClassroomActivities: () => [
    {
      title: 'Activity 1 – Paper Folding & Fraction Strips Manipulation',
      description: `Each pupil folds rectangular strips of paper into halves, fourths, and eighths, shading portions to visually discover equivalent fractions and model addition concretely.`
    },
    {
      title: 'Activity 2 – Blackboard LCM and Addition Relay',
      description: `Students race in pairs to find the LCM of two given denominators on the board, convert to equivalent fractions, and sum the numerators correctly.`
    },
    {
      title: 'Activity 3 – Nigerian Food Sharing Word Problem',
      description: `Pupils solve real-life word problems: "If Amina ate 1/4 of a loaf of bread in the morning and 2/4 in the afternoon, what fraction did she eat altogether?" Pupils share and verify solutions.`
    }
  ],
  getEvaluation: () => [
    `What is a fraction? Differentiate between numerator and denominator.`,
    `State the three major types of fractions and give two examples of each.`,
    `Add the following like fractions: 3/8 + 2/8.`,
    `Add the following unlike fractions: 1/3 + 2/5 (Show all working including LCM).`,
    `Solve the mixed fraction problem: 1 1/2 + 2 1/4.`,
    `Why is it mathematically incorrect to add denominators together when adding fractions?`,
    `Word Problem: Chinedu spent 2/5 of his pocket money on books and 1/5 on transport. What fraction did he spend in total?`,
    `Simplify your final answer to its lowest terms: 6/12.`
  ],
  getCoreRule: () =>
    `Core Mathematical Rule: "When adding unlike fractions, find the LCM of denominators first. Never add denominators together!"`
};

export const rectangleGeometryTopic: TopicKnowledgeModule = {
  id: 'math-rectangles',
  category: 'mathematics',
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return /\b(rectangle|rectangles|plane shapes?|quadrilaterals?)\b/i.test(combined);
  },
  getContentSections: () => [
    {
      sectionNumber: 1,
      heading: `Definition and Geometric Features of a Rectangle`,
      body: `A rectangle is a four-sided two-dimensional geometric plane shape (quadrilateral) with four right angles (each measuring 90°). It has two pairs of parallel and equal opposite sides: the longer side is the Length (L) and the shorter side is the Breadth or Width (B). The sum of all four interior angles in any rectangle is 360° (4 × 90° = 360°).`,
      lessonTakeaway: `A rectangle is an equiangular quadrilateral with pairs of equal opposite sides.`
    },
    {
      sectionNumber: 2,
      heading: `Key Properties of a Rectangle`,
      body: `Every rectangle obeys specific geometric properties that distinguish it from other quadrilaterals:`,
      subPoints: [
        `Opposite sides are parallel and equal in length (AB = DC and AD = BC).`,
        `All four interior angles are right angles (90 degrees each).`,
        `The diagonals are equal in length and bisect (cut into two equal halves) each other.`,
        `A rectangle has two lines of reflective symmetry (vertical and horizontal through midpoints of sides).`,
        `It possesses rotational symmetry of order 2.`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Formulas for Perimeter and Area of a Rectangle`,
      body: `When measuring rectangular surfaces, two key calculations are essential:\n• Perimeter (P): The total distance around the boundary. Formula: P = L + B + L + B = 2(Length + Breadth).\n• Area (A): The amount of space enclosed within the boundary. Formula: Area = Length × Breadth (measured in square units such as cm² or m²).\n\nWorked Example:\nA classroom chalkboard measures 4 meters in length and 2 meters in breadth.\n1. Perimeter = 2 × (4m + 2m) = 2 × 6m = 12 meters.\n2. Area = 4m × 2m = 8 square meters (8 m²).`,
      lessonTakeaway: `Perimeter measures the boundary length, while Area measures the enclosed space.`
    },
    {
      sectionNumber: 4,
      heading: `Differentiating Rectangles from Squares and Parallelograms`,
      body: `Students often confuse quadrilaterals with similar features:`,
      subPoints: [
        `Square vs. Rectangle: A square is a special rectangle where all four sides are equal; in a regular rectangle, only opposite sides are equal.`,
        `Parallelogram vs. Rectangle: Both have equal opposite sides, but a rectangle must have 90° right angles, whereas a parallelogram generally has slanted angles.`,
        `Diagonals in a rectangle bisect each other, but do not meet at 90° unless the rectangle is a square.`
      ]
    },
    {
      sectionNumber: 5,
      heading: `Real-Life Applications in Nigerian Architecture, Carpentry, and Daily Life`,
      body: `Rectangles are ubiquitous in Nigeria. Building blocks, standard plots of land (e.g. 50ft by 100ft), classroom doors, textbook covers, windows, football pitches, and zinc roofing sheets are engineered using rectangular dimensions for structural strength and efficiency.`,
      lessonTakeaway: `Understanding rectangles enables precise land measurement, carpentry construction, and architectural design.`
    }
  ],
  getClassroomActivities: () => [
    {
      title: 'Activity 1 – Measuring Classroom Rectangular Surfaces',
      description: `In pairs, students use meter rulers or measuring tapes to measure the length and breadth of their classroom desks, exercise books, or doors, and record their dimensions.`
    },
    {
      title: 'Activity 2 – Perimeter & Area Chalkboard Calculation Relay',
      description: `Teacher provides varying dimensions (e.g., 8cm by 5cm, 12m by 6m) and teams race to compute Perimeter = 2(L + B) and Area = L × B on the board.`
    },
    {
      title: 'Activity 3 – Paper Folding for Lines of Symmetry',
      description: `Each student cuts a rectangular piece of paper and folds it to verify that it has exactly two lines of symmetry, demonstrating why diagonal folds do not match.`
    }
  ],
  getEvaluation: () => [
    `Define a rectangle and state how many sides and interior angles it possesses.`,
    `State four essential geometric properties of a rectangle.`,
    `What is the measure of each interior angle in a rectangle? What is the total sum of angles?`,
    `Write down the mathematical formula for: (a) Perimeter of a rectangle (b) Area of a rectangle.`,
    `A rectangular vegetable garden has a length of 15 meters and a breadth of 8 meters. Calculate: (a) Its Perimeter (b) Its Area.`,
    `Explain two differences between a rectangle and a square.`,
    `How many lines of symmetry does a rectangle possess? Show how they are determined.`,
    `Mention four real-life rectangular objects found in your school or home in Nigeria.`
  ],
  getCoreRule: () =>
    `Core Geometric Principle: "A rectangle is a quadrilateral with opposite sides parallel and equal, 4 right angles of 90°, and equal diagonals that bisect each other."`
};
