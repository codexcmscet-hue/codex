'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { Team } from '@codexclub/shared';
import {
  X,
  Award,
  UserPlus,
  UserCheck,
  PlusCircle,
  AlertCircle,
  Loader2,
  Search,
  Check,
} from 'lucide-react';

/* =========================================================================
   1. CREATE TEAM MODAL
   ========================================================================= */
interface CreateTeamModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateTeamModal({ onClose, onSuccess }: CreateTeamModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project: '',
    goal: '',
    leaderId: '',
    memberIds: [] as string[],
    creditScore: 0,
  });
  const [memberSearch, setMemberSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch available members (unassigned or members in general)
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['availableMembers', memberSearch],
    queryFn: async () => {
      const res = await api.get('/members', {
        params: { search: memberSearch, limit: 50 },
      });
      return res.data.data;
    },
  });

  // Filter only members who are not currently assigned to any team
  const unassignedMembers = (membersData || []).filter(
    (m: any) => !m.squadId && !m.squadName
  );

  const createTeamMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (formData.creditScore < 0 || formData.creditScore > 10) {
        throw new Error('Credit score must be between 0.0 and 10.0');
      }
      const res = await api.post('/teams', {
        ...formData,
        creditScore: Number(formData.creditScore),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['volunteerStats'] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || 'Failed to create team'
      );
    },
  });

  const toggleMemberSelection = (memberId: string) => {
    if (formData.memberIds.includes(memberId)) {
      setFormData({
        ...formData,
        memberIds: formData.memberIds.filter((id) => id !== memberId),
      });
    } else {
      if (formData.memberIds.length >= 10) {
        setError('A team can have at most 10 additional members.');
        return;
      }
      setFormData({
        ...formData,
        memberIds: [...formData.memberIds, memberId],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#060a10]/95 border border-[rgba(0,168,255,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,168,255,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,168,255,0.12)] bg-[#080d16]/80">
          <div className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5 text-[#00a8ff]" />
            <h3 className="text-lg font-bold text-white">Create New Team</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTeamMutation.mutate();
          }}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                TEAM NAME *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Cyber Guardians"
                className="w-full px-3.5 py-2 glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                INITIAL CREDIT SCORE (0.0 - 10.0)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.creditScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditScore: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2 glass-input text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              DESCRIPTION *
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Team engineering specialization and mission..."
              className="w-full px-3.5 py-2 glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                FLAGSHIP PROJECT
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                placeholder="e.g. AI Vulnerability Scanner"
                className="w-full px-3.5 py-2 glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                SEMESTER GOAL
              </label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                placeholder="e.g. Publish open-source core v1"
                className="w-full px-3.5 py-2 glass-input text-xs"
              />
            </div>
          </div>

          {/* Leader Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              APPOINT TEAM LEADER (OPTIONAL)
            </label>
            <select
              value={formData.leaderId}
              onChange={(e) =>
                setFormData({ ...formData, leaderId: e.target.value })
              }
              className="w-full px-3.5 py-2 glass-input text-xs bg-[#060a10]"
            >
              <option value="">-- Select Team Leader from Unassigned Members --</option>
              {unassignedMembers.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.displayName} (@{m.username}) • Reg: {m.registrationNumber} • Score: {m.creditScore}/10
                </option>
              ))}
            </select>
          </div>

          {/* Member Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-slate-400 uppercase">
                ASSIGN INITIAL MEMBERS ({formData.memberIds.length} SELECTED)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Only unassigned members shown
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Filter members by name or reg..."
                className="w-full pl-8 pr-3 py-1.5 glass-input text-xs"
              />
            </div>

            <div className="max-h-36 overflow-y-auto divide-y divide-[rgba(0,168,255,0.08)] border border-[rgba(0,168,255,0.12)] rounded-xl bg-black/40">
              {isMembersLoading ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  Loading members...
                </div>
              ) : unassignedMembers.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  No unassigned members available.
                </div>
              ) : (
                unassignedMembers
                  .filter((m: any) => m.id !== formData.leaderId)
                  .map((m: any) => {
                    const isSelected = formData.memberIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleMemberSelection(m.id)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? 'bg-[rgba(0,168,255,0.12)] text-[#00c8ff]'
                            : 'hover:bg-white/[0.03] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-4 w-4 rounded border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#00a8ff] bg-[#00a8ff] text-black'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold">{m.displayName}</span>
                          <span className="text-slate-500 font-mono">
                            (@{m.username})
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                          Score: {m.creditScore}/10
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,168,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="px-5 py-2 text-xs font-semibold btn-electric rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {createTeamMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Team</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   2. UPDATE TEAM SCORE MODAL (0.0 – 10.0 STRICT SCALE + MANDATORY REASON)
   ========================================================================= */
interface UpdateScoreModalProps {
  team: Team;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdateScoreModal({
  team,
  onClose,
  onSuccess,
}: UpdateScoreModalProps) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState<number>(team.score || 0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateScoreMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (score < 0 || score > 10) {
        throw new Error('Score must be between 0.0 and 10.0');
      }
      if (!reason.trim() || reason.trim().length < 3) {
        throw new Error('Audit reason must be at least 3 characters long');
      }

      await api.patch(`/teams/${team.id}/score`, {
        score: Number(score),
        reason: reason.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetails', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamHistory', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || 'Failed to update score'
      );
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md rounded-2xl bg-[#060a10]/95 border border-[rgba(0,168,255,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,168,255,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,168,255,0.12)] bg-[#080d16]/80">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-[#00c8ff]" />
            <h3 className="text-lg font-bold text-white">Update Team Score</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateScoreMutation.mutate();
          }}
          className="p-6 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-[rgba(0,168,255,0.04)] border border-[rgba(0,168,255,0.12)] text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 block font-mono uppercase text-[10px]">
                TARGET TEAM
              </span>
              <span className="font-bold text-white text-sm">{team.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-mono uppercase text-[10px]">
                CURRENT SCORE
              </span>
              <span className="font-bold text-[#00c8ff] font-mono text-sm">
                {team.score.toFixed(1)} / 10.0
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-400 uppercase">
                NEW CREDIT SCORE (0.0 – 10.0) *
              </label>
              <span className="text-xs font-mono font-bold text-[#00c8ff]">
                {Number(score).toFixed(1)}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value))}
                className="w-full accent-[#00a8ff] cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 glass-input text-sm font-mono text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              AUDIT REASON / JUSTIFICATION *
            </label>
            <textarea
              rows={3}
              required
              minLength={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Outstanding performance in intra-college hackathon, deployed fullstack MVP on AWS S3."
              className="w-full px-3.5 py-2 glass-input text-xs"
            />
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              This reason will be permanently recorded in the team audit trail.
            </span>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,168,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateScoreMutation.isPending || !reason.trim()}
              className="px-5 py-2 text-xs font-semibold btn-electric rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {updateScoreMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  <span>Commit Score</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   3. ADD MEMBER TO TEAM MODAL
   ========================================================================= */
interface AddMemberModalProps {
  team: Team;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddMemberModal({
  team,
  onClose,
  onSuccess,
}: AddMemberModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['availableMembersForAdd', search],
    queryFn: async () => {
      const res = await api.get('/members', {
        params: { search, limit: 50 },
      });
      return res.data.data;
    },
  });

  const unassignedMembers = (membersData || []).filter(
    (m: any) => !m.squadId && !m.squadName
  );

  const addMemberMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (!selectedMemberId) throw new Error('Please select a member to add');

      await api.post(`/teams/${team.id}/members`, {
        memberId: selectedMemberId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetails', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamHistory', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || 'Failed to add member'
      );
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md rounded-2xl bg-[#060a10]/95 border border-[rgba(0,168,255,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,168,255,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,168,255,0.12)] bg-[#080d16]/80">
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-[#00a8ff]" />
            <h3 className="text-lg font-bold text-white">Add Member to Team</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search unassigned members..."
              className="w-full pl-8 pr-3 py-2 glass-input text-xs"
            />
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-[rgba(0,168,255,0.08)] border border-[rgba(0,168,255,0.12)] rounded-xl bg-black/40">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Loading members...
              </div>
            ) : unassignedMembers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No unassigned members found.
              </div>
            ) : (
              unassignedMembers.map((m: any) => {
                const isSelected = selectedMemberId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`p-3 flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-[rgba(0,168,255,0.15)] text-[#00c8ff]'
                        : 'hover:bg-white/[0.03] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{m.displayName}</div>
                      <div className="text-slate-400 font-mono text-[10px]">
                        @{m.username} • {m.registrationNumber}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-slate-400">
                        Score: {m.creditScore}/10
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-[#00a8ff]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,168,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={addMemberMutation.isPending || !selectedMemberId}
              onClick={() => addMemberMutation.mutate()}
              className="px-5 py-2 text-xs font-semibold btn-electric rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {addMemberMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Add to Team</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. CHANGE TEAM LEADER MODAL
   ========================================================================= */
interface ChangeLeaderModalProps {
  team: Team;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ChangeLeaderModal({
  team,
  onClose,
  onSuccess,
}: ChangeLeaderModalProps) {
  const queryClient = useQueryClient();
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(
    team.leaderId || ''
  );
  const [error, setError] = useState<string | null>(null);

  // Combine current members + unassigned members as leader candidates
  const { data: membersData } = useQuery({
    queryKey: ['candidateLeaders'],
    queryFn: async () => {
      const res = await api.get('/members', { params: { limit: 50 } });
      return res.data.data;
    },
  });

  const currentTeamMembers = team.members || [];
  const candidateMembers = (membersData || []).filter(
    (m: any) =>
      !m.squadId || m.squadId === team.id || m.squadId?._id === team.id
  );

  const changeLeaderMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (!selectedLeaderId) throw new Error('Please select a leader');

      await api.patch(`/teams/${team.id}/leader`, {
        leaderId: selectedLeaderId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamDetails', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamHistory', team.id] });
      queryClient.invalidateQueries({ queryKey: ['teamLeaderboard'] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || err.message || 'Failed to change leader'
      );
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md rounded-2xl bg-[#060a10]/95 border border-[rgba(0,168,255,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,168,255,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,168,255,0.12)] bg-[#080d16]/80">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Change Team Leader</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
              SELECT NEW LEADER FOR {team.name}
            </label>
            <select
              value={selectedLeaderId}
              onChange={(e) => setSelectedLeaderId(e.target.value)}
              className="w-full px-3.5 py-2.5 glass-input text-xs bg-[#060a10]"
            >
              <option value="">-- Choose Candidate Leader --</option>
              <optgroup label="Current Team Members">
                {currentTeamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.displayName} (@{m.username}) • Score: {m.creditScore}/10
                  </option>
                ))}
              </optgroup>
              <optgroup label="Unassigned Members">
                {candidateMembers
                  .filter(
                    (m: any) =>
                      !currentTeamMembers.some((tm) => tm.id === m.id) &&
                      m.id !== team.leader?.id
                  )
                  .map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} (@{m.username}) • Score: {m.creditScore}/10
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,168,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={
                changeLeaderMutation.isPending ||
                !selectedLeaderId ||
                selectedLeaderId === team.leader?.id
              }
              onClick={() => changeLeaderMutation.mutate()}
              className="px-5 py-2 text-xs font-semibold btn-electric rounded-xl flex items-center space-x-2 disabled:opacity-50"
            >
              {changeLeaderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Update Leader</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
