import React, { useState, useRef } from 'react';
import {
  X,
  HardDriveDownload,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  BookOpen,
  RefreshCw,
  Trash2
} from 'lucide-react';
import {
  downloadBackupFile,
  parseAndValidateBackup,
  restoreBackupBundle,
  clearAllLocalData,
  type RestoreResult,
  type BackupBundle
} from '../../services/backupService';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
  currentNotesCount: number;
  currentSchemesCount: number;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
  currentNotesCount,
  currentSchemesCount
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'restore'>('export');
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedBundle, setParsedBundle] = useState<BackupBundle | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const success = downloadBackupFile();
    if (success) {
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 4000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParseError(null);
    setRestoreResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const val = parseAndValidateBackup(content);
      if (val.success && val.bundle) {
        setParsedBundle(val.bundle);
      } else {
        setParsedBundle(null);
        setParseError(val.error || 'Failed to parse backup file');
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read selected file from device');
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!parsedBundle) return;
    setIsRestoring(true);
    const result = restoreBackupBundle(parsedBundle, restoreMode);
    setIsRestoring(false);
    setRestoreResult(result);

    if (result.success && onDataRestored) {
      onDataRestored();
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to clear your local lesson notes? Make sure you have downloaded a backup first!')) {
      clearAllLocalData();
      if (onDataRestored) {
        onDataRestored();
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Data Safety &amp; Portability
              </h2>
              <p className="text-xs text-slate-500">
                Backup, transfer across devices, or restore your lesson notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Download Backup</span>
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'restore'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Restore / Transfer</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Saved Notes</span>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {currentNotesCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Custom Schemes</span>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {currentSchemesCount}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Privacy &amp; Data Ownership</span>
                </p>
                <p className="text-emerald-800">
                  Your notes and schemes are saved in your local browser storage. Downloading a backup ensures you never lose your work if your browser history is cleared, and lets you transfer your notes to another laptop or phone anytime.
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>Download LessonFlow Backup (.json)</span>
              </button>

              {hasDownloaded && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold text-center border border-emerald-300 animate-in fade-in">
                  ✓ Backup file downloaded successfully! Keep it safe on your Google Drive or phone.
                </div>
              )}
            </div>
          )}

          {activeTab === 'restore' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30"
              >
                <UploadCloud className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Select or drop LessonFlow backup JSON file'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click to select backup file from your device
                </p>
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {parsedBundle && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Backup Verified</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {new Date(parsedBundle.exportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Notes in Backup</span>
                      <strong className="text-slate-900">{parsedBundle.notes.length}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Schemes in Backup</span>
                      <strong className="text-slate-900">{parsedBundle.customSchemes.length}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-800 block">Restore Strategy:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRestoreMode('merge')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition ${
                          restoreMode === 'merge'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Merge with Existing
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                          Keeps existing notes, adds new ones.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRestoreMode('replace')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition ${
                          restoreMode === 'replace'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Replace Library
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                          Overwrites all notes with backup.
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteRestore}
                    disabled={isRestoring}
                    className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                    <span>Confirm &amp; Restore Library</span>
                  </button>
                </div>
              )}

              {restoreResult && (
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  restoreResult.success
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {restoreResult.success ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Restore complete! Added/updated {restoreResult.notesCount} notes and {restoreResult.schemesCount} schemes.
                      </span>
                    </div>
                  ) : (
                    <span>Failed to restore: {restoreResult.error}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={handleResetData}
            className="text-red-600 hover:text-red-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Data</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200/60 text-slate-700 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
