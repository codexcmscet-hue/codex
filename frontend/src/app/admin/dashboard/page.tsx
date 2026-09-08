'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
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
        <p className="text-sm text-zinc-400 mt-1">Real-time club metrics, performance distribution, and system logs.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Total Members</span>
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalMembers || 0}</div>
          <div className="text-xs text-green-400 mt-2 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{stats?.activeMembers || 0} Active today</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Volunteers</span>
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalVolunteers || 0}</div>
          <div className="text-xs text-zinc-400 mt-2">{stats?.activeVolunteers || 0} on duty</div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Active Squads</span>
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalSquads || 0}</div>
          <div className="text-xs text-zinc-400 mt-2">Competitive teams</div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase">Avg Credit Score</span>
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.averageCreditScore || 0} / 10</div>
          <div className="text-xs text-zinc-400 mt-2">Overall club rating</div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Score Distribution */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Credit Score Distribution</h2>
              <p className="text-xs text-zinc-400">Strict member credit distribution (0-10)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.creditScoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="score" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#ffffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Member Growth Trend */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Member Growth Trend</h2>
              <p className="text-xs text-zinc-400">Monthly new member registrations</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.memberGrowth || []}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="members" stroke="#ffffff" fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activities List */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Live System Activity Stream</h2>
          <span className="text-xs text-zinc-400 font-mono">LATEST 10 RECORDS</span>
        </div>
        <div className="divide-y divide-white/5">
          {stats?.recentActivities?.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">No activities recorded yet.</div>
          ) : (
            stats?.recentActivities?.map((act: any) => (
              <div key={act._id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-zinc-200 font-medium">{act.description}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">{new Date(act.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs font-mono font-semibold px-2 py-1 rounded bg-white/10 text-white">
                  +{act.points} PTS
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

