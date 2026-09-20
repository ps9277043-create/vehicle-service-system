import React, { useState, useEffect } from 'react';
import { X, CalendarClock, Car, Wrench, Plus, DollarSign, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceType } from '../../types';

const SERVICE_CATALOG: { type: ServiceType; defaultHours: number; defaultCost: number }[] = [
  { type: 'Oil & Filter Change', defaultHours: 1.0, defaultCost: 6500 },
  { type: 'Comprehensive Brake Inspection', defaultHours: 1.5, defaultCost: 12000 },
  { type: 'Tire Rotation & Balance', defaultHours: 1.0, defaultCost: 2500 },
  { type: 'Transmission Fluid Service', defaultHours: 2.0, defaultCost: 18500 },
  { type: 'Battery & Electrical Diagnostics', defaultHours: 1.0, defaultCost: 4500 },
  { type: 'Scheduled 60,000 Mile Overhaul', defaultHours: 3.5, defaultCost: 32000 },
  { type: 'Cooling System Flush', defaultHours: 1.5, defaultCost: 8500 },
  { type: 'Multi-Point Safety Inspection', defaultHours: 1.0, defaultCost: 3500 },
];

export const BookServiceModal: React.FC = () => {
  const { 
    isBookServiceOpen, 
    setIsBookServiceOpen, 
    vehicles, 
    technicians, 
    addSchedule, 
    preselectedVehicleId, 
    setPreselectedVehicleId 
  } = useApp();

  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Oil & Filter Change');
  const [scheduledDate, setScheduledDate] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [durationHours, setDurationHours] = useState<number>(1.0);
  const [estimatedCost, setEstimatedCost] = useState<number>(6500);
  const [assignedTech, setAssignedTech] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isBookServiceOpen) {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);

      if (preselectedVehicleId && vehicles.some(v => v.id === preselectedVehicleId)) {
        setVehicleId(preselectedVehicleId);
      } else if (vehicles.length > 0 && !vehicleId) {
        setVehicleId(vehicles[0].id);
      }
    }
  }, [isBookServiceOpen, preselectedVehicleId, vehicles]);

  if (!isBookServiceOpen) return null;

  const handleServiceTypeChange = (type: ServiceType) => {
    setServiceType(type);
    const catalogItem = SERVICE_CATALOG.find(c => c.type === type);
    if (catalogItem) {
      setDurationHours(catalogItem.defaultHours);
      setEstimatedCost(catalogItem.defaultCost);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !scheduledDate) return;

    addSchedule({
      vehicleId,
      serviceType,
      scheduledDate,
      priority,
      estimatedDurationHours: Number(durationHours),
      estimatedCost: Number(estimatedCost),
      assignedTechnician: assignedTech || 'Diagnostic Pool',
      notes: notes.trim()
    });

    setNotes('');
    setPreselectedVehicleId(null);
    setIsBookServiceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 my-8 overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                Schedule Routine Maintenance
              </h2>
              <p className="text-xs text-slate-400">
                Book preventive maintenance and scheduled service intervals
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsBookServiceOpen(false);
              setPreselectedVehicleId(null);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Vehicle Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Select Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} ({v.licensePlate}) - {v.mileage.toLocaleString()} mi
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Routine Service Package *
            </label>
            <select
              value={serviceType}
              onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {SERVICE_CATALOG.map((cat) => (
                <option key={cat.type} value={cat.type}>
                  {cat.type} (~${cat.defaultCost}, {cat.defaultHours}h)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Booking Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Booking Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('Normal')}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all font-mono ${
                    priority === 'Normal'
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/50'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Urgent')}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all font-mono ${
                    priority === 'Urgent'
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/50 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  Expedited / Urgent
                </button>
              </div>
            </div>
          </div>

          {/* Duration & Cost Estimates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Estimated Shop Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Estimated Cost (₹)
              </label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold font-mono">₹</span>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Assigned Technician */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Assigned Service Tech (Optional)
            </label>
            <select
              value={assignedTech}
              onChange={(e) => setAssignedTech(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">-- General Service Bay Dispatch --</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Special Instructions / Fleet Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Check spare tire pressure, perform multi-point safety checklist, report brake lining thickness."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsBookServiceOpen(false);
                setPreselectedVehicleId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Confirm Service Booking</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
