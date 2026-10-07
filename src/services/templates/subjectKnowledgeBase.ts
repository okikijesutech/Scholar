import type { ContentSection, ClassroomActivity } from '../../types';
import { categorizeSubject } from './subjectCategories';

export function generateSubjectSpecificContentSections(subject: string, topic: string, subTopic: string): ContentSection[] {
  const category = categorizeSubject(subject);
  const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();

  // 1. TOPIC-AWARE: Fractions in Mathematics
  if (category === 'mathematics' && (combined.includes('fraction') || combined.includes('proper') || combined.includes('denominator'))) {
    return [
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
    ];
  }

  // 2. TOPIC-AWARE: Habitats & Adaptation in Science / Basic Science
  if (category === 'science' && (combined.includes('habitat') || combined.includes('adaptation') || combined.includes('aquatic') || combined.includes('desert'))) {
    return [
      {
        sectionNumber: 1,
        heading: `Meaning of Habitat and Adaptation`,
        body: `A HABITAT is the natural dwelling place or environment in which an organism lives, feeds, and reproduces. An ADAPTATION is any special structural, physiological, or behavioural feature that enables a living organism to survive and thrive successfully in its specific habitat. Without adaptation, living things cannot survive environmental pressures such as temperature, predators, and scarcity of food or water.`,
        lessonTakeaway: `Adaptation is nature's mechanism for survival in specific environments.`
      },
      {
        sectionNumber: 2,
        heading: `Aquatic Habitats and Structural Adaptations of Organisms`,
        body: `An aquatic habitat is a water environment, categorized into Marine (saltwater: oceans, seas), Freshwater (rivers, lakes, ponds), and Estuarine (brackish water). Living organisms in water exhibit remarkable adaptations:`,
        subPoints: [
          `Fishes (e.g., Tilapia, Catfish): Have streamlined body shapes to reduce water resistance; fins for balance and steering; gills for breathing dissolved oxygen in water; and swim bladders for buoyancy.`,
          `Water Plants (e.g., Water Hyacinth, Water Lily): Have broad, floating leaves with stomata on the upper surface for gaseous exchange, and large spongy air cavities (aerenchyma) in stems to aid floating.`,
          `Ducks and Water Birds: Possess webbed feet for paddling and oily, waterproof feathers.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Desert (Arid) Habitats and Survival Adaptations`,
        body: `A desert is a dry, arid terrestrial habitat characterized by extreme heat during the day, cold nights, very low rainfall, and sandy terrain. Desert organisms have specialized mechanisms to conserve water:`,
        subPoints: [
          `Camel ("Ship of the Desert"): Stores fat in its hump (which breaks down into metabolic water); has long eyelashes and nostrils that seal tightly against blowing sand; and broad padded feet that prevent sinking into loose sand.`,
          `Desert Plants (e.g., Cactus, Aloe): Have thick, fleshy succulent stems that store large volumes of water; reduced needle-like leaves (spines) to minimize transpiration; and deep taproots to tap subterranean moisture.`,
          `Desert Rodents and Lizards: Are largely nocturnal (active only at night) and excrete concentrated dry uric acid to conserve body fluids.`
        ]
      },
      {
        sectionNumber: 4,
        heading: `Comparison Between Aquatic and Desert Adaptations`,
        body: `While aquatic organisms are adapted to maximize oxygen uptake and streamline movement through dense water, desert organisms are primarily adapted for water conservation and thermoregulation against extreme solar radiation.`,
        lessonTakeaway: `Structure strictly matches function: an organism displaced from its natural habitat faces extinction without appropriate adaptations.`
      },
      {
        sectionNumber: 5,
        heading: `Environmental Conservation and Threats to Habitats in Nigeria`,
        body: `In Nigeria, human activities severely threaten natural habitats: oil spillage in the Niger Delta destroys aquatic life, while deforestation and climate change accelerate desertification in Northern Nigeria (e.g., Sokoto, Borno, Katsina). Students must advocate for tree planting and pollution control.`,
        lessonTakeaway: `Protecting natural habitats is our collective duty to safeguard biodiversity for future generations.`
      }
    ];
  }

  // 3. TOPIC-AWARE: Adjectives in English Studies / Language
  if (category === 'language' && combined.includes('adjective')) {
    return [
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
    ];
  }

  // 4. TOPIC-AWARE: Temptation of Jesus in CRS / Religious Studies
  if (category === 'religious' && combined.includes('temptation')) {
    return [
      {
        sectionNumber: 1,
        heading: `Meaning and Concept of Temptation`,
        body: `Temptation is an enticement, attraction, or strong inducement to do something wrong, immoral, or contrary to the will of God. It can arise through personal fleshly desires, peer influence, difficult circumstances, or the devil. Being tempted is not in itself a sin; sin occurs only when a person consents, yields, and deliberately commits the wrong act.`,
        lessonTakeaway: `Temptation is a universal human trial; yielding to it is what constitutes sin.`
      },
      {
        sectionNumber: 2,
        heading: `Jesus is Tempted in the Wilderness (Matthew 4:1–11)`,
        body: `Immediately following His baptism by John in River Jordan, Jesus was led by the Holy Spirit into the Judean wilderness to be tempted by the devil. Jesus fasted for forty days and forty nights, during which He experienced intense physical hunger. At His moment of physical weakness, Satan approached Him with three specific temptations.`,
        lessonTakeaway: `Spiritual victory requires preparation through prayer, fasting, and grounding in God's Word.`
      },
      {
        sectionNumber: 3,
        heading: `The Three Temptations of Jesus and His Scriptural Responses`,
        body: `Satan tested Jesus on physical needs, spiritual presumption, and worldly ambition:`,
        subPoints: [
          `1. Turning Stones into Bread: Satan said: "If you are the Son of God, command these stones to become bread." Jesus replied with Scripture: "Man shall not live on bread alone, but on every word that comes from the mouth of God" (Deut. 8:3). Lesson: Spiritual obedience takes precedence over immediate physical appetites.`,
          `2. Jumping from the Temple Pinnacle: Satan took Jesus to the highest point of the temple in Jerusalem and urged Him to throw Himself down, quoting Scripture out of context. Jesus replied: "Do not put the Lord your God to the test" (Deut. 6:16). Lesson: We must never tempt God recklessly or twist scriptures to justify risky behaviour.`,
          `3. Worshipping Satan for Worldly Glory: Satan showed Jesus all the kingdoms of the world and offered them if Jesus would bow down and worship him. Jesus rejected him emphatically: "Away from me, Satan! For it is written: Worship the Lord your God, and serve him only" (Deut. 6:13). Lesson: No worldly wealth or status is worth compromising our relationship with God.`
        ]
      },
      {
        sectionNumber: 4,
        heading: `How Jesus Overcame Temptation and Why It Matters`,
        body: `Jesus conquered temptation not by debating Satan, but by standing firmly on the authority of the written Word of God ("It is written"). He exercised self-control, trusted God's timing, and maintained unswerving loyalty to His divine mission.`,
        lessonTakeaway: `Memorizing and applying God's Word is the ultimate defense against temptation.`
      },
      {
        sectionNumber: 5,
        heading: `Moral and Practical Lessons for Nigerian Students Today`,
        body: `Young Nigerians face daily temptations: examination malpractice, internet scam (Yahoo-Yahoo), stealing, cultism, drug abuse, and peer pressure to acquire instant riches. Following the example of Jesus Christ, students must choose integrity, contentment, and hard work over illicit shortcuts.`,
        lessonTakeaway: `Contentment, integrity, and faith in God build a future that outlasts temporary worldly allurements.`
      }
    ];
  }

  // DEFAULT / GENERAL SUBJECT CATEGORY IMPLEMENTATIONS
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
          `Rule 1: Always maintain proper operational order and clarity of steps.`,
          `Rule 2: Align like terms and place values strictly in their proper columns.`,
          `Rule 3: Ensure mathematical signs are treated with care.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Step-by-Step Worked Demonstration on the Chalkboard`,
        body: `Example 1: Step-by-step resolution of a standard problem involving ${subTopic}:\nStep 1: Write down the given expression.\nStep 2: Group like terms or isolate variables.\nStep 3: Perform calculations systematically.\nStep 4: Check the final solution by substituting back into the original problem.`,
        lessonTakeaway: `Checking your answer is the best way to guarantee 100% accuracy in mathematics.`
      },
      {
        sectionNumber: 4,
        heading: `Common Computational Errors and How to Avoid Them`,
        body: `Examiners in WAEC, NECO, and BECE report frequent pitfalls that cost students marks in ${topic}:`,
        subPoints: [
          `Pitfall 1: Rushing through calculations without writing out intermediate steps.`,
          `Pitfall 2: Misplacing place-value zero placeholders.`,
          `Pitfall 3: Not simplifying fractions or final numerical answers to their lowest terms.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Everyday Nigerian Commercial and Practical Word Problems`,
        body: `Mathematics is lived daily in Nigerian trade, engineering, and personal budgeting. Calculating prices, measuring materials, or estimating travel times all rely on ${subTopic}.`,
        lessonTakeaway: `A sound mathematician makes wise financial and practical decisions in everyday life.`
      }
    ];
  }

  if (category === 'science') {
    return [
      {
        sectionNumber: 1,
        heading: `Scientific Definition and Concept of ${subTopic}`,
        body: `In the study of ${subject}, ${subTopic} deals with the observable natural processes and principles governing ${topic}. Scientists investigate how living matter, materials, or physical forces interact under specific environmental conditions.`,
        lessonTakeaway: `Science relies on empirical evidence, accurate observation, and reproducible experiments.`
      },
      {
        sectionNumber: 2,
        heading: `Underlying Scientific Principles and Characteristics`,
        body: `The natural mechanisms controlling ${topic} follow established scientific laws:`,
        subPoints: [
          `Core Principle 1: Cause-and-effect relationship in natural phenomena.`,
          `Core Principle 2: Relationship between structure, composition, and function.`,
          `Core Principle 3: Interdependence between organisms and their physical environment.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Scientific Investigation and Experimental Procedures`,
        body: `To demonstrate ${subTopic} practically, teachers and students utilize standard science inquiry:\n• Materials: Clear specimens, models, charts, and locally available teaching aids.\n• Method: Observe characteristics, record accurate data, and draw deduced conclusions.`,
        lessonTakeaway: `Safety and careful observation are fundamental to successful scientific discovery.`
      },
      {
        sectionNumber: 4,
        heading: `Real-Life Environmental and Practical Applications in Nigeria`,
        body: `The principles of ${topic} are directly visible across Nigeria:`,
        subPoints: [
          `Public Health: Promoting sanitation, hygiene, and disease prevention in communities.`,
          `Agriculture & Environment: Sustainable farming, soil management, and resource conservation.`,
          `Technology & Daily Life: Practical problem solving and technical innovation.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Environmental Stewardship and Scientific Ethics`,
        body: `Scientific knowledge must be coupled with responsibility. Reckless pollution and environmental destruction harm our communities. Students must act as ambassadors for environmental conservation.`,
        lessonTakeaway: `True science seeks to preserve life and build sustainable communities.`
      }
    ];
  }

  if (category === 'language') {
    return [
      {
        sectionNumber: 1,
        heading: `Grammatical Definition and Rules of ${subTopic}`,
        body: `${subTopic} is a crucial structural component of language communication. It governs how words and ideas are combined to express clear, coherent thoughts in both spoken and written discourse.`,
        lessonTakeaway: `Correct language mechanics ensures thoughts are communicated without ambiguity.`
      },
      {
        sectionNumber: 2,
        heading: `Rules of Usage and Sentence Structures`,
        body: `Mastery of ${subTopic} requires adhering to standard rules:`,
        subPoints: [
          `Rule 1: Proper sentence structure and grammatical concord must be strictly maintained.`,
          `Rule 2: Proper punctuation marks dictate rhythm, pause, and meaning.`,
          `Rule 3: Consistency in tense and vocabulary choice throughout paragraphs.`
        ]
      },
      {
        sectionNumber: 3,
        heading: `Illustrative Worked Sentences and Examples`,
        body: `The teacher illustrates correct usage with contrasting examples:\n• Correct: Clear, concise sentences demonstrating ${subTopic}.\n• Incorrect: Common errors that distort intended meaning.`,
        lessonTakeaway: `Reading wide and practicing active writing builds effortless linguistic competence.`
      },
      {
        sectionNumber: 4,
        heading: `Common Errors and How to Overcome Them`,
        body: `In everyday communication, mother-tongue interference often leads to typical speech and writing errors:`,
        subPoints: [
          `Tautology: Unnecessary repetition of words with identical meaning.`,
          `Direct literal translation from indigenous mother tongues into English.`,
          `Misuse of prepositions and agreement errors.`
        ]
      },
      {
        sectionNumber: 5,
        heading: `Practical Application in Essay Writing and Oral Communication`,
        body: `Examiners reward candidates who demonstrate rich vocabulary and flawless grammatical mechanics in essays, formal letters, and comprehension passages.`,
        lessonTakeaway: `Eloquent speech and polished writing open doors to academic and professional excellence.`
      }
    ];
  }

  // Fallback for general Humanities, Vocational, and Social Sciences
  return [
    {
      sectionNumber: 1,
      heading: `Meaning and Foundations of ${subTopic}`,
      body: `In the study of ${subject}, ${subTopic} forms an integral topic that equips learners with essential knowledge and practical skills relating to ${topic}.`,
      lessonTakeaway: `Clear understanding of foundational definitions is essential for academic excellence.`
    },
    {
      sectionNumber: 2,
      heading: `Key Principles, Classifications, and Components`,
      body: `Understanding ${topic} requires exploring its fundamental components and characteristics:`,
      subPoints: [
        `Primary characteristics and functions of ${subTopic}.`,
        `Classifications and structural relationships within ${subject}.`,
        `Regulatory guidelines and ethical standards.`
      ]
    },
    {
      sectionNumber: 3,
      heading: `Step-by-Step Practical Demonstration and Case Study`,
      body: `The teacher guides the class through realistic scenarios illustrating how ${subTopic} works in practice, highlighting actionable methods and solutions.`,
      lessonTakeaway: `Theory becomes powerful when translated into practical action.`
    },
    {
      sectionNumber: 4,
      heading: `Contemporary Challenges and Realistic Solutions in Nigeria`,
      body: `In Nigeria today, practicing ${topic} encounters diverse socio-economic factors. Students analyze challenges and suggest sustainable solutions.`,
      lessonTakeaway: `Constructive problem-solving builds stronger institutions and communities.`
    },
    {
      sectionNumber: 5,
      heading: `Character Building and Life Lessons for Nigerian Students`,
      body: `The study of ${topic} reinforces personal discipline, honesty, and diligence for future leadership.`,
      lessonTakeaway: `Integrity and diligent study are the sure foundations for lasting success.`
    }
  ];
}

export function generateSubjectSpecificClassroomActivities(subject: string, topic: string, subTopic: string): ClassroomActivity[] {
  const category = categorizeSubject(subject);
  const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();

  // Fractions activities
  if (category === 'mathematics' && (combined.includes('fraction') || combined.includes('proper') || combined.includes('denominator'))) {
    return [
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
    ];
  }

  // Habitat / Adaptation activities
  if (category === 'science' && (combined.includes('habitat') || combined.includes('adaptation') || combined.includes('aquatic') || combined.includes('desert'))) {
    return [
      {
        title: 'Activity 1 – Specimen Identification and Diagram Sketching',
        description: `Pupils inspect diagrams of a Tilapia fish and a Cactus plant, sketching and labeling features that enable each to survive in water and the desert.`
      },
      {
        title: 'Activity 2 – Habitat Matching Card Game',
        description: `Small groups receive flashcards with organisms (camel, water lily, mudskipper, aloe vera, duck) and match each to its correct habitat along with its primary adaptive feature.`
      },
      {
        title: 'Activity 3 – Environmental Conservation Action Plan',
        description: `Class brainstorms two practical actions to prevent the destruction of water bodies and combat desert encroachment in Nigeria.`
      }
    ];
  }

  // Adjectives activities
  if (category === 'language' && combined.includes('adjective')) {
    return [
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
    ];
  }

  // Default category activities
  if (category === 'mathematics') {
    return [
      {
        title: 'Activity 1 – Mental Math & Flashcard Speed Drill',
        description: `Teacher flashes calculation cards on ${subTopic}. Pupils solve in under 15 seconds, reinforcing quick recall of operational rules.`
      },
      {
        title: 'Activity 2 – Pair Problem-Solving at the Chalkboard',
        description: `Students work in pairs at the chalkboard. Student A states the rule and steps; Student B computes the final solution and verifies it.`
      },
      {
        title: 'Activity 3 – Real-Life Nigerian Market Day Simulation',
        description: `Class simulates buying and selling goods in a local Nigerian market stall to solve realistic word problems.`
      }
    ];
  }

  if (category === 'science') {
    return [
      {
        title: 'Activity 1 – Specimen Observation & Chart Inspection',
        description: `Students inspect physical specimens or charts related to ${subTopic}, sketching and labeling key parts neatly in their science notebooks.`
      },
      {
        title: 'Activity 2 – Controlled Demonstration / Mini Science Inquiry',
        description: `Teacher guides students through a hands-on demonstration of ${topic}, recording observations and deducing scientific conclusions.`
      },
      {
        title: 'Activity 3 – Environmental Action Discussion',
        description: `Students brainstorm practical steps they can take to solve health or environmental challenges in their school and home communities.`
      }
    ];
  }

  if (category === 'language') {
    return [
      {
        title: 'Activity 1 – Sentence Construction & Grammar Relay',
        description: `Groups of students take turns building grammatically sound sentences on the chalkboard using ${subTopic}.`
      },
      {
        title: 'Activity 2 – Guided Reading & Oral Pronunciation Drill',
        description: `Students read aloud selected passages from their reader, practicing correct stress, intonation, and articulation.`
      },
      {
        title: 'Activity 3 – Mini Debate & Confident Expression',
        description: `A short 5-minute class debate requiring students to articulate persuasive arguments with rich vocabulary and correct grammar.`
      }
    ];
  }

  return [
    {
      title: 'Activity 1 – Small Group Analysis & Presentation',
      description: `Divide the class into three study groups to explore different aspects of ${subTopic}:`,
      items: [
        `Group 1: Analyze the definitions and core characteristics of ${subTopic}.`,
        `Group 2: Identify practical challenges students encounter when studying ${topic}.`,
        `Group 3: Propose realistic solutions and moral takeaways for everyday life.`
      ]
    },
    {
      title: 'Activity 2 – Guided Reading & Practical Demonstration',
      description: `Students open their textbooks to the chapter on ${topic}. Selected pupils take turns reading aloud key passages while the teacher clarifies technical vocabulary.`
    },
    {
      title: 'Activity 3 – Interactive Class Discussion',
      description: `Teacher engages the entire class in a reflective dialogue on relating the lesson to challenges young Nigerians face.`
    }
  ];
}

export function generateSubjectSpecificEvaluation(subject: string, topic: string, subTopic: string): string[] {
  const category = categorizeSubject(subject);
  const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();

  if (category === 'mathematics' && (combined.includes('fraction') || combined.includes('proper') || combined.includes('denominator'))) {
    return [
      `What is a fraction? Differentiate between numerator and denominator.`,
      `State the three major types of fractions and give two examples of each.`,
      `Add the following like fractions: 3/8 + 2/8.`,
      `Add the following unlike fractions: 1/3 + 2/5 (Show all working including LCM).`,
      `Solve the mixed fraction problem: 1 1/2 + 2 1/4.`,
      `Why is it mathematically incorrect to add denominators together when adding fractions?`,
      `Word Problem: Chinedu spent 2/5 of his pocket money on books and 1/5 on transport. What fraction did he spend in total?`,
      `Simplify your final answer to its lowest terms: 6/12.`
    ];
  }

  if (category === 'science' && (combined.includes('habitat') || combined.includes('adaptation') || combined.includes('aquatic') || combined.includes('desert'))) {
    return [
      `Define the term 'habitat' and give three examples of natural habitats.`,
      `What is meant by biological adaptation?`,
      `Mention three adaptive features of a Tilapia fish that enable it to survive in water.`,
      `Explain why water lilies have wide leaves and stomata on their upper surface.`,
      `List four adaptations of a camel that enable it to survive severe desert conditions.`,
      `How do cacti plants prevent excessive water loss in arid environments?`,
      `State two human activities that destroy aquatic habitats in Nigeria and how to prevent them.`,
      `Explain what happens when an organism is removed from its natural habitat.`
    ];
  }

  if (category === 'language' && combined.includes('adjective')) {
    return [
      `Define an adjective and give three examples.`,
      `Mention five types of adjectives and write one illustrative sentence for each.`,
      `Underline the adjectives in the sentence: "The courageous young girl won a prestigious national scholarship."`,
      `Differentiate between attributive and predicative positions of adjectives with examples.`,
      `Arrange these adjectives in the correct order: (leather / brown / large / Nigerian) bag.`,
      `Give the comparative and superlative degrees of: good, tall, beautiful, and bad.`,
      `Correct the error in this sentence: "Emeka is more taller than his brother."`,
      `Construct two original sentences using demonstrative adjectives.`
    ];
  }

  if (category === 'religious' && combined.includes('temptation')) {
    return [
      `What is temptation? Is being tempted a sin?`,
      `Where was Jesus when He was tempted, and how long did He fast?`,
      `Mention the three temptations of Jesus Christ in the wilderness.`,
      `What was Jesus' response when Satan asked Him to turn stones into bread?`,
      `Why did Jesus refuse to jump from the pinnacle of the temple?`,
      `What did Satan promise Jesus in exchange for worship?`,
      `Mention four ways Jesus overcame the temptation of the devil.`,
      `State five practical moral lessons Christian youths can learn from the temptation of Jesus.`
    ];
  }

  if (category === 'mathematics') {
    return [
      `Define ${subTopic} in clear mathematical terms.`,
      `State the operational rule or formula used to solve problems on ${topic}.`,
      `Why is it important to follow the correct operational steps?`,
      `Solve Example 1 written on the chalkboard in your evaluation books.`,
      `Solve Example 2 involving multiple computational steps.`,
      `Solve a practical word problem involving budgeting in Naira (₦).`,
      `State two common errors pupils make when calculating ${topic}.`,
      `How can you verify that your mathematical answer is correct?`
    ];
  }

  if (category === 'science') {
    return [
      `What is the scientific definition of ${subTopic}?`,
      `Name three major characteristics or structures associated with ${topic}.`,
      `State the core scientific principle governing this lesson.`,
      `List the materials or specimens used in studying ${subTopic}.`,
      `Describe the step-by-step observation or demonstration conducted today.`,
      `What safety precaution must be observed in science study?`,
      `Mention three ways ${topic} applies to public health, agriculture, or daily life in Nigeria.`,
      `Why is environmental sanitation essential for preserving life?`
    ];
  }

  if (category === 'language') {
    return [
      `Define ${subTopic} and give two examples.`,
      `Identify the grammatical function of ${subTopic} in a sentence.`,
      `Construct three original sentences illustrating proper usage of ${subTopic}.`,
      `Correct the grammatical error in the sentence written on the chalkboard.`,
      `Differentiate between standard formal English and common speech errors.`,
      `Spell and pronounce the key vocabulary words learned in today's lesson.`,
      `Why is active reading crucial for mastering language competence?`
    ];
  }

  return [
    `What is the definition of ${subTopic}?`,
    `Explain the background and significance of ${topic}.`,
    `Identify three major characteristics or components of ${subTopic}.`,
    `Describe the process or steps involved when dealing with ${topic}.`,
    `How does understanding ${subTopic} help in solving everyday problems?`,
    `Mention two challenges associated with this topic in contemporary Nigerian society.`,
    `How can a disciplined student overcome these challenges?`,
    `State three moral or practical lessons learned from ${topic}.`
  ];
}

export function generateSubjectSpecificCoreRule(subject: string, topic: string): string {
  const category = categorizeSubject(subject);
  const combined = `${subject} ${topic}`.toLowerCase();

  if (category === 'religious') {
    if (combined.includes('islamic') || combined.includes('irs')) {
      return 'Key Quranic Reference: “Verily, with hardship comes ease.” (Surah Ash-Sharh 94:6)';
    }
    return 'Key Scripture: “Worship the Lord your God, and serve him only.” (Matthew 4:10)';
  }
  if (category === 'mathematics') {
    if (combined.includes('fraction')) {
      return `Core Mathematical Rule: "When adding unlike fractions, find the LCM of denominators first. Never add denominators together!"`;
    }
    return `Core Mathematical Rule: "Always check your signs, maintain place value alignment, and verify your answers through substitution."`;
  }
  if (category === 'science') {
    if (combined.includes('habitat') || combined.includes('adaptation')) {
      return `Core Biological Principle: "Structure matches environment: living organisms adapt specialized features to survive in their natural habitats."`;
    }
    return `Core Scientific Principle: "Observation without bias, hypothesis tested by experiment, and knowledge applied for the preservation of life."`;
  }
  if (category === 'language') {
    if (combined.includes('adjective')) {
      return `Golden Rule of Adjectives: "Use adjectives to illuminate, not to clutter. Observe the Royal Order: Opinion, Size, Age, Shape, Colour, Origin, Material + Noun."`;
    }
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

export function generateDefaultSteps(topic: string, subTopic: string) {
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
