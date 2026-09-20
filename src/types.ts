export type UserRole = 'owner' | 'technician' | 'manager';

export type VehicleStatus = 'Operational' | 'In Service' | 'Critical Fault' | 'Attention Needed';

export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  lastServiceMileage: number;
  nextServiceDate: string;
  lastServiceDate: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  fuelType: FuelType;
  status: VehicleStatus;
  color: string;
  notes?: string;
}

export type FaultSeverity = 'Low' | 'Medium' | 'Critical';

export type TicketStage = 
  | 'Fault Reported'
  | 'In Inspection'
  | 'Parts Ordered'
  | 'In Repair'
  | 'Ready for Pickup'
  | 'Completed';

export interface ReplacedPart {
  id: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  status: 'In Stock' | 'Ordered' | 'Installed';
}

export interface TechnicianNote {
  id: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  noteText: string;
}

export interface FaultTicket {
  id: string;
  ticketNumber: string;
  vehicleId: string;
  vehicleVin: string;
  vehicleName: string;
  reportedDate: string;
  reportedBy: string;
  severity: FaultSeverity;
  faultTitle: string;
  faultDescription: string;
  dtcCodes: string[];
  symptoms: string[];
  stage: TicketStage;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  odometerAtFault: number;
  photos: string[];
  notes: TechnicianNote[];
  parts: ReplacedPart[];
  laborHours: number;
  laborHourlyRate: number;
  estimatedCompletionDate?: string;
  completedDate?: string;
}

export type ServiceType = 
  | 'Oil & Filter Change'
  | 'Comprehensive Brake Inspection'
  | 'Tire Rotation & Balance'
  | 'Transmission Fluid Service'
  | 'Battery & Electrical Diagnostics'
  | 'Scheduled 60,000 Mile Overhaul'
  | 'Cooling System Flush'
  | 'Multi-Point Safety Inspection';

export type ScheduleStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

export interface ServiceSchedule {
  id: string;
  scheduleNumber: string;
  vehicleId: string;
  vehicleVin: string;
  vehicleName: string;
  serviceType: ServiceType;
  scheduledDate: string;
  priority: 'Normal' | 'Urgent';
  status: ScheduleStatus;
  estimatedDurationHours: number;
  estimatedCost: number;
  assignedTechnician?: string;
  notes?: string;
  completedDate?: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  activeJobsCount: number;
  completedThisMonth: number;
  rating: number;
  status: 'Available' | 'On Job' | 'Off Duty';
  avatar: string;
}

export interface DtcDefinition {
  code: string;
  title: string;
  system: string;
  severity: FaultSeverity;
  commonCauses: string[];
  recommendedAction: string;
}

export type ThemeMode = 'bright' | 'slate' | 'midnight';

