import type {
  LLMProvider,
  TestConnectionResult,
  StructuredGenerateParams,
  VisionExtractParams
} from './types';
import type { AIProviderConfig } from '../../../types';
import { parseStructuredJsonResponse } from './jsonHelper';

const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';
const GEMINI_AVAILABLE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

export const geminiProvider: LLMProvider = {
  id: 'gemini',
  displayName: 'Google Gemini',
  defaultModel: GEMINI_DEFAULT_MODEL,
  availableModels: GEMINI_AVAILABLE_MODELS,

  async testConnection(config: AIProviderConfig): Promise<TestConnectionResult> {
    const startTime = Date.now();
    try {
      if (!config.apiKey) {
        return { success: false, error: 'API key is required.' };
      }

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'x-goog-api-key': config.apiKey
        }
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          latencyMs,
          error: `HTTP ${res.status}: ${errorText.slice(0, 150)}`
        };
      }

      const data = await res.json();
      const modelCount = data.models?.length || 0;
      const targetModel = config.model || GEMINI_DEFAULT_MODEL;

      return {
        success: true,
        latencyMs,
        modelUsed: targetModel,
        message: `Connection successful (${latencyMs}ms). ${modelCount} models detected.`
      };
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : String(err)
      };
    }
  },

  async generateStructured<T>(params: StructuredGenerateParams, config: AIProviderConfig): Promise<T> {
    const targetModel = config.model || GEMINI_DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent`;

    const contents: any[] = [];
    if (params.systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: params.systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood. I will generate strictly conforming structured JSON.' }] });
    }
    contents.push({ role: 'user', parts: [{ text: params.prompt }] });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: params.temperature ?? 0.4
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini API returned an empty completion.');
    }

    return parseStructuredJsonResponse<T>(text);
  },

  async extractFromVision<T>(params: VisionExtractParams, config: AIProviderConfig): Promise<T> {
    const targetModel = config.model || GEMINI_DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent`;

    const parts: any[] = params.images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64
      }
    }));

    if (params.systemPrompt) {
      parts.push({ text: `System Instructions:\n${params.systemPrompt}\n\nTask Instructions:\n${params.prompt}` });
    } else {
      parts.push({ text: params.prompt });
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: params.temperature ?? 0.2
        }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini Vision Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini Vision returned no text output.');
    }

    return parseStructuredJsonResponse<T>(text);
  }
};
