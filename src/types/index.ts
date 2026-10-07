export type SchoolCategory = 'primary' | 'jss' | 'sss';

export type ClassLevel = 
  | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6'
  | 'JSS 1' | 'JSS 2' | 'JSS 3'
  | 'SSS 1' | 'SSS 2' | 'SSS 3';

export type Term = '1st Term' | '2nd Term' | '3rd Term';

export interface LessonStep {
  stepNumber: number;
  title: string;
  teacherActivity: string;
  studentActivity: string;
  durationMinutes?: number;
}

export interface ContentSection {
  sectionNumber: number;
  heading: string;
  body: string;
  subPoints?: string[];
  lessonTakeaway?: string;
}

export interface ClassroomActivity {
  title: string;
  description: string;
  items?: string[];
}

export type AIProviderId = 'gemini' | 'claude' | 'openai';

export interface AIProviderConfig {
  provider: AIProviderId;
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface ProvenanceMetadata {
  provider?: AIProviderId | 'offline_skeleton';
  modelName?: string;
  source?: 'ai' | 'offline_skeleton' | 'book_scan' | 'manual';
  capturedAt?: string;
}

export interface LessonNote {
  id: string;
  schoolName: string;
  teacherName: string;
  subject: string;
  classLevel: ClassLevel;
  term: Term;
  week: number;
  date: string;
  duration: string;
  period: string;
  averageAge: string;
  
  // Curriculum & Scripture / Text references
  topic: string;
  subTopic: string;
  references?: string; // e.g. Bible references, literature acts, key formulas
  behavioralObjectives: string[];
  previousKnowledge: string;
  instructionalMaterials: string[];
  referenceBooks: string[];
  
  // Full In-Depth Lesson Content (the actual lecture text/notes pupils copy)
  contentSections: ContentSection[];

  // Interactive Classroom Activities
  classroomActivities: ClassroomActivity[];
  
  // Instructional Presentation Steps
  steps: LessonStep[];
  
  // Assessment & Wrap-up
  evaluation: string[];
  summary: string;
  assignment: string;
  keyScriptureOrCoreRule?: string; // e.g. Matthew 4:10 or Golden Rule / Core Theorem
  
  // Inspection & Remarks (Left blank/pending until actual classroom presentation and HOD inspection)
  teacherRemarks?: string;
  hodRemarks?: string;
  
  // Transparency, Origin & Provenance Metadata
  isOfflineDraft?: boolean;
  generationError?: string;
  provenance?: ProvenanceMetadata;

  createdAt: string;
  updatedAt: string;
}

export interface SchemeWeek {
  week: number;
  topic: string;
  subTopic: string;
  objectivesSummary: string;
  suggestedMaterials: string;
}

export interface SchemeOfWork {
  id: string;
  subject: string;
  classLevel: ClassLevel;
  term: Term;
  weeks: SchemeWeek[];
  provenance?: ProvenanceMetadata;
}

export interface TeacherProfile {
  schoolName: string;
  teacherName: string;
  defaultDuration: string;
  
  // Multi-Provider Settings
  activeProvider?: AIProviderId;
  geminiApiKey?: string;
  geminiModel?: string;
  claudeApiKey?: string;
  claudeModel?: string;
  openaiApiKey?: string;
  openaiModel?: string;
  openaiBaseUrl?: string;
}

export interface GenerationParams {
  schoolName: string;
  teacherName: string;
  subject: string;
  classLevel: ClassLevel;
  term: Term;
  week: number;
  topic: string;
  subTopic?: string;
  duration?: string;
  period?: string;
  customInstructions?: string;
  apiKey?: string;
  providerConfig?: AIProviderConfig;
}
