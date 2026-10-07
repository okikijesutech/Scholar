import type {
  LLMProvider,
  TestConnectionResult,
  StructuredGenerateParams,
  VisionExtractParams
} from './types';
import type { AIProviderConfig } from '../../../types';
import { parseStructuredJsonResponse } from './jsonHelper';

const OPENAI_DEFAULT_MODEL = 'gpt-4o-mini';
const OPENAI_AVAILABLE_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'deepseek-chat',
  'llama-3.3-70b-versatile',
  'claude-3-5-sonnet'
];

function resolveEndpoint(config: AIProviderConfig, path: string): string {
  const base = (config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const openaiProvider: LLMProvider = {
  id: 'openai',
  displayName: 'OpenAI / Compatible Endpoint',
  defaultModel: OPENAI_DEFAULT_MODEL,
  availableModels: OPENAI_AVAILABLE_MODELS,

  async testConnection(config: AIProviderConfig): Promise<TestConnectionResult> {
    const startTime = Date.now();
    try {
      if (!config.apiKey && !config.baseUrl?.includes('localhost') && !config.baseUrl?.includes('127.0.0.1')) {
        return { success: false, error: 'API key is required.' };
      }

      const url = resolveEndpoint(config, '/models');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const res = await fetch(url, { headers });
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          latencyMs,
          error: `HTTP ${res.status}: ${errText.slice(0, 150)}`
        };
      }

      const data = await res.json();
      const modelCount = data.data?.length || 0;
      const targetModel = config.model || OPENAI_DEFAULT_MODEL;

      return {
        success: true,
        latencyMs,
        modelUsed: targetModel,
        message: `Endpoint active (${latencyMs}ms). ${modelCount > 0 ? `${modelCount} models detected.` : 'Ready.'}`
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
    const targetModel = config.model || OPENAI_DEFAULT_MODEL;
    const url = resolveEndpoint(config, '/chat/completions');

    const messages: any[] = [];
    if (params.systemPrompt) {
      messages.push({
        role: 'system',
        content: `${params.systemPrompt}\nIMPORTANT: Respond with pure valid JSON only.`
      });
    }
    messages.push({ role: 'user', content: params.prompt });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: targetModel,
        messages,
        response_format: { type: 'json_object' },
        temperature: params.temperature ?? 0.3
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenAI-compatible Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Endpoint returned no content.');
    }

    return parseStructuredJsonResponse<T>(content);
  },

  async extractFromVision<T>(params: VisionExtractParams, config: AIProviderConfig): Promise<T> {
    const targetModel = config.model || OPENAI_DEFAULT_MODEL;
    const url = resolveEndpoint(config, '/chat/completions');

    const contentParts: any[] = [];
    for (const img of params.images) {
      contentParts.push({
        type: 'image_url',
        image_url: {
          url: `data:${img.mimeType};base64,${img.base64}`
        }
      });
    }
    contentParts.push({
      type: 'text',
      text: params.prompt
    });

    const messages: any[] = [];
    if (params.systemPrompt) {
      messages.push({
        role: 'system',
        content: `${params.systemPrompt}\nIMPORTANT: Respond with pure JSON only.`
      });
    }
    messages.push({ role: 'user', content: contentParts });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: targetModel,
        messages,
        response_format: { type: 'json_object' },
        temperature: params.temperature ?? 0.2
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Vision Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Vision extraction returned no content.');
    }

    return parseStructuredJsonResponse<T>(content);
  }
};
