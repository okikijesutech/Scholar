import React, { useState, useEffect } from 'react';
import type { ClassLevel, Term, TeacherProfile } from '../types';
import { NIGERIAN_CLASSES, getSubjectsForClass, SAMPLE_SCHEMES_OF_WORK } from '../data/curriculumData';
import { Sparkles, BookOpen, Clock, Calendar, Check, Wand2, UploadCloud } from 'lucide-react';

interface GeneratorTabProps {
  profile: TeacherProfile;
  onGenerate: (params: {
    schoolName: string;
    teacherName: string;
    subject: string;
    classLevel: ClassLevel;
    term: Term;
    week: number;
    topic: string;
    subTopic: string;
    duration: string;
    period: string;
    customInstructions: string;
    apiKey?: string;
  }) => Promise<void>;
  isGenerating: boolean;
  onSelectSample: (id: string) => void;
  onOpenImportModal?: () => void;
}

export const GeneratorTab: React.FC<GeneratorTabProps> = ({
  profile,
  onGenerate,
  isGenerating,
  onSelectSample,
  onOpenImportModal
}) => {
  const [classLevel, setClassLevel] = useState<ClassLevel>('JSS 2');
  const [subject, setSubject] = useState<string>('Basic Science');
  const [term, setTerm] = useState<Term>('1st Term');
  const [week, setWeek] = useState<number>(2);
  const [topic, setTopic] = useState<string>('Living Things (Habitat)');
  const [subTopic, setSubTopic] = useState<string>('Adaptation of Organisms to Aquatic and Desert Habitats');
  const [duration, setDuration] = useState<string>(profile.defaultDuration || '40 Minutes');
  const [period, setPeriod] = useState<string>('1st & 2nd Period (Double)');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [autofillSuccess, setAutofillSuccess] = useState<boolean>(false);

  // Update subjects when class changes
  useEffect(() => {
    const availableSubjects = getSubjectsForClass(classLevel);
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0] || 'Mathematics');
    }
  }, [classLevel]);

  // Handle autofilling from preloaded NERDC schemes
  const handleAutofillFromScheme = () => {
    const foundScheme = SAMPLE_SCHEMES_OF_WORK.find(
      s => s.classLevel === classLevel && s.subject === subject && s.term === term
    );

    if (foundScheme) {
      const weekData = foundScheme.weeks.find(w => w.week === week);
      if (weekData) {
        setTopic(weekData.topic);
        setSubTopic(weekData.subTopic);
        setAutofillSuccess(true);
        setTimeout(() => setAutofillSuccess(false), 2000);
        return;
      }
    }

    // Generic fallback topic
    setTopic(`${subject} Concepts for Week ${week}`);
    setSubTopic(`Detailed applications and exercises`);
    setAutofillSuccess(true);
    setTimeout(() => setAutofillSuccess(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    await onGenerate({
      schoolName: profile.schoolName,
      teacherName: profile.teacherName,
      subject,
      classLevel,
      term,
      week,
      topic,
      subTopic,
      duration,
      period,
      customInstructions,
      apiKey: profile.geminiApiKey
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUBEB & Federal Ministry of Education Format</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Write Inspection-Ready Lesson Notes in Seconds
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6">
            Generate culturally contextualized Nigerian lesson plans aligned with the NERDC Basic and Senior Secondary curricula. Complete with Bloom's behavioral objectives, local instructional aids, and step-by-step procedures.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print to PDF</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export to Word (.docx)</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Generator Form Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-md border border-slate-200">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Lesson Details & Curriculum Parameters</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the fields below or click "Auto-fill from NERDC Scheme" to pull the syllabus directly.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onOpenImportModal && (
              <button
                type="button"
                onClick={onOpenImportModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Scan Scheme (PDF / Photo)</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleAutofillFromScheme}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              {autofillSuccess ? '✓ Scheme Loaded!' : 'Auto-fill from NERDC Scheme'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Class Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Class Level
              </label>
              <select
                value={classLevel}
                onChange={e => setClassLevel(e.target.value as ClassLevel)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                <optgroup label="Primary School (Basic 1 - 6)">
                  {NIGERIAN_CLASSES.filter(c => c.category === 'primary').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Junior Secondary School (JSS 1 - 3)">
                  {NIGERIAN_CLASSES.filter(c => c.category === 'jss').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Senior Secondary School (SSS 1 - 3)">
                  {NIGERIAN_CLASSES.filter(c => c.category === 'sss').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              >
                {getSubjectsForClass(classLevel).map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Term & Week */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Term
                </label>
                <select
                  value={term}
                  onChange={e => setTerm(e.target.value as Term)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Week
                </label>
                <select
                  value={week}
                  onChange={e => setWeek(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>Week {w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Topic and Sub-topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Living Things, Simple Equations, Photosynthesis"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Sub-Topic (Optional)
              </label>
              <input
                type="text"
                value={subTopic}
                onChange={e => setSubTopic(e.target.value)}
                placeholder="e.g. Characteristics of Living Organisms, Solving for x"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Duration & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Lesson Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 40 Minutes, 80 Minutes"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Period on Timetable
              </label>
              <input
                type="text"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                placeholder="e.g. 1st Period (8:00 - 8:40 AM) or Double Period"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Specific Teaching Focus or Context (Optional)</span>
              <span className="text-[11px] text-slate-400 font-normal">e.g. "Focus on local Nigerian market examples", "Include practical lab activity"</span>
            </label>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={e => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus on differentiated learning for pupils who struggle with division; use examples from the farm / market."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-700/25 transition disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Inspection-Ready Lesson Note...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Complete Lesson Note</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Sample Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Preloaded Inspection-Ready Samples</h3>
          <span className="text-xs text-slate-500">Click any sample to explore the standard layout</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Featured CRS Note requested by user */}
          <div
            onClick={() => onSelectSample('sample-crs-jss2-week4')}
            className="cursor-pointer group p-5 rounded-2xl bg-emerald-50/60 border-2 border-emerald-500/40 hover:border-emerald-600 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                JSS 2 (Featured)
              </span>
              <span className="text-xs text-emerald-700 font-semibold">Week 4</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">CRS</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              The Temptation of Jesus Christ: 7 content sections, 3 classroom activities, 11 evaluation questions.
            </p>
          </div>

          <div
            onClick={() => onSelectSample('sample-math-pri4')}
            className="cursor-pointer group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                Primary 4
              </span>
              <span className="text-xs text-slate-400">Week 8</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">Mathematics</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              Multiplication of 2-digit numbers by 2-digit numbers using columnar method & market word problems.
            </p>
          </div>

          <div
            onClick={() => onSelectSample('sample-sci-jss2')}
            className="cursor-pointer group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200">
                JSS 2 (Basic 8)
              </span>
              <span className="text-xs text-slate-400">Week 2</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">Basic Science</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              Living Things: Adaptation of Tilapia fish, Camel, and Cactus to aquatic and desert habitats.
            </p>
          </div>

          <div
            onClick={() => onSelectSample('sample-bio-sss1')}
            className="cursor-pointer group p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 font-semibold text-xs border border-purple-200">
                SSS 1 (Senior)
              </span>
              <span className="text-xs text-slate-400">Week 3</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">Biology</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              The Cell: Cell theory, organelle functions (Mitochondria, Chloroplast), and Plant vs Animal cells.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
