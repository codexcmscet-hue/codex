'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { TeamLeaderboard } from '@/components/leaderboard/TeamLeaderboard';
import {
  Users,
  ShieldCheck,
  Code2,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats, isPending } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/analytics/admin');
      return res.data.data;
    },
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Command Center</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time club metrics, performance distribution, and system logs.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Members</span>
            <Users className="h-4 w-4 text-[#00a8ff]" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalMembers || 0}</div>
          <div className="text-xs text-[#00c8ff] mt-2 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{stats?.activeMembers || 0} Active today</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Volunteers</span>
            <ShieldCheck className="h-4 w-4 text-[#00a8ff]" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalVolunteers || 0}</div>
          <div className="text-xs text-slate-400 mt-2">{stats?.activeVolunteers || 0} on duty</div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Squads</span>
            <Code2 className="h-4 w-4 text-[#00a8ff]" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalSquads || 0}</div>
          <div className="text-xs text-slate-400 mt-2">Competitive teams</div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Avg Credit Score</span>
            <Activity className="h-4 w-4 text-[#00a8ff]" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{stats?.averageCreditScore || 0} / 10</div>
          <div className="text-xs text-slate-400 mt-2">Overall club rating</div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Score Distribution */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Credit Score Distribution</h2>
              <p className="text-xs text-slate-400">Member credit score rating distribution (0–10 scale)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.creditScoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,168,255,0.08)" />
                <XAxis dataKey="score" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#05080e',
                    borderColor: 'rgba(0,168,255,0.3)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                />
                <Bar dataKey="count" fill="#00a8ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Member Growth Trend */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Member Growth Trend</h2>
              <p className="text-xs text-slate-400">Monthly new member registrations</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.memberGrowth || []}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a8ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00a8ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,168,255,0.08)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#05080e',
                    borderColor: 'rgba(0,168,255,0.3)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                />
                <Area type="monotone" dataKey="members" stroke="#00a8ff" strokeWidth={2} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activities List */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Live System Activity Stream</h2>
          <span className="badge-blue text-[10px] font-mono px-2.5 py-0.5 rounded-full">LATEST 10 RECORDS</span>
        </div>
        <div className="divide-y divide-[rgba(0,168,255,0.08)]">
          {stats?.recentActivities?.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No activities recorded yet.</div>
          ) : (
            stats?.recentActivities?.map((act: any) => (
              <div key={act._id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-200 font-medium">{act.description}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{new Date(act.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[rgba(0,168,255,0.12)] border border-[rgba(0,168,255,0.25)] text-[#00c8ff]">
                  +{act.points} PTS
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Prominent Team Leaderboard Section */}
      <TeamLeaderboard
        title="Team Leaderboard"
        subtitle="Global team standings, credit scores (0–10 scale), and performance rankings."
        showPodium={true}
        limit={10}
      />
    </div>
  );
}

