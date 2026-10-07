import React, { useState } from 'react';
import type { ClassLevel, Term, SchemeOfWork, TeacherProfile, LessonNote } from '../types';
import { NIGERIAN_CLASSES, SAMPLE_SCHEMES_OF_WORK, getSubjectsForClass } from '../data/curriculumData';
import { BookOpen, Calendar, ArrowRight, Sparkles, UploadCloud, Trash2, CheckCircle2, Layers, ShieldCheck, MapPin } from 'lucide-react';
import { TermBatchModal } from './TermBatchModal';
import { getVerifiedStateScheme, NIGERIAN_STATES } from '../services/curriculumCollationService';

interface SchemeBrowserTabProps {
  onSelectWeekToGenerate: (
    classLevel: ClassLevel,
    subject: string,
    term: Term,
    week: number,
    topic: string,
    subTopic: string,
    objectivesSummary?: string,
    suggestedMaterials?: string
  ) => void;
  customSchemes: SchemeOfWork[];
  onOpenImportModal: (classLevel?: ClassLevel, subject?: string, term?: Term) => void;
  onDeleteCustomScheme: (id: string) => void;
  profile: TeacherProfile;
  onBatchComplete?: (notes: LessonNote[]) => void;
  onOpenSettings?: () => void;
}

export const SchemeBrowserTab: React.FC<SchemeBrowserTabProps> = ({
  onSelectWeekToGenerate,
  customSchemes,
  onOpenImportModal,
  onDeleteCustomScheme,
  profile,
  onBatchComplete,
  onOpenSettings
}) => {
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'Lagos');
  const [classLevel, setClassLevel] = useState<ClassLevel>('Primary 4');
  const [term, setTerm] = useState<Term>('1st Term');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const availableSubjects = getSubjectsForClass(classLevel);
  const [subject, setSubject] = useState<string>('Mathematics');

  const normalizeSubject = (str: string) => str.toLowerCase().replace(/\s*\([a-z0-9&/ ]+\)/g, '').trim();

  // Check custom schemes first, then verified state schemes, then fallback preloaded NERDC schemes
  const customMatch = customSchemes.find(
    s => s.classLevel === classLevel && s.term === term && normalizeSubject(s.subject) === normalizeSubject(subject)
  );

  const verifiedStateMatch = getVerifiedStateScheme(selectedState, classLevel, subject, term);

  const defaultMatch = SAMPLE_SCHEMES_OF_WORK.find(
    s => s.classLevel === classLevel && s.term === term && normalizeSubject(s.subject) === normalizeSubject(subject)
  );

  const currentScheme = customMatch || verifiedStateMatch || defaultMatch;
  const isCustom = !!customMatch;
  const isVerifiedState = !customMatch && !!verifiedStateMatch;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>National Educational Research & Development Council (NERDC)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Standard & Custom Scheme of Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Browse weekly syllabus breakdowns or upload your school's scheme from a PDF or photo.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {currentScheme && (
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Generate Entire Term ({currentScheme.weeks.length} Weeks)</span>
            </button>
          )}

          <button
            onClick={() => onOpenImportModal(classLevel, subject, term)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-emerald-300" />
            <span>Import Scheme from PDF / Photo</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>{st} State</option>
              ))}
            </select>
          </div>

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
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            {NIGERIAN_CLASSES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            {availableSubjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={term}
            onChange={e => setTerm(e.target.value as Term)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>

        {isCustom && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Scanned / Custom Scheme
            </span>
            <button
              onClick={() => {
                if (confirm(`Remove custom scheme for ${subject} (${classLevel})?`)) {
                  onDeleteCustomScheme(customMatch.id);
                }
              }}
              title="Delete custom scheme"
              className="p-1 text-slate-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {isVerifiedState && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Official {selectedState} State Scheme ({verifiedStateMatch?.uploaderCount || 3} Schools Consensus)
            </span>
          </div>
        )}
      </div>

      {/* Scheme Content */}
      {currentScheme ? (
        <div className="space-y-4">
          {isVerifiedState && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Official Unified {selectedState} State Syllabus Loaded
                  </p>
                  <p className="text-emerald-700 text-[11px]">
                    Verified by Super Admin across multiple Nigerian schools in {selectedState}. Inspection-ready for state ministry evaluators.
                  </p>
                </div>
              </div>
              <span className="shrink-0 bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                Admin Verified
              </span>
            </div>
          )}

          <div className="flex items-center justify-between px-2 text-sm text-slate-600 font-medium">
            <span>
              Showing {currentScheme.weeks.length} weeks breakdown for <strong className="text-slate-900">{subject}</strong> ({classLevel} - {term})
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              isVerifiedState
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isCustom
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {isVerifiedState
                ? `Official ${selectedState} State Syllabus`
                : isCustom
                ? 'Imported Document Scheme'
                : 'Official NERDC Syllabus'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentScheme.weeks.map(item => (
              <div
                key={item.week}
                className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition">
                      <Calendar className="w-3 h-3" />
                      Week {item.week}
                    </span>
                    {item.week === 7 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Mid-Term
                      </span>
                    )}
                    {(item.week === 11 || item.week === 12) && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Exam Period
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                    {item.topic}
                  </h3>

                  {item.subTopic && (
                    <p className="text-xs text-slate-500 font-medium mt-1 mb-3">
                      <span className="font-semibold text-slate-700">Sub-Topic:</span> {item.subTopic}
                    </p>
                  )}

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 space-y-1.5">
                    {item.objectivesSummary && (
                      <div>
                        <span className="font-semibold text-slate-700">Expected Outcome:</span> {item.objectivesSummary}
                      </div>
                    )}
                    {item.suggestedMaterials && (
                      <div>
                        <span className="font-semibold text-slate-700">Aids:</span> {item.suggestedMaterials}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onSelectWeekToGenerate(
                      classLevel,
                      subject,
                      term,
                      item.week,
                      item.topic,
                      item.subTopic || '',
                      item.objectivesSummary,
                      item.suggestedMaterials
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white px-3.5 py-2.5 text-xs font-semibold transition group-hover:bg-emerald-700 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Generate Week {item.week} Note</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fallback when no scheme is yet configured for the combination */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Import Scheme for {subject} ({classLevel})</h3>
            <p className="text-xs text-slate-500 mt-1">
              Do you have a PDF curriculum document or a photo of your school's scheme of work for {subject}? You can upload it now and our Vision AI will extract the entire 12-week schedule automatically!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenImportModal(classLevel, subject, term)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import from PDF or Photo</span>
            </button>
            <button
              onClick={() => onSelectWeekToGenerate(classLevel, subject, term, 1, `${subject} Fundamentals`, `Introduction and Principles`)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 px-5 py-2.5 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Write Custom Topic in Generator</span>
            </button>
          </div>
        </div>
      )}

      {currentScheme && (
        <TermBatchModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          scheme={currentScheme}
          profile={profile}
          onBatchComplete={notes => {
            onBatchComplete?.(notes);
          }}
          onOpenSettings={onOpenSettings}
        />
      )}
    </div>
  );
};
