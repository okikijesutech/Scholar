import React, { useState, useEffect } from 'react';
import type { ClassLevel, Term, SchemeOfWork, TeacherProfile } from '../types';
import { NIGERIAN_CLASSES, getSubjectsForClass } from '../data/curriculumData';
import { extractSchemeFromDocument } from '../services/schemeExtractorService';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  BookOpen
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
}

export const SchemeImportModal: React.FC<SchemeImportModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSchemeExtracted,
  onOpenSettings,
  initialClassLevel = 'JSS 2',
  initialSubject,
  initialTerm = '1st Term'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<ClassLevel>(initialClassLevel);
  const [term, setTerm] = useState<Term>(initialTerm);
  const availableSubjects = getSubjectsForClass(classLevel);
  const [subject, setSubject] = useState<string>(initialSubject || availableSubjects[0] || 'Mathematics');

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedScheme, setExtractedScheme] = useState<SchemeOfWork | null>(null);

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

  // Clean up Object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setScanError(null);
    setExtractedScheme(null);
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
      setExtractedScheme(null);

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

    if (!profile.geminiApiKey || profile.geminiApiKey.trim().length < 10) {
      setScanError('Please enter your free Google Gemini API key in Settings to scan and extract schemes from images and PDFs.');
      return;
    }

    try {
      setIsScanning(true);
      setScanError(null);
      const result = await extractSchemeFromDocument(
        selectedFile,
        classLevel,
        subject,
        term,
        profile.geminiApiKey
      );
      setExtractedScheme(result.scheme);
    } catch (err: any) {
      console.error('Scan error:', err);
      setScanError(err.message || 'Failed to scan document. Please check the image/PDF clarity and your Gemini API key.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAcceptAndSave = () => {
    if (extractedScheme) {
      onSchemeExtracted(extractedScheme);
      handleModalClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Scan & Import Scheme of Work</h2>
              <p className="text-xs text-slate-500">Extract 12-week syllabus topics automatically from PDF or phone photo</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata Target Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class Level</label>
              <select
                value={classLevel}
                onChange={e => {
                  const newClass = e.target.value as ClassLevel;
                  setClassLevel(newClass);
                  const subjs = getSubjectsForClass(newClass);
                  if (!subjs.includes(subject)) {
                    setSubject(subjs[0] || 'Mathematics');
                  }
                }}
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2 bg-white"
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
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2 bg-white"
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
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2 bg-white"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
          </div>

          {/* Upload Area */}
          {!extractedScheme && (
            <div className="space-y-4">
              <label className="block">
                <div className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition ${
                  selectedFile ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-emerald-600 bg-slate-50/50'
                }`}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                        {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB • Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 mx-auto flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Drop your syllabus photo or PDF here</p>
                        <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP smartphone photos, or PDF documents</p>
                      </div>
                      <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">
                        Browse Files
                      </span>
                    </div>
                  )}
                </div>
              </label>

              {/* Image Preview if applicable */}
              {previewUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                  <img src={previewUrl} alt="Scheme Preview" className="object-contain h-48 w-full" />
                </div>
              )}

              {/* Gemini API Key Notice */}
              {(!profile.geminiApiKey || profile.geminiApiKey.trim().length < 10) && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Multimodal Vision AI Requires Free Gemini API Key</p>
                    <p className="text-amber-800">
                      To transcribe photo schemes, add your free key from Google AI Studio in Settings.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        handleModalClose();
                        onOpenSettings();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 underline mt-1"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Open Settings to add API Key</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Box */}
              {scanError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>{scanError}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartExtraction}
                  disabled={!selectedFile || isScanning}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-6 py-2.5 text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isScanning ? 'Scanning Scheme with Vision AI...' : 'Start Extraction'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Results Preview */}
          {extractedScheme && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2.5 text-emerald-900 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Successfully Extracted {extractedScheme.weeks.length} Weeks for {extractedScheme.subject} ({extractedScheme.classLevel})</span>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {extractedScheme.weeks.map(item => (
                  <div key={item.week} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="text-emerald-700">Week {item.week}: {item.topic}</span>
                    </div>
                    {item.subTopic && (
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-700">Sub-topic:</span> {item.subTopic}
                      </p>
                    )}
                    {item.objectivesSummary && (
                      <p className="text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-600">Objectives:</span> {item.objectivesSummary}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExtractedScheme(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back / Upload Another
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAndSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 text-xs font-bold shadow-md transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Save to Scheme of Work & Use Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
