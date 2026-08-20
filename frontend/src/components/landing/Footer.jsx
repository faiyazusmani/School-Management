import React, { useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Github, GraduationCap } from 'lucide-react';
import { toast } from '../ui/toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed to EduManage PRO updates & newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-7xl mx-auto bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-12 shadow-2xl space-y-12 relative overflow-hidden">
        {/* Subtle Brand Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none -z-0" />

        {/* Top Header Row: Brand Badge, Quote & Subscribe */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-6 border-b border-slate-800/80">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                EduManage <span className="text-indigo-400">PRO</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Empower Your School Operations – <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                One Campus At A Time.
              </span>
            </h2>
          </div>

          <div className="w-full lg:w-auto space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Get In Touch!</h3>
            <form onSubmit={handleSubscribe} className="flex items-center bg-slate-950/90 border border-indigo-500/40 focus-within:border-indigo-400 rounded-full p-1.5 pl-5 max-w-md w-full transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none flex-1 w-full"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all shrink-0 shadow-lg shadow-indigo-500/25 hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* 4-Column Section */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
              CONTACT INFORMATION
            </h4>
            <div className="space-y-3 text-xs pt-1">
              <a
                href="mailto:faiyazusmani068@gmail.com"
                className="flex items-center gap-2.5 text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all"
                title="Send email to faiyazusmani068@gmail.com"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>faiyazusmani068@gmail.com</span>
              </a>
              <a
                href="tel:8114103889"
                className="flex items-center gap-2.5 text-slate-200 font-semibold hover:text-indigo-400 transition-colors"
                title="Call +91 8114103889"
              >
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 8114103889</span>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#statistics" className="hover:text-indigo-400 transition-colors">Pricing & Plans</a></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              HELP
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
              <li><a href="#help" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#support" className="hover:text-indigo-400 transition-colors">Support Portal</a></li>
              <li><a href="#security" className="hover:text-indigo-400 transition-colors">Security Compliance</a></li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              FOLLOW US
            </h4>
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook Link */}
              <a
                href="https://www.facebook.com/faiyaz.usmani.16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                title="Open Faiyaz Usmani Facebook Profile"
                className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 text-slate-200 flex items-center justify-center hover:bg-gradient-to-tr hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer group"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>

              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/faiyaz_usmani_01/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                title="Open Faiyaz Usmani Instagram Profile"
                className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 text-slate-200 flex items-center justify-center hover:bg-gradient-to-tr hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer group"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/faiyazusmani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="Open Faiyaz Usmani GitHub Profile"
                className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 text-slate-200 flex items-center justify-center hover:bg-gradient-to-tr hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-400 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer group"
              >
                <Github className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policy Bar */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© 2026 EduManage PRO. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-indigo-400 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
