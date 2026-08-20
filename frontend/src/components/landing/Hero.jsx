import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Award, Bell, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Hero = () => {
  const [pulseCount, setPulseCount] = useState(1450);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + (Math.floor(Math.random() * 3) - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-8 lg:pt-16 lg:pb-10 bg-slate-950 text-slate-100">
      {/* Dynamic Animated Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute -top-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-bounce" style={{ animationDuration: '8s' }} />
      <div className="absolute -top-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Hero Headline Group */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Animated Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 backdrop-blur-md shadow-lg shadow-indigo-500/10 hover:border-indigo-400 transition-all cursor-pointer">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs font-bold text-indigo-300 tracking-wide">
              Next-Gen School SaaS v2.5 Released
            </span>
            <Badge variant="purple" className="text-[10px] uppercase animate-pulse">PRODUCTION READY</Badge>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Empower Your School With{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligent Management
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            EduManage Pro unifies Super Admins, Teachers, and Students into a seamless, high-performance web OS with automated grading, real-time attendance, and role-based intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <a href="#features">
              <Button size="lg" variant="primary" className="shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all duration-300 font-bold px-8">
                View Features <ArrowRight className="w-5 h-5 ml-1.5" />
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-1 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role-Based Access (RBAC)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>JWT + bcrypt Security</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 hover:border-purple-500/50 transition-colors">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Dark & Light Themes</span>
            </div>
          </div>
        </div>

        {/* 🌟 ANIMATED INTERACTIVE FEATURE SHOWCASE GRID (Covers space tightly) */}
        <div className="pt-2 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature Card 1: Attendance Ticker */}
            <div className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  96.8% RATE
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Real-Time Attendance
                </h4>
                <p className="text-xs text-slate-400 mt-1">Instant Present / Leave / Late logs with automated calculations.</p>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[96.8%] rounded-full animate-pulse" />
              </div>
            </div>

            {/* Feature Card 2: Live Notice Board */}
            <div className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  LIVE BROADCAST
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Instant Notice Board
                </h4>
                <p className="text-xs text-slate-400 mt-1">Publish notices to Teachers & Students in under 1 second.</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Sports Meet Announced
              </div>
            </div>

            {/* Feature Card 3: Automated Gradebook */}
            <div className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  GPA 3.88 / 4.0
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Exam & Grade System
                </h4>
                <p className="text-xs text-slate-400 mt-1">Automated grade computation & PDF transcript exports.</p>
              </div>
              <div className="flex items-center justify-between text-xs text-purple-300 font-bold bg-purple-500/10 p-1.5 rounded-lg border border-purple-500/20">
                <span>Grade 12 Results</span>
                <span className="text-emerald-400">Published ✓</span>
              </div>
            </div>

            {/* Feature Card 4: Enrolled Students */}
            <div className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  ACTIVE USERS
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Enrolled Students
                </h4>
                <p className="text-xs text-slate-400 mt-1">Real-time student registry & profile demographics.</p>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-300 font-extrabold bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                <span>Total Registered</span>
                <span className="text-white font-mono">{pulseCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
