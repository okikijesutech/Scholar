import React, { useState } from 'react';
import {
  X,
  Cloud,
  CloudCheck,
  CloudOff,
  Building2,
  User,
  UploadCloud,
  DownloadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  loginToEduFlows,
  clearEduFlowsSession,
  getStoredUser,
  getStoredToken,
  getEduFlowsBaseUrl,
  setEduFlowsBaseUrl,
  pushNotesToEduFlows,
  fetchNotesFromEduFlows,
  type EduFlowsUser,
} from '../../services/eduflowsClient';
import { getStoredNotes, saveNote } from '../../services/storageService';

interface EduFlowsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const EduFlowsSyncModal: React.FC<EduFlowsSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
}) => {
  const [currentUser, setCurrentUser] = useState<EduFlowsUser | null>(getStoredUser());
  const [serverUrl, setServerUrl] = useState(getEduFlowsBaseUrl());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    message: string;
  }>({ type: 'idle', message: '' });

  if (!isOpen) return null;

  const isConnected = Boolean(getStoredToken() && currentUser);
  const localNotes = getStoredNotes();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      const result = await loginToEduFlows(email, password, serverUrl);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setSyncStatus({
          type: 'success',
          message: `Connected successfully to ${result.user.schoolName}!`,
        });
        if (onSyncComplete) onSyncComplete();
      } else {
        setSyncStatus({
          type: 'error',
          message: result.error || 'Failed to authenticate with EduFlows.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearEduFlowsSession();
    setCurrentUser(null);
    setSyncStatus({
      type: 'idle',
      message: 'Disconnected from EduFlows.',
    });
    if (onSyncComplete) onSyncComplete();
  };

  const handlePushNotes = async () => {
    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      const result = await pushNotesToEduFlows(localNotes);
      if (result.success) {
        setSyncStatus({
          type: 'success',
          message: `Successfully synced ${result.syncedCount} lesson note(s) to EduFlows!`,
        });
        if (onSyncComplete) onSyncComplete();
      } else {
        setSyncStatus({
          type: 'error',
          message: result.errors?.join(', ') || 'Failed to push notes to EduFlows.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePullNotes = async () => {
    setIsLoading(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      const result = await fetchNotesFromEduFlows();
      if (result.success && result.notes) {
        let importedCount = 0;
        result.notes.forEach((note) => {
          saveNote(note);
          importedCount += 1;
        });
        setSyncStatus({
          type: 'success',
          message: `Pulled ${importedCount} lesson note(s) from EduFlows into local workspace!`,
        });
        if (onSyncComplete) onSyncComplete();
      } else {
        setSyncStatus({
          type: 'error',
          message: result.error || 'Failed to pull notes from EduFlows.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Cloud className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                EduFlows Cloud Sync
              </h3>
              <p className="text-xs text-emerald-200">
                School Management & Central Repository Bridge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {syncStatus.message && (
          <div
            className={`px-5 py-3 text-xs flex items-center gap-2 border-b ${
              syncStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : syncStatus.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {syncStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : syncStatus.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : null}
            <span>{syncStatus.message}</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {isConnected && currentUser ? (
            /* Connected State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                    <CloudCheck className="w-4 h-4" />
                    <span>Connected to School Server</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {currentUser.role}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentUser.fullName} ({currentUser.email})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentUser.schoolName}</span>
                  </div>
                </div>

                {(currentUser.assignedClasses.length > 0 ||
                  currentUser.assignedSubjects.length > 0) && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                    {currentUser.assignedClasses.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 text-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                    {currentUser.assignedSubjects.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-teal-100 text-teal-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sync Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePushNotes}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UploadCloud className="w-4 h-4" />
                  )}
                  <span>Push Local Notes ({localNotes.length})</span>
                </button>

                <button
                  onClick={handlePullNotes}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <DownloadCloud className="w-4 h-4" />
                  )}
                  <span>Pull Cloud Notes</span>
                </button>
              </div>

              {/* Disconnect */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <CloudOff className="w-3.5 h-3.5" />
                  <span>Disconnect EduFlows</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Base: {serverUrl}
                </span>
              </div>
            </div>
          ) : (
            /* Logged Out Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                Connect your LessonFlow workspace with EduFlows to backup notes, get HOD approval, and access unified state curriculum.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  EduFlows Server URL
                </label>
                <input
                  type="url"
                  required
                  value={serverUrl}
                  onChange={(e) => {
                    setServerUrl(e.target.value);
                    setEduFlowsBaseUrl(e.target.value);
                  }}
                  placeholder="http://localhost:3000"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Development default: http://localhost:3000 or your school domain.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teacher or Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu.ng"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span>Sign In & Connect EduFlows</span>
              </button>

              <p className="text-center text-[11px] text-slate-500">
                LessonFlow is offline-first. Connecting is optional.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
