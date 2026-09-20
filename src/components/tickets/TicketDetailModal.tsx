import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Cpu, 
  Wrench, 
  Calendar, 
  User, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Package, 
  MessageSquare, 
  Gauge, 
  Car, 
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TicketStage, ReplacedPart, FaultSeverity } from '../../types';
import { DTC_LIBRARY } from '../../data/mockData';
import { formatINR } from '../../utils/currency';

const STAGES: TicketStage[] = [
  'Fault Reported',
  'In Inspection',
  'Parts Ordered',
  'In Repair',
  'Ready for Pickup',
  'Completed'
];

export const TicketDetailModal: React.FC = () => {
  const { 
    selectedTicketId, 
    setSelectedTicketId, 
    tickets, 
    updateTicketStage, 
    updateTicket,
    addTicketNote, 
    addTicketPart, 
    updateTicketPartStatus,
    technicians,
    currentRole,
    vehicles 
  } = useApp();

  const ticket = tickets.find(t => t.id === selectedTicketId);

  // Form states for adding notes & parts
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [partQuantity, setPartQuantity] = useState<number>(1);
  const [partUnitCost, setPartUnitCost] = useState<number>(45);
  const [partSupplier, setPartSupplier] = useState('OEM Parts Distribution');
  const [partStatus, setPartStatus] = useState<'In Stock' | 'Ordered' | 'Installed'>('Ordered');

  if (!ticket) return null;

  const currentStageIndex = STAGES.indexOf(ticket.stage);
  const vehicle = vehicles.find(v => v.id === ticket.vehicleId);

  // Parts total and Labor total calculation
  const partsTotal = ticket.parts.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const laborTotal = (ticket.laborHours || 0) * (ticket.laborHourlyRate || 145);
  const grandTotal = partsTotal + laborTotal;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    let author = 'Service Desk';
    let role = 'Advisor';
    if (currentRole === 'technician') {
      author = ticket.assignedTechnicianName || 'Marcus Vance';
      role = 'Diagnostic Technician';
    } else if (currentRole === 'manager') {
      author = 'Alex Mercer';
      role = 'Service Manager';
    } else if (currentRole === 'owner') {
      author = ticket.reportedBy;
      role = 'Vehicle Owner';
    }

    addTicketNote(ticket.id, newNoteText.trim(), author, role);
    setNewNoteText('');
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim() || !partNumber.trim()) return;

    addTicketPart(ticket.id, {
      partName: partName.trim(),
      partNumber: partNumber.trim().toUpperCase(),
      quantity: Number(partQuantity) || 1,
      unitCost: Number(partUnitCost) || 0,
      supplier: partSupplier.trim(),
      status: partStatus
    });

    setPartName('');
    setPartNumber('');
    setPartQuantity(1);
    setShowAddPartForm(false);
  };

  const handleLaborHoursChange = (hours: number) => {
    updateTicket(ticket.id, { laborHours: Math.max(0, hours) });
  };

  const handleTechnicianChange = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    updateTicket(ticket.id, {
      assignedTechnicianId: tech?.id,
      assignedTechnicianName: tech?.name
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/90 my-6 overflow-hidden text-slate-200">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {ticket.ticketNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif]">
                  {ticket.faultTitle}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  ticket.severity === 'Critical'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : ticket.severity === 'Medium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {ticket.severity} Severity
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{ticket.vehicleName}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">VIN: {ticket.vehicleVin}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTicketId(null)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Workflow Stage Tracker Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Repair Lifecycle Stage Progression
              </span>
              <span className="text-xs font-mono text-amber-400">
                Current: <strong className="text-white">{ticket.stage}</strong>
              </span>
            </div>

            {/* Stepper indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {STAGES.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => updateTicketStage(ticket.id, stage)}
                    title={`Click to set stage to ${stage}`}
                    className={`p-2 rounded-lg text-left transition-all border text-xs cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                        : isPassed
                        ? 'bg-slate-900 border-emerald-500/40 text-emerald-400 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span>0{idx + 1}</span>
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isCurrent && <Clock className="w-3 h-3 text-slate-950 animate-spin" />}
                    </div>
                    <div className="truncate text-[11px] leading-tight">{stage}</div>
                  </button>
                );
              })}
            </div>

            {/* Quick advance button */}
            {currentStageIndex < STAGES.length - 1 && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Ready for next workflow step?
                </span>
                <button
                  onClick={() => updateTicketStage(ticket.id, STAGES[currentStageIndex + 1])}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span>Advance to {STAGES[currentStageIndex + 1]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 2-Column Info Dossier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Diagnostics, Symptoms, Telemetry */}
            <div className="md:col-span-2 space-y-5">
              
              {/* OBD-II Diagnostic Codes Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2.5 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  Active OBD-II Diagnostic Fault Codes (DTC)
                </h3>

                {ticket.dtcCodes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No specific DTC codes flagged by scan tool.</p>
                ) : (
                  <div className="space-y-2">
                    {ticket.dtcCodes.map((code) => {
                      const def = DTC_LIBRARY.find(d => d.code === code);
                      return (
                        <div key={code} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {code}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {def ? def.system : 'Powertrain System'}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs font-semibold text-slate-200">
                            {def ? def.title : 'Diagnostic Trouble Code'}
                          </p>
                          {def && (
                            <div className="mt-2 text-[11px] space-y-1 text-slate-400 border-t border-slate-800/80 pt-2">
                              <p>
                                <strong className="text-slate-300">Recommended Action:</strong>{' '}
                                {def.recommendedAction}
                              </p>
                              <p>
                                <strong className="text-slate-300">Typical Causes:</strong>{' '}
                                {def.commonCauses.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Observed Symptoms */}
              {ticket.symptoms.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                    Reported Symptoms Checklist
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {ticket.symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        ✓ {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Initial Driver Fault Description
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ticket.faultDescription || 'No additional narrative provided.'}
                </p>
              </div>

              {/* Attached Photos / Evidence */}
              {ticket.photos.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2.5">
                    Inspection Evidence &amp; Visual Snapshots ({ticket.photos.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ticket.photos.map((photo, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                        <img src={photo} alt="Inspection" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parts Replaced & Logged */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-400" />
                    Bill of Materials &amp; Replaced Parts ({ticket.parts.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddPartForm(!showAddPartForm)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Part</span>
                  </button>
                </div>

                {/* Add Part Form */}
                {showAddPartForm && (
                  <form onSubmit={handleAddPart} className="mb-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-white">Log Component Replacement</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <input
                          type="text"
                          placeholder="Part Name (e.g. Denso Ignition Coil)"
                          value={partName}
                          onChange={(e) => setPartName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Part Number (e.g. 90919-02258)"
                          value={partNumber}
                          onChange={(e) => setPartNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={partQuantity}
                          onChange={(e) => setPartQuantity(Number(e.target.value))}
                          className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Unit Cost (₹)</label>
                        <input
                          type="number"
                          step="1"
                          value={partUnitCost}
                          onChange={(e) => setPartUnitCost(Number(e.target.value))}
                          className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">Status</label>
                        <select
                          value={partStatus}
                          onChange={(e) => setPartStatus(e.target.value as any)}
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Ordered">Ordered</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Installed">Installed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddPartForm(false)}
                        className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 font-mono"
                      >
                        Save Part to Invoice
                      </button>
                    </div>
                  </form>
                )}

                {/* Parts Table */}
                {ticket.parts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No replacement parts logged yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                          <th className="pb-2">Part Description</th>
                          <th className="pb-2">Part #</th>
                          <th className="pb-2 text-center">Qty</th>
                          <th className="pb-2 text-right">Unit</th>
                          <th className="pb-2 text-right">Total</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {ticket.parts.map((part) => (
                          <tr key={part.id}>
                            <td className="py-2 text-slate-200 font-medium">{part.partName}</td>
                            <td className="py-2 font-mono text-slate-400">{part.partNumber}</td>
                            <td className="py-2 text-center font-mono">{part.quantity}</td>
                            <td className="py-2 text-right font-mono">{formatINR(part.unitCost, true)}</td>
                            <td className="py-2 text-right font-mono font-bold text-white">{formatINR(part.totalCost, true)}</td>
                            <td className="py-2 text-right">
                              <select
                                value={part.status}
                                onChange={(e) => updateTicketPartStatus(ticket.id, part.id, e.target.value as any)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                  part.status === 'Installed'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : part.status === 'Ordered'
                                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                                    : 'bg-slate-900 text-slate-300 border-slate-700'
                                }`}
                              >
                                <option value="Ordered">Ordered</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Installed">Installed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Technician Diagnostic Notes History */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Technician Diagnostic Journal &amp; Notes ({ticket.notes.length})
                </h3>

                {/* Timeline of notes */}
                <div className="space-y-3 mb-4">
                  {ticket.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No technician notes recorded yet.</p>
                  ) : (
                    ticket.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-amber-400">{note.authorName}</span>
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800 font-mono">
                              {note.authorRole}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{note.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{note.noteText}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add new note input */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add diagnostic finding, oscilloscope result, or repair note..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl font-mono transition-all shrink-0 cursor-pointer"
                  >
                    Post Note
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Ticket Meta & Repair Billing */}
            <div className="space-y-5">
              
              {/* Telemetry & Vehicle Meta */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-mono uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-800 pb-2">
                  Telemetry &amp; Dispatch
                </h4>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Technician</span>
                  <select
                    value={ticket.assignedTechnicianId || ''}
                    onChange={(e) => handleTechnicianChange(e.target.value)}
                    className="mt-1 w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Unassigned --</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Odometer at Fault</span>
                  <div className="mt-1 flex items-center gap-1 font-mono font-bold text-white">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.odometerAtFault.toLocaleString()} miles</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Reported On</span>
                  <span className="font-mono text-slate-300">{ticket.reportedDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Reported By</span>
                  <span className="text-slate-300">{ticket.reportedBy}</span>
                </div>

                {vehicle && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Owner / Fleet Contact</span>
                    <p className="font-medium text-white">{vehicle.ownerName}</p>
                    <p className="font-mono text-[11px] text-slate-400">{vehicle.ownerPhone}</p>
                  </div>
                )}
              </div>

              {/* Service Cost & Invoice Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-mono uppercase text-[11px] text-amber-400 font-semibold border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>Repair Cost Estimation</span>
                  <DollarSign className="w-3.5 h-3.5" />
                </h4>

                {/* Labor Hours Adjuster */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-[11px]">Labor Hours ({formatINR(ticket.laborHourlyRate)}/hr)</span>
                    <span className="font-mono text-white font-bold">{ticket.laborHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={ticket.laborHours}
                    onChange={(e) => handleLaborHoursChange(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-slate-400">
                    <span>Labor Subtotal:</span>
                    <span className="font-mono text-slate-200">{formatINR(laborTotal, true)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Parts Subtotal:</span>
                    <span className="font-mono text-slate-200">{formatINR(partsTotal, true)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Cost:</span>
                    <span className="font-mono text-amber-400">{formatINR(grandTotal, true)}</span>
                  </div>
                </div>

                {ticket.stage === 'Completed' && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Repair finalized. Vehicle tested &amp; cleared for release.</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
