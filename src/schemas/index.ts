import { z } from 'zod';

export const schoolCategorySchema = z.enum(['primary', 'jss', 'sss']);

export const classLevelSchema = z.enum([
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3'
]);

export const termSchema = z.enum(['1st Term', '2nd Term', '3rd Term']);

export const aiProviderIdSchema = z.enum(['gemini', 'claude', 'openai']);

export const lessonStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  teacherActivity: z.string(),
  studentActivity: z.string(),
  durationMinutes: z.number().optional()
});

export const contentSectionSchema = z.object({
  sectionNumber: z.number(),
  heading: z.string(),
  body: z.string(),
  subPoints: z.array(z.string()).optional(),
  lessonTakeaway: z.string().optional()
});

export const classroomActivitySchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()).optional()
});

export const provenanceMetadataSchema = z.object({
  provider: z.string().optional(),
  modelName: z.string().optional(),
  source: z.string().optional(),
  capturedAt: z.string().optional()
}).optional();

export const lessonNoteSchema = z.object({
  id: z.string(),
  schoolName: z.string().default(''),
  teacherName: z.string().default(''),
  subject: z.string(),
  classLevel: z.string(),
  term: z.string(),
  week: z.number(),
  date: z.string().default(''),
  duration: z.string().default('40 Minutes'),
  period: z.string().default('Single Period'),
  averageAge: z.string().default(''),

  topic: z.string(),
  subTopic: z.string().default(''),
  references: z.string().optional(),
  behavioralObjectives: z.array(z.string()).default([]),
  previousKnowledge: z.string().default(''),
  instructionalMaterials: z.array(z.string()).default([]),
  referenceBooks: z.array(z.string()).default([]),

  contentSections: z.array(contentSectionSchema).default([]),
  classroomActivities: z.array(classroomActivitySchema).default([]),
  steps: z.array(lessonStepSchema).default([]),

  evaluation: z.array(z.string()).default([]),
  summary: z.string().default(''),
  assignment: z.string().default(''),
  keyScriptureOrCoreRule: z.string().optional(),

  teacherRemarks: z.string().optional(),
  hodRemarks: z.string().optional(),

  isOfflineDraft: z.boolean().optional(),
  generationError: z.string().optional(),
  provenance: provenanceMetadataSchema,

  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString())
});

export const schemeWeekSchema = z.object({
  week: z.number(),
  topic: z.string(),
  subTopic: z.string().default(''),
  objectivesSummary: z.string().default(''),
  suggestedMaterials: z.string().default('')
});

export const schemeOfWorkSchema = z.object({
  id: z.string(),
  subject: z.string(),
  classLevel: z.string(),
  term: z.string(),
  weeks: z.array(schemeWeekSchema),
  provenance: provenanceMetadataSchema
});

export const teacherProfileSchema = z.object({
  schoolName: z.string().default(''),
  teacherName: z.string().default(''),
  defaultDuration: z.string().default('40 Minutes'),
  activeProvider: aiProviderIdSchema.optional().default('gemini'),
  geminiApiKey: z.string().optional().default(''),
  geminiModel: z.string().optional().default('gemini-2.5-flash'),
  claudeApiKey: z.string().optional().default(''),
  claudeModel: z.string().optional().default('claude-3-5-sonnet-20241022'),
  openaiApiKey: z.string().optional().default(''),
  openaiModel: z.string().optional().default('gpt-4o-mini'),
  openaiBaseUrl: z.string().optional().default('https://api.openai.com/v1')
});

export type LessonNoteSchemaType = z.infer<typeof lessonNoteSchema>;
export type SchemeOfWorkSchemaType = z.infer<typeof schemeOfWorkSchema>;
export type TeacherProfileSchemaType = z.infer<typeof teacherProfileSchema>;
