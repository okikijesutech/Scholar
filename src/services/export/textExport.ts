import type { LessonNote } from '../../types';

// Generate formatted plain text / markdown matching the user's preferred layout
export function formatAsPlainText(note: LessonNote): string {
  let text = `${note.subject.toUpperCase()} – ${note.classLevel.toUpperCase()}
${note.term.toUpperCase()} – WEEK ${note.week} LESSON NOTE

Subject:
${note.subject}

Class:
${note.classLevel}

Term:
${note.term}

Week:
${note.week}

Topic:
${note.topic}
${note.subTopic ? `\nSub-Topic:\n${note.subTopic}\n` : ''}`;

  if (note.references) {
    text += `\nBible / References:\n${note.references}\n`;
  }

  text += `\nLearning Objectives\n\nBy the end of the lesson, students should be able to:\n`;
  note.behavioralObjectives.forEach((obj) => {
    text += `\n• ${obj}`;
  });

  if (note.previousKnowledge) {
    text += `\n\nPrevious Knowledge / Entry Behaviour:\n${note.previousKnowledge}\n`;
  }

  if (note.instructionalMaterials && note.instructionalMaterials.length > 0) {
    text += `\nInstructional Materials / Teaching Aids:\n`;
    note.instructionalMaterials.forEach(mat => {
      text += `• ${mat}\n`;
    });
  }

  // Content Sections
  if (note.contentSections && note.contentSections.length > 0) {
    text += `\nLESSON CONTENT\n`;
    note.contentSections.forEach(section => {
      text += `\n${section.sectionNumber}. ${section.heading}\n\n${section.body}\n`;
      if (section.subPoints && section.subPoints.length > 0) {
        text += `\n` + section.subPoints.map(p => `• ${p}`).join('\n') + `\n`;
      }
      if (section.lessonTakeaway) {
        text += `\nLesson from this section:\n${section.lessonTakeaway}\n`;
      }
    });
  }

  // Classroom Activities
  if (note.classroomActivities && note.classroomActivities.length > 0) {
    text += `\nClassroom Activities\n`;
    note.classroomActivities.forEach(act => {
      text += `\n${act.title}\n${act.description}\n`;
      if (act.items && act.items.length > 0) {
        text += `\n` + act.items.map(it => `• ${it}`).join('\n') + `\n`;
      }
    });
  }

  // Evaluation Questions
  text += `\nEvaluation Questions\n`;
  note.evaluation.forEach((q, i) => {
    text += `${i + 1}. ${q}\n`;
  });

  // Summary & Assignment
  text += `\nSummary:\n${note.summary}\n`;
  text += `\nAssignment:\n${note.assignment}\n`;

  if (note.keyScriptureOrCoreRule) {
    text += `\nKey Scripture / Principle:\n${note.keyScriptureOrCoreRule}\n`;
  }

  return text;
}
