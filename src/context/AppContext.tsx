import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserRole, 
  Vehicle, 
  FaultTicket, 
  ServiceSchedule, 
  Technician, 
  TicketStage, 
  ReplacedPart,
  TechnicianNote,
  ScheduleStatus,
  ThemeMode
} from '../types';
import { 
  INITIAL_VEHICLES, 
  INITIAL_TICKETS, 
  INITIAL_SCHEDULES, 
  INITIAL_TECHNICIANS 
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'dashboard' | 'vehicles' | 'tickets' | 'schedules' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'vehicles' | 'tickets' | 'schedules' | 'analytics') => void;
  
  vehicles: Vehicle[];
  tickets: FaultTicket[];
  schedules: ServiceSchedule[];
  technicians: Technician[];
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  
  isCreateFaultOpen: boolean;
  setIsCreateFaultOpen: (open: boolean) => void;
  
  isAddVehicleOpen: boolean;
  setIsAddVehicleOpen: (open: boolean) => void;
  
  isBookServiceOpen: boolean;
  setIsBookServiceOpen: (open: boolean) => void;
  
  preselectedVehicleId: string | null;
  setPreselectedVehicleId: (id: string | null) => void;
  
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // Actions
  addVehicle: (vehicleData: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  addTicket: (ticketData: {
    vehicleId: string;
    faultTitle: string;
    faultDescription: string;
    severity: 'Low' | 'Medium' | 'Critical';
    dtcCodes: string[];
    symptoms: string[];
    odometerAtFault: number;
    photos: string[];
    assignedTechnicianId?: string;
  }) => FaultTicket;
  
  updateTicketStage: (ticketId: string, newStage: TicketStage) => void;
  updateTicket: (ticketId: string, updates: Partial<FaultTicket>) => void;
  addTicketNote: (ticketId: string, noteText: string, authorName?: string, authorRole?: string) => void;
  addTicketPart: (ticketId: string, part: Omit<ReplacedPart, 'id' | 'totalCost'>) => void;
  updateTicketPartStatus: (ticketId: string, partId: string, status: 'In Stock' | 'Ordered' | 'Installed') => void;
  
  addSchedule: (scheduleData: {
    vehicleId: string;
    serviceType: any;
    scheduledDate: string;
    priority: 'Normal' | 'Urgent';
    estimatedDurationHours: number;
    estimatedCost: number;
    assignedTechnician?: string;
    notes?: string;
  }) => void;
  
  updateScheduleStatus: (id: string, status: ScheduleStatus) => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'vms_user_role_v2',
  VEHICLES: 'vms_vehicles_v2',
  TICKETS: 'vms_tickets_v2',
  SCHEDULES: 'vms_schedules_v2',
  THEME: 'vms_theme_mode_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as ThemeMode) || 'slate';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'manager';
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'vehicles' | 'tickets' | 'schedules' | 'analytics'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const [isCreateFaultOpen, setIsCreateFaultOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isBookServiceOpen, setIsBookServiceOpen] = useState(false);
  const [preselectedVehicleId, setPreselectedVehicleId] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved vehicles', e);
      }
    }
    return INITIAL_VEHICLES;
  });

  const [tickets, setTickets] = useState<FaultTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tickets', e);
      }
    }
    return INITIAL_TICKETS;
  });

  const [schedules, setSchedules] = useState<ServiceSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved schedules', e);
      }
    }
    return INITIAL_SCHEDULES;
  });

  const [technicians] = useState<Technician[]>(INITIAL_TECHNICIANS);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now().toString(36)}`,
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const addTicket = (ticketData: {
    vehicleId: string;
    faultTitle: string;
    faultDescription: string;
    severity: 'Low' | 'Medium' | 'Critical';
    dtcCodes: string[];
    symptoms: string[];
    odometerAtFault: number;
    photos: string[];
    assignedTechnicianId?: string;
  }): FaultTicket => {
    const vehicle = vehicles.find(v => v.id === ticketData.vehicleId);
    const assignedTech = technicians.find(t => t.id === ticketData.assignedTechnicianId);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: FaultTicket = {
      id: `tkt-${Date.now().toString(36)}`,
      ticketNumber: `FLT-${randomNum}`,
      vehicleId: ticketData.vehicleId,
      vehicleVin: vehicle ? vehicle.vin : 'UNKNOWN',
      vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
      reportedDate: formattedDate,
      reportedBy: currentRole === 'owner' ? (vehicle ? `${vehicle.ownerName} (Owner)` : 'Vehicle Owner') : 'Service Advisor Desk',
      severity: ticketData.severity,
      faultTitle: ticketData.faultTitle,
      faultDescription: ticketData.faultDescription,
      dtcCodes: ticketData.dtcCodes,
      symptoms: ticketData.symptoms,
      stage: 'Fault Reported',
      assignedTechnicianId: assignedTech?.id,
      assignedTechnicianName: assignedTech?.name,
      odometerAtFault: ticketData.odometerAtFault,
      photos: ticketData.photos,
      notes: [],
      parts: [],
      laborHours: 1.5,
      laborHourlyRate: 1200,
    };

    setTickets(prev => [newTicket, ...prev]);

    // If critical, update vehicle status
    if (ticketData.severity === 'Critical' && vehicle) {
      updateVehicle(vehicle.id, { status: 'Critical Fault' });
    } else if (vehicle && vehicle.status === 'Operational') {
      updateVehicle(vehicle.id, { status: 'In Service' });
    }

    return newTicket;
  };

  const updateTicketStage = (ticketId: string, newStage: TicketStage) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const updates: Partial<FaultTicket> = { stage: newStage };
      if (newStage === 'Completed') {
        const now = new Date();
        updates.completedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        // Also update vehicle back to Operational if all other tickets resolved
        const vehicle = vehicles.find(v => v.id === t.vehicleId);
        if (vehicle) {
          updateVehicle(vehicle.id, { status: 'Operational' });
        }
      } else if (newStage === 'Ready for Pickup') {
        const vehicle = vehicles.find(v => v.id === t.vehicleId);
        if (vehicle) {
          updateVehicle(vehicle.id, { status: 'Operational' });
        }
      }
      return { ...t, ...updates };
    }));
  };

  const updateTicket = (ticketId: string, updates: Partial<FaultTicket>) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updates } : t));
  };

  const addTicketNote = (ticketId: string, noteText: string, authorName?: string, authorRole?: string) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let defaultAuthor = 'Service Team';
    let defaultRole = 'Technician';

    if (currentRole === 'technician') {
      defaultAuthor = 'Marcus Vance';
      defaultRole = 'Diagnostic Technician';
    } else if (currentRole === 'manager') {
      defaultAuthor = 'Alex Mercer';
      defaultRole = 'Service Operations Manager';
    } else if (currentRole === 'owner') {
      defaultAuthor = 'Vehicle Owner';
      defaultRole = 'Client';
    }

    const newNote: TechnicianNote = {
      id: `note-${Date.now().toString(36)}`,
      authorName: authorName || defaultAuthor,
      authorRole: authorRole || defaultRole,
      timestamp,
      noteText
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, notes: [...t.notes, newNote] };
      }
      return t;
    }));
  };

  const addTicketPart = (ticketId: string, part: Omit<ReplacedPart, 'id' | 'totalCost'>) => {
    const totalCost = Number((part.quantity * part.unitCost).toFixed(2));
    const newPart: ReplacedPart = {
      ...part,
      id: `part-${Date.now().toString(36)}`,
      totalCost
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, parts: [...t.parts, newPart] };
      }
      return t;
    }));
  };

  const updateTicketPartStatus = (ticketId: string, partId: string, status: 'In Stock' | 'Ordered' | 'Installed') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          parts: t.parts.map(p => p.id === partId ? { ...p, status } : p)
        };
      }
      return t;
    }));
  };

  const addSchedule = (scheduleData: {
    vehicleId: string;
    serviceType: any;
    scheduledDate: string;
    priority: 'Normal' | 'Urgent';
    estimatedDurationHours: number;
    estimatedCost: number;
    assignedTechnician?: string;
    notes?: string;
  }) => {
    const vehicle = vehicles.find(v => v.id === scheduleData.vehicleId);
    const randomNum = Math.floor(2000 + Math.random() * 8000);
    const newSchedule: ServiceSchedule = {
      id: `sch-${Date.now().toString(36)}`,
      scheduleNumber: `SVC-${randomNum}`,
      vehicleId: scheduleData.vehicleId,
      vehicleVin: vehicle ? vehicle.vin : 'UNKNOWN',
      vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle',
      serviceType: scheduleData.serviceType,
      scheduledDate: scheduleData.scheduledDate,
      priority: scheduleData.priority,
      status: 'Scheduled',
      estimatedDurationHours: scheduleData.estimatedDurationHours,
      estimatedCost: scheduleData.estimatedCost,
      assignedTechnician: scheduleData.assignedTechnician,
      notes: scheduleData.notes
    };

    setSchedules(prev => [newSchedule, ...prev]);
  };

  const updateScheduleStatus = (id: string, status: ScheduleStatus) => {
    setSchedules(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updates: Partial<ServiceSchedule> = { status };
      if (status === 'Completed') {
        const now = new Date();
        updates.completedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        // update vehicle nextServiceDate to 6 months later
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 6);
        const nextDateStr = nextDate.toISOString().split('T')[0];
        const vehicle = vehicles.find(v => v.id === s.vehicleId);
        if (vehicle) {
          updateVehicle(vehicle.id, { 
            lastServiceDate: updates.completedDate,
            nextServiceDate: nextDateStr,
            lastServiceMileage: vehicle.mileage
          });
        }
      }
      return { ...s, ...updates };
    }));
  };

  const resetToSampleData = () => {
    setVehicles(INITIAL_VEHICLES);
    setTickets(INITIAL_TICKETS);
    setSchedules(INITIAL_SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  };

  const contextValue = useMemo(() => ({
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    vehicles,
    tickets,
    schedules,
    technicians,
    searchQuery,
    setSearchQuery,
    selectedTicketId,
    setSelectedTicketId,
    isCreateFaultOpen,
    setIsCreateFaultOpen,
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    isBookServiceOpen,
    setIsBookServiceOpen,
    preselectedVehicleId,
    setPreselectedVehicleId,
    theme,
    setTheme,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addTicket,
    updateTicketStage,
    updateTicket,
    addTicketNote,
    addTicketPart,
    updateTicketPartStatus,
    addSchedule,
    updateScheduleStatus,
    resetToSampleData,
  }), [
    currentRole,
    activeTab,
    vehicles,
    tickets,
    schedules,
    technicians,
    searchQuery,
    selectedTicketId,
    isCreateFaultOpen,
    isAddVehicleOpen,
    isBookServiceOpen,
    preselectedVehicleId,
    theme
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
