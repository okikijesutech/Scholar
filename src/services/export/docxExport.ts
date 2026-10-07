import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, HeadingLevel } from 'docx';
import type { LessonNote } from '../../types';

// Export Lesson Note as a formatted Microsoft Word (.docx) document
export async function exportToDocx(note: LessonNote): Promise<void> {
  const contentChildren: Paragraph[] = [];

  // Add in-depth Content Sections to Word Document
  if (note.contentSections && note.contentSections.length > 0) {
    contentChildren.push(createSectionHeading('LESSON CONTENT (LECTURE & TEACHING TEXT)'));
    note.contentSections.forEach((section) => {
      contentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${section.sectionNumber}. ${section.heading}`,
              bold: true,
              size: 22,
              color: '1E3A8A'
            })
          ],
          spacing: { before: 140, after: 80 }
        }),
        new Paragraph({
          text: section.body,
          spacing: { after: 80 }
        })
      );

      if (section.subPoints && section.subPoints.length > 0) {
        section.subPoints.forEach((pt) => {
          // Remove manual '• ' so Word's native bullet does not double-render
          const cleanPt = pt.replace(/^[•\-*]\s*/, '');
          contentChildren.push(
            new Paragraph({
              text: cleanPt,
              spacing: { after: 50 },
              bullet: { level: 0 }
            })
          );
        });
      }

      if (section.lessonTakeaway) {
        contentChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Lesson from this section: ', bold: true, italics: true }),
              new TextRun({ text: section.lessonTakeaway, italics: true })
            ],
            spacing: { before: 60, after: 120 }
          })
        );
      }
    });
  }

  // Add Classroom Activities to Word Document
  const activitiesChildren: Paragraph[] = [];
  if (note.classroomActivities && note.classroomActivities.length > 0) {
    activitiesChildren.push(createSectionHeading('CLASSROOM ACTIVITIES'));
    note.classroomActivities.forEach((act) => {
      activitiesChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: act.title,
              bold: true,
              size: 20,
              color: '047857'
            })
          ],
          spacing: { before: 120, after: 60 }
        }),
        new Paragraph({
          text: act.description,
          spacing: { after: 60 }
        })
      );

      if (act.items && act.items.length > 0) {
        act.items.forEach((item) => {
          const cleanItem = item.replace(/^[•\-*]\s*/, '');
          contentChildren.push(
            new Paragraph({
              text: cleanItem,
              spacing: { after: 50 },
              bullet: { level: 0 }
            })
          );
        });
      }
    });
  }

  const schoolTitle = note.schoolName ? note.schoolName.toUpperCase() : 'NAME OF SCHOOL: _________________________________________';
  const teacherDisplay = note.teacherName || '_________________________________';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: [
          // Header / Title
          new Paragraph({
            text: schoolTitle,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${note.subject.toUpperCase()} – ${note.classLevel.toUpperCase()}`,
                bold: true,
                size: 24,
                color: '1E3A8A'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${note.term.toUpperCase()} – WEEK ${note.week} LESSON NOTE`,
                bold: true,
                size: 22,
                color: '047857'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 }
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Teacher:'),
                  createContentCell(teacherDisplay),
                  createHeaderCell('Subject:'),
                  createContentCell(note.subject)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('Class:'),
                  createContentCell(note.classLevel),
                  createHeaderCell('Term & Week:'),
                  createContentCell(`${note.term} | Week ${note.week}`)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('Date:'),
                  createContentCell(note.date),
                  createHeaderCell('Duration:'),
                  createContentCell(note.duration)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('Period:'),
                  createContentCell(note.period),
                  createHeaderCell('Avg. Age:'),
                  createContentCell(note.averageAge)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('Topic:'),
                  createCellWithSpan(note.topic, 3, true)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('Sub-Topic:'),
                  createCellWithSpan(note.subTopic, 3, false)
                ]
              }),
              ...(note.references
                ? [
                    new TableRow({
                      children: [
                        createHeaderCell('References:'),
                        createCellWithSpan(note.references, 3, false)
                      ]
                    })
                  ]
                : [])
            ]
          }),

          // Learning Objectives
          createSectionHeading('LEARNING OBJECTIVES'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'By the end of the lesson, students should be able to:',
                italics: true
              })
            ],
            spacing: { after: 80 }
          }),
          ...note.behavioralObjectives.map((obj, i) =>
            new Paragraph({
              text: `${i + 1}. ${obj}`,
              spacing: { after: 60 }
            })
          ),

          // Previous Knowledge & Instructional Materials
          createSectionHeading('PREVIOUS KNOWLEDGE & TEACHING AIDS'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Previous Knowledge / Entry Behaviour: ', bold: true }),
              new TextRun({ text: note.previousKnowledge })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Instructional Materials / Teaching Aids:', bold: true })
            ],
            spacing: { after: 60 }
          }),
          ...note.instructionalMaterials.map((mat) => {
            const cleanMat = mat.replace(/^[•\-*]\s*/, '');
            return new Paragraph({
              text: cleanMat,
              spacing: { after: 50 },
              bullet: { level: 0 }
            });
          }),

          // In-Depth Full Lesson Content
          ...contentChildren,

          // Classroom Activities
          ...activitiesChildren,

          // Step-by-Step Procedure Table
          createSectionHeading('INSTRUCTIONAL PRESENTATION PROCEDURE'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableHeadCell('Step', 10),
                  createTableHeadCell('Stage & Focus', 25),
                  createTableHeadCell('Teacher\'s Activity', 35),
                  createTableHeadCell('Pupils\' / Students\' Activity', 30)
                ]
              }),
              ...note.steps.map(step =>
                new TableRow({
                  children: [
                    createStepCell(`Step ${step.stepNumber}`, 10),
                    createStepCell(step.title, 25),
                    createStepCell(step.teacherActivity, 35),
                    createStepCell(step.studentActivity, 30)
                  ]
                })
              )
            ]
          }),

          // Formative Evaluation Questions
          createSectionHeading('EVALUATION QUESTIONS'),
          ...note.evaluation.map((q, i) =>
            new Paragraph({
              text: `${i + 1}. ${q}`,
              spacing: { after: 60 }
            })
          ),

          // Summary & Homework Assignment
          createSectionHeading('SUMMARY & WRAP-UP'),
          new Paragraph({
            text: note.summary,
            spacing: { after: 120 }
          }),

          createSectionHeading('ASSIGNMENT / HOMEWORK'),
          new Paragraph({
            text: note.assignment,
            spacing: { after: 140 }
          }),

          // Key Scripture / Core Rule
          ...(note.keyScriptureOrCoreRule
            ? [
                createSectionHeading('KEY SCRIPTURE / CORE RULE'),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: note.keyScriptureOrCoreRule,
                      bold: true,
                      size: 22,
                      color: '047857'
                    })
                  ],
                  spacing: { after: 180 }
                })
              ]
            : []),

          // Supervision & Remarks (Neutral pending sign-off)
          createSectionHeading('QUALITY ASSURANCE & VETTING'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Teacher\'s Remarks:'),
                  createCellWithSpan(note.teacherRemarks || '(To be completed after lesson presentation)', 3, false)
                ]
              }),
              new TableRow({
                children: [
                  createHeaderCell('HOD / VP Remarks:'),
                  createCellWithSpan(note.hodRemarks || '(Awaiting inspection and sign-off)', 3, false)
                ]
              }),
              new TableRow({
                children: [
                  createSignCell('Teacher\'s Signature & Date'),
                  createSignCell('HOD Signature & Date'),
                  createSignCell('VP (Academics) Signature'),
                  createSignCell('Principal / Official Stamp')
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileNameSafe = `${note.subject}_${note.classLevel}_Week${note.week}_LessonNote.docx`.replace(/\s+/g, '_');
  a.download = fileNameSafe;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helpers for Word document styling
function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 20,
        color: '1E3A8A'
      })
    ],
    spacing: { before: 200, after: 100 }
  });
}

function createHeaderCell(text: string): TableCell {
  return new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })]
  });
}

function createContentCell(text: string): TableCell {
  return new TableCell({
    width: { size: 30, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })]
  });
}

function createCellWithSpan(text: string, colSpan: number, bold = false): TableCell {
  return new TableCell({
    columnSpan: colSpan,
    children: [new Paragraph({ children: [new TextRun({ text, bold, size: 18 })] })]
  });
}

function createTableHeadCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })]
  });
}

function createStepCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })]
  });
}

function createSignCell(label: string): TableCell {
  return new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({ text: '', spacing: { before: 240 } }),
      new Paragraph({
        children: [new TextRun({ text: `_____________________\n${label}`, size: 16, italics: true })],
        alignment: AlignmentType.CENTER
      })
    ]
  });
}
