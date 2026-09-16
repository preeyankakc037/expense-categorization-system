import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, BotMessageSquare } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'AI Assistant', path: '/assistant', icon: BotMessageSquare },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          Expense AI
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm',
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive ? 'text-primary-600' : 'text-slate-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
            U
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-700">User Account</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
