import { useState } from 'react';
import confetti from 'canvas-confetti';
import type { TabType } from './components/Navbar';
import { Navbar } from './components/Navbar';
import { GeneratorTab } from './components/GeneratorTab';
import { SchemeBrowserTab } from './components/SchemeBrowserTab';
import { LessonPreviewTab } from './components/LessonPreviewTab';
import { SavedNotesTab } from './components/SavedNotesTab';
import { SettingsModal } from './components/SettingsModal';
import { SchemeImportModal } from './components/SchemeImportModal';
import { AdminCollationModal } from './components/admin/AdminCollationModal';
import { BackupModal } from './components/backup/BackupModal';
import { EduFlowsSyncModal } from './components/modals/EduFlowsSyncModal';
import { isEduFlowsConnected, getStoredUser } from './services/eduflowsClient';
import type { LessonNote, TeacherProfile, ClassLevel, Term, SchemeOfWork, GenerationParams } from './types';
import { generateLessonNote } from './services/aiGenerator';
import { resolveActiveProviderConfig } from './services/ai/providers';
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
  const [notes, setNotes] = useState<LessonNote[]>(() => getStoredNotes());
  const [activeNote, setActiveNote] = useState<LessonNote | null>(() => {
    const loadedNotes = getStoredNotes();
    return loadedNotes.length > 0 ? loadedNotes[0] : null;
  });
  const [profile, setProfile] = useState<TeacherProfile>(() => getTeacherProfile());
  const [customSchemes, setCustomSchemes] = useState<SchemeOfWork[]>(() => getCustomSchemes());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isAdminCollationOpen, setIsAdminCollationOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isEduFlowsSyncOpen, setIsEduFlowsSyncOpen] = useState<boolean>(false);
  const [verifiedVersion, setVerifiedVersion] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [importModalParams, setImportModalParams] = useState<{
    classLevel?: ClassLevel;
    subject?: string;
    term?: Term;
  }>({});

  const handleOpenImportModal = (classLevel?: ClassLevel, subject?: string, term?: Term) => {
    setImportModalParams({ classLevel, subject, term });
    setIsImportModalOpen(true);
  };

  // Handle generating note
  const handleGenerate = async (params: GenerationParams) => {
    try {
      setIsGenerating(true);
      const generated = await generateLessonNote(params);
      
      // Save and set active
      const saveRes = saveNote(generated);
      if (!saveRes.success) {
        console.warn('Note generated but failed to persist to local storage:', saveRes.error);
      }
      const updatedNotes = getStoredNotes();
      setNotes(updatedNotes);
      setActiveNote(generated);
      
      // Trigger subtle celebration (canvas will be automatically hidden if user prints immediately)
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
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
    subTopic: string,
    objectivesSummary?: string,
    suggestedMaterials?: string
  ) => {
    const providerConfig = resolveActiveProviderConfig(profile);
    const customInstructions = [
      objectivesSummary ? `Specific Syllabus Objectives: ${objectivesSummary}` : '',
      suggestedMaterials ? `Prescribed Teaching Aids / Materials: ${suggestedMaterials}` : '',
      'Strictly ground lesson content in these captured syllabus objectives and teaching aids.'
    ].filter(Boolean).join('\n');

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
      customInstructions,
      apiKey: providerConfig.apiKey,
      providerConfig
    });
  };

  const handleSaveNote = (noteToSave: LessonNote): boolean => {
    const res = saveNote(noteToSave);
    if (!res.success) {
      alert(`Could not save lesson note: ${res.error || 'Storage quota exceeded or storage unavailable.'}`);
      return false;
    }
    setActiveNote(noteToSave);
    setNotes(getStoredNotes());
    return true;
  };

  const handleDuplicateNote = (noteToDup: LessonNote) => {
    const duplicated = duplicateNote(noteToDup);
    if (!duplicated) {
      alert('Could not duplicate note: browser storage is full or unavailable.');
      return;
    }
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
    } catch {
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

  const handleDataRestored = () => {
    const updatedNotes = getStoredNotes();
    const updatedSchemes = getCustomSchemes();
    const updatedProfile = getTeacherProfile();
    setNotes(updatedNotes);
    setCustomSchemes(updatedSchemes);
    setProfile(updatedProfile);
    if (updatedNotes.length > 0) {
      setActiveNote(updatedNotes[0]);
    } else {
      setActiveNote(null);
    }
    setVerifiedVersion(v => v + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedNotesCount={notes.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewNote={handleNewNote}
        hasActiveNote={!!activeNote}
        onOpenAdminCollation={() => setIsAdminCollationOpen(true)}
        onOpenEduFlowsSync={() => setIsEduFlowsSyncOpen(true)}
        isEduFlowsConnected={isEduFlowsConnected()}
        schoolName={getStoredUser()?.schoolName}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'generator' && (
          <GeneratorTab
            profile={profile}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onSelectSample={handleSelectSample}
            onOpenImportModal={handleOpenImportModal}
          />
        )}

        {activeTab === 'scheme' && (
          <SchemeBrowserTab
            key={`scheme-${verifiedVersion}`}
            onSelectWeekToGenerate={handleSelectWeekToGenerate}
            customSchemes={customSchemes}
            onOpenImportModal={handleOpenImportModal}
            onDeleteCustomScheme={handleDeleteCustomScheme}
            profile={profile}
            onBatchComplete={newNotes => {
              const updated = getStoredNotes();
              setNotes(updated);
              if (newNotes.length > 0) {
                setActiveNote(newNotes[0]);
                setActiveTab('library');
              }
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'preview' && (
          <LessonPreviewTab
            key={activeNote?.id ?? 'empty'}
            note={activeNote}
            onSaveNote={handleSaveNote}
            onNewNote={handleNewNote}
            profile={profile}
            onOpenSettings={() => setIsSettingsOpen(true)}
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
            onOpenBackup={() => setIsBackupModalOpen(true)}
            onOpenEduFlowsSync={() => setIsEduFlowsSyncOpen(true)}
            isEduFlowsConnected={isEduFlowsConnected()}
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
        initialClassLevel={importModalParams.classLevel}
        initialSubject={importModalParams.subject}
        initialTerm={importModalParams.term}
        existingSchemes={customSchemes}
      />

      <AdminCollationModal
        isOpen={isAdminCollationOpen}
        onClose={() => setIsAdminCollationOpen(false)}
        onVerifiedSchemesUpdated={() => setVerifiedVersion(v => v + 1)}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={handleDataRestored}
        currentNotesCount={notes.length}
        currentSchemesCount={customSchemes.length}
      />

      <EduFlowsSyncModal
        isOpen={isEduFlowsSyncOpen}
        onClose={() => setIsEduFlowsSyncOpen(false)}
        onSyncComplete={() => {
          setNotes(getStoredNotes());
        }}
      />

      {/* Footer (Hidden during printing) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            LessonFlow • Inspection-Ready Lesson Notes for Nigerian Schools (by EduFlows)
          </p>
          <p className="text-[11px] text-slate-400">
            Aligned with the pedagogical structure of the NERDC Basic Education Curriculum (BEC) &amp; Senior Secondary Education Curriculum (SSEC). Independent educational planning tool; not officially affiliated with or endorsed by NERDC or SUBEB.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
