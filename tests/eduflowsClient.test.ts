import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getEduFlowsBaseUrl,
  setEduFlowsBaseUrl,
  getStoredToken,
  getStoredUser,
  isEduFlowsConnected,
  clearEduFlowsSession,
  loginToEduFlows,
  pushNotesToEduFlows,
  fetchNotesFromEduFlows,
  fetchCurriculumFromEduFlows,
} from '../src/services/eduflowsClient';
import type { LessonNote } from '../src/types';

let store: Record<string, string> = {};

const mockStorage = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value.toString();
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    store = {};
  }),
};

vi.stubGlobal('localStorage', mockStorage);

describe('EduFlows Client Service', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it('manages EduFlows base URL configuration', () => {
    expect(getEduFlowsBaseUrl()).toBe('http://localhost:3000');
    setEduFlowsBaseUrl('https://portal.greenfield.edu.ng/');
    expect(getEduFlowsBaseUrl()).toBe('https://portal.greenfield.edu.ng');
  });

  it('handles successful login and session persistence', async () => {
    const mockUser = {
      id: 'teacher-123',
      email: 'teacher@school.ng',
      fullName: 'Amina Bello',
      role: 'teacher',
      schoolId: 'school-99',
      schoolName: 'GreenField Academy',
      assignedClasses: ['JSS 1', 'JSS 2'],
      assignedSubjects: ['Mathematics'],
    };

    const mockResponse = {
      success: true,
      token: 'jwt-token-xyz',
      user: mockUser,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loginToEduFlows('teacher@school.ng', 'secret123');

    expect(result.success).toBe(true);
    expect(result.token).toBe('jwt-token-xyz');
    expect(result.user?.schoolName).toBe('GreenField Academy');
    expect(getStoredToken()).toBe('jwt-token-xyz');
    expect(getStoredUser()?.email).toBe('teacher@school.ng');
    expect(isEduFlowsConnected()).toBe(true);
  });

  it('handles failed login response gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: 'Invalid email or password' }),
    } as Response);

    const result = await loginToEduFlows('wrong@school.ng', 'wrongpass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');
    expect(isEduFlowsConnected()).toBe(false);
  });

  it('clears session on logout', () => {
    mockStorage.setItem('eduflows_token', 'test-token');
    mockStorage.setItem('eduflows_user', JSON.stringify({ email: 't@s.ng' }));

    expect(isEduFlowsConnected()).toBe(true);
    clearEduFlowsSession();
    expect(isEduFlowsConnected()).toBe(false);
    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('requires authentication to push notes', async () => {
    const mockNotes: LessonNote[] = [];
    const result = await pushNotesToEduFlows(mockNotes);

    expect(result.success).toBe(false);
    expect(result.errors).toContain('Not authenticated with EduFlows');
  });

  it('pushes notes when authenticated and attaches bearer token', async () => {
    mockStorage.setItem('eduflows_token', 'valid-jwt');

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, syncedCount: 2 }),
    } as Response);

    const mockNotes = [
      { id: 'note-1', topic: 'Fractions', subject: 'Mathematics' } as unknown as LessonNote,
      { id: 'note-2', topic: 'Decimals', subject: 'Mathematics' } as unknown as LessonNote,
    ];

    const result = await pushNotesToEduFlows(mockNotes);

    expect(result.success).toBe(true);
    expect(result.syncedCount).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/lessonflow/notes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-jwt',
        }),
      })
    );
  });

  it('fetches notes from EduFlows bridge when authenticated', async () => {
    mockStorage.setItem('eduflows_token', 'valid-jwt');

    const mockNotes = [{ id: 'note-cloud-1', topic: 'Algebra' }];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, notes: mockNotes }),
    } as Response);

    const result = await fetchNotesFromEduFlows({ classLevel: 'JSS 1' });

    expect(result.success).toBe(true);
    expect(result.notes).toHaveLength(1);
  });

  it('fetches curriculum frameworks from EduFlows bridge', async () => {
    const mockFrameworks = [{ id: 'fw-lagos', name: 'Lagos State Unified Curriculum' }];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, frameworks: mockFrameworks }),
    } as Response);

    const result = await fetchCurriculumFromEduFlows({ state: 'Lagos' });

    expect(result.success).toBe(true);
    expect(result.frameworks).toHaveLength(1);
  });
});
