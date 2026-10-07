import type { AIProviderId, AIProviderConfig } from '../../../types';

export interface TestConnectionResult {
  success: boolean;
  modelUsed?: string;
  latencyMs?: number;
  message?: string;
  error?: string;
}

export interface VisionImagePayload {
  base64: string;
  mimeType: string;
}

export interface StructuredGenerateParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
}

export interface VisionExtractParams {
  prompt: string;
  images: VisionImagePayload[];
  systemPrompt?: string;
  temperature?: number;
}

export interface LLMProvider {
  id: AIProviderId;
  displayName: string;
  defaultModel: string;
  availableModels?: string[];

  testConnection(config: AIProviderConfig): Promise<TestConnectionResult>;
  generateStructured<T>(params: StructuredGenerateParams, config: AIProviderConfig): Promise<T>;
  extractFromVision<T>(params: VisionExtractParams, config: AIProviderConfig): Promise<T>;
}
