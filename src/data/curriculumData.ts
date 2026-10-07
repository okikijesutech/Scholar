import type { ClassLevel, SchemeOfWork, Term } from '../types';

export const NIGERIAN_CLASSES: { id: ClassLevel; name: string; category: 'primary' | 'jss' | 'sss'; avgAge: string }[] = [
  { id: 'Primary 1', name: 'Primary 1 (Basic 1)', category: 'primary', avgAge: '5 - 6 years' },
  { id: 'Primary 2', name: 'Primary 2 (Basic 2)', category: 'primary', avgAge: '6 - 7 years' },
  { id: 'Primary 3', name: 'Primary 3 (Basic 3)', category: 'primary', avgAge: '7 - 8 years' },
  { id: 'Primary 4', name: 'Primary 4 (Basic 4)', category: 'primary', avgAge: '8 - 9 years' },
  { id: 'Primary 5', name: 'Primary 5 (Basic 5)', category: 'primary', avgAge: '9 - 10 years' },
  { id: 'Primary 6', name: 'Primary 6 (Basic 6)', category: 'primary', avgAge: '10 - 11 years' },
  { id: 'JSS 1', name: 'JSS 1 (Basic 7)', category: 'jss', avgAge: '11 - 12 years' },
  { id: 'JSS 2', name: 'JSS 2 (Basic 8)', category: 'jss', avgAge: '12 - 13 years' },
  { id: 'JSS 3', name: 'JSS 3 (Basic 9)', category: 'jss', avgAge: '13 - 14 years' },
  { id: 'SSS 1', name: 'SSS 1 (Senior Secondary 1)', category: 'sss', avgAge: '14 - 15 years' },
  { id: 'SSS 2', name: 'SSS 2 (Senior Secondary 2)', category: 'sss', avgAge: '15 - 16 years' },
  { id: 'SSS 3', name: 'SSS 3 (Senior Secondary 3)', category: 'sss', avgAge: '16 - 17 years' },
];

export const PRIMARY_SUBJECTS = [
  'Mathematics',
  'English Studies',
  'Basic Science & Technology',
  'Social Studies',
  'Civic Education',
  'Agricultural Science',
  'Home Economics',
  'Physical and Health Education (PHE)',
  'Cultural & Creative Arts (CCA)',
  'Christian Religious Studies (CRS)',
  'Islamic Religious Studies (IRS)',
  'Yoruba / Igbo / Hausa Language',
];

export const JSS_SUBJECTS = [
  'Mathematics',
  'English Studies',
  'Basic Science',
  'Basic Technology',
  'Civic Education',
  'Social Studies',
  'Business Studies',
  'Agricultural Science',
  'Home Economics',
  'Physical and Health Education (PHE)',
  'Cultural and Creative Arts (CCA)',
  'Computer Studies / ICT',
  'Christian Religious Studies (CRS)',
  'Islamic Religious Studies (IRS)',
];

export const SSS_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Biology',
  'Chemistry',
  'Physics',
  'Economics',
  'Civic Education',
  'Government',
  'Agricultural Science',
  'Commerce',
  'Financial Accounting',
  'Literature-in-English',
  'Geography',
  'Further Mathematics',
  'Computer Studies',
  'Technical Drawing',
  'Food and Nutrition',
];

export const STANDARD_TEXTBOOKS: Record<string, string[]> = {
  'Mathematics': [
    'New General Mathematics by M.F. Macrae et al. (Pearson/Longman)',
    'Excellence in Mathematics for Nigerian Schools',
    'NERDC National Mathematics Curriculum Series',
    'MAN (Mathematical Association of Nigeria) Mathematics',
  ],
  'English Studies': [
    'Evans Effective English for Schools',
    'Macmillan Brilliant English Course',
    'Intensive English for Senior Secondary Schools',
    'Countdown English Language by Ogunsanwo et al.',
  ],
  'English Language': [
    'Evans Effective English for Senior Secondary Schools',
    'Oral English for Schools and Colleges by Sam Onuigbo',
    'Intensive English for SSS by Benson O.A. Oluikpe',
    'Round-Up English Language for WASSCE/NECO',
  ],
  'Basic Science': [
    'STAN (Science Teachers Association of Nigeria) Basic Science Course',
    'Comprehensive Basic Science for JSS by F.O.C. Ndu',
    'Lantern Basic Science for Junior Secondary Schools',
  ],
  'Basic Science & Technology': [
    'STAN Basic Science and Technology for Primary Schools',
    'Macmillan Basic Science and Technology Course Book',
    'Evans Basic Science and Technology Series',
  ],
  'Biology': [
    'Essential Biology for Senior Secondary Schools by M.C. Michael',
    'Modern Biology for Senior Secondary Schools by S.T. Ramalingam',
    'College Biology by Idodo Umeh',
    'STAN Biology for Senior Secondary Schools',
  ],
  'Chemistry': [
    'New School Chemistry for Senior Secondary Schools by Osei Yaw Ababio',
    'Essential Chemistry for Senior Secondary Schools by I.A. Odesina',
    'Comprehensive Certificate Chemistry by Holderness and Lambert',
  ],
  'Physics': [
    'New School Physics for Senior Secondary Schools by M.W. Anyakoha',
    'Comprehensive Physics for Senior Secondary Schools',
    'Senior Secondary School Physics by P.N. Okeke and M.W. Anyakoha',
  ],
  'Economics': [
    'Comprehensive Economics for Senior Secondary Schools by J.U. Anyaele',
    'Essential Economics for Senior Secondary Schools by C.E. Ande',
    'Fundamentals of Economics by R.A.I. Anyanwuocha',
  ],
  'Civic Education': [
    'Basic Civic Education for Nigerian Schools by Ukegbu et al.',
    'Essential Civic Education for Senior Secondary Schools',
    'Rasmed Civic Education Series',
  ],
  'Social Studies': [
    'Social Studies for Junior Secondary Schools by Dayo Olagunju',
    'Macmillan Social Studies Series',
    'Evans Social Studies for Nigerian Schools',
  ],
  'Business Studies': [
    'WABP Business Studies for Junior Secondary Schools',
    'Evans Junior Secondary Business Studies by Egbe et al.',
    'Comprehensive Business Studies for JSS',
  ],
  'Agricultural Science': [
    'Essential Agricultural Science for Senior Secondary Schools by O.A. Iwena',
    'Prescribed Agricultural Science for Schools and Colleges',
    'STAN Agricultural Science Series',
  ],
  'Government': [
    'Round-Up Government for Senior Secondary Certificate by J.U. Anyaele',
    'Essential Government for Senior Secondary Schools by C.C. Dibie',
    'Comprehensive Government by K.A. Aina',
  ]
};

// Rich Authentic Schemes of Work from NERDC standards
export const SAMPLE_SCHEMES_OF_WORK: SchemeOfWork[] = [
  // Primary 4 Mathematics - 1st Term
  {
    id: 'pri4-math-term1',
    subject: 'Mathematics',
    classLevel: 'Primary 4',
    term: '1st Term',
    weeks: [
      {
        week: 1,
        topic: 'Whole Numbers (Counting & Writing up to 100,000)',
        subTopic: 'Reading and writing numbers up to 10,000 in figures and words',
        objectivesSummary: 'Pupils should be able to count in thousands and write 4-to-5 digit numbers correctly.',
        suggestedMaterials: 'Number flashcards, abacus, chart showing place values (Units, Tens, Hundreds, Thousands).'
      },
      {
        week: 2,
        topic: 'Place Value of Whole Numbers',
        subTopic: 'Identifying place value of digits up to 100,000',
        objectivesSummary: 'Pupils should be able to state the place value of any underlined digit in a 5-digit number.',
        suggestedMaterials: 'Place value charts, spike abacus, counters.'
      },
      {
        week: 3,
        topic: 'Ordering and Comparing Whole Numbers',
        subTopic: 'Using symbols <, >, and = to compare numbers',
        objectivesSummary: 'Pupils should compare two 5-digit numbers and arrange numbers in ascending and descending order.',
        suggestedMaterials: 'Comparison flashcards (<, >, =), number strips.'
      },
      {
        week: 4,
        topic: 'Roman Numerals',
        subTopic: 'Reading and writing Roman numerals from I to C (1 to 100)',
        objectivesSummary: 'Pupils should identify Roman numerals I, V, X, L, C and convert Hindu-Arabic numbers to Roman numerals.',
        suggestedMaterials: 'Wall clock with Roman numerals, matchsticks, charts.'
      },
      {
        week: 5,
        topic: 'Addition of Whole Numbers',
        subTopic: 'Addition of 4-digit numbers with and without regrouping',
        objectivesSummary: 'Pupils should add two 4-digit numbers with carrying.',
        suggestedMaterials: 'Counters, place value grid board.'
      },
      {
        week: 6,
        topic: 'Subtraction of Whole Numbers',
        subTopic: 'Subtraction of 4-digit numbers with borrowing',
        objectivesSummary: 'Pupils should subtract numbers involving borrowing across zeros.',
        suggestedMaterials: 'Bundles of sticks (tens, hundreds), place value blocks.'
      },
      {
        week: 7,
        topic: 'Mid-Term Assessment & Break',
        subTopic: 'Mid-term revision test and evaluation',
        objectivesSummary: 'Evaluate pupils mastery of Weeks 1 to 6 topics.',
        suggestedMaterials: 'Question papers, worksheets.'
      },
      {
        week: 8,
        topic: 'Multiplication of Whole Numbers',
        subTopic: 'Multiplication of 2-digit numbers by 2-digit numbers',
        objectivesSummary: 'Pupils should multiply 2-digit numbers using vertical algorithm.',
        suggestedMaterials: 'Multiplication tables chart 1-12, bottle tops.'
      },
      {
        week: 9,
        topic: 'Division of Whole Numbers',
        subTopic: 'Division of 3-digit numbers by 1-digit number with and without remainder',
        objectivesSummary: 'Pupils should divide numbers using long division method.',
        suggestedMaterials: 'Real objects (oranges, sweets) for sharing simulations.'
      },
      {
        week: 10,
        topic: 'Multiples and Factors',
        subTopic: 'Lowest Common Multiple (LCM) of simple numbers',
        objectivesSummary: 'Pupils should list multiples of 2, 3, 4, 5 and find their LCM.',
        suggestedMaterials: 'Number grid 1-100, colored markers.'
      },
      {
        week: 11,
        topic: 'Revision',
        subTopic: 'General termly revision of all topics covered',
        objectivesSummary: 'Consolidate learning and address individual learning difficulties.',
        suggestedMaterials: 'Past examination questions, revision charts.'
      },
      {
        week: 12,
        topic: 'End of Term Examination',
        subTopic: 'First Term Examination & Assessment',
        objectivesSummary: 'Assess overall pupil performance for the term.',
        suggestedMaterials: 'Examination scripts.'
      }
    ]
  },

  // JSS 2 Basic Science - 1st Term
  {
    id: 'jss2-science-term1',
    subject: 'Basic Science',
    classLevel: 'JSS 2',
    term: '1st Term',
    weeks: [
      {
        week: 1,
        topic: 'Living Things (Habitat)',
        subTopic: 'Types of habitats: Aquatic, Terrestrial, Arboreal and their characteristics',
        objectivesSummary: 'Students should be able to define habitat, classify habitats into 3 main types and give 2 Nigerian examples of each.',
        suggestedMaterials: 'Aquarium or pond water sample, pictures of mangrove forest, savanna grassland, charts.'
      },
      {
        week: 2,
        topic: 'Adaptation of Living Things to Their Habitats',
        subTopic: 'Adaptive features of aquatic and desert organisms',
        objectivesSummary: 'Students should explain how tilapia fish and cactus adapt to their respective environments.',
        suggestedMaterials: 'Preserved fish specimen, potted cactus/succulent plant, hand lens.'
      },
      {
        week: 3,
        topic: 'Relationship Between Organisms in a Habitat',
        subTopic: 'Predation, Symbiosis, Parasitism, Commensalism, and Mutualism',
        objectivesSummary: 'Students should define biological relationships and give everyday examples.',
        suggestedMaterials: 'Illustrative charts, tick on cattle photo, legume root nodules.'
      },
      {
        week: 4,
        topic: 'Pollution (Air, Water, and Land)',
        subTopic: 'Causes, sources, and effects of environmental pollution in Nigeria',
        objectivesSummary: 'Students should list 4 major pollutants in Nigerian cities (e.g. exhaust fumes, plastic waste) and their remedies.',
        suggestedMaterials: 'Samples of polluted water, newspaper clippings on oil spillage or plastic menace.'
      },
      {
        week: 5,
        topic: 'Deforestation and Afforestation',
        subTopic: 'Causes and consequences of forest destruction, conservation measures',
        objectivesSummary: 'Students should distinguish between deforestation and afforestation and state 3 reasons for tree planting.',
        suggestedMaterials: 'Tree seedlings, pictures of desert encroachment in Northern Nigeria.'
      },
      {
        week: 6,
        topic: 'Desertification and Ozone Layer Depletion',
        subTopic: 'Causes, global warming, and mitigation strategies',
        objectivesSummary: 'Students should explain the greenhouse effect and how human activities damage the ozone layer.',
        suggestedMaterials: 'Globe, diagram of atmosphere layers, UV protection chart.'
      },
      {
        week: 7,
        topic: 'Mid-Term Test & Break',
        subTopic: 'Assessment of Weeks 1-6 learning objectives',
        objectivesSummary: 'Evaluate students comprehension and practical identification skills.',
        suggestedMaterials: 'Test questions.'
      },
      {
        week: 8,
        topic: 'Energy (Kinetic and Potential Energy)',
        subTopic: 'Forms of energy and law of conservation of energy',
        objectivesSummary: 'Students should calculate potential energy (mgh) and kinetic energy (1/2 mv²) with simple examples.',
        suggestedMaterials: 'Simple pendulum, spring, coiled toy, ruler, ball.'
      },
      {
        week: 9,
        topic: 'Energy Transfer and Transformation',
        subTopic: 'Conversion of energy from one form to another (e.g. chemical to electrical)',
        objectivesSummary: 'Students should trace energy conversions in a torchlight, car engine, and hydroelectric dam (Kainji Dam).',
        suggestedMaterials: 'Dry cell battery, connecting wires, miniature bulb, solar toy.'
      },
      {
        week: 10,
        topic: 'Crude Oil and Petrochemicals',
        subTopic: 'Origin of crude oil in the Niger Delta, fractional distillation and fractions',
        objectivesSummary: 'Students should name 4 fractions of crude oil and state their uses.',
        suggestedMaterials: 'Fractional distillation chart, samples of kerosene, petrol, engine oil, candle wax.'
      },
      {
        week: 11,
        topic: 'Revision',
        subTopic: 'General review of habitat, pollution, energy, and crude oil',
        objectivesSummary: 'Prepare students for the term examinations.',
        suggestedMaterials: 'Summary flashcards, mock quizzes.'
      },
      {
        week: 12,
        topic: 'First Term Examination',
        subTopic: 'Summative Examination',
        objectivesSummary: 'Comprehensive assessment of term syllabus.',
        suggestedMaterials: 'Examination scripts.'
      }
    ]
  },

  // SSS 1 Biology - 1st Term
  {
    id: 'sss1-bio-term1',
    subject: 'Biology',
    classLevel: 'SSS 1',
    term: '1st Term',
    weeks: [
      {
        week: 1,
        topic: 'Recognizing Living Things',
        subTopic: 'Characteristics of living things (MR NIGER D), differences between plants and animals',
        objectivesSummary: 'Students should state the 8 characteristics of life and compare plant and animal structures.',
        suggestedMaterials: 'Live potted plant, grasshopper, charts showing characteristics of life.'
      },
      {
        week: 2,
        topic: 'Classification of Living Things',
        subTopic: 'Binomial nomenclature, Kingdom classification (Monera, Protista, Fungi, Plantae, Animalia)',
        objectivesSummary: 'Students should explain Linnaeus system of naming and classify common organisms into kingdoms.',
        suggestedMaterials: 'Specimens: mushroom, spirogyra, amoeba diagram, earthworm.'
      },
      {
        week: 3,
        topic: 'The Cell: Structure and Functions',
        subTopic: 'Cell theory, cell organelles (nucleus, mitochondria, chloroplasts, ribosomes)',
        objectivesSummary: 'Students should draw and label plant and animal cells and state functions of 5 organelles.',
        suggestedMaterials: 'Compound light microscope, prepared slides of onion epidermal cells and cheek cells.'
      },
      {
        week: 4,
        topic: 'Cell as a Living Unit',
        subTopic: 'Forms in which living cells exist (Single, Colonial, Filamentous, Part of multicellular organism)',
        objectivesSummary: 'Students should differentiate between Chlamydomonas, Volvox, Spirogyra, and onion epidermal tissue.',
        suggestedMaterials: 'Pond water culture, slides, microscope.'
      },
      {
        week: 5,
        topic: 'Cell and its Environment (Diffusion and Osmosis)',
        subTopic: 'Mechanisms of diffusion and osmosis, plasmolysis, turgidity, haemolysis',
        objectivesSummary: 'Students should demonstrate osmosis using yam cup and sugar solution.',
        suggestedMaterials: 'Irish or white yam, beaker, concentrated sucrose solution, Petri dish, potassium permanganate crystal.'
      },
      {
        week: 6,
        topic: 'Properties and Functions of the Cell (Cellular Respiration)',
        subTopic: 'Aerobic and anaerobic respiration, glycolysis and Krebs cycle overview',
        objectivesSummary: 'Students should write the balanced chemical equation for cellular respiration and compare aerobic vs anaerobic.',
        suggestedMaterials: 'Germinating seeds, thermos flask, lime water, thermometer.'
      },
      {
        week: 7,
        topic: 'Mid-Term Break & Assessment',
        subTopic: 'Mid-term practical and theory test',
        objectivesSummary: 'Assess students lab drawing skills and conceptual understanding.',
        suggestedMaterials: 'Question papers.'
      },
      {
        week: 8,
        topic: 'Nutrition in Living Things (Autotrophic Nutrition)',
        subTopic: 'Photosynthesis: light and dark stages, conditions necessary for photosynthesis',
        objectivesSummary: 'Students should describe the process of photosynthesis and test a green leaf for starch.',
        suggestedMaterials: 'Variegated croton leaf, boiling water, ethanol, water bath, iodine solution, white tile.'
      },
      {
        week: 9,
        topic: 'Heterotrophic Nutrition',
        subTopic: 'Holozoic, saprophytic, and parasitic nutrition',
        objectivesSummary: 'Students should explain modes of nutrition and adaptations of parasitic plants (e.g. dodder/Cassytha).',
        suggestedMaterials: 'Bread mould (Rhizopus) under hand lens, tapeworm specimen/chart.'
      },
      {
        week: 10,
        topic: 'Mineral Nutrition in Plants',
        subTopic: 'Macro-nutrients (N, P, K, Ca, Mg, S) and Micro-nutrients, deficiency symptoms',
        objectivesSummary: 'Students should identify deficiency symptoms like chlorosis and stunted growth.',
        suggestedMaterials: 'Potted maize plants grown with and without nitrogen fertilizer.'
      },
      {
        week: 11,
        topic: 'Revision',
        subTopic: 'Review of cell biology, physiology, and plant nutrition',
        objectivesSummary: 'Comprehensive review and WAEC/NECO practical format preparation.',
        suggestedMaterials: 'Past WASSCE/NECO biology past question papers.'
      },
      {
        week: 12,
        topic: 'First Term Examination',
        subTopic: 'Theory and practical examinations',
        objectivesSummary: 'End of term performance evaluation.',
        suggestedMaterials: 'Examination scripts.'
      }
    ]
  },

  // SSS 2 Economics - 1st Term
  {
    id: 'sss2-econ-term1',
    subject: 'Economics',
    classLevel: 'SSS 2',
    term: '1st Term',
    weeks: [
      {
        week: 1,
        topic: 'Tools of Economic Analysis',
        subTopic: 'Measures of Central Tendency (Mean, Median, Mode) and Dispersion for grouped data',
        objectivesSummary: 'Students should compute the mean, median, and mode for frequency distribution tables.',
        suggestedMaterials: 'Graph sheets, statistical tables, financial newspaper extracts (BusinessDay).'
      },
      {
        week: 2,
        topic: 'Concept of Elasticity of Demand',
        subTopic: 'Price elasticity of demand: types (elastic, inelastic, unitary), formula and calculation',
        objectivesSummary: 'Students should calculate coefficient of elasticity and interpret demand curves.',
        suggestedMaterials: 'Demand schedule charts, graph boards.'
      },
      {
        week: 3,
        topic: 'Income and Cross Elasticity of Demand',
        subTopic: 'Normal, inferior, and luxury goods; substitutes and complements in Nigerian markets',
        objectivesSummary: 'Students should differentiate between substitute goods (e.g., Milo and Ovaltine) and complementary goods (e.g., car and petrol).',
        suggestedMaterials: 'Real market items or logos, elasticity diagrams.'
      },
      {
        week: 4,
        topic: 'Elasticity of Supply',
        subTopic: 'Price elasticity of supply: formula, calculation, and determinants in agriculture vs manufacturing',
        objectivesSummary: 'Students should explain why agricultural produce in Nigeria often has inelastic supply in the short run.',
        suggestedMaterials: 'Supply schedule graphs, agricultural market photos.'
      },
      {
        week: 5,
        topic: 'Theory of Consumer Behavior',
        subTopic: 'Utility concept: Total utility, Marginal utility, Law of Diminishing Marginal Utility',
        objectivesSummary: 'Students should explain consumer equilibrium using the equimarginal principle.',
        suggestedMaterials: 'Bottles of water/soft drink for consumer satisfaction simulation, utility tables.'
      },
      {
        week: 6,
        topic: 'Theory of Production (Laws of Returns)',
        subTopic: 'Short-run and long-run production, Law of Diminishing Returns, Total, Average and Marginal Product',
        objectivesSummary: 'Students should construct and interpret production schedules illustrating the 3 stages of production.',
        suggestedMaterials: 'Production function curves, farm labour charts.'
      },
      {
        week: 7,
        topic: 'Mid-Term Assessment & Break',
        subTopic: 'Mid-term evaluation test',
        objectivesSummary: 'Assess students mastery of elasticity and consumer theory.',
        suggestedMaterials: 'Test questions.'
      },
      {
        week: 8,
        topic: 'Theory of Cost',
        subTopic: 'Fixed cost, variable cost, total cost, marginal cost, and average cost curves',
        objectivesSummary: 'Students should calculate TC, FC, VC, AC, and MC from given schedules and sketch cost curves.',
        suggestedMaterials: 'Cost curve illustrations, factory production scenarios.'
      },
      {
        week: 9,
        topic: 'Theory of Revenue and Market Structures',
        subTopic: 'Total Revenue, Marginal Revenue, Average Revenue; Perfect Competition characteristics',
        objectivesSummary: 'Students should define market structures and analyze short-run profit maximization in perfect competition.',
        suggestedMaterials: 'Revenue graphs, comparison chart of market structures.'
      },
      {
        week: 10,
        topic: 'Monopoly and Imperfect Markets',
        subTopic: 'Sources of monopoly power in Nigeria (e.g. PHCN/DisCos, NNPC), advantages and disadvantages',
        objectivesSummary: 'Students should evaluate public utility monopolies and discuss price discrimination.',
        suggestedMaterials: 'Newspaper articles on utility regulation (NERC, FCCPC).'
      },
      {
        week: 11,
        topic: 'Revision',
        subTopic: 'Comprehensive review of elasticity, production, cost, and revenue',
        objectivesSummary: 'Revision of calculation techniques and essay question answering for WAEC/NECO.',
        suggestedMaterials: 'Past WASSCE economics questions.'
      },
      {
        week: 12,
        topic: 'First Term Examination',
        subTopic: 'End of term examination',
        objectivesSummary: 'Assess students term performance.',
        suggestedMaterials: 'Examination scripts.'
      }
    ]
  }
];

export function getSubjectsForClass(classLevel: ClassLevel): string[] {
  const c = NIGERIAN_CLASSES.find(item => item.id === classLevel);
  if (!c) return PRIMARY_SUBJECTS;
  if (c.category === 'primary') return PRIMARY_SUBJECTS;
  if (c.category === 'jss') return JSS_SUBJECTS;
  return SSS_SUBJECTS;
}

export function getTextbooksForSubject(subject: string): string[] {
  return STANDARD_TEXTBOOKS[subject] || [
    `Approved NERDC ${subject} Textbook for Nigerian Schools`,
    `Evans / Macmillan Educational Series for ${subject}`,
    `Comprehensive ${subject} for Schools and Colleges`
  ];
}
