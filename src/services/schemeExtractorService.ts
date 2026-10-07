import type { SchemeOfWork, SchemeWeek, ClassLevel, Term, AIProviderConfig } from '../types';
import { getProvider } from './ai/providers';
import { resizeImageForVision, fileToBase64 } from '../utils/imageUtils';

export interface ExtractionResult {
  scheme: SchemeOfWork;
  previewUrl?: string;
  sourceFileName: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
}

/**
 * Merges two sets of scheme weeks by week number.
 * Allows capturing multi-page spreads (e.g. Weeks 1-6 from Page 1, Weeks 7-12 from Page 2)
 * without losing previously captured weeks.
 */
export function mergeSchemeWeeks(
  existingWeeks: SchemeWeek[],
  incomingWeeks: SchemeWeek[],
  overwriteExisting = true
): SchemeWeek[] {
  const weekMap = new Map<number, SchemeWeek>();

  for (const w of existingWeeks) {
    weekMap.set(w.week, { ...w });
  }

  for (const w of incomingWeeks) {
    if (!weekMap.has(w.week) || overwriteExisting) {
      weekMap.set(w.week, { ...w });
    } else {
      const current = weekMap.get(w.week)!;
      weekMap.set(w.week, {
        week: w.week,
        topic: w.topic || current.topic,
        subTopic: w.subTopic || current.subTopic,
        objectivesSummary: w.objectivesSummary || current.objectivesSummary,
        suggestedMaterials: w.suggestedMaterials || current.suggestedMaterials
      });
    }
  }

  return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
}

/**
 * Extract Scheme of Work from an image or PDF using Vision LLMs
 * Resizes phone snapshots down to ~1500px in-browser to prevent upload limits and latency.
 */
export async function extractSchemeFromDocument(
  file: File,
  fallbackClass: ClassLevel,
  fallbackSubject: string,
  fallbackTerm: Term,
  providerConfig?: AIProviderConfig,
  apiKeyFallback?: string
): Promise<ExtractionResult> {
  const config: AIProviderConfig = providerConfig || {
    provider: 'gemini',
    apiKey: apiKeyFallback || ''
  };

  if (!config.apiKey || config.apiKey.trim().length < 5) {
    throw new Error(
      `An API key is required to scan syllabus books with ${config.provider.toUpperCase()}. Please configure your key in Settings.`
    );
  }

  let base64Data: string;
  let mimeType: string;
  let originalSizeBytes = file.size;
  let optimizedSizeBytes = file.size;

  if (file.type.startsWith('image/')) {
    const optimized = await resizeImageForVision(file, 1500, 0.85);
    base64Data = optimized.base64;
    mimeType = optimized.mimeType;
    originalSizeBytes = optimized.originalSizeBytes;
    optimizedSizeBytes = optimized.optimizedSizeBytes;
  } else {
    // Non-image e.g. application/pdf
    const direct = await fileToBase64(file);
    base64Data = direct.base64;
    mimeType = direct.mimeType;
  }

  const systemPrompt = `You are an expert Nigerian educational supervisor and syllabus document parser for SUBEB and WAEC.
Your job is to read pictures or documents of Nigerian Schemes of Work and extract the exact weekly curriculum structure.
Extract only what is actually printed or handwritten on the document. Do not invent or hallucinate topics not present.
Respond strictly with pure valid JSON.`;

  const prompt = `Extract the weekly Scheme of Work from this uploaded syllabus document.
Target Subject if detectable: "${fallbackSubject}"
Target Class if detectable: "${fallbackClass}"
Target Term if detectable: "${fallbackTerm}"

Instructions:
1. Identify the Subject, Class Level (Primary 1-6, JSS 1-3, SSS 1-3), and Term (1st, 2nd, or 3rd Term).
2. For every week found in the document, extract:
   - "week": number (1 to 12)
   - "topic": exact topic heading from the document
   - "subTopic": sub-topic or specific breakdown
   - "objectivesSummary": brief behavioral objectives or expected learning outcome
   - "suggestedMaterials": instructional materials or teaching aids mentioned.

Respond strictly with valid JSON conforming to this structure:
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
}`;

  const provider = getProvider(config.provider);
  const parsed = await provider.extractFromVision<any>(
    {
      prompt,
      systemPrompt,
      images: [{ base64: base64Data, mimeType }]
    },
    config
  );

  const scheme: SchemeOfWork = {
    id: `scheme-${Date.now()}`,
    subject: parsed.subject || fallbackSubject,
    classLevel: (parsed.classLevel as ClassLevel) || fallbackClass,
    term: (parsed.term as Term) || fallbackTerm,
    weeks: Array.isArray(parsed.weeks)
      ? parsed.weeks.map((w: any, idx: number) => ({
          week: Number(w.week) || idx + 1,
          topic: String(w.topic || `Week ${idx + 1} Topic`),
          subTopic: String(w.subTopic || ''),
          objectivesSummary: String(w.objectivesSummary || 'General understanding of weekly concept.'),
          suggestedMaterials: String(w.suggestedMaterials || 'Chalkboard, charts, textbooks.')
        }))
      : [],
    provenance: {
      provider: config.provider,
      modelName: config.model || provider.defaultModel,
      source: 'book_scan',
      capturedAt: new Date().toISOString()
    }
  };

  return {
    scheme,
    sourceFileName: file.name,
    originalSizeBytes,
    optimizedSizeBytes
  };
}
