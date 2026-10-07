import React, { useState } from 'react';
import type { TeacherProfile } from '../types';
import { X, Save, Key, School, User, Clock, CheckCircle } from 'lucide-react';

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

  if (!isOpen) return null;

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
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <School className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">School & Teacher Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700/50 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              School Name (Appears on exported notes)
            </label>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
              placeholder="e.g. King's College, Lagos"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Teacher's Name
            </label>
            <input
              type="text"
              required
              value={formData.teacherName}
              onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
              placeholder="e.g. Mr. Babatunde Alabi"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Default Lesson Duration
            </label>
            <select
              value={formData.defaultDuration}
              onChange={e => setFormData({ ...formData, defaultDuration: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="35 Minutes">35 Minutes (Primary)</option>
              <option value="40 Minutes">40 Minutes (Standard Single Period)</option>
              <option value="80 Minutes">80 Minutes (Double Period / Practical)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              Google Gemini API Key (Optional)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              The tool includes a complete built-in Nigerian curriculum generator that works 100% offline. Adding your Gemini API key unlocks advanced AI custom prompt modifications.
            </p>
            <input
              type="password"
              value={formData.geminiApiKey || ''}
              onChange={e => setFormData({ ...formData, geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

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
