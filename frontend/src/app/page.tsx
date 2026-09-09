import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/layouts/GlassCard';
import {
  Code2,
  Terminal,
  ShieldCheck,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-foreground flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
    <div className="min-h-screen bg-[#030507] text-[#f1f5f9] flex flex-col justify-between selection:bg-[#00a8ff] selection:text-black relative overflow-hidden">
      {/* Matrix Blue Ambient Lights */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />
      <div className="absolute inset-0 modern-grid pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-lines pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#070709]/75">
      <header className="border-b border-[rgba(0,168,255,0.15)] backdrop-blur-xl sticky top-0 z-50 bg-[#030507]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
              <Code2 className="h-5 w-5 text-white" />
            <div className="h-9 w-9 rounded-xl bg-[rgba(0,168,255,0.08)] flex items-center justify-center border border-[rgba(0,168,255,0.25)] shadow-[0_0_15px_rgba(0,168,255,0.2)]">
              <Code2 className="h-5 w-5 text-[#00a8ff]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CodeX<span className="text-zinc-500">Club</span>
              CodeX<span className="text-[#00a8ff]">Club</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm text-zinc-400">
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="#community" className="hover:text-white transition-colors">Squads</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-all shadow-sm backdrop-blur-md"
              className="px-4 py-2 text-xs font-semibold text-white border border-[rgba(0,168,255,0.25)] bg-[rgba(0,168,255,0.05)] hover:bg-[rgba(0,168,255,0.12)] hover:border-[#00a8ff] rounded-xl transition-all shadow-sm backdrop-blur-md"
            >
              Sign In Portal
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-xl hover:bg-zinc-200 transition-all shadow-md"
              className="px-4 py-2 text-xs font-semibold btn-electric rounded-xl shadow-md"
            >
              Join Club
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-zinc-300 mb-8 backdrop-blur-xl shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono">Enterprise College Coding Club Operating System</span>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[rgba(0,168,255,0.25)] bg-[rgba(0,168,255,0.06)] text-xs text-sky-300 mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(0,168,255,0.1)]">
            <Sparkles className="h-3.5 w-3.5 text-[#00c8ff]" />
            <span className="font-mono">Next-Gen College Coding Club Platform</span>
          </div>

          <h1 className="text-5xl md:text-7.5xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 text-white">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 text-white">
            Architected for Builders. <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            <span className="bg-gradient-to-r from-white via-sky-200 to-[#00a8ff] bg-clip-text text-transparent">
              Engineered for Speed.
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unified management platform powering developer squads, verified 0–10 credit scoring, live contest registrations, and automated PDF reports.
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unified management platform powering developer squads, verified credit scoring, hackathon coordination, and developer project showcases.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-white/5 text-sm"
              className="w-full sm:w-auto px-8 py-3.5 btn-electric rounded-xl flex items-center justify-center space-x-2 text-sm font-semibold"
            >
              <span>Launch Unified Portal</span>
              <span>Access Unified Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-xl text-sm"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[rgba(0,168,255,0.2)] bg-black/40 hover:bg-[rgba(0,168,255,0.08)] hover:border-[#00a8ff] text-white font-medium transition-all backdrop-blur-xl text-sm"
            >
              Member Registration
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          {/* User-Facing Metrics Cards (No Implementation Clutter) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">0 – 10</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">STRICT CREDIT SCORE</div>
            <GlassCard className="text-left border-[rgba(0,168,255,0.18)]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Total Members</span>
                <Users className="h-4 w-4 text-[#00a8ff]" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">1,200+</div>
              <div className="text-[11px] text-sky-400 mt-1">Active student coders</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">3 Tiers</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">RBAC PERMISSIONS</div>

            <GlassCard className="text-left border-[rgba(0,168,255,0.18)]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Active Squads</span>
                <Code2 className="h-4 w-4 text-[#00a8ff]" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">48</div>
              <div className="text-[11px] text-sky-400 mt-1">Project & contest teams</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">3 DBs</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">ISOLATED ENCLAVES</div>

            <GlassCard className="text-left border-[rgba(0,168,255,0.18)]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Events Hosted</span>
                <Calendar className="h-4 w-4 text-[#00a8ff]" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">35+</div>
              <div className="text-[11px] text-sky-400 mt-1">Hackathons & meetups</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">AWS S3</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">MEDIA PRESIGNED URLS</div>

            <GlassCard className="text-left border-[rgba(0,168,255,0.18)]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Projects Built</span>
                <Terminal className="h-4 w-4 text-[#00a8ff]" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">120+</div>
              <div className="text-[11px] text-sky-400 mt-1">Open-source solutions</div>
            </GlassCard>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-[rgba(0,168,255,0.15)] relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Core Operating Capabilities</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Club Experience Platform</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Single-portal experience with zero-trust access control and instant responsiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
            <GlassCard className="border-[rgba(0,168,255,0.18)]">
              <div className="h-11 w-11 rounded-xl bg-[rgba(0,168,255,0.1)] border border-[rgba(0,168,255,0.25)] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,168,255,0.15)]">
                <Users className="h-5 w-5 text-[#00a8ff]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Squad Collaboration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
              <p className="text-xs text-slate-400 leading-relaxed">
                Form high-impact squads with fellow members, tackle projects, and climb the club leaderboard together.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-400" />
            <GlassCard className="border-[rgba(0,168,255,0.18)]">
              <div className="h-11 w-11 rounded-xl bg-[rgba(0,200,255,0.1)] border border-[rgba(0,200,255,0.25)] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
                <Award className="h-5 w-5 text-[#00c8ff]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Audited 0-10 Credit Rating</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Audited 0-10 credit score metric modified by volunteers and admins with complete historical trails.
              <h3 className="text-lg font-bold text-white mb-2">Credit Score & Progression</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verified credit score system evaluated by volunteers and mentors with detailed performance history.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <GlassCard className="border-[rgba(0,168,255,0.18)]">
              <div className="h-11 w-11 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.25)] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                <ShieldCheck className="h-5 w-5 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Argon2id Cryptography</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                64MB memory-hard hashing, rotating refresh tokens, and strict server-side authorization middleware.
              <h3 className="text-lg font-bold text-white mb-2">Role-Based Gateways</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated dashboards tailored specifically for members, volunteers, and administrators.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-zinc-500 relative z-10 bg-[#070709]/80 backdrop-blur-md">
      <footer className="border-t border-[rgba(0,168,255,0.15)] py-8 px-6 text-center text-xs text-slate-500 relative z-10 bg-[#030507]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CodeX Club Platform. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-zinc-300">Unified Portal</Link>
            <Link href="/register" className="hover:text-zinc-300">Join Club</Link>
            <Link href="/blogs" className="hover:text-zinc-300">Articles</Link>
            <Link href="/login" className="text-slate-400 hover:text-[#00a8ff] transition-colors">Sign In Portal</Link>
            <Link href="/register" className="text-slate-400 hover:text-[#00a8ff] transition-colors">Join Club</Link>
            <Link href="/blogs" className="text-slate-400 hover:text-[#00a8ff] transition-colors">Articles</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
