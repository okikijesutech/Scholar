import type { LessonNote, SchemeOfWork, TeacherProfile } from '../types';
import { backupBundleSchema } from '../schemas';
import {
  getStoredNotes,
  getCustomSchemes,
  getTeacherProfile,
  saveTeacherProfile
} from './storageService';
import { getVerifiedStateSchemes } from './curriculumCollationService';

const STORAGE_KEY_NOTES = 'naija_lesson_notes_v1';
const STORAGE_KEY_CUSTOM_SCHEMES = 'naija_custom_schemes_v1';
const STORAGE_KEY_VERIFIED_STATE_SCHEMES = 'lessonflow_verified_state_schemes_v1';
const STORAGE_KEY_SEEDED = 'naija_notes_seeded_v1';

export interface BackupBundle {
  version: number;
  appName: string;
  exportedAt: string;
  teacherProfile?: TeacherProfile;
  notes: LessonNote[];
  customSchemes: SchemeOfWork[];
  verifiedStateSchemes?: SchemeOfWork[];
  metadata?: {
    notesCount?: number;
    schemesCount?: number;
    exportReason?: string;
  };
}

export interface RestoreResult {
  success: boolean;
  notesCount: number;
  schemesCount: number;
  error?: string;
}

/**
 * Creates an exportable backup bundle containing all user notes,
 * custom uploaded schemes, verified state schemes, and teacher profile.
 */
export function generateBackupBundle(exportReason = 'Manual Backup'): BackupBundle {
  const notes = getStoredNotes();
  const customSchemes = getCustomSchemes();
  const teacherProfile = getTeacherProfile();
  const verifiedStateSchemes = getVerifiedStateSchemes();

  const bundle: BackupBundle = {
    version: 1,
    appName: 'LessonFlow',
    exportedAt: new Date().toISOString(),
    teacherProfile,
    notes,
    customSchemes,
    verifiedStateSchemes,
    metadata: {
      notesCount: notes.length,
      schemesCount: customSchemes.length,
      exportReason
    }
  };

  return bundle;
}

/**
 * Triggers a browser download of the backup bundle as a JSON file.
 */
export function downloadBackupFile(bundle?: BackupBundle): boolean {
  try {
    const data = bundle || generateBackupBundle();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.href = url;
    link.download = `lessonflow-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('Failed to trigger backup download:', e);
    return false;
  }
}

/**
 * Parses and validates an uploaded JSON backup file string against Zod schema.
 */
export function parseAndValidateBackup(jsonString: string): {
  success: boolean;
  bundle?: BackupBundle;
  error?: string;
} {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    const result = backupBundleSchema.safeParse(parsed);

    if (!result.success) {
      const issue = result.error.issues[0];
      return {
        success: false,
        error: `Invalid backup file structure: ${issue?.path.join('.') || 'root'} - ${issue?.message || 'unknown schema mismatch'}`
      };
    }

    return {
      success: true,
      bundle: result.data as unknown as BackupBundle
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? `Corrupt JSON file: ${e.message}` : 'Failed to parse JSON file'
    };
  }
}

/**
 * Restores a validated backup bundle into local storage.
 * - 'merge': Retains existing notes, updates existing matching IDs if incoming is newer, and appends new ones.
 * - 'replace': Completely overwrites notes and custom schemes with the backup contents.
 */
export function restoreBackupBundle(
  bundle: BackupBundle,
  mode: 'merge' | 'replace' = 'merge'
): RestoreResult {
  try {
    if (mode === 'replace') {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(bundle.notes));
      localStorage.setItem(STORAGE_KEY_CUSTOM_SCHEMES, JSON.stringify(bundle.customSchemes));
      if (bundle.teacherProfile) {
        saveTeacherProfile(bundle.teacherProfile);
      }
      if (bundle.verifiedStateSchemes && bundle.verifiedStateSchemes.length > 0) {
        localStorage.setItem(
          STORAGE_KEY_VERIFIED_STATE_SCHEMES,
          JSON.stringify(bundle.verifiedStateSchemes)
        );
      }

      return {
        success: true,
        notesCount: bundle.notes.length,
        schemesCount: bundle.customSchemes.length
      };
    }

    // Merge mode:
    const existingNotes = getStoredNotes();
    const notesMap = new Map<string, LessonNote>();
    for (const n of existingNotes) {
      notesMap.set(n.id, n);
    }

    let notesRestoredCount = 0;
    for (const incomingNote of bundle.notes) {
      const existing = notesMap.get(incomingNote.id);
      if (!existing) {
        notesMap.set(incomingNote.id, incomingNote);
        notesRestoredCount++;
      } else {
        const incomingTime = new Date(incomingNote.updatedAt || incomingNote.createdAt).getTime();
        const existingTime = new Date(existing.updatedAt || existing.createdAt).getTime();
        if (incomingTime >= existingTime) {
          notesMap.set(incomingNote.id, incomingNote);
        }
      }
    }

    const mergedNotes = Array.from(notesMap.values());
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(mergedNotes));

    // Merge custom schemes:
    const existingSchemes = getCustomSchemes();
    const schemeMap = new Map<string, SchemeOfWork>();
    for (const s of existingSchemes) {
      const key = `${s.subject.toLowerCase()}|${s.classLevel}|${s.term}`;
      schemeMap.set(key, s);
    }

    let schemesRestoredCount = 0;
    for (const incomingScheme of bundle.customSchemes) {
      const key = `${incomingScheme.subject.toLowerCase()}|${incomingScheme.classLevel}|${incomingScheme.term}`;
      if (!schemeMap.has(key)) {
        schemeMap.set(key, incomingScheme);
        schemesRestoredCount++;
      } else {
        schemeMap.set(key, incomingScheme);
      }
    }

    const mergedSchemes = Array.from(schemeMap.values());
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCHEMES, JSON.stringify(mergedSchemes));

    // Merge teacher profile if incoming has values
    if (bundle.teacherProfile) {
      const currentProfile = getTeacherProfile();
      const updatedProfile: TeacherProfile = {
        ...currentProfile,
        schoolName: bundle.teacherProfile.schoolName || currentProfile.schoolName,
        teacherName: bundle.teacherProfile.teacherName || currentProfile.teacherName,
        state: bundle.teacherProfile.state || currentProfile.state,
        defaultDuration: bundle.teacherProfile.defaultDuration || currentProfile.defaultDuration
      };
      saveTeacherProfile(updatedProfile);
    }

    // Merge verified schemes
    if (bundle.verifiedStateSchemes && bundle.verifiedStateSchemes.length > 0) {
      const existingVerified = getVerifiedStateSchemes();
      const verifiedMap = new Map<string, SchemeOfWork>();
      for (const v of existingVerified) {
        verifiedMap.set(v.id, v);
      }
      for (const incomingV of bundle.verifiedStateSchemes) {
        verifiedMap.set(incomingV.id, incomingV);
      }
      localStorage.setItem(
        STORAGE_KEY_VERIFIED_STATE_SCHEMES,
        JSON.stringify(Array.from(verifiedMap.values()))
      );
    }

    return {
      success: true,
      notesCount: notesRestoredCount,
      schemesCount: schemesRestoredCount
    };
  } catch (e) {
    console.error('Failed to restore backup bundle:', e);
    return {
      success: false,
      notesCount: 0,
      schemesCount: 0,
      error: e instanceof Error ? e.message : 'Unknown storage restoration failure'
    };
  }
}

/**
 * Resets user notes and custom schemes to a clean slate.
 */
export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_NOTES);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_SCHEMES);
    localStorage.removeItem(STORAGE_KEY_SEEDED);
  } catch (e) {
    console.error('Failed to clear local data:', e);
  }
}
