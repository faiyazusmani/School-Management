import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, BookOpen, DollarSign, Bell, ArrowRight, Command } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchDatabase = [
    { title: 'Alex Rivera (Student)', category: 'Student', route: '/dashboard/students', desc: 'Grade 11-A • Roll #101' },
    { title: 'Dr. Sarah Connor (Faculty)', category: 'Teacher', route: '/dashboard/teachers', desc: 'Department Head • Physics' },
    { title: 'Marcus Rivera (Parent)', category: 'Parent', route: '/dashboard/parents', desc: 'Parent of Lucas & Sophia' },
    { title: 'Grade 11-A (Class)', category: 'Class', route: '/dashboard/classes', desc: 'Room Lab 204 • 36 Students' },
    { title: 'Advanced Physics (Subject)', category: 'Subject', route: '/dashboard/subjects', desc: 'Code: PHY-301 • 4 Credits' },
    { title: 'Term 1 Tuition Invoice', category: 'Invoice', route: '/dashboard/fees', desc: 'INV-2026-001 • Billed ₹45,000' },
    { title: 'Annual Sports Day Registration', category: 'Notice', route: '/dashboard/notices', desc: 'Official School Announcement' },
  ];

  const results = query
    ? searchDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchDatabase.slice(0, 4);

  const handleSelect = (route) => {
    navigate(route);
    onClose();
    setQuery('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent handler
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search everywhere (Students, Faculty, Invoices, Classes)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results list */}
        <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {query ? `Search Results (${results.length})` : 'Popular Shortcuts'}
          </div>

          {results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching records found for "{query}"
            </div>
          ) : (
            results.map((res, i) => (
              <div
                key={i}
                onClick={() => handleSelect(res.route)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-600/20 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                      {res.title}
                    </span>
                    <Badge variant="purple" className="text-[9px] py-0">
                      {res.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{res.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">ESC</kbd> to exit
          </span>
          <span>Global Search Palette v2.5</span>
        </div>
      </div>
    </div>
  );
};
