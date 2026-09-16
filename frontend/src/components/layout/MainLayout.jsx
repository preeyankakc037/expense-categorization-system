import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, Receipt, BotMessageSquare } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Assistant', path: '/assistant', icon: BotMessageSquare },
];

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center p-2 rounded-lg transition-colors',
                isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
