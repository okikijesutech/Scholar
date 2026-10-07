import type { SchemeOfWork, SchemeWeek, ClassLevel, Term } from '../types';
import { resolveGeminiModel } from './ai/geminiClient';

export interface ExtractionResult {
  scheme: SchemeOfWork;
  previewUrl?: string;
  sourceFileName: string;
}

// Convert a File object to base64 string
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data:mime/type;base64, prefix
      const base64Data = result.split(',')[1] || '';
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
}

// Extract Scheme of Work from an image or PDF using Gemini Multimodal Vision API
export async function extractSchemeFromDocument(
  file: File,
  fallbackClass: ClassLevel,
  fallbackSubject: string,
  fallbackTerm: Term,
  apiKey?: string
): Promise<ExtractionResult> {
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error('A Google Gemini API key is required to scan and extract Schemes of Work from PDFs or images. Please add your free Gemini API key in Settings.');
  }

  const base64Data = await fileToBase64(file);
  const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

  const prompt = `
You are an expert Nigerian curriculum document parser for SUBEB, WAEC, and the Federal Ministry of Education.
Extract the 10-to-12 week Scheme of Work from this uploaded ${mimeType === 'application/pdf' ? 'PDF document' : 'image of a printed/handwritten syllabus'}.

Target Subject if detectable: ${fallbackSubject}
Target Class if detectable: ${fallbackClass}
Target Term if detectable: ${fallbackTerm}

Your task:
1. Identify the Subject, Class Level (e.g. Primary 1-6, JSS 1-3, SSS 1-3), and Term (1st, 2nd, or 3rd Term).
2. For each week found in the document (typically Week 1 to Week 12), extract:
   - "week": number (1 to 12)
   - "topic": exact topic heading from the document
   - "subTopic": sub-topic or specific breakdown for that week
   - "objectivesSummary": brief behavioral objectives or expected learning outcome for the week
   - "suggestedMaterials": recommended instructional materials or teaching aids mentioned, or standard Nigerian aids suitable for the topic.

You MUST respond strictly with valid JSON conforming to this structure (no markdown fences, just pure JSON):
{
  "subject": "...",
  "classLevel": "...",
  "term": "...",
  "weeks": [
    {
      "week": 1,
      "topic": "...",
      "subTopic": "...",
      "objectivesSummary": "...",
      "suggestedMaterials": "..."
    }
  ]
}
`;

  const primaryModel = await resolveGeminiModel(apiKey);
  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-001'
  ]));

  let textOutput: string | null = null;
  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) break;
      } else {
        const errorText = await response.text();
        lastError = new Error(`Extraction failed on ${model} (${response.status}): ${errorText}`);
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  if (!textOutput) {
    throw lastError || new Error('No content returned from the document scanner.');
  }

  const cleanedJson = textOutput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(cleanedJson);

  const scheme: SchemeOfWork = {
    id: `scheme-${Date.now()}`,
    subject: parsed.subject || fallbackSubject,
    classLevel: (parsed.classLevel as ClassLevel) || fallbackClass,
    term: (parsed.term as Term) || fallbackTerm,
    weeks: Array.isArray(parsed.weeks) ? parsed.weeks.map((w: any, idx: number) => ({
      week: Number(w.week) || idx + 1,
      topic: String(w.topic || `Week ${idx + 1} Topic`),
      subTopic: String(w.subTopic || ''),
      objectivesSummary: String(w.objectivesSummary || 'General understanding of the weekly concept.'),
      suggestedMaterials: String(w.suggestedMaterials || 'Chalkboard, charts, textbooks.')
    })) : []
  };

  return {
    scheme,
    sourceFileName: file.name
  };
}
