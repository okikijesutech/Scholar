import type { TopicKnowledgeModule } from './types';

export const temptationTopic: TopicKnowledgeModule = {
  id: 'religious-temptation',
  category: 'religious',
  matches: (subject, topic, subTopic) => {
    const combined = `${subject} ${topic} ${subTopic}`.toLowerCase();
    return /\b(temptation|temptations of jesus|wilderness)\b/i.test(combined);
  },
  getContentSections: () => [
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
  ],
  getClassroomActivities: () => [
    {
      title: 'Activity 1 – Scriptural Role Play & Passage Reading',
      description: `Selected students read Matthew 4:1–11 aloud, role-playing the dialogue between Jesus and the tempter with solemnity and focus.`
    },
    {
      title: 'Activity 2 – Resisting Peer Pressure Case Studies',
      description: `Small groups analyze modern youth scenarios (e.g. cheating in WAEC, peer lure to consume drugs) and formulate scriptural, integrity-based responses.`
    },
    {
      title: 'Activity 3 – Memory Verse Drill',
      description: `Students recite and memorize Matthew 4:4 and Matthew 4:10, recording them in their exercise notebooks.`
    }
  ],
  getEvaluation: () => [
    `What is temptation? Is being tempted a sin?`,
    `Where was Jesus when He was tempted, and how long did He fast?`,
    `Mention the three temptations of Jesus Christ in the wilderness.`,
    `What was Jesus' response when Satan asked Him to turn stones into bread?`,
    `Why did Jesus refuse to jump from the pinnacle of the temple?`,
    `What did Satan promise Jesus in exchange for worship?`,
    `Mention four ways Jesus overcame the temptation of the devil.`,
    `State five practical moral lessons Christian youths can learn from the temptation of Jesus.`
  ],
  getCoreRule: () =>
    `Key Scripture: “Worship the Lord your God, and serve him only.” (Matthew 4:10)`
};
