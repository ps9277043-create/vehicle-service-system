import React, { useState } from 'react';
import { X, Car, Plus, Hash, User, Phone, Mail, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FuelType } from '../../types';

export const AddVehicleModal: React.FC = () => {
  const { isAddVehicleOpen, setIsAddVehicleOpen, addVehicle } = useApp();

  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [licensePlate, setLicensePlate] = useState('');
  const [mileage, setMileage] = useState<number>(35000);
  const [fuelType, setFuelType] = useState<FuelType>('Gasoline');
  const [color, setColor] = useState('Oxford White');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAddVehicleOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim() || !make.trim() || !model.trim() || !licensePlate.trim()) return;

    // Estimate next service date 6 months from today
    const now = new Date();
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 6);
    const nextDateStr = nextDate.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    addVehicle({
      vin: vin.trim().toUpperCase(),
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      licensePlate: licensePlate.trim().toUpperCase(),
      mileage: Number(mileage) || 0,
      lastServiceMileage: Math.max(0, Number(mileage) - 5000),
      nextServiceDate: nextDateStr,
      lastServiceDate: todayStr,
      ownerName: ownerName.trim() || 'Fleet Operations',
      ownerPhone: ownerPhone.trim() || '(555) 000-0000',
      ownerEmail: ownerEmail.trim() || 'fleet@company.com',
      fuelType,
      status: 'Operational',
      color,
      notes: notes.trim()
    });

    // Reset and close
    setVin('');
    setMake('');
    setModel('');
    setLicensePlate('');
    setNotes('');
    setIsAddVehicleOpen(false);
  };

  const handleGenerateSampleVin = () => {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let sampleVin = '1HG';
    for (let i = 0; i < 14; i++) {
      sampleVin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setVin(sampleVin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 my-8 overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                Register New Vehicle
              </h2>
              <p className="text-xs text-slate-400">
                Enroll vehicle profile into active diagnostic inventory
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddVehicleOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* VIN with sample generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Vehicle Identification Number (VIN) *
              </label>
              <button
                type="button"
                onClick={handleGenerateSampleVin}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline"
              >
                Auto-generate Sample VIN
              </button>
            </div>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="e.g. 1FTFW1E84KFA92811 (17 Characters)"
              maxLength={17}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tracking-wider focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          {/* Make, Model, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Make *
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Ford, Toyota"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Model *
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. F-150, RAV4"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Year *
              </label>
              <input
                type="number"
                min={1990}
                max={2028}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* License Plate & Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                License Plate *
              </label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="e.g. 7ABC892"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Current Odometer (Miles) *
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Fuel Type & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Powertrain / Fuel *
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Gasoline">Gasoline (ICE)</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid Electric (HEV/PHEV)</option>
                <option value="Electric">Battery Electric (BEV)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Exterior Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Oxford White, Magnetic Gray"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Owner / Contact Info */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Owner / Fleet Manager Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Contact / Fleet Name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Phone (555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Email contact"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
              Vehicle Operating Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High-duty cycle delivery vehicle. Uses synthetic 5W-30 oil."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-mono transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Vehicle</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
