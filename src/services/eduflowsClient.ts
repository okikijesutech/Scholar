import type { LessonNote } from '../types';

export interface EduFlowsUser {
  id: string;
  email: string;
  fullName: string;
  role: 'teacher' | 'admin' | 'superadmin' | string;
  schoolId: string;
  schoolName: string;
  assignedClasses: string[];
  assignedSubjects: string[];
}

export interface EduFlowsAuthResponse {
  success: boolean;
  token?: string;
  user?: EduFlowsUser;
  error?: string;
}

export interface EduFlowsSyncResult {
  success: boolean;
  syncedCount: number;
  failedCount?: number;
  errors?: string[];
  message?: string;
}

const TOKEN_KEY = 'eduflows_token';
const USER_KEY = 'eduflows_user';
const BASE_URL_KEY = 'eduflows_api_base_url';
const DEFAULT_BASE_URL = 'http://localhost:3000';

function safeGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    // ignore
  }
  return null;
}

function safeSet(key: string, val: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch {
    // ignore
  }
}

function safeRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function getEduFlowsBaseUrl(): string {
  const stored = safeGet(BASE_URL_KEY);
  if (stored) return stored;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EDUFLOWS_API_URL) {
      return import.meta.env.VITE_EDUFLOWS_API_URL as string;
    }
  } catch {
    // ignore
  }
  return DEFAULT_BASE_URL;
}

export function setEduFlowsBaseUrl(url: string): void {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  safeSet(BASE_URL_KEY, cleanUrl);
}

export function getStoredToken(): string | null {
  return safeGet(TOKEN_KEY);
}

export function getStoredUser(): EduFlowsUser | null {
  const raw = safeGet(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EduFlowsUser;
  } catch {
    return null;
  }
}

export function isEduFlowsConnected(): boolean {
  return Boolean(getStoredToken() && getStoredUser());
}

export function clearEduFlowsSession(): void {
  safeRemove(TOKEN_KEY);
  safeRemove(USER_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function loginToEduFlows(
  email: string,
  password: string,
  customBaseUrl?: string
): Promise<EduFlowsAuthResponse> {
  if (customBaseUrl) {
    setEduFlowsBaseUrl(customBaseUrl);
  }
  const baseUrl = getEduFlowsBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/v1/lessonflow/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Authentication failed with status ${res.status}`,
      };
    }

    safeSet(TOKEN_KEY, data.token);
    safeSet(USER_KEY, JSON.stringify(data.user));

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network connection error';
    return {
      success: false,
      error: `Could not reach EduFlows at ${baseUrl}: ${message}`,
    };
  }
}

export async function pushNotesToEduFlows(
  notes: LessonNote[]
): Promise<EduFlowsSyncResult> {
  const baseUrl = getEduFlowsBaseUrl();
  const token = getStoredToken();

  if (!token) {
    return {
      success: false,
      syncedCount: 0,
      errors: ['Not authenticated with EduFlows'],
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/v1/lessonflow/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        syncedCount: data.syncedCount || 0,
        failedCount: data.failedCount || notes.length,
        errors: data.errors || [data.error || 'Sync request failed'],
      };
    }

    return {
      success: true,
      syncedCount: data.syncedCount || 0,
      failedCount: data.failedCount || 0,
      message: data.message,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network connection error';
    return {
      success: false,
      syncedCount: 0,
      errors: [`Network sync error: ${message}`],
    };
  }
}

export async function fetchNotesFromEduFlows(filters?: {
  classLevel?: string;
  subject?: string;
  term?: string;
}): Promise<{ success: boolean; notes?: LessonNote[]; error?: string }> {
  const baseUrl = getEduFlowsBaseUrl();
  const token = getStoredToken();

  if (!token) {
    return { success: false, error: 'Not authenticated with EduFlows' };
  }

  try {
    const query = new URLSearchParams();
    if (filters?.classLevel) query.set('classLevel', filters.classLevel);
    if (filters?.subject) query.set('subject', filters.subject);
    if (filters?.term) query.set('term', filters.term);

    const url = `${baseUrl}/api/v1/lessonflow/notes${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to fetch notes from EduFlows' };
    }

    return { success: true, notes: data.notes };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network connection error';
    return { success: false, error: `Network fetch error: ${message}` };
  }
}

export async function fetchCurriculumFromEduFlows(filters?: {
  state?: string;
  classLevel?: string;
  subject?: string;
  term?: string;
}): Promise<{ success: boolean; frameworks?: unknown[]; error?: string }> {
  const baseUrl = getEduFlowsBaseUrl();

  try {
    const query = new URLSearchParams();
    if (filters?.state) query.set('state', filters.state);
    if (filters?.classLevel) query.set('classLevel', filters.classLevel);
    if (filters?.subject) query.set('subject', filters.subject);
    if (filters?.term) query.set('term', filters.term);

    const url = `${baseUrl}/api/v1/lessonflow/curriculum${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to fetch curriculum' };
    }

    return { success: true, frameworks: data.frameworks };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network connection error';
    return { success: false, error: `Network fetch error: ${message}` };
  }
}
