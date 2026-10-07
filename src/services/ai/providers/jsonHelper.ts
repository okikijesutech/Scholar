/**
 * Resilient JSON Parser for LLM outputs
 * Handles markdown code fences, leading conversational filler, and trailing comments/commas.
 */
export function parseStructuredJsonResponse<T>(rawText: string): T {
  if (!rawText || !rawText.trim()) {
    throw new Error('LLM returned an empty response.');
  }

  // 1. Strip standard code fence wrappers
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // 2. Direct JSON parse
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // 3. Fallback: extract the outermost JSON object {...} or array [...]
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        const sanitized = objMatch[0].replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(sanitized) as T;
      } catch {
        // Fall through
      }
    }

    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try {
        const sanitized = arrMatch[0].replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(sanitized) as T;
      } catch {
        // Fall through
      }
    }
  }

  throw new Error(`Failed to parse LLM output as valid JSON:\n${rawText.slice(0, 300)}...`);
}

/** Alias for convenient import */
export const cleanAndExtractJson = parseStructuredJsonResponse;
