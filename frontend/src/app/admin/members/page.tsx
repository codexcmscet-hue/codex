'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { Search, Trash2, Edit, Award, ExternalLink, Loader2, Download } from 'lucide-react';

export default function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [newScore, setNewScore] = useState<number>(5);
  const [reason, setReason] = useState('');

  const { data, isPending } = useQuery({
    queryKey: ['adminMembers', search],
    queryFn: async () => {
      const res = await api.get('/members', { params: { search, limit: 50 } });
      return res.data;
    },
  });

  const updateScoreMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/credit/${selectedMember.id}`, {
        score: Number(newScore),
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMembers'] });
      setCreditModalOpen(false);
      setReason('');
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      if (confirm('Are you sure you want to permanently delete this member?')) {
        await api.delete(`/members/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMembers'] });
    },
  });

  const downloadReport = async (memberId: string) => {
    window.open(`http://localhost:5000/api/reports/member/${memberId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Member Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage club members, adjust credit scores, and export PDF records.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, reg, email..."
            className="w-full pl-9 pr-4 py-2 glass-input text-xs"
          />
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-white/5 border-b border-white/10 text-xs font-mono text-zinc-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Reg Number</th>
                <th className="px-6 py-3.5">Squad</th>
                <th className="px-6 py-3.5">Credit Score</th>
                <th className="px-6 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isPending ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-500" />
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-zinc-500">
                    No members match the query.
                  </td>
                </tr>
              ) : (
                data?.data?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={m.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.username}`}
                          alt={m.username}
                          className="h-8 w-8 rounded-full bg-white/10 border border-white/20"
                        />
                        <div>
                          <div className="font-semibold text-white">{m.displayName}</div>
                          <div className="text-xs text-zinc-500">@{m.username} • {m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{m.registrationNumber}</td>
                    <td className="px-6 py-4">
                      {m.squadName ? (
                        <span className="px-2 py-1 rounded bg-white/10 text-xs font-medium text-white">
                          {m.squadName}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white font-mono">{m.creditScore}/10</span>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setNewScore(m.creditScore);
                            setCreditModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="Modify Credit Score"
                        >
                          <Award className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadReport(m.id)}
                          className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="Download PDF Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {m.githubUrl && (
                          <a
                            href={m.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteMemberMutation.mutate(m.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Credit Score Modal */}
      {creditModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md p-6 border-white/20">
            <h3 className="text-lg font-bold text-white mb-1">Modify Credit Score</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Updating credit rating for <strong className="text-white">{selectedMember.displayName}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">NEW SCORE (0 - 10 INTEGER)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={newScore}
                  onChange={(e) => setNewScore(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 glass-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">REASON / AUDIT NOTE</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Exceptional leadership in hackathon and mentoring junior squad members"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreditModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updateScoreMutation.isPending || !reason.trim()}
                  onClick={() => updateScoreMutation.mutate()}
                  className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {updateScoreMutation.isPending ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

