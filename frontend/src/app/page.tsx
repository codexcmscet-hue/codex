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
  Layers,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-foreground flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />
      <div className="absolute inset-0 modern-grid pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-lines pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#070709]/75">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CodeX<span className="text-zinc-500">Club</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-all shadow-sm backdrop-blur-md"
            >
              Sign In Portal
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-xl hover:bg-zinc-200 transition-all shadow-md"
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
          </div>

          <h1 className="text-5xl md:text-7.5xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 text-white">
            Architected for Builders. <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Engineered for Speed.
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unified management platform powering developer squads, verified 0–10 credit scoring, live contest registrations, and automated PDF reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-white/5 text-sm"
            >
              <span>Launch Unified Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-xl text-sm"
            >
              Member Registration
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">0 – 10</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">STRICT CREDIT SCORE</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">3 Tiers</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">RBAC PERMISSIONS</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">3 DBs</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">ISOLATED ENCLAVES</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-extrabold text-white mb-1 font-mono">AWS S3</div>
              <div className="text-[11px] text-zinc-400 font-mono tracking-wider">MEDIA PRESIGNED URLS</div>
            </GlassCard>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Core Operating Capabilities</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
              Single-portal experience with zero-trust access control and instant responsiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Squad Collaboration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Form high-impact squads with fellow members, tackle projects, and climb the club leaderboard together.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Audited 0-10 Credit Rating</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Audited 0-10 credit score metric modified by volunteers and admins with complete historical trails.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Argon2id Cryptography</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                64MB memory-hard hashing, rotating refresh tokens, and strict server-side authorization middleware.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-zinc-500 relative z-10 bg-[#070709]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CodeX Club Platform. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-zinc-300">Unified Portal</Link>
            <Link href="/register" className="hover:text-zinc-300">Join Club</Link>
            <Link href="/blogs" className="hover:text-zinc-300">Articles</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
