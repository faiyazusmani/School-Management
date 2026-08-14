import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Send, Shield, Heart } from 'lucide-react';
import { toast } from '../ui/toast';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Subscribed to EduManage Pro updates & educational whitepapers!');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 dark:bg-slate-950 light:bg-slate-900 border-t border-slate-900 dark:border-slate-900 light:border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                EduManage <span className="text-indigo-400">PRO</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The next-generation SaaS school operating system empowering administrators, educators, students, and parents worldwide.
            </p>
            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter work email for updates"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features Grid</a></li>
              <li><a href="#statistics" className="hover:text-indigo-400 transition-colors">Uptime & Metrics</a></li>
              <li><a href="#teachers" className="hover:text-indigo-400 transition-colors">Faculty Roster</a></li>
              <li><a href="#gallery" className="hover:text-indigo-400 transition-colors">Campus Tour</a></li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Role Portals
            </h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Super Admin Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Teacher Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Parent Portal</Link></li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Security & Legal
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-indigo-400 cursor-pointer">FERPA & GDPR Compliance</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Security Whitepaper</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 EduManage Pro Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for global educational institutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
