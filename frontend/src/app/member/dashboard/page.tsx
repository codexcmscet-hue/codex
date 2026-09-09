'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import {
  Award,
  Activity,
  Calendar,
  Code2,
  ExternalLink,
  PlusCircle,
  GitBranch,
} from 'lucide-react';
import Link from 'next/link';

export default function MemberDashboardPage() {
  const { data: dashboard, isPending } = useQuery({
    queryKey: ['memberDashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/member');
      return res.data.data;
    },
  });

  if (isPending) {
    return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;
  }

  const profile = dashboard?.profile;
  const squad = dashboard?.squad;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {profile?.displayName || 'Developer'}!
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Track your personal credit score, squad milestones, and active tasks.</p>
          <p className="text-sm text-slate-400 mt-1">Track your personal credit score, squad milestones, and active tasks.</p>
        </div>

        {profile?.githubUrl && (
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-colors"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[rgba(0,168,255,0.08)] hover:bg-[rgba(0,168,255,0.15)] border border-[rgba(0,168,255,0.25)] text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <GitBranch className="h-3.5 w-3.5 text-[#00a8ff]" />
            <span>GitHub Profile</span>
            <ExternalLink className="h-3 w-3" />
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">My Credit Score</div>
          <div className="text-4xl font-extrabold text-white font-mono">{profile?.creditScore || 5}/10</div>
          <div className="text-xs text-zinc-400 mt-2">Verified rating</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">My Credit Score</div>
          <div className="text-4xl font-extrabold text-[#00c8ff] font-mono">{profile?.creditScore || 5} / 10</div>
          <div className="text-xs text-[#00a8ff] mt-2">Verified standing</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Activities Completed</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Activities Completed</div>
          <div className="text-4xl font-extrabold text-white">{profile?.activitiesCompleted || 0}</div>
          <div className="text-xs text-zinc-400 mt-2">Workshops & tasks</div>
          <div className="text-xs text-slate-400 mt-2">Workshops & tasks</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Events Participated</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Events Participated</div>
          <div className="text-4xl font-extrabold text-white">{profile?.eventsParticipated || 0}</div>
          <div className="text-xs text-zinc-400 mt-2">Contests & meetups</div>
          <div className="text-xs text-slate-400 mt-2">Contests & meetups</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Squad Status</div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Squad Status</div>
          <div className="text-xl font-bold text-white truncate">{squad ? squad.name : 'No Squad'}</div>
          <div className="text-xs text-zinc-400 mt-2">{squad ? `Score: ${squad.score} pts` : 'Solo Member'}</div>
          <div className="text-xs text-slate-400 mt-2">{squad ? `Score: ${squad.score} pts` : 'Solo Member'}</div>
        </GlassCard>
      </div>

      {/* Squad Performance Card or Register Squad Prompt */}
      {squad ? (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase">LINKED SQUAD</div>
              <div className="text-xs font-mono text-[#00a8ff] uppercase tracking-wider">LINKED SQUAD</div>
              <h2 className="text-2xl font-bold text-white mt-1">{squad.name}</h2>
            </div>
            <Link
              href="/member/squad"
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs hover:bg-zinc-200 transition-colors"
              className="px-4 py-2 btn-electric text-xs rounded-xl"
            >
              Squad Room
            </Link>
          </div>

          <p className="text-sm text-zinc-300 mb-4">{squad.description}</p>
          <p className="text-sm text-slate-300 mb-4">{squad.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[rgba(0,168,255,0.04)] border border-[rgba(0,168,255,0.12)] text-xs">
            <div>
              <span className="text-zinc-500 font-mono uppercase block mb-1">CURRENT PROJECT</span>
              <span className="text-slate-500 font-mono uppercase block mb-1">CURRENT PROJECT</span>
              <span className="font-semibold text-white">{squad.project || 'Open Innovation'}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono uppercase block mb-1">TEAM GOAL</span>
              <span className="text-slate-500 font-mono uppercase block mb-1">TEAM GOAL</span>
              <span className="font-semibold text-white">{squad.goal || 'Complete milestones by semester end'}</span>
            </div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="border-dashed border-white/20 text-center py-10">
          <Code2 className="h-10 w-10 text-zinc-500 mx-auto mb-3" />
        <GlassCard className="border-dashed border-[rgba(0,168,255,0.25)] text-center py-10">
          <Code2 className="h-10 w-10 text-[#00a8ff]/60 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">You are not in a Squad</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Squads collaborate on competitive programming, hackathons, and high-impact engineering projects.
          </p>
          <Link
            href="/member/squad"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl text-xs hover:bg-zinc-200 transition-all shadow-md"
            className="inline-flex items-center space-x-2 px-6 py-2.5 btn-electric rounded-xl text-xs shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Register a Squad</span>
          </Link>
        </GlassCard>
      )}

      {/* Recent Activity Timeline */}
      <GlassCard>
        <h2 className="text-base font-bold text-white mb-4">My Activity Stream</h2>
        <div className="divide-y divide-white/5">
        <div className="divide-y divide-[rgba(0,168,255,0.08)]">
          {dashboard?.activities?.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500">No recent activity.</div>
            <div className="py-6 text-center text-xs text-slate-500">No recent activity.</div>
          ) : (
            dashboard?.activities?.map((act: any) => (
              <div key={act._id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-zinc-200 font-medium">{act.description}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">{new Date(act.createdAt).toLocaleDateString()}</div>
                  <div className="text-slate-200 font-medium">{act.description}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{new Date(act.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-1 rounded">
                <span className="text-xs font-mono font-bold text-[#00c8ff] bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] px-2.5 py-1 rounded-lg">
                  +{act.points} PTS
                </span>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

