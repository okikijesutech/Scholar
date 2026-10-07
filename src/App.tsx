import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { TabType } from './components/Navbar';
import { Navbar } from './components/Navbar';
import { GeneratorTab } from './components/GeneratorTab';
import { SchemeBrowserTab } from './components/SchemeBrowserTab';
import { LessonPreviewTab } from './components/LessonPreviewTab';
import { SavedNotesTab } from './components/SavedNotesTab';
import { SettingsModal } from './components/SettingsModal';
import { SchemeImportModal } from './components/SchemeImportModal';
import type { LessonNote, TeacherProfile, ClassLevel, Term, SchemeOfWork } from './types';
import { generateLessonNote } from './services/aiGenerator';
import { 
  getStoredNotes, 
  saveNote, 
  deleteNote, 
  duplicateNote, 
  getTeacherProfile, 
  saveTeacherProfile,
  getCustomSchemes,
  saveCustomScheme,
  deleteCustomScheme
} from './services/storageService';
import { SAMPLE_LESSON_NOTES } from './data/sampleNotes';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [activeNote, setActiveNote] = useState<LessonNote | null>(null);
  const [profile, setProfile] = useState<TeacherProfile>(getTeacherProfile());
  const [customSchemes, setCustomSchemes] = useState<SchemeOfWork[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedNotes = getStoredNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setActiveNote(loadedNotes[0]);
    }
    setCustomSchemes(getCustomSchemes());
  }, []);

  // Handle generating note
  const handleGenerate = async (params: {
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
  }) => {
    try {
      setIsGenerating(true);
      const generated = await generateLessonNote(params);
      
      // Save and set active
      saveNote(generated);
      const updatedNotes = getStoredNotes();
      setNotes(updatedNotes);
      setActiveNote(generated);
      
      // Trigger subtle celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti fallback
      }

      // Switch to preview
      setActiveTab('preview');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate lesson note. Please check your network or parameters.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Select sample note
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_LESSON_NOTES.find(n => n.id === sampleId);
    if (found) {
      setActiveNote(found);
      setActiveTab('preview');
    }
  };

  // Trigger from Scheme of Work browser
  const handleSelectWeekToGenerate = async (
    classLevel: ClassLevel,
    subject: string,
    term: Term,
    week: number,
    topic: string,
    subTopic: string
  ) => {
    await handleGenerate({
      schoolName: profile.schoolName,
      teacherName: profile.teacherName,
      subject,
      classLevel,
      term,
      week,
      topic,
      subTopic,
      duration: profile.defaultDuration || '40 Minutes',
      period: '1st & 2nd Period',
      customInstructions: 'Aligned with official scheme of work',
      apiKey: profile.geminiApiKey
    });
  };

  const handleSaveNote = (noteToSave: LessonNote) => {
    saveNote(noteToSave);
    setActiveNote(noteToSave);
    setNotes(getStoredNotes());
  };

  const handleDuplicateNote = (noteToDup: LessonNote) => {
    const duplicated = duplicateNote(noteToDup);
    setNotes(getStoredNotes());
    setActiveNote(duplicated);
    setActiveTab('preview');
  };

  const handleDeleteNote = (id: string) => {
    const updated = deleteNote(id);
    setNotes(updated);
    if (activeNote && activeNote.id === id) {
      setActiveNote(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleSaveProfile = (newProfile: TeacherProfile) => {
    setProfile(newProfile);
    saveTeacherProfile(newProfile);
  };

  const handleSchemeExtracted = (newScheme: SchemeOfWork) => {
    saveCustomScheme(newScheme);
    setCustomSchemes(getCustomSchemes());
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
    setActiveTab('scheme');
  };

  const handleDeleteCustomScheme = (id: string) => {
    const updated = deleteCustomScheme(id);
    setCustomSchemes(updated);
  };

  const handleNewNote = () => {
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedNotesCount={notes.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewNote={handleNewNote}
        hasActiveNote={!!activeNote}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <GeneratorTab
            profile={profile}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onSelectSample={handleSelectSample}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

        {activeTab === 'scheme' && (
          <SchemeBrowserTab
            onSelectWeekToGenerate={handleSelectWeekToGenerate}
            customSchemes={customSchemes}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onDeleteCustomScheme={handleDeleteCustomScheme}
          />
        )}

        {activeTab === 'preview' && (
          <LessonPreviewTab
            note={activeNote}
            onSaveNote={handleSaveNote}
            onNewNote={handleNewNote}
          />
        )}

        {activeTab === 'library' && (
          <SavedNotesTab
            notes={notes}
            onOpenNote={n => {
              setActiveNote(n);
              setActiveTab('preview');
            }}
            onDuplicateNote={handleDuplicateNote}
            onDeleteNote={handleDeleteNote}
            onNewNote={handleNewNote}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <SchemeImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        profile={profile}
        onSchemeExtracted={handleSchemeExtracted}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Footer (Hidden during printing) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            NaijaLessonPlan • Designed for Nigerian Primary & Secondary Educators
          </p>
          <p className="text-[11px] text-slate-400">
            Compliant with NERDC Basic Education Curriculum (BEC) & Senior Secondary Education Curriculum (SSEC).
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
