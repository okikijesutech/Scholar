import React, { useState } from 'react';
import type { LessonNote } from '../types';
import { exportToDocx, formatAsPlainText } from '../services/exportService';
import { 
  Printer, 
  FileDown, 
  Copy, 
  Save, 
  Edit3, 
  Check, 
  Eye, 
  Sparkles,
  School,
  BookOpen,
  Trash2,
  Bookmark,
  Users,
  Lightbulb,
  CheckCircle2,
  Quote
} from 'lucide-react';

interface LessonPreviewTabProps {
  note: LessonNote | null;
  onSaveNote: (note: LessonNote) => void;
  onNewNote: () => void;
}

export const LessonPreviewTab: React.FC<LessonPreviewTabProps> = ({
  note: initialNote,
  onSaveNote,
  onNewNote
}) => {
  const [note, setNote] = useState<LessonNote | null>(initialNote);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);

  React.useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto my-16 bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">No Lesson Note Selected</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Generate a new lesson note from the Generator tab, or choose one from your Saved Notes library.
          </p>
        </div>
        <button
          onClick={onNewNote}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 text-sm font-bold shadow-md transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Go to Generator</span>
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(note);
    } catch (err) {
      console.error('Docx export failed:', err);
      alert('Export to Word failed. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const text = formatAsPlainText(note);
      await navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSave = () => {
    onSaveNote(note);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Editing helpers
  const handleObjectiveChange = (index: number, val: string) => {
    const updated = [...note.behavioralObjectives];
    updated[index] = val;
    setNote({ ...note, behavioralObjectives: updated });
  };

  const handleAddObjective = () => {
    setNote({
      ...note,
      behavioralObjectives: [...note.behavioralObjectives, 'Explain the key aspects of the topic.']
    });
  };

  const handleRemoveObjective = (index: number) => {
    setNote({
      ...note,
      behavioralObjectives: note.behavioralObjectives.filter((_, i) => i !== index)
    });
  };

  const handleSectionBodyChange = (index: number, val: string) => {
    const updated = [...(note.contentSections || [])];
    updated[index] = { ...updated[index], body: val };
    setNote({ ...note, contentSections: updated });
  };

  const handleSectionHeadingChange = (index: number, val: string) => {
    const updated = [...(note.contentSections || [])];
    updated[index] = { ...updated[index], heading: val };
    setNote({ ...note, contentSections: updated });
  };

  const handleEvaluationChange = (index: number, val: string) => {
    const updated = [...note.evaluation];
    updated[index] = val;
    setNote({ ...note, evaluation: updated });
  };

  const handleAddEvaluation = () => {
    setNote({
      ...note,
      evaluation: [...note.evaluation, 'Explain the main point of the lesson.']
    });
  };

  const handleRemoveEvaluation = (index: number) => {
    setNote({
      ...note,
      evaluation: note.evaluation.filter((_, i) => i !== index)
    });
  };

  const handleStepChange = (index: number, field: 'title' | 'teacherActivity' | 'studentActivity', val: string) => {
    const updatedSteps = [...note.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: val };
    setNote({ ...note, steps: updatedSteps });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Floating Action Bar (Hidden during Print) */}
      <div className="no-print sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode:</span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isEditing ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? 'Inspection View' : 'Edit Note Content'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>

          {/* Word Download */}
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExportingDocx ? 'Generating DOCX...' : 'Download Word (.docx)'}</span>
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSuccess ? 'Copied Full Note!' : 'Copy Formatted Text'}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved!' : 'Save Note'}</span>
          </button>
        </div>
      </div>

      {/* Official Inspection Lesson Note Sheet */}
      <div className="print-container bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-xl space-y-7 text-slate-900">
        
        {/* School Header Banner */}
        <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-extrabold uppercase tracking-widest">
            <School className="w-4 h-4" />
            <span>Federal Republic of Nigeria • Ministry of Education / SUBEB Format</span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={note.schoolName}
              onChange={e => setNote({ ...note, schoolName: e.target.value })}
              className="text-xl sm:text-2xl font-black text-center w-full uppercase border-b border-dashed border-emerald-500 py-1"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              {note.schoolName}
            </h1>
          )}

          <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            {note.subject} – {note.classLevel}
          </div>

          <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {note.term} • Week {note.week} Lesson Note
          </div>
        </div>

        {/* Administrative Metadata Table */}
        <div className="overflow-x-auto">
          <table className="print-table w-full border-collapse border border-slate-900 text-xs sm:text-sm">
            <tbody>
              <tr>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold w-1/6">Teacher's Name:</td>
                <td className="border border-slate-900 p-2 w-2/6">
                  {isEditing ? (
                    <input
                      type="text"
                      value={note.teacherName}
                      onChange={e => setNote({ ...note, teacherName: e.target.value })}
                      className="w-full border rounded px-2 py-0.5"
                    />
                  ) : (
                    note.teacherName
                  )}
                </td>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold w-1/6">Subject:</td>
                <td className="border border-slate-900 p-2 w-2/6 font-semibold">
                  {note.subject}
                </td>
              </tr>

              <tr>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Class Level:</td>
                <td className="border border-slate-900 p-2 font-semibold">{note.classLevel}</td>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Term & Week:</td>
                <td className="border border-slate-900 p-2">{note.term} • Week {note.week}</td>
              </tr>

              <tr>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Date:</td>
                <td className="border border-slate-900 p-2">{note.date}</td>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Duration:</td>
                <td className="border border-slate-900 p-2">{note.duration}</td>
              </tr>

              <tr>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Period:</td>
                <td className="border border-slate-900 p-2">{note.period}</td>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Average Age:</td>
                <td className="border border-slate-900 p-2">{note.averageAge}</td>
              </tr>

              <tr>
                <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Topic:</td>
                <td colSpan={3} className="border border-slate-900 p-2 font-bold text-slate-900 text-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      value={note.topic}
                      onChange={e => setNote({ ...note, topic: e.target.value })}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    note.topic
                  )}
                </td>
              </tr>

              {note.subTopic && (
                <tr>
                  <td className="border border-slate-900 bg-slate-100 p-2 font-bold">Sub-Topic:</td>
                  <td colSpan={3} className="border border-slate-900 p-2 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={note.subTopic}
                        onChange={e => setNote({ ...note, subTopic: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      note.subTopic
                    )}
                  </td>
                </tr>
              )}

              {note.references && (
                <tr>
                  <td className="border border-slate-900 bg-slate-100 p-2 font-bold">References / Passages:</td>
                  <td colSpan={3} className="border border-slate-900 p-2 font-semibold text-emerald-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={note.references}
                        onChange={e => setNote({ ...note, references: e.target.value })}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      note.references
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Learning Objectives */}
        <section className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 no-print" />
              <span>Learning Objectives</span>
            </h2>
            {isEditing && (
              <button
                onClick={handleAddObjective}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold hover:bg-emerald-200"
              >
                + Add Objective
              </button>
            )}
          </div>
          <p className="text-xs italic text-slate-600">
            By the end of the lesson, students should be able to:
          </p>

          <ol className="space-y-1.5 list-decimal list-inside text-xs sm:text-sm pl-2">
            {note.behavioralObjectives.map((obj, index) => (
              <li key={index} className="leading-relaxed">
                {isEditing ? (
                  <div className="inline-flex items-center gap-2 w-11/12 ml-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={e => handleObjectiveChange(index, e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => handleRemoveObjective(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span>{obj}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Previous Knowledge & Teaching Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
              Previous Knowledge / Entry Behaviour
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-2">
              {note.previousKnowledge}
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
              Instructional Materials / Teaching Aids
            </h2>
            <ul className="text-xs sm:text-sm space-y-1 pl-2 list-disc list-inside text-slate-800">
              {note.instructionalMaterials.map((mat, i) => (
                <li key={i}>{mat}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* FULL LESSON CONTENT (The Core Lecture & Teaching Text) */}
        {note.contentSections && note.contentSections.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
              <Bookmark className="w-4 h-4 text-emerald-800 no-print" />
              <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-950">
                Lesson Content
              </h2>
            </div>

            <div className="space-y-5">
              {note.contentSections.map((section, idx) => (
                <div key={idx} className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                      {section.sectionNumber}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={section.heading}
                        onChange={e => handleSectionHeadingChange(idx, e.target.value)}
                        className="flex-1 font-bold text-sm sm:text-base border border-slate-300 rounded px-2 py-1"
                      />
                    ) : (
                      <h3 className="text-sm sm:text-base font-bold text-slate-950">
                        {section.heading}
                      </h3>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={section.body}
                      onChange={e => handleSectionBodyChange(idx, e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded p-2"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-8">
                      {section.body}
                    </p>
                  )}

                  {section.subPoints && section.subPoints.length > 0 && (
                    <ul className="text-xs sm:text-sm space-y-1.5 pl-12 list-disc text-slate-800">
                      {section.subPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  )}

                  {section.lessonTakeaway && (
                    <div className="ml-8 mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                      <span className="font-bold text-emerald-800">Lesson from this section: </span>
                      {section.lessonTakeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CLASSROOM ACTIVITIES */}
        {note.classroomActivities && note.classroomActivities.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
              <Users className="w-4 h-4 text-emerald-800 no-print" />
              <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-950">
                Classroom Activities
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {note.classroomActivities.map((act, aIdx) => (
                <div key={aIdx} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-emerald-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-4">
                    {act.description}
                  </p>
                  {act.items && act.items.length > 0 && (
                    <ul className="text-xs sm:text-sm space-y-1 pl-8 list-disc text-slate-700">
                      {act.items.map((item, itIdx) => (
                        <li key={itIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Presentation Steps Table */}
        <section className="space-y-2 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
            Instructional Presentation Procedure
          </h2>

          <div className="overflow-x-auto">
            <table className="print-table w-full border-collapse border border-slate-900 text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-950">
                  <th className="border border-slate-900 p-2 text-left w-16">Step</th>
                  <th className="border border-slate-900 p-2 text-left w-1/4">Stage & Focus</th>
                  <th className="border border-slate-900 p-2 text-left w-2/5">Teacher's Activity</th>
                  <th className="border border-slate-900 p-2 text-left">Pupils' / Students' Activity</th>
                </tr>
              </thead>
              <tbody>
                {note.steps.map((step, index) => (
                  <tr key={index}>
                    <td className="border border-slate-900 p-2 font-bold text-center align-top">
                      Step {step.stepNumber}
                      {step.durationMinutes && (
                        <div className="text-[10px] text-slate-500 font-normal">({step.durationMinutes}m)</div>
                      )}
                    </td>

                    <td className="border border-slate-900 p-2 font-semibold align-top text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => handleStepChange(index, 'title', e.target.value)}
                          className="w-full border rounded px-1.5 py-0.5 text-xs font-semibold"
                        />
                      ) : (
                        step.title
                      )}
                    </td>

                    <td className="border border-slate-900 p-2 align-top text-slate-800 leading-relaxed">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={step.teacherActivity}
                          onChange={e => handleStepChange(index, 'teacherActivity', e.target.value)}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        step.teacherActivity
                      )}
                    </td>

                    <td className="border border-slate-900 p-2 align-top text-slate-800 leading-relaxed">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={step.studentActivity}
                          onChange={e => handleStepChange(index, 'studentActivity', e.target.value)}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        step.studentActivity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Evaluation Questions */}
        <section className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">
              Evaluation Questions
            </h2>
            {isEditing && (
              <button
                onClick={handleAddEvaluation}
                className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold hover:bg-emerald-200"
              >
                + Add Question
              </button>
            )}
          </div>

          <ol className="space-y-1.5 list-decimal list-inside text-xs sm:text-sm pl-2">
            {note.evaluation.map((q, index) => (
              <li key={index} className="leading-relaxed">
                {isEditing ? (
                  <div className="inline-flex items-center gap-2 w-11/12 ml-2">
                    <input
                      type="text"
                      value={q}
                      onChange={e => handleEvaluationChange(index, e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => handleRemoveEvaluation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span>{q}</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Summary & Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
              Summary & Wrap-Up
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-2">
              {note.summary}
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
              Assignment
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-2 whitespace-pre-line">
              {note.assignment}
            </p>
          </section>
        </div>

        {/* Key Scripture / Core Rule Banner */}
        {note.keyScriptureOrCoreRule && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
            <Quote className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Key Scripture / Core Memory Principle
              </span>
              <p className="text-sm sm:text-base font-semibold text-emerald-950 mt-0.5">
                {note.keyScriptureOrCoreRule}
              </p>
            </div>
          </div>
        )}

        {/* Quality Assurance & Vetting */}
        <section className="space-y-2 pt-2 border-t-2 border-slate-900">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">
            Quality Assurance & Vetting Section
          </h2>

          <div className="overflow-x-auto">
            <table className="print-table w-full border-collapse border border-slate-900 text-xs sm:text-sm">
              <tbody>
                <tr>
                  <td className="border border-slate-900 bg-slate-100 p-2 font-bold w-1/4">Teacher's Remarks:</td>
                  <td colSpan={3} className="border border-slate-900 p-2 italic text-slate-700">
                    {note.teacherRemarks || 'Objectives were satisfactorily achieved by learners.'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-900 bg-slate-100 p-2 font-bold">HOD / VP Remarks:</td>
                  <td colSpan={3} className="border border-slate-900 p-2 italic text-slate-700">
                    {note.hodRemarks || 'Approved for classroom presentation.'}
                  </td>
                </tr>
                <tr className="h-20">
                  <td className="border border-slate-900 p-2 text-center align-bottom">
                    <div className="border-t border-slate-400 pt-1 text-[11px] font-bold">
                      Teacher's Signature & Date
                    </div>
                  </td>
                  <td className="border border-slate-900 p-2 text-center align-bottom">
                    <div className="border-t border-slate-400 pt-1 text-[11px] font-bold">
                      HOD's Signature & Date
                    </div>
                  </td>
                  <td className="border border-slate-900 p-2 text-center align-bottom">
                    <div className="border-t border-slate-400 pt-1 text-[11px] font-bold">
                      VP (Academics) Signature
                    </div>
                  </td>
                  <td className="border border-slate-900 p-2 text-center align-bottom">
                    <div className="border-t border-slate-400 pt-1 text-[11px] font-bold">
                      Principal's Stamp & Date
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};
