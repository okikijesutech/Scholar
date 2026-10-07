import type { LessonNote, GenerationParams } from '../types';
import { NIGERIAN_CLASSES } from '../data/curriculumData';
import { callGeminiAPI } from './ai/geminiClient';
import { generateLocalLessonNote } from './templates/offlineGenerator';
import { categorizeSubject, type SubjectCategory } from './templates/subjectCategories';

export type { GenerationParams, SubjectCategory };
export { categorizeSubject };

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

  let generationError: string | undefined;

  // If API key is provided, attempt live Gemini API call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const note = await callGeminiAPI(params, avgAge, effectiveSubTopic);
      // Remove any unwanted pre-filled HOD remarks from AI response
      note.hodRemarks = '';
      return note;
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local curriculum generator:', err);
      generationError = `Gemini AI service unavailable (${err?.message || 'Check key or internet connection'}). Generated using offline NERDC curriculum template.`;
    }
  }

  // Built-in intelligent local generator (Offline-capable)
  return generateLocalLessonNote(params, avgAge, effectiveSubTopic, generationError);
}
