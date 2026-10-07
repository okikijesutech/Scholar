import type { ClassLevel, LessonNote, Term } from '../types';
import { NIGERIAN_CLASSES } from '../data/curriculumData';
import { callGeminiAPI } from './ai/geminiClient';
import { generateLocalLessonNote } from './templates/offlineGenerator';
import { categorizeSubject, type SubjectCategory } from './templates/subjectCategories';

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
}

export { categorizeSubject, type SubjectCategory };

export async function generateLessonNote(params: GenerationParams): Promise<LessonNote> {
  const {
    classLevel,
    topic,
    subTopic = '',
    apiKey
  } = params;

  const classInfo = NIGERIAN_CLASSES.find(c => c.id === classLevel);
  const avgAge = classInfo ? classInfo.avgAge : '10 - 12 years';
  const effectiveSubTopic = subTopic.trim() || `Fundamentals of ${topic}`;

  // If API key is provided, attempt live Gemini API call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await callGeminiAPI(params, avgAge, effectiveSubTopic);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local curriculum generator:', err);
    }
  }

  // Built-in intelligent local generator (Offline-capable)
  return generateLocalLessonNote(params, avgAge, effectiveSubTopic);
}
