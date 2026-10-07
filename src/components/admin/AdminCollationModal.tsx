import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Layers,
  Award,
  Users,
  TrendingUp,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  clusterSchemes,
  promoteClusterToVerifiedStateScheme,
  getVerifiedStateSchemes,
  deleteVerifiedStateScheme,
  type SchemeCluster
} from '../../services/curriculumCollationService';
import { getCustomSchemes } from '../../services/storageService';

interface AdminCollationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifiedSchemesUpdated?: () => void;
}

export const AdminCollationModal: React.FC<AdminCollationModalProps> = ({
  isOpen,
  onClose,
  onVerifiedSchemesUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [promotedSuccessId, setPromotedSuccessId] = useState<string | null>(null);

  // Load uploaded schemes and verified schemes
  const customSchemes = getCustomSchemes();
  const clusters = clusterSchemes(customSchemes);
  const verifiedSchemes = getVerifiedStateSchemes();

  if (!isOpen) return null;

  const handlePromote = (cluster: SchemeCluster) => {
    promoteClusterToVerifiedStateScheme(cluster, 'Super Admin');
    setPromotedSuccessId(cluster.clusterId);
    if (onVerifiedSchemesUpdated) {
      onVerifiedSchemesUpdated();
    }
    setTimeout(() => setPromotedSuccessId(null), 3000);
  };

  const handleDeleteVerified = (schemeId: string) => {
    deleteVerifiedStateScheme(schemeId);
    if (onVerifiedSchemesUpdated) {
      onVerifiedSchemesUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Curriculum Collation &amp; State Verification</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  Super Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Collate teacher syllabus uploads across Nigerian states and establish unified verified curricula.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pending Scheme Clusters ({clusters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'verified'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Official Verified State Schemes ({verifiedSchemes.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Matches are calculated automatically across uploaded schemes.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left">
          {activeTab === 'pending' ? (
            /* Pending Clusters View */
            <div className="space-y-4">
              {clusters.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-700">No Teacher Scheme Uploads Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When teachers take photos of syllabus booklets or upload PDFs in the Scheme Browser, they will appear here grouped by Nigerian state and subject for verification.
                  </p>
                </div>
              ) : (
                clusters.map(cluster => {
                  const isExpanded = expandedClusterId === cluster.clusterId;
                  const isPromoted = promotedSuccessId === cluster.clusterId;

                  return (
                    <div
                      key={cluster.clusterId}
                      className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                    >
                      {/* Cluster Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                              {cluster.state} State
                            </span>
                            <span className="font-bold text-sm text-slate-900">
                              {cluster.classLevel} • {cluster.subject}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">({cluster.term})</span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span>{cluster.uploaderCount} Teacher {cluster.uploaderCount === 1 ? 'Upload' : 'Uploads'}</span>
                            </span>
                            {cluster.uploaderCount > 1 && (
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{Math.round(cluster.averageSimilarity * 100)}% Topic Similarity Match</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedClusterId(isExpanded ? null : cluster.clusterId)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Weeks' : 'Inspect 12 Weeks'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromote(cluster)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                            <span>{isPromoted ? 'Promoted!' : `Promote to ${cluster.state} Unified Scheme`}</span>
                          </button>
                        </div>
                      </div>

                      {/* Expanded Week Breakdown */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Consensus 12-Week Curriculum Schedule:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {cluster.consensusWeeks.map(w => (
                              <div key={w.week} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="font-bold text-emerald-800">Week {w.week}: </span>
                                <span className="font-semibold text-slate-900">{w.topic}</span>
                                {w.subTopic && (
                                  <p className="text-[11px] text-slate-500 mt-0.5">{w.subTopic}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Official Verified Schemes View */
            <div className="space-y-3">
              {verifiedSchemes.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Award className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="font-bold text-sm text-slate-700">No Verified State Schemes Promoted Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Promote pending clusters to officially verify them. Once promoted, all teachers in that state will automatically receive the verified scheme without uploading photos.
                  </p>
                </div>
              ) : (
                verifiedSchemes.map(scheme => (
                  <div
                    key={scheme.id}
                    className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-bold text-[11px]">
                          {scheme.state} State Unified
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {scheme.classLevel} • {scheme.subject} ({scheme.term})
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600">
                        Verified by {scheme.verifiedBy || 'Super Admin'} • {scheme.weeks.length} Weeks Syllabus
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteVerified(scheme.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Remove verified status"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Unified state options are instantly delivered to teachers across all 36 Nigerian states + FCT.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
