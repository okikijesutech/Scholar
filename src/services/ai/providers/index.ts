import type { AIProviderId, AIProviderConfig, TeacherProfile } from '../../../types';
import type { LLMProvider, TestConnectionResult } from './types';
import { geminiProvider } from './geminiProvider';
import { claudeProvider } from './claudeProvider';
import { openaiProvider } from './openaiProvider';

export * from './types';
export { parseStructuredJsonResponse, cleanAndExtractJson } from './jsonHelper';
export { geminiProvider, claudeProvider, openaiProvider };

export const PROVIDERS: Record<AIProviderId, LLMProvider> = {
  gemini: geminiProvider,
  claude: claudeProvider,
  openai: openaiProvider
};

export function getProvider(id: AIProviderId = 'gemini'): LLMProvider {
  return PROVIDERS[id] || geminiProvider;
}

export function resolveActiveProviderConfig(profile: TeacherProfile): AIProviderConfig {
  const provider = profile.activeProvider || 'gemini';

  if (provider === 'claude') {
    return {
      provider: 'claude',
      apiKey: profile.claudeApiKey || '',
      model: profile.claudeModel || claudeProvider.defaultModel
    };
  }

  if (provider === 'openai') {
    return {
      provider: 'openai',
      apiKey: profile.openaiApiKey || '',
      model: profile.openaiModel || openaiProvider.defaultModel,
      baseUrl: profile.openaiBaseUrl || 'https://api.openai.com/v1'
    };
  }

  // Default: Gemini
  return {
    provider: 'gemini',
    apiKey: profile.geminiApiKey || '',
    model: profile.geminiModel || geminiProvider.defaultModel
  };
}

export async function testProviderConnection(config: AIProviderConfig): Promise<TestConnectionResult> {
  if (!config.apiKey || !config.apiKey.trim()) {
    return { success: false, error: 'API key is required.' };
  }
  const provider = getProvider(config.provider);
  return provider.testConnection(config);
}
