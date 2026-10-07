import React, { useState } from 'react';
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
  Calendar,
  BookOpen
} from 'lucide-react';

interface SchemeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSchemeExtracted: (scheme: SchemeOfWork) => void;
  onOpenSettings: () => void;
}

export const SchemeImportModal: React.FC<SchemeImportModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSchemeExtracted,
  onOpenSettings
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<ClassLevel>('JSS 2');
  const [term, setTerm] = useState<Term>('1st Term');
  const availableSubjects = getSubjectsForClass(classLevel);
  const [subject, setSubject] = useState<string>(availableSubjects[0] || 'Christian Religious Studies');

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [extractedScheme, setExtractedScheme] = useState<SchemeOfWork | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Import Scheme of Work from PDF / Photo</h2>
              <p className="text-[11px] text-emerald-200">Extract 12-week syllabus tables from Ministry documents or photos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-emerald-100 hover:bg-emerald-700/50 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!extractedScheme ? (
            <>
              {/* Document Target Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Class Level
                  </label>
                  <select
                    value={classLevel}
                    onChange={e => {
                      const newC = e.target.value as ClassLevel;
                      setClassLevel(newC);
                      const subjs = getSubjectsForClass(newC);
                      if (!subjs.includes(subject)) {
                        setSubject(subjs[0] || 'Mathematics');
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {NIGERIAN_CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white"
                  >
                    {availableSubjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Term
                  </label>
                  <select
                    value={term}
                    onChange={e => setTerm(e.target.value as Term)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Upload PDF Document or Photo of Scheme (Camera / WhatsApp Picture)
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-6 text-center transition bg-slate-50/50 group">
                  <input
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {selectedFile.type.startsWith('image/') ? (
                        previewUrl ? (
                          <img src={previewUrl} alt="Upload preview" className="w-32 h-24 object-cover rounded-xl shadow-xs border border-slate-200" />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-emerald-600" />
                        )
                      ) : (
                        <FileText className="w-10 h-10 text-blue-600" />
                      )}
                      <div className="text-sm font-bold text-slate-900">{selectedFile.name}</div>
                      <div className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Click or drop another file to change</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        Click to select or drag and drop your file here
                      </div>
                      <p className="text-xs text-slate-500">
                        Supports PDF curriculum documents, scanned pages, or phone camera photos (.jpg, .png, .pdf)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* API Key Check / Warning */}
              {(!profile.geminiApiKey || profile.geminiApiKey.trim().length < 10) && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Gemini API Key Required for AI Document & Photo Vision</p>
                    <p>
                      Scanning images and PDF files uses Google Gemini's multimodal vision engine. Please add your free Gemini API key in Settings (get one free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950">aistudio.google.com</a>).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSettings();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold transition"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Open Settings to Add API Key
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {scanError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                  {scanError}
                </div>
              )}

              {/* Extract Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || isScanning}
                  onClick={handleStartExtraction}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Extracting Weekly Scheme with Vision AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Scan & Extract 12-Week Scheme</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Extracted Weeks Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Extraction Successful!
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 mt-0.5">
                    {extractedScheme.subject} • {extractedScheme.classLevel} ({extractedScheme.term})
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Found {extractedScheme.weeks.length} weeks of topics in your uploaded document.
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>

              {/* List of Extracted Weeks */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {extractedScheme.weeks.map(item => (
                  <div key={item.week} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
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
