import type {
  LLMProvider,
  TestConnectionResult,
  StructuredGenerateParams,
  VisionExtractParams
} from './types';
import type { AIProviderConfig } from '../../../types';
import { parseStructuredJsonResponse } from './jsonHelper';

const CLAUDE_DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const CLAUDE_AVAILABLE_MODELS = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229'
];

export const claudeProvider: LLMProvider = {
  id: 'claude',
  displayName: 'Anthropic Claude',
  defaultModel: CLAUDE_DEFAULT_MODEL,
  availableModels: CLAUDE_AVAILABLE_MODELS,

  async testConnection(config: AIProviderConfig): Promise<TestConnectionResult> {
    const startTime = Date.now();
    try {
      if (!config.apiKey) {
        return { success: false, error: 'API key is required.' };
      }

      const targetModel = config.model || CLAUDE_DEFAULT_MODEL;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Ping' }]
        })
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

      return {
        success: true,
        latencyMs,
        modelUsed: targetModel,
        message: `Connection successful (${latencyMs}ms). Active model: ${targetModel}`
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
    const targetModel = config.model || CLAUDE_DEFAULT_MODEL;
    const systemInstruction = `${params.systemPrompt || ''}\nIMPORTANT: Respond with pure, valid JSON only. Do NOT include markdown code blocks, do not wrap in backticks, and do not provide introductory or concluding conversational text.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: targetModel,
        max_tokens: 4096,
        temperature: params.temperature ?? 0.3,
        system: systemInstruction,
        messages: [{ role: 'user', content: params.prompt }]
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Claude API Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const textPart = data.content?.find((c: any) => c.type === 'text');
    if (!textPart?.text) {
      throw new Error('Claude API returned no text in message content.');
    }

    return parseStructuredJsonResponse<T>(textPart.text);
  },

  async extractFromVision<T>(params: VisionExtractParams, config: AIProviderConfig): Promise<T> {
    const targetModel = config.model || CLAUDE_DEFAULT_MODEL;
    const systemInstruction = `${params.systemPrompt || ''}\nIMPORTANT: Return pure JSON conforming to the requested schema. No conversational prose or markdown formatting.`;

    const contentParts: any[] = [];
    for (const img of params.images) {
      contentParts.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mimeType,
          data: img.base64
        }
      });
    }
    contentParts.push({
      type: 'text',
      text: params.prompt
    });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: targetModel,
        max_tokens: 4096,
        temperature: params.temperature ?? 0.2,
        system: systemInstruction,
        messages: [{ role: 'user', content: contentParts }]
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Claude Vision Error (HTTP ${res.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await res.json();
    const textPart = data.content?.find((c: any) => c.type === 'text');
    if (!textPart?.text) {
      throw new Error('Claude Vision returned no text output.');
    }

    return parseStructuredJsonResponse<T>(textPart.text);
  }
};
