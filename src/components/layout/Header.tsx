import React from 'react';
import { 
  Wrench, 
  Car, 
  ShieldAlert, 
  PlusCircle, 
  CalendarPlus, 
  Search, 
  CheckCircle2, 
  Activity,
  Sparkles,
  Users,
  Sun,
  Moon,
  Contrast
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, ThemeMode } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    searchQuery, 
    setSearchQuery,
    setIsCreateFaultOpen,
    setIsBookServiceOpen,
    tickets,
    theme,
    setTheme
  } = useApp();

  const criticalCount = tickets.filter(t => t.severity === 'Critical' && t.stage !== 'Completed').length;

  const roles: { id: UserRole; label: string; icon: any; desc: string }[] = [
    { 
      id: 'owner', 
      label: 'Vehicle Owner', 
      icon: Car,
      desc: 'Owner / Fleet View'
    },
    { 
      id: 'technician', 
      label: 'Technician', 
      icon: Wrench,
      desc: 'Diagnostic & Repair'
    },
    { 
      id: 'manager', 
      label: 'Service Manager', 
      icon: Users,
      desc: 'Admin & Analytics'
    }
  ];

  const themeOptions: { id: ThemeMode; label: string; icon: any; title: string }[] = [
    { 
      id: 'bright', 
      label: 'Bright', 
      icon: Sun, 
      title: 'Bright Mode: Light, crisp daylight workshop theme' 
    },
    { 
      id: 'slate', 
      label: 'Slate', 
      icon: Contrast, 
      title: 'Slate Mode: Balanced dark, softer and brighter than pitch black' 
    },
    { 
      id: 'midnight', 
      label: 'Midnight', 
      icon: Moon, 
      title: 'Midnight Mode: Deep obsidian dark, ultra-dark contrast' 
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand and system status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-['Chakra_Petch',sans-serif]">
                  TORQUE<span className="text-amber-500">OPS</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  OBD-II LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Vehicle Service &amp; Fault Management System</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search VIN, model, DTC code (e.g. P0300), plate..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Role switcher & Action CTA */}
          <div className="flex items-center gap-3">
            {/* Role switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 hidden lg:inline-block">
                Role:
              </span>
              <div className="flex gap-1">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isActive = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setCurrentRole(r.id)}
                      title={r.desc}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Theme Selector: Bright / Slate / Midnight */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-1.5 hidden 2xl:inline-block">
                Theme:
              </span>
              <div className="flex gap-0.5">
                {themeOptions.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`theme-btn-${t.id}`}
                      onClick={() => setTheme(t.id)}
                      title={t.title}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-header-report-fault"
                onClick={() => setIsCreateFaultOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Report Fault</span>
                {criticalCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-200 border border-rose-400/40">
                    {criticalCount}
                  </span>
                )}
              </button>

              <button
                id="btn-header-book-service"
                onClick={() => setIsBookServiceOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                <span className="whitespace-nowrap">Schedule Service</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
