'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { Code2, Users, Target, Rocket, PlusCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function MemberSquadPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project: '',
    goal: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: memberData, isPending } = useQuery({
    queryKey: ['memberProfileMe'],
    queryFn: async () => {
      const res = await api.get('/members/me');
      return res.data.data;
    },
  });

  const registerSquadMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      await api.post('/squads', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberProfileMe'] });
      queryClient.invalidateQueries({ queryKey: ['memberDashboard'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to register squad');
    },
  });

  if (isPending) {
    return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;
  }

  const squad = memberData?.squadId;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Squad Central</h1>
        <p className="text-sm text-zinc-400 mt-1">Squad collaboration, competitive hackathon teams, and shared project goals.</p>
      </div>

      {squad ? (
        <div className="space-y-6">
          <GlassCard className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">OFFICIAL SQUAD</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">{squad.name}</h2>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">SQUAD SCORE</span>
                <span className="text-2xl font-bold text-white font-mono">{squad.score || 0} PTS</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">{squad.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase">
                  <Rocket className="h-4 w-4 text-white" />
                  <span>Flagship Project</span>
                </div>
                <div className="text-sm font-semibold text-white">{squad.project || 'Active Research'}</div>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase">
                  <Target className="h-4 w-4 text-white" />
                  <span>Semester Goal</span>
                </div>
                <div className="text-sm font-semibold text-white">{squad.goal || 'Compete in national finals'}</div>
              </div>
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="max-w-2xl mx-auto p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register a New Squad</h2>
              <p className="text-xs text-zinc-400">Become the leader and assemble your engineering team</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerSquadMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">SQUAD NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Binary Beasts"
                className="w-full px-3.5 py-2.5 glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">DESCRIPTION</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your squad's primary engineering focus..."
                className="w-full px-3.5 py-2.5 glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">FLAGSHIP PROJECT</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="e.g. Distributed Key-Value Store"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">TEAM GOAL</label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="e.g. Win First Prize at CodeFest"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerSquadMutation.isPending}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-4"
              className="w-full py-3 btn-electric font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-4"
            >
              {registerSquadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Register Squad</span>
                </>
              )}
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}

