import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Car, 
  Wrench, 
  DollarSign, 
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleStatus } from '../../types';
import { formatINR } from '../../utils/currency';

export const SchedulesView: React.FC = () => {
  const { 
    schedules, 
    updateScheduleStatus, 
    setIsBookServiceOpen,
    vehicles 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredSchedules = schedules.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const scheduledCount = schedules.filter(s => s.status === 'Scheduled').length;
  const inProgressCount = schedules.filter(s => s.status === 'In Progress').length;
  const completedCount = schedules.filter(s => s.status === 'Completed').length;
  const urgentCount = schedules.filter(s => s.priority === 'Urgent' && s.status !== 'Completed').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Chakra_Petch',sans-serif]">
            Preventive Service &amp; Maintenance Schedules
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track routine oil changes, brake inspections, tire rotations, and scheduled interval overhauls
          </p>
        </div>

        <button
          onClick={() => setIsBookServiceOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-mono transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Routine Service</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Upcoming Scheduled</span>
            <CalendarClock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{scheduledCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Bookings waiting for bay opening</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>In Service Bays</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">{inProgressCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Active jobs on lifts right now</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Urgent Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">{urgentCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Priority safety check intervals</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 uppercase">
            <span>Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">{completedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Service logged to vehicle history</p>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'ALL', label: 'All Services' },
          { id: 'Scheduled', label: 'Scheduled' },
          { id: 'In Progress', label: 'In Progress' },
          { id: 'Completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
              statusFilter === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schedules Cards List */}
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => {
          const vehicle = vehicles.find(v => v.id === schedule.vehicleId);

          return (
            <div
              key={schedule.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {schedule.scheduleNumber}
                  </span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono uppercase ${
                    schedule.priority === 'Urgent'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {schedule.priority}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    schedule.status === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : schedule.status === 'In Progress'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}>
                    {schedule.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                  {schedule.serviceType}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-medium text-slate-200">{schedule.vehicleName}</span>
                  {vehicle && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-400">VIN: {vehicle.vin}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{vehicle.mileage.toLocaleString()} mi</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Tech: <strong className="text-slate-300">{schedule.assignedTechnician || 'Unassigned'}</strong></span>
                </div>

                {schedule.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <strong className="text-slate-300">Shop Instructions:</strong> {schedule.notes}
                  </p>
                )}
              </div>

              {/* Booking Date, Estimates & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Due: {schedule.scheduledDate}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Est. {formatINR(schedule.estimatedCost)} • {schedule.estimatedDurationHours} hrs
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2">
                  {schedule.status === 'Scheduled' && (
                    <button
                      onClick={() => updateScheduleStatus(schedule.id, 'In Progress')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Start Service</span>
                    </button>
                  )}

                  {schedule.status === 'In Progress' && (
                    <button
                      onClick={() => updateScheduleStatus(schedule.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 font-mono transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {schedule.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed {schedule.completedDate || ''}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredSchedules.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
            No service schedules found matching the selected filter.
          </div>
        )}
      </div>

    </div>
  );
};
