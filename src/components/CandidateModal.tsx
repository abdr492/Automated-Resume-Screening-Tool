import { X, Sparkles, AlertTriangle, CheckCircle2, Award, Calendar, Copy, Check, Info, AlertCircle, ChevronRight, Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Candidate, ScreeningResult, Job } from "../types";
import { cn } from "../lib/utils";

interface CandidateModalProps {
  candidate: Candidate;
  result?: ScreeningResult;
  job?: Job;
  onClose: () => void;
  onUpdateStatus?: (status: ScreeningResult['manualStatus']) => void;
}

export default function CandidateModal({ candidate, result, job, onClose, onUpdateStatus }: CandidateModalProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = () => {
    const url = window.location.origin + "/candidate/" + candidate.id;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-400 flex items-center justify-center text-indigo-950 font-bold text-lg">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
              <p className="text-sm text-slate-400">{candidate.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-transparent to-teal-400/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-teal-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Candidate Appraisal Summary</h4>
                </div>
                <div className="glass p-6 rounded-2xl border-white/5 italic text-slate-300 leading-relaxed">
                  <span className="text-teal-400 font-bold not-italic mr-2">AI Analysis:</span>
                  {result?.insights || 'Awaiting professional intelligence appraisal for this requisition.'}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-teal-400">
                  <Award className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Extracted Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(result?.skills || []).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white">
                      {skill}
                    </span>
                  ))}
                  {(!result?.skills || result.skills.length === 0) && (
                    <p className="text-sm text-slate-500">No skills identified yet.</p>
                  )}
                </div>
              </section>

              {job && result && (
                <section className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Award className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Competency Alignment Matrix</h4>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Cross-Referenced with Requisition
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.requirements.map((req, i) => {
                      const isFound = result.skills.some(skill => 
                        skill.toLowerCase().includes(req.toLowerCase()) || 
                        req.toLowerCase().includes(skill.toLowerCase())
                      );
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={i} 
                          className="glass p-3 rounded-xl border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "text-xs font-bold uppercase tracking-tighter",
                              isFound ? "text-white" : "text-slate-500"
                            )}>{req}</span>
                            <div className={cn(
                              "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                              isFound ? "bg-teal-400 text-slate-950" : "bg-rose-400/10 text-rose-400"
                            )}>
                              {isFound ? "Aligned" : "Gap"}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: isFound ? "100%" : "0%" }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                                className={cn(
                                  "h-full rounded-full",
                                  isFound ? "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.4)]" : "bg-white/0"
                                )}
                              />
                            </div>
                            <span className={cn(
                              "text-[10px] font-mono",
                              isFound ? "text-teal-400" : "text-slate-600"
                            )}>
                              {isFound ? "1.0" : "0.0"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-teal-400">
                  <Calendar className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Experience Details</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {result?.experience || 'Run AI screening to extract experience highlights.'}
                </p>
              </section>

              {result?.interviewQuestions && result.interviewQuestions.length > 0 && (
                <section className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Tailored Interview Protocol</h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      <Info className="w-3 h-3" />
                      Generated based on Skill Gaps
                    </div>
                  </div>
                  <div className="space-y-4">
                    {result.interviewQuestions.map((q, i) => (
                      <div key={i} className="group/q relative glass p-5 rounded-2xl border-indigo-400/10 hover:border-indigo-400/30 transition-all bg-indigo-400/[0.02]">
                        <button 
                          onClick={() => copyToClipboard(q.question, i)}
                          className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 opacity-0 group-hover/q:opacity-100 transition-opacity hover:bg-white/10"
                          title="Copy question"
                        >
                          {copied === i ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        
                        <p className="text-sm font-bold text-white leading-relaxed pr-8 mb-4">{q.question}</p>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-indigo-400/60 tracking-wider">Strategic Intent:</span>
                            <span className="text-[10px] font-medium text-slate-400 italic">{q.intent}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-indigo-400/60 tracking-wider">Look For:</span>
                            <div className="flex gap-1">
                              {q.expectedKeywords.map((kw, j) => (
                                <span key={j} className="text-[8px] bg-indigo-400/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/20 uppercase font-black">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-8">
              <section className="glass p-6 rounded-3xl border-teal-400/20 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Screening Score</div>
                <div className="text-5xl font-black text-teal-400 mb-2">
                  {result?.score || 0}%
                </div>
                <div className={cn(
                  "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  result?.status === 'highly_qualified' ? "bg-teal-400/20 text-teal-400" : 
                  result?.status === 'qualified' ? "bg-amber-400/20 text-amber-400" :
                  "bg-white/5 text-slate-500"
                )}>
                  {result?.status.replace('_', ' ') || 'UNMATCHED'}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Requirement Checklist</h4>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {result?.mustHaveGaps.length || 0} Gaps Detected
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {job?.requirements.map((req, i) => {
                    const gapDetail = result?.mustHaveGaps.find(gap => 
                      gap.requirement.toLowerCase().includes(req.toLowerCase()) || 
                      req.toLowerCase().includes(gap.requirement.toLowerCase())
                    );
                    const isMissing = !!gapDetail;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className={cn(
                          "flex flex-col p-3 rounded-xl border transition-all space-y-3",
                          isMissing 
                            ? "bg-rose-400/5 border-rose-400/20 shadow-[inset_0_0_20px_rgba(251,113,133,0.05)]" 
                            : "bg-teal-400/5 border-teal-400/20 shadow-[inset_0_0_20px_rgba(45,212,191,0.05)]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center",
                              isMissing ? "bg-rose-400/10 text-rose-400" : "bg-teal-400/10 text-teal-400"
                            )}>
                              {isMissing ? (
                                <X className="w-3 h-3" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                            </div>
                            <span className={cn(
                              "text-xs font-bold uppercase tracking-wider",
                              isMissing ? "text-rose-400" : "text-teal-400"
                            )}>{req}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                              isMissing ? "bg-rose-400/20 text-rose-400" : "bg-teal-400/20 text-teal-400"
                            )}>
                              {isMissing ? "Missing" : "Verified"}
                            </span>
                          </div>
                        </div>

                        {isMissing && (
                          <div className="pl-8 space-y-2 border-l border-rose-400/10 ml-2.5">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-rose-400/60 uppercase tracking-widest">Detail:</p>
                              <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                                "{gapDetail.missingSpecifics}"
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-rose-400/60 uppercase tracking-widest flex items-center gap-1">
                                <AlertCircle className="w-2.5 h-2.5" />
                                Criticality:
                              </p>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                                {gapDetail.impact}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  {!job && result?.mustHaveGaps.map((gap, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 bg-rose-400/5 border border-rose-400/20 rounded-xl text-rose-400">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider">{gap.requirement}</span>
                      </div>
                      <p className="text-[10px] pl-7 opacity-70 italic">"{gap.missingSpecifics}"</p>
                    </div>
                  ))}
                  {result && result.mustHaveGaps.length === 0 && (!job || job.requirements.length === 0) && (
                    <div className="flex items-center gap-3 p-3 bg-teal-400/5 border border-teal-400/10 rounded-xl text-teal-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">All strategic requirements satisfied.</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Status:</span>
            <div className="flex gap-1">
              {[
                { id: 'shortlisted', label: 'Shortlist', color: 'bg-teal-400' },
                { id: 'interview_scheduled', label: 'Interview', color: 'bg-indigo-400' },
                { id: 'rejected', label: 'Reject', color: 'bg-rose-400' },
                { id: 'hired', label: 'Hired', color: 'bg-emerald-400' }
              ].map(status => (
                <button
                  key={status.id}
                  onClick={() => onUpdateStatus?.(status.id as any)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                    result?.manualStatus === status.id 
                      ? `${status.color} text-slate-950 border-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]`
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className={cn(
                "glass-button flex items-center gap-2 transition-all",
                shareCopied ? "text-teal-400 bg-teal-400/5 border-teal-400/20" : "text-slate-400 hover:text-white"
              )}
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Profile</span>
                </>
              )}
            </button>
            <button className="glass-button text-slate-400 hover:text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
