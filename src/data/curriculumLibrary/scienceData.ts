import type { CuratedTopicData } from './types';

export const scienceHabitatsData: CuratedTopicData = {
  id: 'science-habitats',
  category: 'science',
  matchPattern: /\b(habitat|habitats|adaptation|adaptations|aquatic|desert|ecosystem)\b/i,
  contentSections: [
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
  ],
  classroomActivities: [
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
  ],
  evaluation: [
    `Define the term 'habitat' and give three examples of natural habitats.`,
    `What is meant by biological adaptation?`,
    `Mention three adaptive features of a Tilapia fish that enable it to survive in water.`,
    `Explain why water lilies have wide leaves and stomata on their upper surface.`,
    `List four adaptations of a camel that enable it to survive severe desert conditions.`,
    `How do cacti plants prevent excessive water loss in arid environments?`,
    `State two human activities that destroy aquatic habitats in Nigeria and how to prevent them.`,
    `Explain what happens when an organism is removed from its natural habitat.`
  ],
  coreRule: `Core Biological Principle: "Structure matches environment: living organisms adapt specialized features to survive in their natural habitats."`
};
