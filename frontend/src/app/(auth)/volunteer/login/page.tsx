'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { GlassCard } from '@/components/layouts/GlassCard';
import { ShieldAlert, Lock, User, AlertCircle, ArrowRight, Loader2, Code2 } from 'lucide-react';

export default function VolunteerLoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ identifier, password, rememberMe });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid volunteer credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-4 py-12 tech-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CodeX<span className="text-zinc-500">Club</span></span>
          </Link>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-xs text-purple-300 mb-3">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Volunteer Staff Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Volunteer Sign In</h1>
          <p className="text-sm text-zinc-400 mt-1">Access mentor desk, evaluate members & manage events</p>
        </div>

        <GlassCard className="p-8 border-purple-500/20">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">VOLUNTEER USERNAME OR EMAIL</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sarah_tech or volunteer@codex.org"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-zinc-400">PASSWORD</label>
                <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In as Volunteer</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">
              ← Member Login
            </Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal →
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
