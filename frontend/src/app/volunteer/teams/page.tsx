'use client';

import React from 'react';
import { TeamLeaderboard } from '@/components/leaderboard/TeamLeaderboard';

export default function VolunteerTeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Management & Leaderboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Create student engineering teams, manage member rosters, update team leaders, and log credit score updates (0–10 scale) with audit justification.
        </p>
      </div>

      <TeamLeaderboard
        title="Club Team Leaderboard"
        subtitle="Ranked deterministically by verified Team Credit Score and member standing."
        showPodium={true}
        limit={100}
        allowCreate={true}
      />
    </div>
  );
}

