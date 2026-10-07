import type { LessonNote } from '../types';

export const SAMPLE_LESSON_NOTES: LessonNote[] = [
  // User's Exact Requested CRS JSS 2 Week 4 Lesson Note
  {
    id: 'sample-crs-jss2-week4',
    schoolName: 'Grace Community Junior Secondary School, Lagos',
    teacherName: 'Mrs. Abigail Adeleke',
    subject: 'Christian Religious Studies',
    classLevel: 'JSS 2',
    term: '1st Term',
    week: 4,
    date: '2026-10-12',
    duration: '40 Minutes',
    period: '2nd Period (8:45 AM - 9:25 AM)',
    averageAge: '12 - 13 years',
    topic: 'The Temptation of Jesus Christ',
    subTopic: 'Meaning of Temptation, The Three Temptations, Overcoming Temptation & Moral Lessons',
    references: 'Matthew 4:1–11; Mark 1:12–13; Luke 4:1–13',
    behavioralObjectives: [
      'Define temptation in their own words.',
      'Explain what happened when Jesus was tempted in the wilderness.',
      'Identify and explain the three temptations of Jesus.',
      'State how Jesus overcame temptation.',
      'Mention the moral lessons from the temptation of Jesus.',
      'Explain the importance of relying on God\'s Word when facing temptation.'
    ],
    previousKnowledge: 'Students are familiar with the baptism of Jesus by John the Baptist in the River Jordan and how the Holy Spirit descended on Him like a dove.',
    instructionalMaterials: [
      'The Holy Bible (Revised Standard Version / King James Version)',
      'Wall chart illustrating the three temptations of Jesus in the wilderness',
      'Flashcards displaying the scriptural responses Jesus gave to Satan',
      'Chalkboard and colored chalk for summarizing lessons'
    ],
    referenceBooks: [
      'Christian Religious Knowledge for Junior Secondary Schools, Book 2 by T.N.O. Quarcoopome',
      'Basic Christian Religious Studies for JSS 2 by P.E. Adebayo et al.',
      'NERDC Universal Basic Education Curriculum for CRS'
    ],
    contentSections: [
      {
        sectionNumber: 1,
        heading: 'Meaning of Temptation',
        body: 'Temptation is an enticement or strong desire to do something wrong, sinful, or against God\'s will. Temptation can come through our desires, other people, circumstances, or the influence of Satan.',
        lessonTakeaway: 'Being tempted is not itself a sin. Sin occurs when a person gives in to temptation and deliberately does what is wrong.'
      },
      {
        sectionNumber: 2,
        heading: 'Jesus Is Tempted in the Wilderness',
        body: 'After Jesus was baptised, the Holy Spirit led Him into the wilderness. Jesus fasted for forty days and forty nights. During this period, He became hungry. The devil came to Jesus and attempted to make Him disobey God by presenting Him with three major temptations.'
      },
      {
        sectionNumber: 3,
        heading: 'The First Temptation – Turning Stones into Bread',
        body: 'The devil said to Jesus: “If you are the Son of God, tell these stones to become bread.” Jesus was hungry after fasting for forty days. However, He refused to use His power simply to satisfy His physical hunger in a way that would involve obeying Satan. Jesus answered by quoting God\'s Word: “Man shall not live on bread alone, but on every word that comes from the mouth of God.”',
        lessonTakeaway: 'Jesus teaches us that physical needs should not make us disobey God. We should trust God and put His word above our immediate desires.'
      },
      {
        sectionNumber: 4,
        heading: 'The Second Temptation – Jumping from the Temple',
        body: 'The devil took Jesus to the holy city and placed Him on the highest point of the temple. He challenged Jesus to throw Himself down, saying that angels would protect Him because God had promised to protect His people. The devil even quoted Scripture to support his temptation. Jesus refused and replied: “Do not put the Lord your God to the test.”',
        lessonTakeaway: 'We should not deliberately put God to the test. We should also understand God\'s Word correctly instead of twisting Scripture to justify wrong actions.'
      },
      {
        sectionNumber: 5,
        heading: 'The Third Temptation – Worshipping Satan',
        body: 'The devil took Jesus to a very high mountain and showed Him the kingdoms of the world and their splendour. He promised to give everything to Jesus if Jesus would bow down and worship him. Jesus rejected the offer immediately. He said: “Worship the Lord your God, and serve him only.” The devil then left Jesus, and angels came and attended to Him.',
        lessonTakeaway: 'Nothing in this world is worth sacrificing our relationship with God. We must worship God alone and refuse anything that requires us to compromise our faith.'
      },
      {
        sectionNumber: 6,
        heading: 'How Jesus Overcame Temptation',
        body: 'Jesus did not argue with Satan or give in to his demands. He responded with the authority of God\'s Word.',
        subPoints: [
          'Knowing God\'s Word.',
          'Using Scripture correctly.',
          'Trusting God.',
          'Refusing to compromise.',
          'Putting God\'s will above His personal desires.',
          'Remaining obedient to God.'
        ]
      },
      {
        sectionNumber: 7,
        heading: 'Moral Lessons from the Temptation of Jesus',
        body: 'The temptation of Jesus provides essential life guidance for every student:',
        subPoints: [
          'Everyone can face temptation.',
          'Temptation itself is not a sin; giving in to it is wrong.',
          'We should study and know God\'s Word.',
          'God\'s Word can help us overcome temptation.',
          'We should not allow hunger, wealth or ambition to make us disobey God.',
          'We should not test God deliberately.',
          'We should worship God alone.',
          'We must learn to control our desires.',
          'We should trust God during difficult situations.',
          'We should remain faithful even when we are under pressure.'
        ]
      }
    ],
    classroomActivities: [
      {
        title: 'Activity 1 – Group Discussion',
        description: 'Divide the students into three groups to analyze the three temptations.',
        items: [
          'Group 1: Discuss the first temptation (Turning stones into bread). Explain what Satan asked, Jesus\' response, and the lesson.',
          'Group 2: Discuss the second temptation (Jumping from the temple). Explain what Satan asked, Jesus\' response, and the lesson.',
          'Group 3: Discuss the third temptation (Worshipping Satan). Explain what Satan asked, Jesus\' response, and the lesson.'
        ]
      },
      {
        title: 'Activity 2 – Bible Reading',
        description: 'Students open their Bibles to Matthew 4:1–11. Have volunteer students read verses 1 to 11 aloud in turns, while the rest of the class identifies each specific temptation and Jesus\' scriptural reply.'
      },
      {
        title: 'Activity 3 – Class Discussion: Contemporary Nigerian Youth Temptations',
        description: 'Teacher asks students: "What are some temptations that young people face today in school and at home?"',
        items: [
          'Cheating in examinations / Expo.',
          'Stealing from classmates or parents.',
          'Lying to avoid punishment.',
          'Peer pressure to join secret cults or bad company.',
          'Disobedience to parents and school teachers.',
          'Bullying junior students.',
          'Internet misuse and social media addiction.',
          'Substance abuse and smoking.',
          'Desire for quick money ("Yahoo Yahoo" / illegal wealth).',
          'Discuss how God\'s Word, prayer, and self-control can help them overcome these temptations.'
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Introduction & Hook',
        durationMinutes: 5,
        teacherActivity: 'Teacher welcomes students and asks: "Have you ever been urged by a friend to copy homework or sneak out of class? How did you feel?" Connects this to the concept of temptation.',
        studentActivity: 'Students recount relatable personal experiences of being enticed to do wrong and define temptation in their own simple words.'
      },
      {
        stepNumber: 2,
        title: 'Step 1: Meaning of Temptation & The Setting in the Wilderness',
        durationMinutes: 10,
        teacherActivity: 'Teacher explains the definition of temptation, clarifies that being tempted is not sin until one gives in, and narrates Jesus fasting for 40 days and nights in the desert.',
        studentActivity: 'Students write down Section 1 & 2 notes into their exercise books and listen attentively.'
      },
      {
        stepNumber: 3,
        title: 'Step 2: Analysis of the Three Temptations',
        durationMinutes: 15,
        teacherActivity: 'Teacher presents the 3 temptations systematically: Stones to bread, Temple pinnacle jump, and Mountain peak kingdoms. Highlights the exact scriptural quote Jesus used for each.',
        studentActivity: 'Students follow along in Matthew 4:1-11, read Jesus\' answers chorally, and take notes on the moral takeaway of each temptation.'
      },
      {
        stepNumber: 4,
        title: 'Step 3: Activities & Application to Daily Life',
        durationMinutes: 10,
        teacherActivity: 'Teacher facilitates Classroom Activities 1 and 3, asking students to link the temptations to modern issues like exam malpractice, theft, and peer pressure.',
        studentActivity: 'Students participate in group discussions, brainstorm realistic temptations in Nigerian secondary schools, and explain how to resist them.'
      }
    ],
    evaluation: [
      'What is temptation?',
      'Where was Jesus when He was tempted?',
      'How long did Jesus fast?',
      'Who tempted Jesus?',
      'Mention the three temptations of Jesus.',
      'What did Jesus say when Satan asked Him to turn stones into bread?',
      'What did Satan ask Jesus to do at the temple?',
      'Why did Jesus refuse to jump from the temple?',
      'What did Satan promise Jesus if He worshipped him?',
      'Mention five ways Jesus overcame temptation.',
      'State five moral lessons from the temptation of Jesus.'
    ],
    summary: 'Teacher summarizes: Temptation is an enticement to do evil, but it is not a sin unless we yield to it. Jesus overcame Satan\'s three temptations by relying strictly on the authority of God\'s Word and refusing to compromise His holy calling.',
    assignment: 'Read Matthew 4:1–11 and answer the following in your homework exercise books:\n1. Describe the three temptations Jesus faced in the wilderness.\n2. Write the response Jesus gave to each temptation.\n3. Mention five ways a Christian student can overcome temptation today.',
    keyScriptureOrCoreRule: 'Matthew 4:10: “Worship the Lord your God, and serve him only.”',
    teacherRemarks: 'Students were deeply engaged. The discussion on contemporary temptations like exam malpractice and peer pressure was lively and practical.',
    hodRemarks: 'Exemplary lesson note with comprehensive content, biblical references, and high moral value. Approved.',
    createdAt: '2026-10-06T15:00:00Z',
    updatedAt: '2026-10-06T15:00:00Z'
  },

  // Primary 4 Mathematics Sample Note
  {
    id: 'sample-math-pri4',
    schoolName: 'Grace Model Community Primary School, Ikeja',
    teacherName: 'Mrs. Folake Adeyemi',
    subject: 'Mathematics',
    classLevel: 'Primary 4',
    term: '1st Term',
    week: 8,
    date: '2026-10-12',
    duration: '40 Minutes',
    period: '2nd Period (8:45 AM - 9:25 AM)',
    averageAge: '8 - 9 years',
    topic: 'Multiplication of Whole Numbers',
    subTopic: 'Multiplication of 2-digit numbers by 2-digit numbers (Vertical Algorithm)',
    references: 'NERDC Primary 4 Mathematics Curriculum, Theme: Number and Numeration',
    behavioralObjectives: [
      'State the place value of digits in 2-digit numbers accurately.',
      'Multiply a 2-digit number by a 1-digit number with regrouping.',
      'Compute the product of two 2-digit numbers (e.g., 24 × 13) using the vertical columnar method without error.',
      'Solve simple word problems involving multiplication in everyday Nigerian market transactions (e.g., buying exercise books in dozens).'
    ],
    previousKnowledge: 'Pupils are already familiar with times tables 1 to 10 and can comfortably multiply a 2-digit number by a 1-digit number (e.g., 34 × 2).',
    instructionalMaterials: [
      'Multiplication grid chart hung on the chalkboard',
      'Flashcards with 2-digit multiplication equations',
      'Bundles of counting sticks (representing tens and units)',
      'Plastic bottle tops and simulated Nigerian currency notes (₦50, ₦100, ₦200)'
    ],
    referenceBooks: [
      'New General Mathematics for Primary Schools, Book 4 by M.F. Macrae et al. (Pearson/Longman), pages 58–62',
      'Excellence in Mathematics for Basic 4, Learn Africa Plc',
      'NERDC National Basic Education Curriculum for Primary Mathematics'
    ],
    contentSections: [
      {
        sectionNumber: 1,
        heading: 'Meaning and Concept of Multiplication',
        body: 'Multiplication is repeated addition of equal groups. When we say 24 × 13, it means adding 24 thirteen times. Instead of doing lengthy repeated additions, we use the vertical columnar multiplication algorithm.',
        lessonTakeaway: 'The vertical algorithm breaks multiplication down into simple units and tens multiplications.'
      },
      {
        sectionNumber: 2,
        heading: 'Understanding Place Value in 2-Digit Multiplication',
        body: 'In any two-digit multiplier such as 13, the number is composed of 1 Ten (10) and 3 Units (3). To multiply 24 by 13: Step 1: Multiply 24 by 3 Units = 72. Step 2: Multiply 24 by 1 Ten (10) = 240. Step 3: Add the two partial products: 72 + 240 = 312.',
        lessonTakeaway: 'Always place a zero placeholder in the units column when multiplying by the tens digit!'
      },
      {
        sectionNumber: 3,
        heading: 'Step-by-Step Columnar Algorithm Worked Examples',
        body: 'Example 1: Multiply 35 by 12.\n   T  U\n   3  5\n×  1  2\n-------\n   7  0  (35 × 2)\n+ 35  0  (35 × 10)\n-------\n  42  0  (Total Product)',
        subPoints: [
          'Align numbers strictly under Tens (T) and Units (U).',
          'Multiply top number by bottom units digit.',
          'Write a 0 in the units place before multiplying by the bottom tens digit.',
          'Add both lines carefully with carrying where necessary.'
        ]
      },
      {
        sectionNumber: 4,
        heading: 'Real-Life Nigerian Market Word Problems',
        body: 'Multiplication is essential in daily commerce. If Mama Ngozi in Tejuosho Market sells 15 loaves of bread every morning at ₦300 each, or packs 12 crates of eggs with 30 eggs per crate, multiplication provides the rapid calculation required.',
        lessonTakeaway: 'Knowing multiplication prevents being short-changed in the market and builds commercial confidence.'
      }
    ],
    classroomActivities: [
      {
        title: 'Activity 1 – Speed Mental Math Drill',
        description: 'Pupils recite 6, 7, 8, and 9 times tables in rhythm. Teacher flashes rapid-fire mental cards (8 × 7, 9 × 4).'
      },
      {
        title: 'Activity 2 – Pair Blackboard Challenge',
        description: 'Pupils pair up. One pupil computes the units partial product, while the partner computes the tens partial product, and both sum up.'
      },
      {
        title: 'Activity 3 – Market Day Simulation',
        description: 'Pupils use bottle caps and pretend currency to role-play buying items in dozens from a market stall.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Introduction & Warm-up (Hook)',
        durationMinutes: 5,
        teacherActivity: 'Teacher writes mental math questions on the board and asks: "If Chidi buys 3 exercise books at ₦25 each, how much does he pay?"',
        studentActivity: 'Pupils chant times tables and answer ₦75.'
      },
      {
        stepNumber: 2,
        title: 'Step 1: Explaining the Columnar Layout',
        durationMinutes: 10,
        teacherActivity: 'Teacher writes 24 × 13 vertically on chalkboard and shows how 13 is broken into 10 + 3.',
        studentActivity: 'Pupils copy layout into notebooks.'
      },
      {
        stepNumber: 3,
        title: 'Step 2: Guided Demonstration',
        durationMinutes: 12,
        teacherActivity: 'Teacher guides Amina and Babatunde to solve 35 × 12 on the board.',
        studentActivity: 'Class solves along in exercise books.'
      },
      {
        stepNumber: 4,
        title: 'Step 3: Pair Activity',
        durationMinutes: 8,
        teacherActivity: 'Teacher moves around checking place value alignment.',
        studentActivity: 'Pupils work in pairs on flashcards.'
      }
    ],
    evaluation: [
      'What is the first step when multiplying a 2-digit number vertically?',
      'Why must a zero (0) be placed in the units place when multiplying by the tens digit?',
      'Calculate: 24 × 15 in your evaluation books.',
      'Calculate: 32 × 14 in your evaluation books.',
      'A trader in Oshodi market sells 15 crates of eggs every day. How many crates will she sell in 12 days?'
    ],
    summary: 'Always align digits under Tens and Units. Multiply by the units digit first, remember the zero placeholder when multiplying by the tens digit, and add both partial products accurately.',
    assignment: 'From New General Mathematics Book 4, Page 61, Exercise 8B: Solve questions 1 to 6. Word Problem: A school bus has 24 seats. How many pupils can 16 buses carry altogether?',
    keyScriptureOrCoreRule: 'Core Rule: "Always place a 0 in the units column before multiplying by the tens digit."',
    teacherRemarks: 'Pupils were active and 85% correctly placed the zero placeholder.',
    hodRemarks: 'Neat and clear lesson delivery. Approved.',
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-06T10:00:00Z'
  },

  // SSS 1 Biology Sample Note
  {
    id: 'sample-bio-sss1',
    schoolName: 'Federal Government Girls College, Owerri',
    teacherName: 'Dr. (Mrs.) Ngozi Okpara',
    subject: 'Biology',
    classLevel: 'SSS 1',
    term: '1st Term',
    week: 3,
    date: '2026-10-15',
    duration: '40 Minutes',
    period: '1st Period (8:00 AM - 8:40 AM)',
    averageAge: '14 - 15 years',
    topic: 'The Cell: Structure and Functions',
    subTopic: 'Cell Theory and Functions of Organelles in Plant vs Animal Cells',
    references: 'WASSCE & NECO Biology Syllabus; Theme: Organization of Life',
    behavioralObjectives: [
      'State the three tenets of the Classical Cell Theory.',
      'Draw and label a generalized plant cell and animal cell.',
      'Explain the specific functions of the Mitochondrion, Chloroplast, Nucleus, and Ribosome.',
      'Tabulate at least 5 distinct differences between plant and animal cells.'
    ],
    previousKnowledge: 'Students studied characteristics of living things in Week 1 and understand that all living things are made up of basic building blocks.',
    instructionalMaterials: [
      'Compound light microscope with prepared slides of onion epidermal cells',
      '3D plastic cell models representing plant and animal cells',
      'Colored wall chart showing ultrastructure of eukaryotic cells'
    ],
    referenceBooks: [
      'Essential Biology for Senior Secondary Schools by M.C. Michael, pages 24–32',
      'Modern Biology for Senior Secondary Schools by S.T. Ramalingam',
      'STAN Biology for Senior Secondary Schools, Book 1'
    ],
    contentSections: [
      {
        sectionNumber: 1,
        heading: 'Historical Context and The Cell Theory',
        body: 'The cell was first discovered by Robert Hooke in 1665 when examining cork tissue under a primitive microscope. Between 1838 and 1855, Matthias Schleiden, Theodor Schwann, and Rudolf Virchow formulated the Cell Theory.',
        subPoints: [
          'All living organisms are composed of one or more cells.',
          'The cell is the basic structural and functional unit of life.',
          'All cells arise from pre-existing cells (Omnis cellula e cellula).'
        ]
      },
      {
        sectionNumber: 2,
        heading: 'Structure and Functions of Major Cell Organelles',
        body: 'Each organelle inside a eukaryotic cell performs specialized life processes:',
        subPoints: [
          'Nucleus: The control center containing genetic material (DNA).',
          'Mitochondria: The powerhouse of the cell; site of cellular respiration and ATP generation.',
          'Chloroplast: Contains chlorophyll for photosynthesis in plant cells.',
          'Ribosomes: Granular structures responsible for protein synthesis.',
          'Endoplasmic Reticulum (ER): Network for transport of synthesized materials (Rough ER has ribosomes; Smooth ER produces lipids).',
          'Cell Membrane: Selectively permeable boundary regulating entry and exit of substances.'
        ]
      },
      {
        sectionNumber: 3,
        heading: 'Comparative Analysis: Plant Cell vs Animal Cell',
        body: 'Plant and animal cells differ in several fundamental structural respects:',
        subPoints: [
          'Cell Wall: Present in plant cells (cellulose); completely absent in animal cells.',
          'Chloroplast: Present in green plant cells; absent in animal cells.',
          'Vacuole: Large, central and permanent in plant cells; small, temporary in animal cells.',
          'Centrioles: Absent in higher plant cells; present in animal cells for cell division.',
          'Shape: Definite/rigid shape in plant cells; flexible/irregular shape in animal cells.'
        ]
      }
    ],
    classroomActivities: [
      {
        title: 'Activity 1 – Practical Microscope Observation',
        description: 'Students view onion epidermal strips stained with iodine under 100x magnification to identify cell walls and nuclei.'
      },
      {
        title: 'Activity 2 – 3D Model Identification Relay',
        description: 'Students take turns pointing to organelles on the plastic cell model and describing their cellular function.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Introduction & Historical Context',
        durationMinutes: 6,
        teacherActivity: 'Teacher holds up a brick to introduce cells as building blocks of life.',
        studentActivity: 'Students take notes on Robert Hooke and cell theory.'
      },
      {
        stepNumber: 2,
        title: 'Step 1: Cell Ultrastructure & Organelle Functions',
        durationMinutes: 14,
        teacherActivity: 'Teacher demonstrates organelles using 3D models and chalkboard diagrams.',
        studentActivity: 'Students sketch organelles into notebooks.'
      },
      {
        stepNumber: 3,
        title: 'Step 2: Plant vs Animal Cell Comparison',
        durationMinutes: 12,
        teacherActivity: 'Teacher tabulates differences on the chalkboard.',
        studentActivity: 'Students copy comparative table.'
      },
      {
        stepNumber: 4,
        title: 'Step 3: Rapid Fire Quiz',
        durationMinutes: 4,
        teacherActivity: 'Teacher flashes organelle flashcards for quick student responses.',
        studentActivity: 'Students answer with organelle functions.'
      }
    ],
    evaluation: [
      'State the three tenets of the Classical Cell Theory.',
      'Why is the mitochondrion referred to as the powerhouse of the cell?',
      'Mention three structures found in a typical plant cell that are absent in an animal cell.',
      'What is the function of the ribosome and cell membrane?',
      'Differentiate between rough and smooth endoplasmic reticulum.'
    ],
    summary: 'The cell is the basic unit of life. While both plant and animal cells share organelles like the nucleus and mitochondria, plant cells possess cellulose cell walls, chloroplasts, and large central vacuoles.',
    assignment: 'Draw a neatly labeled diagram (10-12 cm long) of a generalized plant cell in your biology drawing book. Tabulate 5 differences between plant and animal cells.',
    keyScriptureOrCoreRule: 'Core Biological Rule: "Omnis cellula e cellula — All living cells arise only from pre-existing cells."',
    teacherRemarks: 'Practical microscope work reinforced classroom theory effectively.',
    hodRemarks: 'Aligned with WAEC/NECO syllabus. Approved.',
    createdAt: '2026-10-06T11:00:00Z',
    updatedAt: '2026-10-06T11:00:00Z'
  }
];
