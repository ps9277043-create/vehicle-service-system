import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Wrench, 
  Users, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Activity,
  Award,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DTC_LIBRARY } from '../../data/mockData';
import { formatINR } from '../../utils/currency';

export const AnalyticsView: React.FC = () => {
  const { tickets, vehicles, schedules, technicians } = useApp();

  // Financial aggregates
  const totalPartsCost = tickets.reduce((acc, t) => {
    return acc + t.parts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  }, 0);

  const totalLaborCost = tickets.reduce((acc, t) => {
    return acc + ((t.laborHours || 0) * (t.laborHourlyRate || 145));
  }, 0);

  const routineServiceRevenue = schedules.reduce((acc, s) => {
    return acc + (s.status === 'Completed' ? s.estimatedCost : 0);
  }, 0);

  const grandTotalRevenue = totalPartsCost + totalLaborCost + routineServiceRevenue;

  // DTC Frequency map
  const dtcCounts: { [code: string]: number } = {};
  tickets.forEach(t => {
    t.dtcCodes.forEach(c => {
      dtcCounts[c] = (dtcCounts[c] || 0) + 1;
    });
  });

  const sortedDtc = Object.entries(dtcCounts).sort((a, b) => b[1] - a[1]);

  // Stage distribution
  const stageStats = [
    { label: 'Fault Reported', count: tickets.filter(t => t.stage === 'Fault Reported').length, color: 'bg-slate-700' },
    { label: 'In Inspection', count: tickets.filter(t => t.stage === 'In Inspection').length, color: 'bg-blue-600' },
    { label: 'Parts Ordered', count: tickets.filter(t => t.stage === 'Parts Ordered').length, color: 'bg-purple-600' },
    { label: 'In Repair', count: tickets.filter(t => t.stage === 'In Repair').length, color: 'bg-amber-500' },
    { label: 'Ready for Pickup', count: tickets.filter(t => t.stage === 'Ready for Pickup').length, color: 'bg-cyan-500' },
    { label: 'Completed', count: tickets.filter(t => t.stage === 'Completed').length, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-['Chakra_Petch',sans-serif]">
          Service Center Analytics &amp; Operations Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Revenue realization, technician utilization, OBD-II failure root causes, and fleet reliability benchmarks
        </p>
      </div>

      {/* Top 4 KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Total Realized Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {formatINR(grandTotalRevenue, true)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Parts + Diagnostic Labor + Scheduled services</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Mean Turnaround</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            2.4 Days
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From intake scan to vehicle release</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>First-Time Fix Rate</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">
            96.2%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero recurrent DTC faults within 60 days</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Active Tech Capacity</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-400">
            {technicians.reduce((a, b) => a + b.activeJobsCount, 0)} Active Bays
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Balanced load across 4 certified techs</p>
        </div>

      </div>

      {/* 2-Column: Financial Breakdown & Lifecycle Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cost & Revenue Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] mb-1">
            Service Cost &amp; Billing Breakdown
          </h2>
          <p className="text-xs text-slate-400 mb-4">Allocations between OEM replacement parts and shop labor</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>Shop Diagnostic &amp; Repair Labor (₹1,200-₹1,500/hr)</span>
                <span className="font-bold text-white">{formatINR(totalLaborCost, true)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${grandTotalRevenue > 0 ? (totalLaborCost / grandTotalRevenue) * 100 : 50}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>Replacement Parts &amp; Hardware Billed</span>
                <span className="font-bold text-white">{formatINR(totalPartsCost, true)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full" 
                  style={{ width: `${grandTotalRevenue > 0 ? (totalPartsCost / grandTotalRevenue) * 100 : 35}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>Scheduled Routine Maintenance Packages</span>
                <span className="font-bold text-white">{formatINR(routineServiceRevenue, true)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${grandTotalRevenue > 0 ? (routineServiceRevenue / grandTotalRevenue) * 100 : 15}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Labor %</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {grandTotalRevenue > 0 ? Math.round((totalLaborCost / grandTotalRevenue) * 100) : 55}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Parts %</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {grandTotalRevenue > 0 ? Math.round((totalPartsCost / grandTotalRevenue) * 100) : 35}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Avg Ticket</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {formatINR(tickets.length > 0 ? grandTotalRevenue / tickets.length : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Lifecycle Stage Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] mb-1">
            Work Order Stage Pipeline
          </h2>
          <p className="text-xs text-slate-400 mb-4">Volume of repair tickets traversing each bay phase</p>

          <div className="space-y-3">
            {stageStats.map((st) => (
              <div key={st.label} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{st.label}</span>
                  <span className="text-white font-bold">{st.count} tickets</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${st.color} rounded-full transition-all`}
                    style={{ width: `${tickets.length > 0 ? (st.count / tickets.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total tickets in system: <strong className="text-white">{tickets.length}</strong></span>
            <span className="text-emerald-400">Resolution rate: 85%</span>
          </div>
        </div>

      </div>

      {/* 2-Column: Technician Workloads & Frequent DTC Fault Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Technician Workload & Performance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] mb-1">
            Technician Workload &amp; Performance
          </h2>
          <p className="text-xs text-slate-400 mb-4">Active jobs in bays, month completions, and customer feedback</p>

          <div className="space-y-3">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">{tech.name}</h3>
                    <p className="text-[11px] text-slate-400">{tech.specialty}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                      <span className="text-amber-400 font-bold">★ {tech.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{tech.completedThisMonth} jobs closed this mo</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    tech.status === 'On Job'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {tech.status}
                  </span>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    {tech.activeJobsCount} Active {tech.activeJobsCount === 1 ? 'Job' : 'Jobs'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Frequent OBD-II Diagnostic Codes */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] mb-1">
            Fleet OBD-II DTC Code Frequency
          </h2>
          <p className="text-xs text-slate-400 mb-4">Recurring diagnostic codes flagged during scan tool inspections</p>

          <div className="space-y-3">
            {sortedDtc.length > 0 ? (
              sortedDtc.map(([code, count]) => {
                const def = DTC_LIBRARY.find(d => d.code === code);
                return (
                  <div key={code} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {code}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">
                          {def ? def.title : 'Diagnostic Code'}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        {count} {count === 1 ? 'instance' : 'instances'}
                      </span>
                    </div>
                    {def && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        System: {def.system} • Severity: {def.severity}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 font-mono">No DTC codes logged.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
