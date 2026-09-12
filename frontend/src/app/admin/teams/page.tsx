'use client';

import React from 'react';
import { TeamLeaderboard } from '@/components/leaderboard/TeamLeaderboard';

export default function AdminTeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Operations & Leaderboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Full administrative authority over team formations, member assignments, credit score audits (0–10 scale), and lifecycle archiving.
        </p>
      </div>

      <TeamLeaderboard
        title="Official Team Leaderboard"
        subtitle="Ranked deterministically by verified Team Credit Score and member standing."
        showPodium={true}
        limit={100}
        allowCreate={true}
      />
    </div>
  );
}
