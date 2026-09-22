import { Receipt, Mail, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white shadow-sm relative overflow-hidden">
      {/* Decorative gradient element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 opacity-80" />
      
      <div className="px-8 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 group-hover:bg-primary-500 transition-all duration-300">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-slate-600">
                Expense AI
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              The smartest way to track, manage, and optimize your personal and business expenses powered by AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-slate-800 tracking-wide uppercase text-xs">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-block hover:-translate-y-0.5 duration-200">Dashboard</Link></li>
              <li><Link to="/expenses" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-block hover:-translate-y-0.5 duration-200">All Expenses</Link></li>
              <li><Link to="/assistant" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-block hover:-translate-y-0.5 duration-200">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="col-span-1 space-y-4">
            <h4 className="font-semibold text-slate-800 tracking-wide uppercase text-xs">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Expense AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" /> 
          </p>
        </div>
      </div>
    </footer>
  );
}