import React, { useState } from 'react';
import type { TeacherProfile, AIProviderId, AIProviderConfig } from '../types';
import {
  X,
  Save,
  School,
  User,
  Clock,
  CheckCircle,
  Activity,
  AlertCircle,
  Loader2,
  Server,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { testProviderConnection, PROVIDERS } from '../services/ai/providers';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSaveProfile: (profile: TeacherProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<TeacherProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
  } | null>(null);

  if (!isOpen) return null;

  const currentProvider: AIProviderId = formData.activeProvider || 'gemini';

  const getCurrentConfig = (): AIProviderConfig => {
    if (currentProvider === 'claude') {
      return {
        provider: 'claude',
        apiKey: formData.claudeApiKey || '',
        model: formData.claudeModel || PROVIDERS.claude.defaultModel
      };
    }
    if (currentProvider === 'openai') {
      return {
        provider: 'openai',
        apiKey: formData.openaiApiKey || '',
        model: formData.openaiModel || PROVIDERS.openai.defaultModel,
        baseUrl: formData.openaiBaseUrl || 'https://api.openai.com/v1'
      };
    }
    return {
      provider: 'gemini',
      apiKey: formData.geminiApiKey || '',
      model: formData.geminiModel || PROVIDERS.gemini.defaultModel
    };
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const config = getCurrentConfig();
      const res = await testProviderConnection(config);
      setTestResult(res);
    } catch (err: unknown) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-emerald-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <School className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">Settings & AI Providers</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700/50 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Teacher Profile Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher & School Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  School Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="e.g. King's College, Lagos"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Teacher's Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="e.g. Mr. Babatunde Alabi"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Default Lesson Duration
              </label>
              <select
                value={formData.defaultDuration}
                onChange={e => setFormData({ ...formData, defaultDuration: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="35 Minutes">35 Minutes (Primary)</option>
                <option value="40 Minutes">40 Minutes (Standard Single Period)</option>
                <option value="80 Minutes">80 Minutes (Double Period / Practical)</option>
              </select>
            </div>
          </div>

          {/* Multi-Provider Configuration */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                AI Model Engine &amp; Multi-Provider
              </h3>
              <span className="text-[11px] text-slate-400">Works 100% offline if no keys configured</span>
            </div>

            {/* Provider Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, activeProvider: 'gemini' });
                  setTestResult(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentProvider === 'gemini'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Google Gemini</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, activeProvider: 'claude' });
                  setTestResult(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentProvider === 'claude'
                    ? 'bg-white text-orange-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Anthropic Claude</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, activeProvider: 'openai' });
                  setTestResult(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentProvider === 'openai'
                    ? 'bg-white text-blue-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>OpenAI / Compatible</span>
              </button>
            </div>

            {/* Provider-Specific Settings */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3.5">
              {currentProvider === 'gemini' && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Gemini API Key</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline text-[11px]"
                    >
                      Get free key at Google AI Studio &rarr;
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.geminiApiKey || ''}
                      onChange={e => setFormData({ ...formData, geminiApiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full rounded-lg border border-slate-300 pr-10 pl-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={formData.geminiModel || PROVIDERS.gemini.defaultModel}
                      onChange={e => setFormData({ ...formData, geminiModel: e.target.value })}
                      placeholder="gemini-2.5-flash"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                    <div className="flex gap-1.5 mt-1.5 text-[11px] text-slate-500">
                      <span>Presets:</span>
                      {PROVIDERS.gemini.availableModels?.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, geminiModel: m })}
                          className="text-emerald-700 hover:underline"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentProvider === 'claude' && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Anthropic Claude API Key</span>
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-700 hover:underline text-[11px]"
                    >
                      Get key at Anthropic Console &rarr;
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.claudeApiKey || ''}
                      onChange={e => setFormData({ ...formData, claudeApiKey: e.target.value })}
                      placeholder="sk-ant-api..."
                      className="w-full rounded-lg border border-slate-300 pr-10 pl-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={formData.claudeModel || PROVIDERS.claude.defaultModel}
                      onChange={e => setFormData({ ...formData, claudeModel: e.target.value })}
                      placeholder="claude-3-5-sonnet-20241022"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-orange-600 focus:outline-none"
                    />
                    <div className="flex gap-1.5 mt-1.5 text-[11px] text-slate-500">
                      <span>Presets:</span>
                      {PROVIDERS.claude.availableModels?.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, claudeModel: m })}
                          className="text-orange-700 hover:underline"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentProvider === 'openai' && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">API Key</span>
                    <span className="text-[11px] text-slate-400">OpenAI, Groq, Together, Ollama</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.openaiApiKey || ''}
                      onChange={e => setFormData({ ...formData, openaiApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full rounded-lg border border-slate-300 pr-10 pl-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Model Name</label>
                      <input
                        type="text"
                        value={formData.openaiModel || PROVIDERS.openai.defaultModel}
                        onChange={e => setFormData({ ...formData, openaiModel: e.target.value })}
                        placeholder="gpt-4o-mini"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                        <Server className="w-3 h-3 text-slate-400" />
                        Base Endpoint URL
                      </label>
                      <input
                        type="text"
                        value={formData.openaiBaseUrl || 'https://api.openai.com/v1'}
                        onChange={e => setFormData({ ...formData, openaiBaseUrl: e.target.value })}
                        placeholder="https://api.openai.com/v1"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Test Connection Button & Result Box */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                      <span>Testing Endpoint...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5 text-slate-600" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>

                {testResult && (
                  <div className="text-xs">
                    {testResult.success ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {testResult.message || `✓ Success (${testResult.latencyMs}ms)`}
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {testResult.error || 'Connection failed'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
