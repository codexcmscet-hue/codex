'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { useAuth } from '@/lib/auth';
import { Role, Team, TeamHistoryEntry } from '@codexclub/shared';
import {
  X,
  Trophy,
  Users,
  Award,
  Calendar,
  Rocket,
  Target,
  Clock,
  ShieldCheck,
  UserCheck,
  UserX,
  History,
  TrendingUp,
  AlertCircle,
  Loader2,
  Trash2,
  Archive,
  Edit,
  PlusCircle,
} from 'lucide-react';

interface TeamDetailsModalProps {
  teamId: string;
  onClose: () => void;
  onOpenUpdateScore?: (team: Team) => void;
  onOpenAddMember?: (team: Team) => void;
  onOpenChangeLeader?: (team: Team) => void;
}

export function TeamDetailsModal({
  teamId,
  onClose,
  onOpenUpdateScore,
  onOpenAddMember,
  onOpenChangeLeader,
}: TeamDetailsModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'history'>('overview');

  const canManage = user?.role === Role.ADMIN || user?.role === Role.VOLUNTEER;
  const isAdmin = user?.role === Role.ADMIN;

  const { data: team, isLoading: isTeamLoading } = useQuery<Team>({
    queryKey: ['teamDetails', teamId],
    queryFn: async () => {
      const res = await api.get(`/teams/${teamId}`);
      return res.data.data;
    },
  });

  const { data: history, isLoading: isHistoryLoading } = useQuery<TeamHistoryEntry[]>({
    queryKey: ['teamHistory', teamId],
    queryFn: async () => {
      const res = await api.get(`/teams/${teamId}/history`);
      return res.data.data;
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (confirm('Are you sure you want to remove this member from the team?')) {
        await api.delete(`/teams/${teamId}/members/${memberId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetails', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamHistory', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
    },
  });

  const archiveTeamMutation = useMutation({
    mutationFn: async () => {
      if (confirm('Are you sure you want to archive this team?')) {
        await api.patch(`/teams/${teamId}/archive`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetails', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      onClose();
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      if (confirm('Are you sure you want to permanently delete this team? Members will be unassigned.')) {
        await api.delete(`/teams/${teamId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      onClose();
    },
  });

  if (isTeamLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-[#080d16] border border-[rgba(0,168,255,0.25)] flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#00a8ff]" />
          <span className="text-sm font-mono text-slate-300">Loading team intelligence...</span>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const scoreColor =
    team.score >= 9.0
      ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      : team.score >= 7.5
      ? 'text-[#00c8ff] bg-[rgba(0,200,255,0.12)] border-[rgba(0,200,255,0.3)]'
      : team.score >= 6.0
      ? 'text-[#00a8ff] bg-[rgba(0,168,255,0.1)] border-[rgba(0,168,255,0.25)]'
      : 'text-slate-400 bg-white/5 border-white/10';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#060a10]/95 border border-[rgba(0,168,255,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,168,255,0.15)] overflow-hidden">
        {/* Header Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[radial-gradient(ellipse,rgba(0,168,255,0.2)_0%,transparent_70%)] pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[rgba(0,168,255,0.12)] bg-[#080d16]/80">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[rgba(0,168,255,0.1)] border border-[rgba(0,168,255,0.3)] flex items-center justify-center text-[#00c8ff] shadow-[0_0_15px_rgba(0,168,255,0.2)]">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{team.name}</h2>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    team.status === 'ACTIVE'
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                      : 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30'
                  }`}
                >
                  {team.status}
                </span>
                {team.rank && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.3)] text-[#00c8ff] font-bold">
                    RANK #{team.rank}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Team ID: {team.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons Bar (if Manager/Admin) */}
        {canManage && (
          <div className="relative z-10 px-6 py-2.5 bg-[rgba(0,168,255,0.03)] border-b border-[rgba(0,168,255,0.08)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenUpdateScore?.(team)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg btn-electric text-xs font-semibold shadow-sm"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Update Score (0–10)</span>
              </button>

              <button
                onClick={() => onOpenAddMember?.(team)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,168,255,0.08)] hover:bg-[rgba(0,168,255,0.15)] border border-[rgba(0,168,255,0.25)] text-xs text-slate-200 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5 text-[#00a8ff]" />
                <span>Add Member</span>
              </button>

              <button
                onClick={() => onOpenChangeLeader?.(team)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-yellow-400" />
                <span>Change Leader</span>
              </button>
            </div>

            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => archiveTeamMutation.mutate()}
                  disabled={archiveTeamMutation.isPending}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 text-xs transition-colors"
                  title="Archive Team"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archive</span>
                </button>

                <button
                  onClick={() => deleteTeamMutation.mutate()}
                  disabled={deleteTeamMutation.isPending}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-colors"
                  title="Delete Team"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-4 px-6 pt-3 border-b border-[rgba(0,168,255,0.08)] text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 font-medium transition-all ${
              activeTab === 'overview'
                ? 'border-[#00a8ff] text-[#00c8ff]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-2.5 border-b-2 font-medium transition-all ${
              activeTab === 'members'
                ? 'border-[#00a8ff] text-[#00c8ff]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            MEMBERS ({team.memberCount || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 font-medium transition-all ${
              activeTab === 'history'
                ? 'border-[#00a8ff] text-[#00c8ff]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            AUDIT HISTORY ({history?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Dashboard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[rgba(0,168,255,0.04)] border border-[rgba(0,168,255,0.15)] flex flex-col justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">TEAM CREDIT SCORE</span>
                  <div className="my-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{team.score.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#008cff] to-[#00c8ff] h-1.5 rounded-full"
                      style={{ width: `${Math.min(Math.max(team.score * 10, 0), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[rgba(0,168,255,0.04)] border border-[rgba(0,168,255,0.15)] flex flex-col justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">AVG MEMBER SCORE</span>
                  <div className="my-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-[#00c8ff] font-mono">
                      {(team.averageMemberScore || team.score).toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Aggregate member standing</span>
                </div>

                <div className="p-4 rounded-xl bg-[rgba(0,168,255,0.04)] border border-[rgba(0,168,255,0.15)] flex flex-col justify-between">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">TEAM ROSTER</span>
                  <div className="my-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{team.memberCount || 0}</span>
                    <span className="text-xs text-slate-400">Members</span>
                  </div>
                  <span className="text-[11px] text-slate-400">1 Leader + {Math.max((team.memberCount || 0) - 1, 0)} Peers</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ABOUT THIS TEAM</span>
                <p className="text-sm text-slate-200 leading-relaxed">{team.description}</p>
              </div>

              {/* Flagship Project & Goal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[rgba(0,168,255,0.03)] border border-[rgba(0,168,255,0.1)] space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#00a8ff]">
                    <Rocket className="h-4 w-4" />
                    <span className="uppercase font-semibold">Flagship Project</span>
                  </div>
                  <p className="text-sm font-medium text-white">{team.project || 'General Innovation'}</p>
                </div>

                <div className="p-4 rounded-xl bg-[rgba(0,168,255,0.03)] border border-[rgba(0,168,255,0.1)] space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#00a8ff]">
                    <Target className="h-4 w-4" />
                    <span className="uppercase font-semibold">Semester Goal</span>
                  </div>
                  <p className="text-sm font-medium text-white">{team.goal || 'Complete milestones by semester end'}</p>
                </div>
              </div>

              {/* Leader Highlight */}
              {team.leader && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(0,168,255,0.08)] to-transparent border border-[rgba(0,168,255,0.2)] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-[rgba(0,168,255,0.15)] border border-[rgba(0,168,255,0.3)] flex items-center justify-center font-bold text-sm text-[#00a8ff] shadow-[0_0_10px_rgba(0,168,255,0.2)]">
                      {team.leader.displayName?.[0] || 'L'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm">{team.leader.displayName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-semibold">
                          TEAM LEADER
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        @{team.leader.username} • {team.leader.registrationNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">LEADER SCORE</span>
                    <span className="text-sm font-mono font-bold text-[#00c8ff]">
                      {team.leader.creditScore || 5} / 10
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  TEAM ROSTER ({team.memberCount || 0} TOTAL)
                </span>
                {canManage && (
                  <button
                    onClick={() => onOpenAddMember?.(team)}
                    className="text-xs text-[#00a8ff] hover:text-[#00c8ff] flex items-center space-x-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-[rgba(0,168,255,0.08)] border border-[rgba(0,168,255,0.12)] rounded-xl overflow-hidden bg-[#070b12]/60">
                {/* Leader First */}
                {team.leader && (
                  <div className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors bg-[rgba(0,168,255,0.02)]">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-xs font-bold text-yellow-400">
                        {team.leader.displayName?.[0] || 'L'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">{team.leader.displayName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-semibold">
                            LEADER
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          @{team.leader.username} • {team.leader.registrationNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold text-[#00c8ff] bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] px-2.5 py-1 rounded-lg">
                        Score: {team.leader.creditScore || 5}/10
                      </span>
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {team.members?.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No additional members assigned yet.
                  </div>
                ) : (
                  team.members?.map((m) => (
                    <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-[rgba(0,168,255,0.1)] border border-[rgba(0,168,255,0.25)] flex items-center justify-center text-xs font-bold text-[#00a8ff]">
                          {m.displayName?.[0] || 'M'}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{m.displayName}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            @{m.username} • {m.registrationNumber}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono font-bold text-[#00c8ff] bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] px-2.5 py-1 rounded-lg">
                          Score: {m.creditScore || 5}/10
                        </span>

                        {canManage && (
                          <button
                            onClick={() => removeMemberMutation.mutate(m.id)}
                            disabled={removeMemberMutation.isPending}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                            title="Remove Member from Team"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                AUDIT LOG & SCORE UPDATE TRAIL
              </span>

              {isHistoryLoading ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#00a8ff] mb-2" />
                  Loading audit logs...
                </div>
              ) : history?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No score updates or audit events recorded for this team yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {history?.map((h) => (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] text-[#00c8ff]">
                            {h.action}
                          </span>
                          <span className="text-slate-400">
                            by <strong className="text-white">@{h.actorName || 'system'}</strong> ({h.actorRole || 'SYSTEM'})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(h.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {h.previousValue !== undefined && h.newValue !== undefined && (
                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <span className="text-slate-400">Value:</span>
                          <span className="text-slate-400 line-through">
                            {typeof h.previousValue === 'number' ? h.previousValue.toFixed(1) : String(h.previousValue)}
                          </span>
                          <span className="text-slate-500">→</span>
                          <span className="font-bold text-[#00c8ff]">
                            {typeof h.newValue === 'number' ? h.newValue.toFixed(1) : String(h.newValue)}
                          </span>
                        </div>
                      )}

                      {h.reason && (
                        <div className="text-slate-300 bg-black/40 p-2 rounded-lg font-sans">
                          <span className="text-slate-500 font-mono text-[10px] block uppercase">REASON</span>
                          {h.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
