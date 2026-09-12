'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { useAuth } from '@/lib/auth';
import { Role, Team, TeamLeaderboardItem } from '@codexclub/shared';
import {
  Trophy,
  Search,
  Users,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  ArrowUpDown,
  Filter,
  Eye,
  PlusCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import { TeamDetailsModal } from '@/components/teams/TeamDetailsModal';
import {
  CreateTeamModal,
  UpdateScoreModal,
  AddMemberModal,
  ChangeLeaderModal,
} from '@/components/teams/TeamActionModals';

interface TeamLeaderboardProps {
  title?: string;
  subtitle?: string;
  showPodium?: boolean;
  limit?: number;
  allowCreate?: boolean;
}

export function TeamLeaderboard({
  title = 'Team Leaderboard',
  subtitle = 'Real-time club team rankings, credit ratings, and competitive engineering standing.',
  showPodium = true,
  limit = 50,
  allowCreate = true,
}: TeamLeaderboardProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'rank' | 'createdAt'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'ARCHIVED' | 'ALL'>('ACTIVE');

  // Modal State
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scoreModalTeam, setScoreModalTeam] = useState<Team | null>(null);
  const [addMemberModalTeam, setAddMemberModalTeam] = useState<Team | null>(null);
  const [changeLeaderModalTeam, setChangeLeaderModalTeam] = useState<Team | null>(null);

  const canManage = user?.role === Role.ADMIN || user?.role === Role.VOLUNTEER;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['teamLeaderboard', search, sortBy, sortOrder, statusFilter, limit],
    queryFn: async () => {
      const res = await api.get('/teams/leaderboard', {
        params: {
          search: search || undefined,
          sortBy,
          sortOrder,
          status: statusFilter,
          limit,
        },
      });
      return res.data;
    },
  });

  const teams: TeamLeaderboardItem[] = data?.data || [];
  const topThree = teams.slice(0, 3);

  const getPodiumStyle = (rank: number) => {
    if (rank === 1) {
      return {
        cardBorder: 'border-yellow-400/40 hover:border-yellow-400/60',
        badgeBg: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
        glow: 'shadow-[0_0_35px_rgba(234,179,8,0.18)]',
        crown: 'text-yellow-400',
        rankText: '1ST PLACE',
        podiumOrder: 'order-1 sm:order-2',
      };
    }
    if (rank === 2) {
      return {
        cardBorder: 'border-[rgba(0,200,255,0.35)] hover:border-[rgba(0,200,255,0.55)]',
        badgeBg: 'bg-[rgba(0,200,255,0.12)] text-[#00c8ff] border-[rgba(0,200,255,0.3)]',
        glow: 'shadow-[0_0_30px_rgba(0,200,255,0.14)]',
        crown: 'text-[#00c8ff]',
        rankText: '2ND PLACE',
        podiumOrder: 'order-2 sm:order-1',
      };
    }
    return {
      cardBorder: 'border-[rgba(0,168,255,0.25)] hover:border-[rgba(0,168,255,0.45)]',
      badgeBg: 'bg-[rgba(0,168,255,0.1)] text-[#00a8ff] border-[rgba(0,168,255,0.25)]',
      glow: 'shadow-[0_0_25px_rgba(0,168,255,0.1)]',
      crown: 'text-[#00a8ff]',
      rankText: '3RD PLACE',
      podiumOrder: 'order-3 sm:order-3',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.3)] flex items-center justify-center text-[#00c8ff] shadow-[0_0_12px_rgba(0,168,255,0.2)]">
              <Trophy className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>

        {/* Action Button */}
        {allowCreate && canManage && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-electric text-xs font-semibold shadow-md transition-all self-start lg:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Team</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#060a10]/80 border border-[rgba(0,168,255,0.15)] backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams by name, project, leader, or members..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-[#05080e] border border-[rgba(0,168,255,0.18)] rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#00a8ff]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="score" className="bg-[#05080e]">Sort by Score</option>
              <option value="name" className="bg-[#05080e]">Sort by Name</option>
              <option value="createdAt" className="bg-[#05080e]">Sort by Date</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-2.5 py-1.5 rounded-xl bg-[#05080e] border border-[rgba(0,168,255,0.18)] text-xs text-slate-300 hover:text-white transition-colors"
            title="Toggle Sort Order"
          >
            {sortOrder === 'desc' ? 'DESC' : 'ASC'}
          </button>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#05080e] border border-[rgba(0,168,255,0.18)] text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="ACTIVE" className="bg-[#05080e]">Active</option>
            <option value="ARCHIVED" className="bg-[#05080e]">Archived</option>
            <option value="ALL" className="bg-[#05080e]">All Status</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium Highlights (if enabled and sufficient teams exist) */}
      {showPodium && topThree.length >= 3 && !search && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {topThree.map((item) => {
            const style = getPodiumStyle(item.rank);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedTeamId(item.id)}
                className={`${style.podiumOrder} cursor-pointer group rounded-2xl p-5 bg-[#060a10]/90 backdrop-blur-xl border ${style.cardBorder} ${style.glow} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
              >
                {/* Background Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${style.badgeBg}`}>
                    {style.rankText}
                  </span>
                  <Crown className={`h-4 w-4 ${style.crown}`} />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00c8ff] transition-colors truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                    <Rocket className="h-3 w-3 text-[#00a8ff]" />
                    <span className="truncate">{item.project || 'General Innovation'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Team Credit Score</span>
                    <span className="font-mono font-extrabold text-white text-base">
                      {item.score.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#008cff] to-[#00c8ff] h-1.5 rounded-full"
                      style={{ width: `${Math.min(Math.max(item.score * 10, 0), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-[rgba(0,168,255,0.15)] flex items-center justify-center text-[10px] font-bold text-[#00a8ff]">
                      {item.leader?.displayName?.[0] || 'L'}
                    </div>
                    <span className="truncate max-w-[100px] text-slate-300">
                      {item.leader?.displayName || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Users className="h-3.5 w-3.5 text-[#00a8ff]" />
                    <span>{item.memberCount} members</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#05080e]/90 border-b border-[rgba(0,168,255,0.15)] text-xs font-mono text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Team & Project</th>
                <th className="px-6 py-4">Team Leader</th>
                <th className="px-6 py-4">Roster</th>
                <th className="px-6 py-4">Avg Member Score</th>
                <th className="px-6 py-4">Team Credit Score</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,168,255,0.06)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="h-7 w-7 animate-spin mx-auto text-[#00a8ff] mb-2" />
                    <span className="text-xs font-mono text-slate-400">Loading leaderboard rankings...</span>
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-xs text-slate-500 font-mono">
                    No teams found matching your query.
                  </td>
                </tr>
              ) : (
                teams.map((team) => {
                  const isTopThree = team.rank <= 3;
                  const rankBadgeClass =
                    team.rank === 1
                      ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                      : team.rank === 2
                      ? 'bg-[rgba(0,200,255,0.12)] text-[#00c8ff] border-[rgba(0,200,255,0.3)]'
                      : team.rank === 3
                      ? 'bg-[rgba(0,168,255,0.1)] text-[#00a8ff] border-[rgba(0,168,255,0.25)]'
                      : 'bg-white/5 text-slate-400 border-white/10';

                  return (
                    <tr
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className="hover:bg-[rgba(0,168,255,0.03)] cursor-pointer transition-colors group"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${rankBadgeClass}`}>
                            {team.rank}
                          </span>
                          {isTopThree && (
                            <Sparkles className="h-3.5 w-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
                          )}
                        </div>
                      </td>

                      {/* Team & Project */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-white group-hover:text-[#00c8ff] transition-colors flex items-center space-x-2">
                            <span>{team.name}</span>
                            {team.status === 'ARCHIVED' && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-700/40 text-zinc-400 border border-zinc-700">
                                ARCHIVED
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                            {team.project || team.description}
                          </div>
                        </div>
                      </td>

                      {/* Leader */}
                      <td className="px-6 py-4">
                        {team.leader ? (
                          <div className="flex items-center space-x-2.5">
                            <div className="h-7 w-7 rounded-full bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] flex items-center justify-center text-xs font-bold text-[#00a8ff]">
                              {team.leader.displayName?.[0] || 'L'}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-200">
                                {team.leader.displayName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                @{team.leader.username}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">Unassigned</span>
                        )}
                      </td>

                      {/* Members */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
                          <Users className="h-3.5 w-3.5 text-[#00a8ff]" />
                          <span>{team.memberCount} members</span>
                        </div>
                      </td>

                      {/* Average Member Score */}
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-slate-300">
                          {(team.averageMemberScore || team.score).toFixed(1)} / 10.0
                        </span>
                      </td>

                      {/* Team Credit Score */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 min-w-[120px]">
                          <div className="flex items-baseline justify-between font-mono">
                            <span className="text-xs font-bold text-white">
                              {team.score.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-500">/ 10.0</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#008cff] to-[#00c8ff] h-1.5 rounded-full"
                              style={{ width: `${Math.min(Math.max(team.score * 10, 0), 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Details button */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTeamId(team.id);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[rgba(0,168,255,0.15)] border border-white/5 hover:border-[rgba(0,168,255,0.3)] text-slate-400 hover:text-[#00c8ff] transition-all"
                            title="Inspect Team Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modals */}
      {selectedTeamId && (
        <TeamDetailsModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          onOpenUpdateScore={(team) => setScoreModalTeam(team)}
          onOpenAddMember={(team) => setAddMemberModalTeam(team)}
          onOpenChangeLeader={(team) => setChangeLeaderModalTeam(team)}
        />
      )}

      {createModalOpen && (
        <CreateTeamModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {scoreModalTeam && (
        <UpdateScoreModal
          team={scoreModalTeam}
          onClose={() => setScoreModalTeam(null)}
          onSuccess={() => refetch()}
        />
      )}

      {addMemberModalTeam && (
        <AddMemberModal
          team={addMemberModalTeam}
          onClose={() => setAddMemberModalTeam(null)}
          onSuccess={() => refetch()}
        />
      )}

      {changeLeaderModalTeam && (
        <ChangeLeaderModal
          team={changeLeaderModalTeam}
          onClose={() => setChangeLeaderModalTeam(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

