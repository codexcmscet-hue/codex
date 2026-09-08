'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import {
  Activity,
  Award,
  Calendar,
  Code2,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const radarData = [
  { subject: 'Algorithms', score: 85, fullMark: 100 },
  { subject: 'Web Dev', score: 92, fullMark: 100 },
  { subject: 'Security', score: 70, fullMark: 100 },
  { subject: 'System Design', score: 78, fullMark: 100 },
  { subject: 'Teamwork', score: 95, fullMark: 100 },
];

export default function SoloPerformancePage() {
  const { data: performance, isPending } = useQuery({
    queryKey: ['myPerformance'],
    queryFn: async () => {
      const res = await api.get('/members/me/performance');
      return res.data.data;
    },
  });

  if (isPending) {
    return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;
  }

  const creditHistory = performance?.creditHistory || [];
  const chartHistory = [...creditHistory].reverse().map((item: any) => ({
    date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: item.newScore,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Solo Performance & Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">Detailed breakdown of your credit rating, skill proficiencies, and activity history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Current Credit Rating</div>
          <div className="text-4xl font-extrabold text-white font-mono">{performance?.creditScore || 5} / 10</div>
          <div className="text-xs text-green-400 mt-2 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Strict integer metric</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Total Activity Points</div>
          <div className="text-4xl font-extrabold text-white font-mono">{performance?.activityPoints || 0}</div>
          <div className="text-xs text-zinc-500 mt-2">Earned across all challenges</div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Events Attended</div>
          <div className="text-4xl font-extrabold text-white font-mono">{performance?.eventsParticipated || 0}</div>
          <div className="text-xs text-zinc-500 mt-2">Verified registrations</div>
        </GlassCard>
      </div>

      {/* Radar Skill Proficiency & Credit Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-base font-bold text-white mb-2">Skill Profile Evaluation</h2>
          <p className="text-xs text-zinc-400 mb-6">Competency radar evaluated across core technical domains</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" />
                <Radar name="Member" dataKey="score" stroke="#ffffff" fill="#ffffff" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-base font-bold text-white mb-2">Credit Score History Trend</h2>
          <p className="text-xs text-zinc-400 mb-6">Audit progression of your verified credit rating</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartHistory.length > 0 ? chartHistory : [{ date: 'Initial', score: performance?.creditScore || 5 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" domain={[0, 10]} fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="stepAfter" dataKey="score" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Credit Modification Audit Trail */}
      <GlassCard>
        <h2 className="text-base font-bold text-white mb-4">Credit Score Modification Records</h2>
        <div className="divide-y divide-white/5">
          {creditHistory.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500">No score modifications recorded.</div>
          ) : (
            creditHistory.map((item: any) => (
              <div key={item._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2">
                <div>
                  <div className="text-zinc-200 font-medium">
                    Changed from <strong className="text-white">{item.previousScore}</strong> to <strong className="text-white">{item.newScore}</strong>
                  </div>
                  <div className="text-zinc-400 mt-0.5">Reason: {item.reason}</div>
                </div>
                <div className="text-zinc-500 font-mono">
                  {new Date(item.createdAt).toLocaleDateString()} by {item.modifiedByName || item.modifiedByRole}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

