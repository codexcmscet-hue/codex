'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { GlassCard } from '@/components/layouts/GlassCard';
import {
  Code2,
  Lock,
  User,
  Shield,
  ShieldAlert,
  AlertCircle,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type RoleTab = 'MEMBER' | 'VOLUNTEER' | 'ADMIN';

export default function UnifiedLoginPage() {
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleTab>('MEMBER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleConfig = {
    MEMBER: {
      title: 'Member Gateway',
      subtitle: 'Developer workspace, credit score & squad rooms',
      badge: 'Student Developer',
      subtitle: 'Developer workspace, activities & squad access',
      badge: 'Student Member',
      icon: Code2,
      accentColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
      activeTabBg: 'bg-white text-black shadow-lg shadow-white/10',
      defaultUsername: 'dev_surya',
      identifierLabel: 'USERNAME OR COLLEGE EMAIL',
      placeholder: 'e.g. dev_surya or surya@codex.edu',
      activeTabBg: 'bg-[#00a8ff] text-black font-semibold shadow-lg shadow-[#00a8ff]/25',
      identifierLabel: 'USERNAME OR EMAIL',
      placeholder: 'Enter your registered username or email',
    },
    VOLUNTEER: {
      title: 'Volunteer Portal',
      subtitle: 'Mentee supervision, 0-10 credit evaluations & events',
      badge: 'Mentor & Staff',
      subtitle: 'Mentor desk, member evaluation & event coordination',
      badge: 'Club Volunteer',
      icon: ShieldAlert,
      accentColor: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
      activeTabBg: 'bg-purple-500 text-white shadow-lg shadow-purple-500/20',
      defaultUsername: 'sarah_tech',
      activeTabBg: 'bg-[#008cff] text-black font-semibold shadow-lg shadow-[#008cff]/25',
      identifierLabel: 'VOLUNTEER IDENTIFIER',
      placeholder: 'e.g. sarah_tech or volunteer@codex.org',
      placeholder: 'Enter volunteer username or email',
    },
    ADMIN: {
      title: 'Administrator Gateway',
      subtitle: 'Master security perimeter, system metrics & audit logs',
      badge: 'Full Root Access',
      subtitle: 'Master system controls, analytics & security audits',
      badge: 'Club Admin',
      icon: Shield,
      accentColor: 'from-red-500/20 to-amber-500/10 border-red-500/30 text-red-300',
      activeTabBg: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
      defaultUsername: 'admin',
      identifierLabel: 'ADMINISTRATOR USERNAME / ROOT',
      placeholder: 'e.g. admin or admin@codexclub.org',
      activeTabBg: 'bg-[#00c8ff] text-black font-semibold shadow-lg shadow-[#00c8ff]/25',
      identifierLabel: 'ADMINISTRATOR IDENTIFIER',
      placeholder: 'Enter administrator credentials',
    },
  };

  const currentConfig = roleConfig[activeRole];

  const handleTabChange = (role: RoleTab) => {
    setActiveRole(role);
    setError(null);
  };

  const fillDemoCredentials = () => {
    setIdentifier(currentConfig.defaultUsername);
    setPassword('CodexClub@2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ identifier, password, rememberMe });
    } catch (err: any) {
      setError(err.response?.data?.message || `Invalid ${activeRole.toLowerCase()} credentials`);
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] relative flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
    <div className="min-h-screen bg-[#030507] text-[#f1f5f9] relative flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      {/* Matrix Blue Ambient Lights */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />
      <div className="absolute inset-0 modern-grid pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-lines pointer-events-none z-0" />

      <div className="w-full max-w-lg relative z-10">
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-105 transition-transform backdrop-blur-md">
              <Code2 className="h-6 w-6 text-white" />
            <div className="h-11 w-11 rounded-xl bg-[rgba(0,168,255,0.08)] flex items-center justify-center border border-[rgba(0,168,255,0.25)] shadow-[0_0_20px_rgba(0,168,255,0.15)] group-hover:border-[#00a8ff] transition-all backdrop-blur-md">
              <Code2 className="h-6 w-6 text-[#00a8ff]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              CodeX<span className="text-zinc-500">Club</span>
              CodeX<span className="text-[#00a8ff]">Club</span>
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Single Sign-On Portal</h1>
          <p className="text-xs text-zinc-400 mt-1">Select your role to access your dedicated terminal</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Account Authentication</h1>
          <p className="text-xs text-slate-400 mt-1">Select your access tier to proceed</p>
        </div>

        {/* Main Multi-Role Card */}
        <div className="glass-panel p-8 border-white/15 relative">
        {/* Central Glass Login Panel */}
        <div className="glass-panel p-8 border-[rgba(0,168,255,0.2)] shadow-[0_16px_40px_rgba(0,0,0,0.6)] relative">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10 mb-6 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#05080e] border border-[rgba(0,168,255,0.15)] mb-6 backdrop-blur-md">
            {(['MEMBER', 'VOLUNTEER', 'ADMIN'] as RoleTab[]).map((role) => {
              const isActive = activeRole === role;
              const Icon = roleConfig[role].icon;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleTabChange(role)}
                  className={cn(
                    'flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                    'flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs transition-all duration-200',
                    isActive
                      ? roleConfig[role].activeTabBg
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{role.charAt(0) + role.slice(1).toLowerCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Role Badge Indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          {/* Role Header Banner */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(0,168,255,0.12)]">
            <div>
              <div className="text-base font-bold text-white flex items-center space-x-2">
                <span>{currentConfig.title}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{currentConfig.subtitle}</p>
              <div className="text-sm font-semibold text-white">{currentConfig.title}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentConfig.subtitle}</p>
            </div>
            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-mono border uppercase tracking-wider', currentConfig.accentColor)}>
            <span className="badge-blue px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider">
              {currentConfig.badge}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                {currentConfig.identifierLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentConfig.placeholder}
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-zinc-400">PASSWORD</label>
                <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-white transition-colors">
                  Forgot password?
                <label className="block text-xs font-mono text-slate-400">PASSWORD</label>
                <Link href="/forgot-password" className="text-xs text-[#00a8ff] hover:text-[#00c8ff] transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 glass-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                  className="rounded bg-[#080c14] border-[rgba(0,168,255,0.3)] text-[#00a8ff] focus:ring-0"
                />
                <span>Remember session</span>
              </label>

              {/* Demo Auto-fill Helper */}
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center space-x-1 underline decoration-dotted"
              >
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Auto-fill Demo</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 shadow-lg shadow-white/5 mt-2"
              className="w-full py-2.5 btn-electric rounded-xl flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <span>Sign In as {activeRole.charAt(0) + activeRole.slice(1).toLowerCase()}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Call to Action */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-zinc-400 flex items-center justify-between">
            <span>New member joining the club?</span>
            <Link href="/register" className="text-white hover:underline font-semibold flex items-center space-x-1">
              <span>Register Here</span>
          {/* Bottom Link */}
          <div className="mt-6 pt-5 border-t border-[rgba(0,168,255,0.12)] text-center text-xs text-slate-400 flex items-center justify-between">
            <span>New coding club applicant?</span>
            <Link href="/register" className="text-[#00a8ff] hover:text-[#00c8ff] font-medium flex items-center space-x-1">
              <span>Register Account</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
