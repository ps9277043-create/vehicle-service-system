import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Kanban, 
  Table as TableIcon, 
  Search, 
  Plus, 
  Filter, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Gauge, 
  DollarSign,
  Package,
  Wrench
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TicketStage, FaultSeverity, FaultTicket } from '../../types';
import { formatINR } from '../../utils/currency';

const STAGES: { id: TicketStage; label: string; color: string }[] = [
  { id: 'Fault Reported', label: 'Fault Reported', color: 'border-slate-700 bg-slate-900/60' },
  { id: 'In Inspection', label: 'In Inspection', color: 'border-blue-800/60 bg-blue-950/20' },
  { id: 'Parts Ordered', label: 'Parts Ordered', color: 'border-purple-800/60 bg-purple-950/20' },
  { id: 'In Repair', label: 'In Repair', color: 'border-amber-800/60 bg-amber-950/20' },
  { id: 'Ready for Pickup', label: 'Ready for Pickup', color: 'border-cyan-800/60 bg-cyan-950/20' },
  { id: 'Completed', label: 'Completed', color: 'border-emerald-800/60 bg-emerald-950/20' },
];

export const TicketsView: React.FC = () => {
  const { 
    tickets, 
    updateTicketStage, 
    setSelectedTicketId, 
    setIsCreateFaultOpen, 
    searchQuery 
  } = useApp();

  const [viewType, setViewType] = useState<'kanban' | 'table'>('kanban');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');

  const activeSearch = (searchQuery || localSearch).toLowerCase().trim();

  const filteredTickets = tickets.filter((t) => {
    if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;
    if (stageFilter !== 'ALL' && t.stage !== stageFilter) return false;
    if (activeSearch) {
      const matchNum = t.ticketNumber.toLowerCase().includes(activeSearch);
      const matchTitle = t.faultTitle.toLowerCase().includes(activeSearch);
      const matchVeh = t.vehicleName.toLowerCase().includes(activeSearch);
      const matchVin = t.vehicleVin.toLowerCase().includes(activeSearch);
      const matchDtc = t.dtcCodes.some(c => c.toLowerCase().includes(activeSearch));
      const matchTech = t.assignedTechnicianName?.toLowerCase().includes(activeSearch);
      if (!matchNum && !matchTitle && !matchVeh && !matchVin && !matchDtc && !matchTech) {
        return false;
      }
    }
    return true;
  });

  const handleAdvanceStage = (e: React.MouseEvent, ticket: FaultTicket) => {
    e.stopPropagation();
    const currentIndex = STAGES.findIndex(s => s.id === ticket.stage);
    if (currentIndex < STAGES.length - 1) {
      updateTicketStage(ticket.id, STAGES[currentIndex + 1].id);
    }
  };

  const handleRegressStage = (e: React.MouseEvent, ticket: FaultTicket) => {
    e.stopPropagation();
    const currentIndex = STAGES.findIndex(s => s.id === ticket.stage);
    if (currentIndex > 0) {
      updateTicketStage(ticket.id, STAGES[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Chakra_Petch',sans-serif]">
            Fault Tickets &amp; Diagnostic Kanban Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active OBD-II codes through inspection, parts procurement, service bay repair, and handover
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch Kanban vs Table */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewType('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'kanban' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewType === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateFaultOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 font-mono transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Fault Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by Ticket # (FLT-xxxx), DTC code (P0300), vehicle, technician..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical (Red)</option>
              <option value="Medium">Medium (Orange)</option>
              <option value="Low">Low (Green)</option>
            </select>
          </div>

          {/* Stage filter for table view */}
          {viewType === 'table' && (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-xl text-xs">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Stages</option>
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Visual Kanban Columns View */}
      {viewType === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1100px]">
            {STAGES.map((stageObj, stageIdx) => {
              const stageTickets = filteredTickets.filter(t => t.stage === stageObj.id);
              return (
                <div
                  key={stageObj.id}
                  className={`rounded-2xl border ${stageObj.color} p-3 flex flex-col min-h-[580px] shadow-inner`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <h3 className="text-xs font-bold text-slate-200 font-['Chakra_Petch',sans-serif] truncate">
                        {stageObj.label}
                      </h3>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
                      {stageTickets.length}
                    </span>
                  </div>

                  {/* Ticket Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                    {stageTickets.map((ticket) => {
                      const partsCost = ticket.parts.reduce((s, p) => s + p.totalCost, 0);
                      const laborCost = ticket.laborHours * ticket.laborHourlyRate;
                      const totalEst = partsCost + laborCost;

                      return (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="group relative rounded-xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/60 p-3.5 shadow-md hover:shadow-xl transition-all cursor-pointer text-left"
                        >
                          {/* Top: Ticket Number & Severity Badge */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="font-mono text-xs font-bold text-amber-400">
                              {ticket.ticketNumber}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              ticket.severity === 'Critical'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : ticket.severity === 'Medium'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {ticket.severity}
                            </span>
                          </div>

                          {/* Fault Title */}
                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                            {ticket.faultTitle}
                          </h4>

                          {/* Vehicle Info */}
                          <p className="text-[11px] text-slate-400 mt-1 truncate">
                            {ticket.vehicleName}
                          </p>

                          {/* DTC Codes Chips */}
                          {ticket.dtcCodes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {ticket.dtcCodes.map((code) => (
                                <span
                                  key={code}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                >
                                  {code}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Telemetry Footer: Odometer & Cost */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{ticket.odometerAtFault.toLocaleString()} mi</span>
                            <span className="font-bold text-slate-200">
                              {formatINR(totalEst)}
                            </span>
                          </div>

                          {/* Technician Assignment */}
                          {ticket.assignedTechnicianName && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 truncate">
                              <Wrench className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              <span className="truncate">{ticket.assignedTechnicianName}</span>
                            </div>
                          )}

                          {/* Stage Transition Arrows */}
                          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            {stageIdx > 0 ? (
                              <button
                                type="button"
                                onClick={(e) => handleRegressStage(e, ticket)}
                                title="Move to previous stage"
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-mono flex items-center gap-0.5"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>Back</span>
                              </button>
                            ) : <div />}

                            {stageIdx < STAGES.length - 1 && (
                              <button
                                type="button"
                                onClick={(e) => handleAdvanceStage(e, ticket)}
                                title="Advance to next stage"
                                className="p-1 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold flex items-center gap-0.5"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {stageTickets.length === 0 && (
                      <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-500 font-mono">
                        No tickets in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Table View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 font-mono uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Fault Title &amp; DTC</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4 text-right">Est. Cost</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTickets.map((ticket) => {
                  const partsCost = ticket.parts.reduce((s, p) => s + p.totalCost, 0);
                  const laborCost = ticket.laborHours * ticket.laborHourlyRate;
                  const totalEst = partsCost + laborCost;

                  return (
                    <tr 
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {ticket.ticketNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{ticket.vehicleName}</div>
                        <span className="text-[10px] font-mono text-slate-400">{ticket.vehicleVin}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ticket.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : ticket.severity === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {ticket.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{ticket.faultTitle}</div>
                        {ticket.dtcCodes.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {ticket.dtcCodes.map(c => (
                              <span key={c} className="font-mono text-[10px] bg-slate-800 px-1 rounded text-amber-400">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                          {ticket.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {ticket.assignedTechnicianName || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        {formatINR(totalEst, true)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicketId(ticket.id);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700"
                        >
                          Diagnose
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
