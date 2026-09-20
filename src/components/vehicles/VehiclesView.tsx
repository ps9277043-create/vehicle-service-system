import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Plus, 
  Gauge, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Fuel, 
  User, 
  Phone, 
  Wrench, 
  LayoutGrid, 
  List, 
  ShieldAlert, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleStatus, FuelType } from '../../types';

export const VehiclesView: React.FC = () => {
  const { 
    vehicles, 
    tickets, 
    schedules, 
    setIsAddVehicleOpen, 
    setIsCreateFaultOpen, 
    setIsBookServiceOpen, 
    setPreselectedVehicleId,
    setSelectedTicketId,
    searchQuery 
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [fuelFilter, setFuelFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState('');

  // Combined search from header or local input
  const activeSearch = (searchQuery || localSearch).toLowerCase().trim();

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (fuelFilter !== 'ALL' && v.fuelType !== fuelFilter) return false;
    if (activeSearch) {
      const matchVin = v.vin.toLowerCase().includes(activeSearch);
      const matchMake = v.make.toLowerCase().includes(activeSearch);
      const matchModel = v.model.toLowerCase().includes(activeSearch);
      const matchPlate = v.licensePlate.toLowerCase().includes(activeSearch);
      const matchOwner = v.ownerName.toLowerCase().includes(activeSearch);
      if (!matchVin && !matchMake && !matchModel && !matchPlate && !matchOwner) {
        return false;
      }
    }
    return true;
  });

  const handleReportFaultForCar = (vehicleId: string) => {
    setPreselectedVehicleId(vehicleId);
    setIsCreateFaultOpen(true);
  };

  const handleScheduleServiceForCar = (vehicleId: string) => {
    setPreselectedVehicleId(vehicleId);
    setIsBookServiceOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Chakra_Petch',sans-serif]">
            Vehicle Inventory &amp; Fleet Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage VIN profiles, odometer telemetry, service interval schedules, and assigned diagnostic alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddVehicleOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-mono transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by VIN, make, model, license plate, or owner..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({vehicles.length})</option>
              <option value="Operational">Operational</option>
              <option value="In Service">In Service</option>
              <option value="Critical Fault">Critical Fault</option>
              <option value="Attention Needed">Attention Needed</option>
            </select>
          </div>

          {/* Powertrain filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1.5 rounded-xl text-xs">
            <Fuel className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric (BEV)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles count display */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <span>Showing {filteredVehicles.length} of {vehicles.length} enrolled vehicles</span>
        {(statusFilter !== 'ALL' || fuelFilter !== 'ALL' || activeSearch) && (
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setFuelFilter('ALL');
              setLocalSearch('');
            }}
            className="text-amber-400 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const carTickets = tickets.filter(t => t.vehicleId === vehicle.id && t.stage !== 'Completed');
            const hasCritical = carTickets.some(t => t.severity === 'Critical');
            const carSchedules = schedules.filter(s => s.vehicleId === vehicle.id && s.status === 'Scheduled');

            // Mileage progress calculation
            const milesSinceService = Math.max(0, vehicle.mileage - (vehicle.lastServiceMileage || 0));
            const intervalTarget = 10000;
            const progressPercent = Math.min(100, Math.round((milesSinceService / intervalTarget) * 100));

            return (
              <div
                key={vehicle.id}
                className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top card bar: status badge & plate */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950 border border-slate-800 text-white tracking-wider">
                      {vehicle.licensePlate}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                      vehicle.status === 'Operational'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : vehicle.status === 'Critical Fault'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : vehicle.status === 'In Service'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Vehicle Name & VIN */}
                  <h3 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] group-hover:text-amber-400 transition-colors">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    VIN: <span className="text-slate-300">{vehicle.vin}</span>
                  </p>

                  {/* Telemetry chips: Mileage, Powertrain */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Odometer</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-white mt-0.5">
                        <Gauge className="w-3.5 h-3.5 text-amber-400" />
                        <span>{vehicle.mileage.toLocaleString()} mi</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Powertrain</span>
                      <div className="flex items-center gap-1 font-medium text-slate-200 mt-0.5">
                        <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate">{vehicle.fuelType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Interval Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Service Interval Progress</span>
                      <span className={progressPercent > 80 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progressPercent >= 90
                            ? 'bg-rose-500'
                            : progressPercent >= 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>Next Due: {vehicle.nextServiceDate}</span>
                      <span>Last: {vehicle.lastServiceMileage.toLocaleString()} mi</span>
                    </div>
                  </div>

                  {/* Active Faults & Tickets Mini Pills */}
                  {carTickets.length > 0 && (
                    <div className="mt-4 p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono font-semibold text-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          {carTickets.length} Active Fault {carTickets.length === 1 ? 'Ticket' : 'Tickets'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {carTickets.slice(0, 2).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTicketId(t.id)}
                            className="w-full text-left px-2 py-1 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between"
                          >
                            <span className="truncate">{t.ticketNumber}: {t.faultTitle}</span>
                            <span className="font-mono text-amber-400 ml-1 shrink-0">{t.stage}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Owner details */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{vehicle.ownerName}</span>
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">{vehicle.ownerPhone}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleReportFaultForCar(vehicle.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Report Fault</span>
                  </button>
                  <button
                    onClick={() => handleScheduleServiceForCar(vehicle.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Book Service</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 font-mono uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4">VIN</th>
                  <th className="py-3 px-4">Plate</th>
                  <th className="py-3 px-4">Odometer</th>
                  <th className="py-3 px-4">Powertrain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Next Service</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <span className="text-[11px] text-slate-400">{vehicle.ownerName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{vehicle.vin}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono font-semibold text-white">
                        {vehicle.licensePlate}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="py-3 px-4 text-slate-300">{vehicle.fuelType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        vehicle.status === 'Operational'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : vehicle.status === 'Critical Fault'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{vehicle.nextServiceDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleReportFaultForCar(vehicle.id)}
                          className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-[11px] font-mono border border-rose-500/30"
                        >
                          Fault
                        </button>
                        <button
                          onClick={() => handleScheduleServiceForCar(vehicle.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700"
                        >
                          Service
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
