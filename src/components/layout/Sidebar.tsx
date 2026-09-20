import React from 'react';
import { 
  LayoutDashboard, 
  CarFront, 
  AlertTriangle, 
  CalendarClock, 
  BarChart3, 
  RotateCcw,
  ShieldCheck,
  Wrench,
  UserCheck,
  CheckCircle,
  Zap,
  Sun,
  Moon,
  Contrast
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    tickets, 
    vehicles, 
    schedules, 
    currentRole,
    resetToSampleData,
    theme,
    setTheme
  } = useApp();

  const openTickets = tickets.filter(t => t.stage !== 'Completed');
  const criticalTickets = tickets.filter(t => t.severity === 'Critical' && t.stage !== 'Completed');
  const pendingSchedules = schedules.filter(s => s.status !== 'Completed');

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'vehicles' as const,
      label: 'Vehicles & Fleet',
      icon: CarFront,
      badge: vehicles.length,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'tickets' as const,
      label: 'Fault Reports & Kanban',
      icon: AlertTriangle,
      badge: openTickets.length,
      badgeColor: criticalTickets.length > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'schedules' as const,
      label: 'Service Schedules',
      icon: CalendarClock,
      badge: pendingSchedules.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'analytics' as const,
      label: 'Analytics & Costs',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 text-slate-300">
      {/* Navigation links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
          Main Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role context card */}
      <div className="mt-6 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Active Mode
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Verified
          </span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {currentRole === 'owner' && <CarFront className="w-4 h-4" />}
            {currentRole === 'technician' && <Wrench className="w-4 h-4" />}
            {currentRole === 'manager' && <ShieldCheck className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200 capitalize">
              {currentRole === 'owner' && 'Owner / Fleet Admin'}
              {currentRole === 'technician' && 'Service Technician'}
              {currentRole === 'manager' && 'Service Manager'}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {currentRole === 'owner' && 'Bookings & Fault Reports'}
              {currentRole === 'technician' && 'DTC Diagnostics & Repairs'}
              {currentRole === 'manager' && 'Full System Control'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          {currentRole === 'owner' && (
            <p className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Submit DTC codes &amp; track stages</span>
            </p>
          )}
          {currentRole === 'technician' && (
            <p className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Add diagnostic notes &amp; log parts</span>
            </p>
          )}
          {currentRole === 'manager' && (
            <p className="flex items-center gap-1.5 text-slate-400">
              <UserCheck className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Full dispatch, costs &amp; metrics</span>
            </p>
          )}
        </div>
      </div>

      {/* Fleet quick telemetry */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
          Diagnostic Telemetry
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Operational Fleet</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {vehicles.filter(v => v.status === 'Operational').length} / {vehicles.length}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Critical Alerts</span>
            <span className="font-mono text-rose-400 font-semibold">
              {criticalTickets.length}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>In Repair Bay</span>
            <span className="font-mono text-amber-400 font-semibold">
              {tickets.filter(t => t.stage === 'In Repair' || t.stage === 'In Inspection').length}
            </span>
          </div>
        </div>
      </div>

      {/* Background Theme Mode Selector */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Background Theme
          </span>
          <span className="text-[10px] font-mono text-amber-400 capitalize font-bold">{theme}</span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTheme('bright')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all ${
              theme === 'bright'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Light / Bright mode (high visibility daytime)"
          >
            <Sun className="w-3.5 h-3.5 mb-0.5" />
            <span>Bright</span>
          </button>
          <button
            onClick={() => setTheme('slate')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all ${
              theme === 'slate'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Slate mode (softer, brighter dark mode)"
          >
            <Contrast className="w-3.5 h-3.5 mb-0.5" />
            <span>Slate</span>
          </button>
          <button
            onClick={() => setTheme('midnight')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all ${
              theme === 'midnight'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Midnight mode (a little darker, deep obsidian)"
          >
            <Moon className="w-3.5 h-3.5 mb-0.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Reset Data CTA at bottom */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            if (confirm('Reset application data back to default sample state?')) {
              resetToSampleData();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-all cursor-pointer font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
};
