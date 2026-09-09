'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  Code2,
  Calendar,
  FileText,
  FileSpreadsheet,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const volunteerNavItems = [
  { label: 'Overview', href: '/volunteer/dashboard', icon: LayoutDashboard },
  { label: 'Assigned Members', href: '/volunteer/members', icon: Users },
  { label: 'Squads', href: '/volunteer/squads', icon: Code2 },
  { label: 'Events', href: '/volunteer/events', icon: Calendar },
  { label: 'Mini Blogs', href: '/volunteer/blogs', icon: FileText },
  { label: 'Club Reports', href: '/volunteer/reports', icon: FileSpreadsheet },
];

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex">
    <div className="min-h-screen bg-[#030507] text-[#f1f5f9] flex relative overflow-hidden">
      {/* Matrix Blue Ambient Lights */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="absolute inset-0 modern-grid pointer-events-none z-0" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0c0c10]/90 backdrop-blur-xl flex flex-col justify-between p-4 sticky top-0 h-screen z-40">
      <aside className="w-64 border-r border-[rgba(0,168,255,0.15)] bg-[#05080e]/90 backdrop-blur-xl flex flex-col justify-between p-4 sticky top-0 h-screen z-40">
        <div>
          <Link href="/" className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-white/10">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Code2 className="h-4 w-4 text-white" />
          <Link href="/" className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-[rgba(0,168,255,0.12)]">
            <div className="h-9 w-9 rounded-xl bg-[rgba(0,168,255,0.08)] flex items-center justify-center border border-[rgba(0,168,255,0.25)] shadow-[0_0_15px_rgba(0,168,255,0.15)]">
              <Code2 className="h-4 w-4 text-[#00a8ff]" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">CodeX<span className="text-zinc-500">Club</span></div>
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">VOLUNTEER PORTAL</div>
              <div className="font-bold text-sm tracking-tight text-white">CodeX<span className="text-[#00a8ff]">Club</span></div>
              <div className="text-[10px] text-[#00a8ff] font-mono uppercase tracking-widest">VOLUNTEER PORTAL</div>
            </div>
          </Link>

          <nav className="space-y-1">
            {volunteerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/volunteer/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      ? 'bg-[rgba(0,168,255,0.12)] text-[#00a8ff] border-l-2 border-[#00a8ff] shadow-[inset_0_0_12px_rgba(0,168,255,0.1)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-black' : 'text-zinc-400')} />
                  <Icon className={cn('h-4 w-4', isActive ? 'text-[#00a8ff]' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-white/10 pt-4 space-y-3">
        <div className="border-t border-[rgba(0,168,255,0.12)] pt-4 space-y-3">
          <div className="flex items-center space-x-3 px-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white uppercase">
            <div className="h-8 w-8 rounded-full bg-[rgba(0,168,255,0.15)] border border-[rgba(0,168,255,0.3)] flex items-center justify-center text-xs font-bold text-[#00a8ff] uppercase shadow-[0_0_10px_rgba(0,168,255,0.2)]">
              {user?.username?.[0] || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.username}</div>
              <div className="text-[10px] text-zinc-500">Volunteer Wing</div>
              <div className="text-[10px] text-slate-400">Volunteer Wing</div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto relative z-10">
        {children}
      </main>
    </div>
  );
}

