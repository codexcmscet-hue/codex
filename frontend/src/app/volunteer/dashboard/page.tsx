'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { Users, Award, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VolunteerDashboardPage() {
  const { data: stats, isPending } = useQuery({
    queryKey: ['volunteerStats'],
    queryFn: async () => {
      const res = await api.get('/analytics/volunteer');
      return res.data.data;
    },
  });

  if (isPending) {
    return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Volunteer Command Desk</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage assigned member progress, maintain credit integrity, and publish mini blogs.</p>
        <p className="text-sm text-slate-400 mt-1">Manage assigned member progress, maintain credit integrity, and publish mini blogs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Assigned Members</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Assigned Members</div>
          <div className="text-3xl font-bold text-white">{stats?.assignedCount || 0}</div>
          <div className="text-xs text-zinc-500 mt-2">Active mentees</div>
          <div className="text-xs text-slate-400 mt-2">Active mentees</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Average Credit Score</div>
          <div className="text-3xl font-bold text-white">{stats?.averageScore || 0} / 10</div>
          <div className="text-xs text-zinc-500 mt-2">Mentee collective score</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Average Credit Score</div>
          <div className="text-3xl font-bold text-white font-mono">{stats?.averageScore || 0} / 10</div>
          <div className="text-xs text-slate-400 mt-2">Mentee collective score</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Department</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Department</div>
          <div className="text-xl font-bold text-white truncate">{stats?.volunteer?.department || 'General'}</div>
          <div className="text-xs text-zinc-500 mt-2">Specialization wing</div>
          <div className="text-xs text-slate-400 mt-2">Specialization wing</div>
        </GlassCard>
      </div>

      {/* Assigned Members Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Assigned Mentees</h2>
          <Link href="/volunteer/members" className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1">
          <Link href="/volunteer/members" className="text-xs text-[#00a8ff] hover:text-[#00c8ff] flex items-center space-x-1">
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
        <div className="divide-y divide-[rgba(0,168,255,0.08)]">
          {stats?.assignedMembers?.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500">No members assigned yet.</div>
            <div className="py-6 text-center text-xs text-slate-500">No members assigned yet.</div>
          ) : (
            stats?.assignedMembers?.map((m: any) => (
              <div key={m._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{m.displayName}</div>
                  <div className="text-xs text-zinc-500">@{m.username} • {m.registrationNumber}</div>
                  <div className="text-xs text-slate-400">@{m.username} • {m.registrationNumber}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded">
                  <span className="text-xs font-mono font-bold text-[#00c8ff] bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] px-2.5 py-1 rounded-lg">
                    Score: {m.creditScore}/10
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

