import type { SchemeOfWork, SchemeWeek, ClassLevel, Term } from '../types';

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Extraction failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('No content returned from the document scanner.');
  }

  const parsed = JSON.parse(textOutput);

  // Validate and normalize weeks
  const rawWeeks = Array.isArray(parsed.weeks) ? parsed.weeks : [];
  const normalizedWeeks: SchemeWeek[] = rawWeeks.map((w: any, index: number) => ({
    week: Number(w.week) || (index + 1),
    topic: String(w.topic || `Week ${index + 1} Topic`),
    subTopic: String(w.subTopic || `General fundamentals and practicals`),
    objectivesSummary: String(w.objectivesSummary || `Students should understand core principles of ${w.topic || 'the topic'}.`),
    suggestedMaterials: String(w.suggestedMaterials || `Chalkboard, charts, and locally available realia.`)
  }));

  const detectedClass: ClassLevel = isValidClass(parsed.classLevel) ? parsed.classLevel : fallbackClass;
  const detectedTerm: Term = isValidTerm(parsed.term) ? parsed.term : fallbackTerm;
  const detectedSubject: string = parsed.subject || fallbackSubject;

  const scheme: SchemeOfWork = {
    id: `scheme-extracted-${Date.now()}`,
    subject: detectedSubject,
    classLevel: detectedClass,
    term: detectedTerm,
    weeks: normalizedWeeks
  };

  return {
    scheme,
    sourceFileName: file.name
  };
}

function isValidClass(c: any): c is ClassLevel {
  const valid = [
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'
  ];
  return typeof c === 'string' && valid.includes(c);
}

function isValidTerm(t: any): t is Term {
  return t === '1st Term' || t === '2nd Term' || t === '3rd Term';
}
