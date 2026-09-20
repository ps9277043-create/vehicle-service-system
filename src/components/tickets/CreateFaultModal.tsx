import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  Cpu, 
  UploadCloud, 
  Car, 
  Gauge, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FaultSeverity } from '../../types';
import { DTC_LIBRARY } from '../../data/mockData';

const COMMON_SYMPTOMS = [
  'Check Engine Light (Solid)',
  'Check Engine Light (Flashing)',
  'Rough Idle / Violent Shaking',
  'Reduced Engine Power (Limp Mode)',
  'Transmission Slipping / Hard Shift',
  'ABS / Traction Control Warning',
  'Brake Squeal or Soft Pedal',
  'Burning Oil / Exhaust Odor',
  'Coolant Temperature High',
  'Unusual Knocking / Ticking Noise'
];

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Cluster Warning Light', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
  { label: 'Engine Bay Inspection', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Brake Rotor / Caliper', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80' },
];

export const CreateFaultModal: React.FC = () => {
  const { 
    isCreateFaultOpen, 
    setIsCreateFaultOpen, 
    vehicles, 
    technicians, 
    addTicket, 
    preselectedVehicleId, 
    setPreselectedVehicleId,
    setSelectedTicketId 
  } = useApp();

  const [vehicleId, setVehicleId] = useState('');
  const [faultTitle, setFaultTitle] = useState('');
  const [severity, setSeverity] = useState<FaultSeverity>('Medium');
  const [selectedDtcCodes, setSelectedDtcCodes] = useState<string[]>([]);
  const [customDtcInput, setCustomDtcInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [odometerAtFault, setOdometerAtFault] = useState<number>(50000);
  const [description, setDescription] = useState('');
  const [assignedTechnicianId, setAssignedTechnicianId] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (isCreateFaultOpen) {
      if (preselectedVehicleId && vehicles.some(v => v.id === preselectedVehicleId)) {
        setVehicleId(preselectedVehicleId);
        const selVeh = vehicles.find(v => v.id === preselectedVehicleId);
        if (selVeh) setOdometerAtFault(selVeh.mileage);
      } else if (vehicles.length > 0 && !vehicleId) {
        setVehicleId(vehicles[0].id);
        setOdometerAtFault(vehicles[0].mileage);
      }
    }
  }, [isCreateFaultOpen, preselectedVehicleId, vehicles]);

  if (!isCreateFaultOpen) return null;

  const handleVehicleChange = (id: string) => {
    setVehicleId(id);
    const sel = vehicles.find(v => v.id === id);
    if (sel) {
      setOdometerAtFault(sel.mileage);
    }
  };

  const toggleDtcCode = (code: string) => {
    if (selectedDtcCodes.includes(code)) {
      setSelectedDtcCodes(selectedDtcCodes.filter(c => c !== code));
    } else {
      setSelectedDtcCodes([...selectedDtcCodes, code]);
    }
  };

  const handleAddCustomDtc = () => {
    const formatted = customDtcInput.trim().toUpperCase();
    if (formatted && !selectedDtcCodes.includes(formatted)) {
      setSelectedDtcCodes([...selectedDtcCodes, formatted]);
      setCustomDtcInput('');
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos([...photos, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !faultTitle.trim()) return;

    const newTicket = addTicket({
      vehicleId,
      faultTitle: faultTitle.trim(),
      faultDescription: description.trim(),
      severity,
      dtcCodes: selectedDtcCodes,
      symptoms: selectedSymptoms,
      odometerAtFault: Number(odometerAtFault) || 0,
      photos,
      assignedTechnicianId: assignedTechnicianId || undefined
    });

    // Clean up
    setFaultTitle('');
    setDescription('');
    setSelectedDtcCodes([]);
    setSelectedSymptoms([]);
    setPhotos([]);
    setPreselectedVehicleId(null);
    setIsCreateFaultOpen(false);
    setSelectedTicketId(newTicket.id);
  };

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 my-8 overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                Log Diagnostic Fault Ticket
              </h2>
              <p className="text-xs text-slate-400">
                Submit OBD-II DTC codes, vehicle telemetry &amp; fault symptoms
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCreateFaultOpen(false);
              setPreselectedVehicleId(null);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Vehicle Selection & Mileage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Select Vehicle *
              </label>
              <div className="relative">
                <select
                  value={vehicleId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.licensePlate})
                    </option>
                  ))}
                </select>
              </div>
              {selectedVehicle && (
                <p className="mt-1 text-[11px] font-mono text-slate-400">
                  VIN: <span className="text-slate-300">{selectedVehicle.vin}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Odometer at Fault (Miles) *
              </label>
              <div className="relative">
                <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={odometerAtFault}
                  onChange={(e) => setOdometerAtFault(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                  placeholder="e.g. 48250"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fault Title & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Fault Summary / Title *
              </label>
              <input
                type="text"
                value={faultTitle}
                onChange={(e) => setFaultTitle(e.target.value)}
                placeholder="e.g. Engine Misfire on Cylinder 3 with CEL Flashing"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Severity Level *
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['Low', 'Medium', 'Critical'] as FaultSeverity[]).map((lvl) => {
                  const isSelected = severity === lvl;
                  return (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSeverity(lvl)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold font-mono transition-all ${
                        isSelected
                          ? lvl === 'Critical'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : lvl === 'Medium'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                            : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OBD-II Diagnostic Codes Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                OBD-II Diagnostic Fault Codes (DTC)
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedDtcCodes.length} selected
              </span>
            </div>

            {/* Quick selector chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl max-h-28 overflow-y-auto">
              {DTC_LIBRARY.map((dtc) => {
                const isSelected = selectedDtcCodes.includes(dtc.code);
                return (
                  <button
                    key={dtc.code}
                    type="button"
                    onClick={() => toggleDtcCode(dtc.code)}
                    title={`${dtc.title} (${dtc.system})`}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{dtc.code}</span>
                    <span className="text-[10px] opacity-75 font-sans hidden sm:inline">
                      - {dtc.title.slice(0, 20)}...
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customDtcInput}
                onChange={(e) => setCustomDtcInput(e.target.value)}
                placeholder="Or type custom DTC (e.g. P0301, U0121, B1200)"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 uppercase focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCustomDtc}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Code
              </button>
            </div>
          </div>

          {/* Observed Symptoms Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Observed Symptoms Checklist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {COMMON_SYMPTOMS.map((symptom) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                      isChecked
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-medium'
                        : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{symptom}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fault Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Detailed Driver / Operating Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when the issue occurs (e.g. cold morning start, under heavy acceleration, highway speed, strange odors, dash alerts)..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Photo attachments placeholder & samples */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                Photos &amp; Diagnostic Attachments
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {photos.length} attached
              </span>
            </div>

            {/* Quick preset selector */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick attach sample photo:</span>
              {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPhoto(preset.url)}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 border border-slate-700"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            {/* Photo thumbnails */}
            {photos.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                    <img src={url} alt="Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Technician (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Assign Service Technician (Optional)
            </label>
            <select
              value={assignedTechnicianId}
              onChange={(e) => setAssignedTechnicianId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">-- Auto-Dispatch / Unassigned --</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.specialty} ({t.status})
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreateFaultOpen(false);
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
              <span>Submit Fault Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
