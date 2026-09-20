import React from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Car, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Plus,
  Cpu,
  Users,
  Activity,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TicketStage, FaultSeverity } from '../../types';
import { formatINR } from '../../utils/currency';

export const DashboardView: React.FC = () => {
  const { 
    currentRole, 
    vehicles, 
    tickets, 
    schedules, 
    technicians, 
    setSelectedTicketId, 
    setIsCreateFaultOpen, 
    setIsBookServiceOpen,
    setIsAddVehicleOpen,
    setActiveTab 
  } = useApp();

  const openTickets = tickets.filter(t => t.stage !== 'Completed');
  const criticalTickets = tickets.filter(t => t.severity === 'Critical' && t.stage !== 'Completed');
  const upcomingSchedules = schedules.filter(s => s.status === 'Scheduled');

  // Financial calculations
  const totalCostRepairs = tickets.reduce((acc, t) => {
    const partsSum = t.parts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    const laborSum = (t.laborHours || 0) * (t.laborHourlyRate || 145);
    return acc + partsSum + laborSum;
  }, 0);

  const STAGES: TicketStage[] = [
    'Fault Reported',
    'In Inspection',
    'Parts Ordered',
    'In Repair',
    'Ready for Pickup',
    'Completed'
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Role-tailored Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>
                {currentRole === 'owner' && 'FLEET OWNER CONSOLE'}
                {currentRole === 'technician' && 'TECHNICIAN WORKSTATION // BAY 03'}
                {currentRole === 'manager' && 'SERVICE OPERATIONS OVERVIEW'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-['Chakra_Petch',sans-serif]">
              {currentRole === 'owner' && 'Vehicle Fleet & Service Tracking'}
              {currentRole === 'technician' && 'Assigned Diagnostics & Repair Tasks'}
              {currentRole === 'manager' && 'Service Center & Fault Management'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {currentRole === 'owner' && 'Monitor vehicle operating health, submit diagnostic fault codes, and track technician progress in real time.'}
              {currentRole === 'technician' && 'Inspect OBD-II trouble codes, record scope waveforms, log replaced components, and advance repair stages.'}
              {currentRole === 'manager' && 'Control technician dispatch, monitor fleet uptime, analyze servicing margins, and resolve open tickets.'}
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreateFaultOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report DTC Fault</span>
            </button>
            <button
              onClick={() => setIsBookServiceOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Service</span>
            </button>
            {currentRole !== 'technician' && (
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Vehicle</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Critical Faults High-Priority Alert Banner */}
      {criticalTickets.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 shadow-lg shadow-rose-950/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-200">
                    {criticalTickets.length} Critical Fault {criticalTickets.length === 1 ? 'Alert' : 'Alerts'} Require Attention
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white uppercase">
                    Urgent
                  </span>
                </div>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  Vehicles flagged with serious powertrain, brake, or airbag malfunctions. Inspect immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {criticalTickets.slice(0, 2).map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setSelectedTicketId(ct.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition-all flex items-center gap-1"
                >
                  <span>{ct.ticketNumber} ({ct.vehicleName.split(' ')[1] || 'Auto'})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Open Fault Tickets */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Open Tickets</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{openTickets.length}</span>
            <span className="text-xs text-slate-400 font-mono">/ {tickets.length} total</span>
          </div>
          <div className="mt-2 text-xs flex items-center gap-2 text-slate-400">
            <span className="text-rose-400 font-mono font-semibold">{criticalTickets.length} critical</span>
            <span>•</span>
            <span className="text-amber-400 font-mono font-semibold">{openTickets.length - criticalTickets.length} standard</span>
          </div>
        </div>

        {/* Servicing & Repair Value */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Repair Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{formatINR(totalCostRepairs)}</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +8.4%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Labor &amp; parts billed across active tickets
          </p>
        </div>

        {/* Fleet Operational Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Fleet Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {Math.round((vehicles.filter(v => v.status === 'Operational').length / Math.max(1, vehicles.length)) * 100)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {vehicles.filter(v => v.status === 'Operational').length}/{vehicles.length} running
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {vehicles.filter(v => v.status !== 'Operational').length} vehicles under service/repair
          </p>
        </div>

        {/* Scheduled Routine Services */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Upcoming Services</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{upcomingSchedules.length}</span>
            <span className="text-xs text-slate-400 font-mono">scheduled</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {schedules.filter(s => s.priority === 'Urgent' && s.status === 'Scheduled').length} urgent maintenance intervals
          </p>
        </div>

      </div>

      {/* Visual Pipeline Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            Repair Workflow Stage Distribution
          </h2>
          <button
            onClick={() => setActiveTab('tickets')}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {STAGES.map((stage) => {
            const count = tickets.filter(t => t.stage === stage).length;
            return (
              <div 
                key={stage}
                onClick={() => setActiveTab('tickets')}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all"
              >
                <span className="text-[11px] text-slate-400 block truncate">{stage}</span>
                <span className="text-xl font-mono font-bold text-white mt-1 block">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Recent Fault Tickets & Upcoming Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Active Fault Tickets */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                Active Diagnostic Tickets
              </h2>
              <p className="text-xs text-slate-400">Reported issues, OBD-II DTC codes, and live repair statuses</p>
            </div>
            <button
              onClick={() => setActiveTab('tickets')}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono"
            >
              View All ({tickets.length})
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {tickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {ticket.ticketNumber}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-semibold uppercase ${
                      ticket.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : ticket.severity === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {ticket.severity}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {ticket.stage}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {ticket.faultTitle}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">{ticket.vehicleName}</span>
                  {ticket.dtcCodes.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1">
                        {ticket.dtcCodes.map((code) => (
                          <span key={code} className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded text-[10px]">
                            {code}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {ticket.assignedTechnicianName && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">Tech: {ticket.assignedTechnicianName}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Routine Service Schedules */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                Service &amp; Maintenance Schedule
              </h2>
              <p className="text-xs text-slate-400">Routine oil changes, brake checks, and scheduled intervals</p>
            </div>
            <button
              onClick={() => setActiveTab('schedules')}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono"
            >
              Calendar ({schedules.length})
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {schedules.slice(0, 4).map((schedule) => (
              <div
                key={schedule.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {schedule.scheduleNumber}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono uppercase ${
                      schedule.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {schedule.priority}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white">
                    {schedule.serviceType}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {schedule.vehicleName} • Tech: {schedule.assignedTechnician || 'Unassigned'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{schedule.scheduledDate}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                    Est. {formatINR(schedule.estimatedCost)} ({schedule.estimatedDurationHours}h)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
