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
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CodeX<span className="text-zinc-500">Club</span></span>
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
              className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-all shadow-sm"
            >
              Join Club
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center tech-grid">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-8 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>Next-Gen College Coding Club Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Architected for Builders. Built for Speed.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Enterprise-grade management system powering squads, live competitions, automated credit scoring, and developer portfolios.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Register as Member</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-md"
            >
              Admin Portal
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            <GlassCard className="text-left">
              <div className="text-3xl font-bold text-white mb-1">0 - 10</div>
              <div className="text-xs text-zinc-400 font-mono">STRICT CREDIT SCORE</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-bold text-white mb-1">3 Tiers</div>
              <div className="text-xs text-zinc-400 font-mono">RBAC PERMISSIONS</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-bold text-white mb-1">3 DBs</div>
              <div className="text-xs text-zinc-400 font-mono">ISOLATED ARCHITECTURE</div>
            </GlassCard>
            <GlassCard className="text-left">
              <div className="text-3xl font-bold text-white mb-1">AWS S3</div>
              <div className="text-xs text-zinc-400 font-mono">MEDIA STORAGE</div>
            </GlassCard>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Engineered for Excellence</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
              Every subsystem designed for low latency, zero-trust security, and exceptional user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <Users className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2">Squad Collaboration</h3>
              <p className="text-sm text-zinc-400">
                Form high-impact squads with fellow members, tackle projects, and climb the club leaderboard together.
              </p>
            </GlassCard>

            <GlassCard>
              <Award className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2">Real-Time Credit Scores</h3>
              <p className="text-sm text-zinc-400">
                Audited 0-10 credit score metric modified by volunteers and admins with complete historical trails.
              </p>
            </GlassCard>

            <GlassCard>
              <ShieldCheck className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-bold mb-2">Zero-Trust RBAC</h3>
              <p className="text-sm text-zinc-400">
                Argon2id password hashing, isolated authentication database, and JWT rotation via HttpOnly cookies.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CodeX Club. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <Link href="/admin/login" className="hover:text-zinc-300">Admin</Link>
            <Link href="/login" className="hover:text-zinc-300">Volunteer</Link>
            <Link href="/register" className="hover:text-zinc-300">Member</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

