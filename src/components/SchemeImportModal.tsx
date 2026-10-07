import React, { useState, useEffect, useRef } from 'react';
import type { ClassLevel, Term, SchemeOfWork, SchemeWeek, TeacherProfile } from '../types';
import { NIGERIAN_CLASSES, getSubjectsForClass } from '../data/curriculumData';
import {
  extractSchemeFromDocument,
  mergeSchemeWeeks,
  type ExtractionResult
} from '../services/schemeExtractorService';
import { resolveActiveProviderConfig } from '../services/ai/providers';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Settings,
  Plus,
  Trash2,
  Download,
  Upload,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SchemeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSchemeExtracted: (scheme: SchemeOfWork) => void;
  onOpenSettings: () => void;
  initialClassLevel?: ClassLevel;
  initialSubject?: string;
  initialTerm?: Term;
  existingSchemes?: SchemeOfWork[];
}

export const SchemeImportModal: React.FC<SchemeImportModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSchemeExtracted,
  onOpenSettings,
  initialClassLevel = 'JSS 2',
  initialSubject,
  initialTerm = '1st Term',
  existingSchemes = []
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<ClassLevel>(initialClassLevel);
  const [term, setTerm] = useState<Term>(initialTerm);
  const availableSubjects = getSubjectsForClass(classLevel);
  const [subject, setSubject] = useState<string>(initialSubject || availableSubjects[0] || 'Mathematics');

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedWeeks, setExtractedWeeks] = useState<SchemeWeek[]>([]);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [mergeWithExisting, setMergeWithExisting] = useState<boolean>(true);
  const [extractionMeta, setExtractionMeta] = useState<{
    originalSize: number;
    optimizedSize: number;
  } | null>(null);

  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      const activeClass = initialClassLevel || classLevel;
      if (initialClassLevel) setClassLevel(initialClassLevel);
      if (initialTerm) setTerm(initialTerm);
      const subjs = getSubjectsForClass(activeClass);
      if (initialSubject && subjs.includes(initialSubject)) {
        setSubject(initialSubject);
      } else {
        setSubject(subjs[0] || 'Mathematics');
      }
    }
  }

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const activeConfig = resolveActiveProviderConfig(profile);
  const hasValidKey = Boolean(activeConfig.apiKey && activeConfig.apiKey.trim().length > 5);

  const existingMatchingScheme = existingSchemes.find(
    s => s.subject === subject && s.classLevel === classLevel && s.term === term
  );

  const handleModalClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setScanError(null);
    setExtractedWeeks([]);
    setIsReviewing(false);
    setExtractionMeta(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setScanError(null);
      setIsReviewing(false);

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedFile) return;

    if (!hasValidKey) {
      setScanError(`Please configure your ${activeConfig.provider.toUpperCase()} API key in Settings to scan syllabus books.`);
      return;
    }

    try {
      setIsScanning(true);
      setScanError(null);
      const result: ExtractionResult = await extractSchemeFromDocument(
        selectedFile,
        classLevel,
        subject,
        term,
        activeConfig
      );

      setExtractedWeeks(result.scheme.weeks);
      setExtractionMeta({
        originalSize: result.originalSizeBytes,
        optimizedSize: result.optimizedSizeBytes
      });
      setIsReviewing(true);
    } catch (err: unknown) {
      console.error('Scan error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setScanError(msg || 'Failed to scan document. Please check clarity and API connection.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateWeek = (index: number, field: keyof SchemeWeek, value: any) => {
    const updated = [...extractedWeeks];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedWeeks(updated);
  };

  const handleAddWeek = () => {
    const nextWeekNumber = extractedWeeks.length > 0 ? Math.max(...extractedWeeks.map(w => w.week)) + 1 : 1;
    setExtractedWeeks([
      ...extractedWeeks,
      {
        week: nextWeekNumber,
        topic: 'New Topic',
        subTopic: '',
        objectivesSummary: 'Students should be able to...',
        suggestedMaterials: 'Chalkboard, charts, textbook'
      }
    ]);
  };

  const handleDeleteWeek = (index: number) => {
    setExtractedWeeks(extractedWeeks.filter((_, idx) => idx !== index));
  };

  const handleExportJson = () => {
    const schemeToExport: SchemeOfWork = {
      id: existingMatchingScheme?.id || `scheme-${Date.now()}`,
      subject,
      classLevel,
      term,
      weeks: extractedWeeks,
      provenance: {
        provider: activeConfig.provider,
        modelName: activeConfig.model,
        source: 'book_scan',
        capturedAt: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(schemeToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheme_${subject.replace(/\s+/g, '_')}_${classLevel.replace(/\s+/g, '_')}_${term.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed && Array.isArray(parsed.weeks)) {
          if (parsed.subject) setSubject(parsed.subject);
          if (parsed.classLevel) setClassLevel(parsed.classLevel);
          if (parsed.term) setTerm(parsed.term);
          setExtractedWeeks(parsed.weeks);
          setIsReviewing(true);
        } else {
          alert('Invalid scheme JSON format.');
        }
      } catch {
        alert('Failed to parse scheme JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleAcceptAndSave = () => {
    let finalWeeks = extractedWeeks;

    if (existingMatchingScheme && mergeWithExisting) {
      finalWeeks = mergeSchemeWeeks(existingMatchingScheme.weeks, extractedWeeks, true);
    }

    const schemeToSave: SchemeOfWork = {
      id: existingMatchingScheme?.id || `scheme-${Date.now()}`,
      subject,
      classLevel,
      term,
      weeks: finalWeeks,
      provenance: {
        provider: activeConfig.provider,
        modelName: activeConfig.model,
        source: 'book_scan',
        capturedAt: new Date().toISOString()
      }
    };

    onSchemeExtracted(schemeToSave);
    handleModalClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-emerald-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="text-base font-bold">Import &amp; Digitize Scheme of Work</h2>
              <p className="text-[11px] text-emerald-200">
                Snap photos of your physical syllabus book or load an offline JSON backup
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isReviewing ? (
            /* Upload & Configuration Screen */
            <div className="space-y-5">
              {/* Target Class/Subject/Term Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    {NIGERIAN_CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    {availableSubjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Term</label>
                  <select
                    value={term}
                    onChange={e => setTerm(e.target.value as Term)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 text-center transition bg-slate-50/50">
                <input
                  type="file"
                  id="scheme-file-input"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="scheme-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 hover:underline">
                      Click to choose photo or PDF
                    </span>
                    <span className="text-xs text-slate-500"> of your syllabus</span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    Large phone snapshots are automatically compressed down to ~1500px in your browser before upload to save data and speed up extraction.
                  </p>
                </label>
              </div>

              {/* Preview Box */}
              {selectedFile && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium truncate">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="text-[11px] text-emerald-600">
                      ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-emerald-300 shrink-0"
                    />
                  )}
                </div>
              )}

              {/* Active Provider Indicator */}
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>
                    Vision Model: <strong className="capitalize">{activeConfig.provider}</strong> ({activeConfig.model || 'Default'})
                  </span>
                </div>
                {!hasValidKey && (
                  <button
                    type="button"
                    onClick={() => {
                      handleModalClose();
                      onOpenSettings();
                    }}
                    className="text-xs font-bold text-emerald-800 underline flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Configure API Key
                  </button>
                )}
              </div>

              {/* Error Box */}
              {scanError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>{scanError}</p>
                </div>
              )}

              {/* Action Buttons & JSON Backup */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={jsonFileInputRef}
                    accept="application/json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => jsonFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Load JSON Backup</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStartExtraction}
                    disabled={!selectedFile || isScanning}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2 text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isScanning ? 'Scanning Book...' : 'Extract Weeks with Vision'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Editable Review Grid Screen */
            <div className="space-y-4">
              {/* Header Banner with Compression Stats */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Extracted {extractedWeeks.length} Weeks for {subject} ({classLevel})
                  </span>
                </div>
                {extractionMeta && extractionMeta.originalSize > extractionMeta.optimizedSize && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                    Image optimized: {Math.round(extractionMeta.originalSize / 1024)}KB &rarr; {Math.round(extractionMeta.optimizedSize / 1024)}KB in browser
                  </span>
                )}
              </div>

              {/* Merge with Existing Weeks Toggle */}
              {existingMatchingScheme && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-medium">
                    <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Existing scheme found ({existingMatchingScheme.weeks.length} weeks). Merge incoming weeks?
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={mergeWithExisting}
                      onChange={e => setMergeWithExisting(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Merge by week</span>
                  </label>
                </div>
              )}

              {/* Editable Table */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {extractedWeeks.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800">Week:</span>
                        <input
                          type="number"
                          value={item.week}
                          onChange={e => handleUpdateWeek(idx, 'week', Number(e.target.value))}
                          className="w-14 rounded-lg border border-slate-300 px-2 py-1 text-center font-bold text-xs bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteWeek(idx)}
                        className="text-slate-400 hover:text-red-600 transition p-1"
                        title="Delete week"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Topic</label>
                        <input
                          type="text"
                          value={item.topic}
                          onChange={e => handleUpdateWeek(idx, 'topic', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Sub-Topic</label>
                        <input
                          type="text"
                          value={item.subTopic}
                          onChange={e => handleUpdateWeek(idx, 'subTopic', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Objectives</label>
                        <input
                          type="text"
                          value={item.objectivesSummary}
                          onChange={e => handleUpdateWeek(idx, 'objectivesSummary', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Teaching Aids / Materials</label>
                        <input
                          type="text"
                          value={item.suggestedMaterials}
                          onChange={e => handleUpdateWeek(idx, 'suggestedMaterials', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Week Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleAddWeek}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Week</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export JSON Backup</span>
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  &larr; Back to Upload
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAndSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Save Scheme to App Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
