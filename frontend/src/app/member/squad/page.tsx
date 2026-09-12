'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { TeamLeaderboard } from '@/components/leaderboard/TeamLeaderboard';
import { Team } from '@codexclub/shared';
import {
  Code2,
  Users,
  Target,
  Rocket,
  PlusCircle,
  AlertCircle,
  Loader2,
  Trophy,
  Crown,
  Award,
  Sparkles,
} from 'lucide-react';

export default function MemberSquadPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project: '',
    goal: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: memberData, isLoading: isMemberLoading } = useQuery({
    queryKey: ['memberProfileMe'],
    queryFn: async () => {
      const res = await api.get('/members/me');
      return res.data.data;
    },
  });

  const { data: myTeam, isLoading: isTeamLoading } = useQuery<Team | null>({
    queryKey: ['myTeam'],
    queryFn: async () => {
      try {
        const res = await api.get('/teams/my-team');
        return res.data.data;
      } catch (err) {
        return null;
      }
    },
  });

  const registerSquadMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      await api.post('/teams', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberProfileMe'] });
      queryClient.invalidateQueries({ queryKey: ['memberDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['myTeam'] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to register squad');
    },
  });

  if (isMemberLoading || isTeamLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Team & Squad Central</h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor your team standing, collaborate on flagship projects, and review the club leaderboard rankings.
        </p>
      </div>

      {/* "My Team" Section */}
      {myTeam ? (
        <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
          {/* Ambient Top Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[radial-gradient(circle,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#00a8ff] uppercase tracking-wider font-semibold">
                  YOUR ASSIGNED TEAM
                </span>
                {myTeam.rank && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.3)] text-[#00c8ff] font-bold">
                    RANK #{myTeam.rank}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-1">{myTeam.name}</h2>
            </div>

            <div className="p-3.5 rounded-xl bg-[rgba(0,168,255,0.06)] border border-[rgba(0,168,255,0.2)] text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">TEAM CREDIT SCORE</span>
              <div className="flex items-baseline justify-end space-x-1">
                <span className="text-3xl font-extrabold text-white font-mono">{myTeam.score.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">{myTeam.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00a8ff] uppercase">
                <Rocket className="h-4 w-4" />
                <span>Flagship Project</span>
              </div>
              <div className="text-sm font-semibold text-white">{myTeam.project || 'General Innovation'}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00a8ff] uppercase">
                <Target className="h-4 w-4" />
                <span>Semester Goal</span>
              </div>
              <div className="text-sm font-semibold text-white">{myTeam.goal || 'Complete milestones by semester end'}</div>
            </div>
          </div>

          {/* Roster & Members */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              TEAM ROSTER ({myTeam.memberCount || (myTeam.members?.length || 0) + (myTeam.leader ? 1 : 0)} MEMBERS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Leader Card */}
              {myTeam.leader && (
                <div className="p-3 rounded-xl bg-yellow-400/[0.04] border border-yellow-400/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-xs font-bold text-yellow-400">
                      {myTeam.leader.displayName?.[0] || 'L'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>{myTeam.leader.displayName}</span>
                        <Crown className="h-3 w-3 text-yellow-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        @{myTeam.leader.username}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#00c8ff]">
                    {myTeam.leader.creditScore || 5}/10
                  </span>
                </div>
              )}

              {/* Members */}
              {myTeam.members?.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-full bg-[rgba(0,168,255,0.1)] border border-[rgba(0,168,255,0.25)] flex items-center justify-center text-xs font-bold text-[#00a8ff]">
                      {m.displayName?.[0] || 'M'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{m.displayName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{m.username}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#00c8ff]">
                    {m.creditScore || 5}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="border-dashed border-[rgba(0,168,255,0.25)] text-center py-10">
          <Code2 className="h-12 w-12 text-[#00a8ff]/60 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">You Are Not Currently in a Team</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6">
            Club members collaborate within specialized engineering teams to build software, compete in hackathons, and earn collective team credit scores. Contact a Volunteer or Admin to be added to a team.
          </p>
        </GlassCard>
      )}

      {/* Global Team Leaderboard */}
      <TeamLeaderboard
        title="Club Team Leaderboard"
        subtitle="Ranked deterministically by verified Team Credit Score and member standing."
        showPodium={true}
        limit={50}
        allowCreate={false}
      />
    </div>
  );
}
