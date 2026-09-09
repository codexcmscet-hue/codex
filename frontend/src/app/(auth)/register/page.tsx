'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import {
  Code2,
  Lock,
  User,
  Mail,
  Phone,
  Hash,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    registrationNumber: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', formData);
      setSuccessMsg(res.data.message || 'Registration successful! Please check your email.');
      setSuccessMsg(res.data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      }, 2500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Registration failed');
          : 'Registration failed. Please check your details.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-4 py-12 tech-grid">
      <div className="w-full max-w-xl">
    <div className="min-h-screen bg-[#030507] text-[#f1f5f9] relative flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      {/* Matrix Blue Ambient Lights */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />
      <div className="absolute inset-0 modern-grid pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-lines pointer-events-none z-0" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Code2 className="h-6 w-6 text-white" />
          <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
            <div className="h-11 w-11 rounded-xl bg-[rgba(0,168,255,0.08)] flex items-center justify-center border border-[rgba(0,168,255,0.25)] shadow-[0_0_20px_rgba(0,168,255,0.15)] group-hover:border-[#00a8ff] transition-all backdrop-blur-md">
              <Code2 className="h-6 w-6 text-[#00a8ff]" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CodeX<span className="text-zinc-500">Club</span></span>
            <span className="text-2xl font-bold tracking-tight text-white">
              CodeX<span className="text-[#00a8ff]">Club</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Join CodeX Club</h1>
          <p className="text-sm text-zinc-400 mt-1">Create your developer identity and start collaborating</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Member Registration</h1>
          <p className="text-xs text-slate-400 mt-1">Join the engineering collective and start collaborating</p>
        </div>

        <GlassCard className="p-8">
        <div className="glass-panel p-8 border-[rgba(0,168,255,0.2)] relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-start space-x-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">FULL NAME</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">FULL NAME</label>
                <input
                  type="text"
                  name="displayName"
                  required
                  autoComplete="name"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Alex Rivera"
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">USERNAME</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">USERNAME</label>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="alex_codes"
                  placeholder="e.g. alex_codes"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">COLLEGE EMAIL</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">COLLEGE EMAIL</label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@college.edu"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">PHONE (E.164)</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">PHONE NUMBER</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">REGISTRATION NUMBER</label>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">STUDENT REGISTRATION NO.</label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="2024CS1092"
                className="w-full px-3.5 py-2.5 glass-input text-sm uppercase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">PASSWORD</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  placeholder="Min 8 chars with symbols"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">CONFIRM PASSWORD</label>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              className="w-full mt-3 py-2.5 btn-electric rounded-xl flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-zinc-400">
            Already a member?{' '}
            <Link href="/login" className="text-white hover:underline font-medium">
              Sign in
          <div className="mt-6 pt-5 border-t border-[rgba(0,168,255,0.12)] text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-[#00a8ff] hover:text-[#00c8ff] font-medium">
              Sign In to Portal
            </Link>
          </div>
        </GlassCard>
        </div>
      </div>
    </div>
  );
}

